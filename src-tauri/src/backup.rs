//! 备份导出 / 导入。JSON 里只有业务数据和模型设置，不含 API Key（Key 只在凭据管理器）。

use rusqlite::types::{Value as Sql, ValueRef};
use rusqlite::Connection;
use serde::Serialize;
use serde_json::{json, Map, Value};

use crate::service::e;

type R<T> = Result<T, String>;

pub const FORMAT: &str = "goal-plan-assistant-backup";
/// v1：结构版本 3（无提醒）；v2：结构版本 4，新增 goal_reminders
/// v4：数据结构 6（天气缓存表不入备份；天气城市/开关在 settings 里随备份）
/// v5：数据结构 7（目标状态新增 completed）
pub const BACKUP_VERSION: i64 = 5;
/// 按外键依赖顺序（导入按此顺序插入，清空按倒序）
pub const TABLES: [&str; 10] = ["settings", "goals", "plan_versions", "plan_days", "checkins", "chat_sessions", "chat_messages", "weekly_reviews", "goal_reminders", "plan_templates"];
/// 各表从哪个备份版本开始有
fn since(t: &str) -> i64 {
    match t {
        "goal_reminders" => 2,
        "plan_templates" => 3,
        _ => 1,
    }
}
const MAX_BYTES: usize = 50 * 1024 * 1024;

#[derive(Debug, Serialize, Clone)]
pub struct BackupInfo {
    pub exported_at: String,
    pub app_version: String,
    pub schema_version: i64,
    pub goals: usize,
    pub plan_versions: usize,
    pub checkins: usize,
    pub chat_messages: usize,
    pub weekly_reviews: usize,
    pub goal_reminders: usize,
    pub plan_templates: usize,
    pub backup_version: i64,
}

fn schema_version(conn: &Connection) -> R<i64> {
    conn.query_row("SELECT COALESCE(MAX(version),0) FROM schema_migrations", [], |r| r.get(0)).map_err(e)
}

fn columns(conn: &Connection, table: &str) -> R<Vec<String>> {
    let mut st = conn.prepare(&format!("PRAGMA table_info({table})")).map_err(e)?;
    let cols = st.query_map([], |r| r.get::<_, String>(1)).map_err(e)?.collect::<Result<Vec<_>, _>>().map_err(e)?;
    Ok(cols)
}

fn dump(conn: &Connection, table: &str) -> R<Vec<Value>> {
    let cols = columns(conn, table)?;
    let order = if table == "settings" { "key" } else { "id" };
    let mut st = conn.prepare(&format!("SELECT * FROM {table} ORDER BY {order}")).map_err(e)?;
    let mut rows = st.query([]).map_err(e)?;
    let mut out = Vec::new();
    while let Some(r) = rows.next().map_err(e)? {
        let mut m = Map::new();
        for (i, c) in cols.iter().enumerate() {
            let v = match r.get_ref(i).map_err(e)? {
                ValueRef::Null => Value::Null,
                ValueRef::Integer(n) => json!(n),
                ValueRef::Real(f) => json!(f),
                ValueRef::Text(t) => json!(String::from_utf8_lossy(t)),
                ValueRef::Blob(_) => return Err(format!("{table}.{c} 是二进制数据，无法导出")),
            };
            m.insert(c.clone(), v);
        }
        out.push(Value::Object(m));
    }
    Ok(out)
}

pub fn export(conn: &Connection, exported_at: &str, app_version: &str) -> R<Value> {
    let mut tables = Map::new();
    for t in TABLES {
        tables.insert(t.into(), Value::Array(dump(conn, t)?));
    }
    Ok(json!({
        "format": FORMAT,
        "backup_version": BACKUP_VERSION,
        "schema_version": schema_version(conn)?,
        "app_version": app_version,
        "exported_at": exported_at,
        "tables": tables,
    }))
}

/// 严格校验结构，返回概要（不写库）
pub fn inspect(conn: &Connection, v: &Value) -> R<BackupInfo> {
    let o = v.as_object().ok_or("备份文件格式不对：最外层应是 JSON 对象")?;
    if o.get("format").and_then(|x| x.as_str()) != Some(FORMAT) {
        return Err("这不是「目标计划助手」的备份文件".into());
    }
    let bv = o.get("backup_version").and_then(|x| x.as_i64()).ok_or("备份文件缺少 backup_version")?;
    if !(1..=BACKUP_VERSION).contains(&bv) {
        return Err(format!("备份格式版本 {bv} 不受支持（当前支持 1-{BACKUP_VERSION}），{}", if bv > BACKUP_VERSION { "备份来自更新的版本，请先升级应用" } else { "文件可能已损坏" }));
    }
    let sv = o.get("schema_version").and_then(|x| x.as_i64()).ok_or("备份文件缺少 schema_version")?;
    let cur = schema_version(conn)?;
    // 各备份格式版本对应的数据结构版本（v1=3、v2=4、v3=5、v4=6、v5=当前）
    let expect = match bv { 1 => 3, 2 => 4, 3 => 5, 4 => 6, _ => cur };
    if sv != expect {
        return Err(format!("备份的数据结构版本是 {sv}，当前应用是 {cur}，无法导入{}", if sv > cur { "（备份来自更新的版本，请先升级应用）" } else { "" }));
    }
    let exported_at = o.get("exported_at").and_then(|x| x.as_str()).ok_or("备份文件缺少导出时间 exported_at")?.to_string();
    let app_version = o.get("app_version").and_then(|x| x.as_str()).unwrap_or("").to_string();
    let tables = o.get("tables").and_then(|x| x.as_object()).ok_or("备份文件缺少 tables")?;
    for k in tables.keys() {
        if !TABLES.contains(&k.as_str()) {
            return Err(format!("备份里有未知的数据表 {k}"));
        }
    }
    let count = |t: &str| -> R<usize> {
        if since(t) > bv {
            if tables.contains_key(t) {
                return Err(format!("v{bv} 备份里不应该有数据表 {t}"));
            }
            return Ok(0);
        }
        let arr = tables.get(t).and_then(|x| x.as_array()).ok_or(format!("备份缺少数据表 {t}"))?;
        let cols = columns(conn, t)?;
        for (i, row) in arr.iter().enumerate() {
            let m = row.as_object().ok_or(format!("{t} 第 {} 条不是对象", i + 1))?;
            for (k, val) in m {
                if !cols.contains(k) {
                    return Err(format!("{t} 第 {} 条有未知字段 {k}", i + 1));
                }
                if val.is_array() || val.is_object() {
                    return Err(format!("{t} 第 {} 条的 {k} 类型不对", i + 1));
                }
            }
            if t != "settings" && !m.get("id").map(|x| x.is_i64()).unwrap_or(false) {
                return Err(format!("{t} 第 {} 条缺少整数 id", i + 1));
            }
        }
        Ok(arr.len())
    };
    for t in TABLES {
        count(t)?;
    }
    let n = |t: &str| tables.get(t).and_then(|x| x.as_array()).map(|a| a.len()).unwrap_or(0);
    Ok(BackupInfo {
        exported_at,
        app_version,
        schema_version: sv,
        goals: n("goals"),
        plan_versions: n("plan_versions"),
        checkins: n("checkins"),
        chat_messages: n("chat_messages"),
        weekly_reviews: n("weekly_reviews"),
        goal_reminders: n("goal_reminders"),
        plan_templates: n("plan_templates"),
        backup_version: bv,
    })
}

pub fn parse(text: &str) -> R<Value> {
    if text.len() > MAX_BYTES {
        return Err("备份文件太大（超过 50MB）".into());
    }
    serde_json::from_str(text.trim_start_matches('\u{feff}')).map_err(|err| format!("备份文件不是合法的 JSON（{err}）"))
}

fn to_sql(v: &Value) -> Sql {
    match v {
        Value::Null => Sql::Null,
        Value::Bool(b) => Sql::Integer(*b as i64),
        Value::Number(n) => n.as_i64().map(Sql::Integer).unwrap_or_else(|| Sql::Real(n.as_f64().unwrap_or(0.0))),
        Value::String(s) => Sql::Text(s.clone()),
        _ => Sql::Null,
    }
}

/// 在一个事务里用备份替换全部业务数据；任何错误都会回滚，原数据不动
pub fn import(conn: &mut Connection, v: &Value) -> R<BackupInfo> {
    let info = inspect(conn, v)?;
    let tables = v["tables"].as_object().ok_or("备份文件缺少 tables")?;
    let tx = conn.transaction().map_err(e)?;
    for t in TABLES.iter().rev() {
        tx.execute(&format!("DELETE FROM {t}"), []).map_err(e)?;
    }
    tx.execute("DELETE FROM sqlite_sequence", []).map_err(e)?;
    tx.execute("DELETE FROM reminder_log", []).map_err(e)?;
    for t in TABLES {
        let cols = columns(&tx, t)?;
        let Some(arr) = tables.get(t).and_then(|x| x.as_array()) else { continue };
        for (i, row) in arr.iter().enumerate() {
            let m = row.as_object().ok_or("备份格式不对")?;
            let keys: Vec<&String> = m.keys().filter(|k| cols.contains(k)).collect();
            let sql = format!(
                "INSERT INTO {t} ({}) VALUES ({})",
                keys.iter().map(|k| format!("\"{k}\"")).collect::<Vec<_>>().join(","),
                (1..=keys.len()).map(|n| format!("?{n}")).collect::<Vec<_>>().join(",")
            );
            let vals: Vec<Sql> = keys.iter().map(|k| to_sql(&m[*k])).collect();
            tx.execute(&sql, rusqlite::params_from_iter(vals))
                .map_err(|err| format!("导入失败，已回滚，原数据未改动：{t} 第 {} 条数据不合法（{err}）", i + 1))?;
        }
    }
    let bad: i64 = tx.query_row("SELECT COUNT(*) FROM pragma_foreign_key_check", [], |r| r.get(0)).map_err(e)?;
    if bad > 0 {
        return Err(format!("导入失败，已回滚，原数据未改动：备份里有 {bad} 条数据引用了不存在的记录"));
    }
    tx.commit().map_err(e)?;
    Ok(info)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::service::*;

    fn rich() -> Connection {
        let mut conn = Connection::open_in_memory().unwrap();
        crate::db::migrate(&conn).unwrap();
        let id = import_sample(&mut conn, "2026-10-14", 1).unwrap();
        let t = get_goal_detail(&conn, id, "2026-10-14", 0).unwrap().today.unwrap().id;
        check_in(&conn, t, "2026-10-14", 2).unwrap();
        let ng = get_goal_detail(&conn, id, "2026-10-14", 3).unwrap();
        let days: Vec<NewDay> = ng.upcoming.iter().map(|d| NewDay { title: d.title.clone(), detail: "改".into(), tasks: vec!["a".into()], is_rest: false }).collect();
        crate::revise::revise_plan(&mut conn, id, &days, "第二版", "chat", "2026-10-14", 4).unwrap();
        crate::chat::set_setting(&conn, "model", "deepseek-reasoner").unwrap();
        let sid = crate::chat::goal_session(&conn, id, 5).unwrap();
        crate::chat::add_user(&conn, sid, "降强度 \"引号\" 和换行\n测试", 6).unwrap();
        crate::review::save_review(&conn, id, "2026-10-12", &crate::review::ReviewText { went_well: "好".into(), hard: "难".into(), next_plan: "".into() }, "2026-10-14", 7).unwrap();
        crate::review::set_ai_comment(&conn, id, "2026-10-12", "点评", 8).unwrap();
        crate::reminder::save_goal_reminders(&conn, id, true, &["08:30".into(), "21:00".into()], 9).unwrap();
        crate::templates::save_goal_as_template(&conn, id, Some("我的模板"), 10).unwrap();
        crate::chat::delete_session(&mut conn, sid, 11).unwrap();
        conn
    }

    #[test]
    fn export_then_import_roundtrip() {
        let src = rich();
        // 新状态 completed 能随备份往返
        src.execute("UPDATE goals SET status='completed' WHERE id=1", []).unwrap();
        let dump1 = export(&src, "2026-10-15T09:00:00+08:00", "0.1.0").unwrap();
        let text = serde_json::to_string_pretty(&dump1).unwrap();
        assert!(!text.to_lowercase().contains("api_key") && !text.contains("sk-"));

        let mut dst = Connection::open_in_memory().unwrap();
        crate::db::migrate(&dst).unwrap();
        import_sample(&mut dst, "2026-10-01", 0).unwrap(); // 目标库原有数据会被覆盖
        let v = parse(&text).unwrap();
        let info = import(&mut dst, &v).unwrap();
        assert_eq!((info.goals, info.plan_versions, info.weekly_reviews, info.goal_reminders, info.plan_templates, info.backup_version), (1, 2, 1, 2, 1, 5));
        let st: String = dst.query_row("SELECT status FROM goals WHERE id=1", [], |r| r.get(0)).unwrap();
        assert_eq!(st, "completed");
        assert_eq!(crate::templates::list_templates(&dst).unwrap().iter().filter(|t| !t.builtin).count(), 1);
        let dump2 = export(&dst, "2026-10-15T09:00:00+08:00", "0.1.0").unwrap();
        assert_eq!(dump1, dump2, "导出→导入→再导出应完全一致");
        let d = get_goal_detail(&dst, 1, "2026-10-14", 0).unwrap();
        assert_eq!((d.version_no, d.done), (Some(2), 6));
        // 自增继续正常
        let id2 = import_sample(&mut dst, "2026-10-14", 9).unwrap();
        assert_eq!(id2, 2);
    }

    #[test]
    fn old_v1_backup_still_imports() {
        let src = rich();
        let mut v = export(&src, "t", "0.1.0").unwrap();
        v["backup_version"] = json!(1);
        v["schema_version"] = json!(3);
        v["tables"].as_object_mut().unwrap().remove("goal_reminders");
        v["tables"].as_object_mut().unwrap().remove("plan_templates");
        for r in v["tables"]["chat_sessions"].as_array_mut().unwrap() {
            r.as_object_mut().unwrap().remove("deleted_at");
        }
        let mut dst = Connection::open_in_memory().unwrap();
        crate::db::migrate(&dst).unwrap();
        import_sample(&mut dst, "2026-10-14", 0).unwrap();
        crate::reminder::save_goal_reminders(&dst, 1, true, &["07:00".into()], 1).unwrap();
        let info = import(&mut dst, &v).unwrap();
        assert_eq!((info.backup_version, info.goal_reminders, info.goals), (1, 0, 1));
        assert!(crate::reminder::goal_reminders(&dst, 1).unwrap().times.is_empty(), "旧备份导入后提醒为空");
        assert_eq!(get_goal_detail(&dst, 1, "2026-10-14", 0).unwrap().done, 6);
        // v1 备份里不该出现新表；v1 但结构版本不对也拒绝
        let mut bad = v.clone();
        bad["tables"]["goal_reminders"] = json!([]);
        assert!(import(&mut dst, &bad).unwrap_err().contains("不应该有"));
        let mut bad = v.clone();
        bad["schema_version"] = json!(4);
        assert!(import(&mut dst, &bad).is_err());
    }

    #[test]
    fn old_v2_backup_still_imports() {
        let src = rich();
        let mut v = export(&src, "t", "0.1.0").unwrap();
        v["backup_version"] = json!(2);
        v["schema_version"] = json!(4);
        v["tables"].as_object_mut().unwrap().remove("plan_templates");
        for r in v["tables"]["chat_sessions"].as_array_mut().unwrap() {
            r.as_object_mut().unwrap().remove("deleted_at");
        }
        let mut dst = Connection::open_in_memory().unwrap();
        crate::db::migrate(&dst).unwrap();
        let g0 = import_sample(&mut dst, "2026-10-14", 0).unwrap();
        crate::templates::save_goal_as_template(&dst, g0, None, 1).unwrap();
        let info = import(&mut dst, &v).unwrap();
        assert_eq!((info.backup_version, info.goal_reminders, info.plan_templates), (2, 2, 0));
        assert_eq!(crate::templates::list_templates(&dst).unwrap().iter().filter(|t| !t.builtin).count(), 0);
        assert_eq!(crate::chat::list_sessions(&dst).unwrap().len(), 1, "旧备份会话没有 deleted_at，导入后可见");
        let mut bad = v.clone();
        bad["tables"]["plan_templates"] = json!([]);
        assert!(import(&mut dst, &bad).unwrap_err().contains("不应该有"));
    }

    #[test]
    fn old_v3_backup_and_weather_settings() {
        let src = rich();
        crate::weather::save_settings(&src, &crate::weather::WeatherSettings { enabled: false, city: crate::weather::City { name: "上海".into(), admin: String::new(), country: String::new(), latitude: 31.23, longitude: 121.47 } }).unwrap();
        let mut v = export(&src, "t", "0.1.0").unwrap();
        assert!(v["tables"].get("weather_cache").is_none(), "天气缓存不入备份");
        let mut dst = Connection::open_in_memory().unwrap();
        crate::db::migrate(&dst).unwrap();
        import(&mut dst, &v).unwrap();
        let ws = crate::weather::get_settings(&dst).unwrap();
        assert!(!ws.enabled && ws.city.name == "上海", "天气设置随备份恢复");
        v["backup_version"] = json!(3);
        v["schema_version"] = json!(5);
        assert_eq!(import(&mut dst, &v).unwrap().backup_version, 3);
        v["schema_version"] = json!(6);
        assert!(import(&mut dst, &v).is_err());
    }

    #[test]
    fn bad_backups_rejected_and_rolled_back() {
        let src = rich();
        let good = export(&src, "t", "0.1.0").unwrap();
        let mut dst = Connection::open_in_memory().unwrap();
        crate::db::migrate(&dst).unwrap();
        import_sample(&mut dst, "2026-10-14", 0).unwrap();
        let before = export(&dst, "t", "0.1.0").unwrap();

        let mut cases: Vec<(Value, &str)> = vec![];
        let mut v = good.clone(); v["format"] = json!("other"); cases.push((v, "不是"));
        let mut v = good.clone(); v["backup_version"] = json!(9); cases.push((v, "不受支持"));
        let mut v = good.clone(); v["schema_version"] = json!(99); cases.push((v, "更新的版本"));
        let mut v = good.clone(); v["tables"].as_object_mut().unwrap().remove("checkins"); cases.push((v, "缺少数据表 checkins"));
        let mut v = good.clone(); v["tables"]["goals"][0]["evil; DROP"] = json!(1); cases.push((v, "未知字段"));
        let mut v = good.clone(); v["tables"]["goals"][0]["status"] = json!("whatever"); cases.push((v, "已回滚"));
        let mut v = good.clone(); v["tables"]["checkins"][0]["plan_day_id"] = json!(99999); cases.push((v, "已回滚"));
        for (v, want) in cases {
            let err = import(&mut dst, &v).unwrap_err();
            assert!(err.contains(want), "期望「{want}」，实际：{err}");
            assert_eq!(export(&dst, "t", "0.1.0").unwrap(), before, "失败后数据必须保持不变");
        }
        assert!(parse("{坏的").unwrap_err().contains("不是合法的 JSON"));
    }
}
