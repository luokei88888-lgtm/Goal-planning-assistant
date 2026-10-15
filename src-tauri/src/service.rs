//! 业务逻辑：目标 / 计划版本 / 每日计划 / 打卡。
//! 函数都接收 `today`（本地日期 YYYY-MM-DD），方便单元测试。

use chrono::{Duration, NaiveDate};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};

type R<T> = Result<T, String>;

pub(crate) fn e(err: rusqlite::Error) -> String {
    format!("数据库错误：{err}")
}

pub(crate) fn parse_date(s: &str) -> R<NaiveDate> {
    NaiveDate::parse_from_str(s, "%Y-%m-%d").map_err(|_| format!("日期格式不对：{s}（应为 YYYY-MM-DD）"))
}

pub(crate) fn shift(date: &str, days: i64) -> R<String> {
    Ok((parse_date(date)? + Duration::days(days)).format("%Y-%m-%d").to_string())
}

#[derive(Debug, Serialize, Clone)]
pub struct GoalSummary {
    pub id: i64,
    pub title: String,
    pub icon: String,
    pub status: String,
    pub version_no: Option<i64>,
    pub done: i64,
    pub total: i64,
    /// 休息日天数（完成率 = done / (total - rest)）
    pub rest: i64,
    pub today_done: bool,
    pub today_in_plan: bool,
}

#[derive(Debug, Serialize, Clone)]
pub struct DayItem {
    pub id: i64,
    pub day_index: i64,
    pub date: String,
    pub title: String,
    pub detail: String,
    pub is_rest: bool,
    pub checked: bool,
    pub kind: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct GoalDetail {
    pub id: i64,
    pub title: String,
    pub icon: String,
    pub status: String,
    pub version_no: Option<i64>,
    pub version_status: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub readonly: bool,
    pub total: i64,
    pub done: i64,
    pub today: Option<DayItem>,
    pub missed: Vec<DayItem>,
    pub upcoming: Vec<DayItem>,
}

#[derive(Debug, Deserialize)]
pub struct NewDay {
    pub title: String,
    #[serde(default)]
    pub detail: String,
    #[serde(default)]
    pub tasks: Vec<String>,
    #[serde(default)]
    pub is_rest: bool,
}

#[derive(Debug, Deserialize)]
pub struct NewGoal {
    pub title: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub icon: Option<String>,
    #[serde(default)]
    pub source: Option<String>,
    #[serde(default)]
    pub summary: String,
    pub start_date: String,
    pub days: Vec<NewDay>,
}

pub(crate) struct Version {
    pub id: i64,
    pub no: i64,
    pub status: String,
    pub start: String,
    pub end: String,
}

pub(crate) fn version_for(conn: &Connection, goal_id: i64, active_only: bool) -> R<Option<Version>> {
    let sql = if active_only {
        "SELECT id, version_no, status, start_date, end_date FROM plan_versions WHERE goal_id=?1 AND status='active'"
    } else {
        "SELECT id, version_no, status, start_date, end_date FROM plan_versions WHERE goal_id=?1 AND status!='draft' ORDER BY version_no DESC LIMIT 1"
    };
    conn.query_row(sql, [goal_id], |r| {
        Ok(Version { id: r.get(0)?, no: r.get(1)?, status: r.get(2)?, start: r.get(3)?, end: r.get(4)? })
    })
    .optional()
    .map_err(e)
}

pub(crate) fn days_of(conn: &Connection, version_id: i64) -> R<Vec<DayItem>> {
    let mut st = conn
        .prepare(
            "SELECT d.id, d.day_index, d.date, d.title, d.detail, d.is_rest, c.kind
             FROM plan_days d LEFT JOIN checkins c ON c.plan_day_id = d.id
             WHERE d.plan_version_id = ?1 ORDER BY d.day_index",
        )
        .map_err(e)?;
    let rows = st
        .query_map([version_id], |r| {
            let kind: Option<String> = r.get(6)?;
            Ok(DayItem {
                id: r.get(0)?,
                day_index: r.get(1)?,
                date: r.get(2)?,
                title: r.get(3)?,
                detail: r.get(4)?,
                is_rest: r.get::<_, i64>(5)? != 0,
                checked: kind.is_some(),
                kind,
            })
        })
        .map_err(e)?;
    rows.collect::<Result<Vec<_>, _>>().map_err(e)
}

#[allow(dead_code)]
pub fn list_goals(conn: &Connection, today: &str) -> R<Vec<GoalSummary>> {
    list_goals_by(conn, today, false)
}

/// 按本地日期自动切换「进行中 / 已完成」：生效版本最后一天早于今天 → completed；
/// 结束日期在今天或之后（如改方案延长）→ 回到 active。归档目标不动。返回变更条数。
pub fn refresh_statuses(conn: &Connection, today: &str) -> R<usize> {
    let a = conn
        .execute(
            "UPDATE goals SET status='completed' WHERE status='active'
             AND id IN (SELECT goal_id FROM plan_versions WHERE status='active' AND end_date < ?1)",
            [today],
        )
        .map_err(e)?;
    let b = conn
        .execute(
            "UPDATE goals SET status='active' WHERE status='completed'
             AND id IN (SELECT goal_id FROM plan_versions WHERE status='active' AND end_date >= ?1)",
            [today],
        )
        .map_err(e)?;
    Ok(a + b)
}

/// archived=true 列出已归档目标（按归档时间倒序）；否则列出进行中 + 已完成（进行中在前）
pub fn list_goals_by(conn: &Connection, today: &str, archived: bool) -> R<Vec<GoalSummary>> {
    refresh_statuses(conn, today)?;
    let sql = if archived {
        "SELECT id, title, icon, status FROM goals WHERE status='archived' ORDER BY updated_at DESC, id DESC"
    } else {
        "SELECT id, title, icon, status FROM goals WHERE status IN ('active','completed') ORDER BY status='completed', id"
    };
    let mut st = conn.prepare(sql).map_err(e)?;
    let goals = st
        .query_map([], |r| Ok((r.get::<_, i64>(0)?, r.get::<_, String>(1)?, r.get::<_, String>(2)?, r.get::<_, String>(3)?)))
        .map_err(e)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(e)?;
    let mut out = Vec::new();
    for (id, title, icon, status) in goals {
        let v = version_for(conn, id, !archived)?;
        let (mut done, mut total, mut rest, mut today_done, mut today_in_plan) = (0, 0, 0, false, false);
        if let Some(v) = &v {
            let days = days_of(conn, v.id)?;
            total = days.len() as i64;
            rest = days.iter().filter(|d| d.is_rest).count() as i64;
            done = days.iter().filter(|d| d.checked).count() as i64;
            if let Some(t) = days.iter().find(|d| d.date == today) {
                today_in_plan = true;
                today_done = t.checked;
            }
        }
        out.push(GoalSummary { id, title, icon, status, version_no: v.map(|v| v.no), done, total, rest, today_done, today_in_plan });
    }
    Ok(out)
}

pub fn get_goal_detail(conn: &Connection, goal_id: i64, today: &str, upcoming_limit: usize) -> R<GoalDetail> {
    let (title, icon, status): (String, String, String) = conn
        .query_row("SELECT title, icon, status FROM goals WHERE id=?1", [goal_id], |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?)))
        .optional()
        .map_err(e)?
        .ok_or("找不到这个目标")?;
    let v = version_for(conn, goal_id, status != "archived")?;
    let mut d = GoalDetail {
        id: goal_id,
        title,
        icon,
        readonly: status == "archived",
        status,
        version_no: None,
        version_status: None,
        start_date: None,
        end_date: None,
        total: 0,
        done: 0,
        today: None,
        missed: vec![],
        upcoming: vec![],
    };
    if let Some(v) = v {
        let days = days_of(conn, v.id)?;
        d.readonly = d.readonly || v.status != "active";
        d.version_no = Some(v.no);
        d.version_status = Some(v.status);
        d.start_date = Some(v.start);
        d.end_date = Some(v.end);
        d.total = days.len() as i64;
        d.done = days.iter().filter(|x| x.checked).count() as i64;
        d.today = days.iter().find(|x| x.date == today).cloned();
        d.missed = days.iter().filter(|x| x.date.as_str() < today && !x.checked).cloned().collect();
        d.upcoming = days.iter().filter(|x| x.date.as_str() > today).take(upcoming_limit).cloned().collect();
    }
    Ok(d)
}

/// 校验某天是否允许打卡，返回 (日期, 是否已打卡)
fn check_day(conn: &Connection, plan_day_id: i64) -> R<(String, bool)> {
    let row: Option<(String, String, String, Option<i64>)> = conn
        .query_row(
            "SELECT d.date, v.status, g.status, c.id FROM plan_days d
             JOIN plan_versions v ON v.id = d.plan_version_id
             JOIN goals g ON g.id = v.goal_id
             LEFT JOIN checkins c ON c.plan_day_id = d.id WHERE d.id = ?1",
            [plan_day_id],
            |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?, r.get(3)?)),
        )
        .optional()
        .map_err(e)?;
    let (date, vstatus, gstatus, cid) = row.ok_or("找不到这一天的计划")?;
    if gstatus == "archived" {
        return Err("目标已归档，只能查看，不能打卡".into());
    }
    match vstatus.as_str() {
        "draft" => return Err("草案还没生效，不能打卡".into()),
        "archived" => return Err("这是归档的旧版本，只能查看，不能打卡".into()),
        _ => {}
    }
    Ok((date, cid.is_some()))
}

fn insert_checkin(conn: &Connection, id: i64, date: &str, kind: &str, now: i64) -> R<()> {
    conn.execute(
        "INSERT INTO checkins (plan_day_id, date, kind, done_at) VALUES (?1, ?2, ?3, ?4)",
        params![id, date, kind, now],
    )
    .map_err(e)?;
    Ok(())
}

/// 给今天打卡
pub fn check_in(conn: &Connection, plan_day_id: i64, today: &str, now: i64) -> R<()> {
    let (date, done) = check_day(conn, plan_day_id)?;
    if date.as_str() > today {
        return Err(format!("{date} 还没到，未来的日子不能提前打卡"));
    }
    if date.as_str() < today {
        return Err("这是过去的日子，请用「补打」".into());
    }
    if done {
        return Err("今天已经打过卡了".into());
    }
    insert_checkin(conn, plan_day_id, &date, "on_time", now)
}

/// 补打过去漏掉的日子
pub fn make_up_check_in(conn: &Connection, plan_day_id: i64, today: &str, now: i64) -> R<()> {
    let (date, done) = check_day(conn, plan_day_id)?;
    if date.as_str() >= today {
        return Err("只能补打今天以前的日子".into());
    }
    if done {
        return Err("这一天已经打过卡了".into());
    }
    insert_checkin(conn, plan_day_id, &date, "make_up", now)
}

/// 取消打卡（打卡/补打都可撤销）
pub fn undo_check_in(conn: &Connection, plan_day_id: i64) -> R<()> {
    let (_, done) = check_day(conn, plan_day_id)?;
    if !done {
        return Err("这一天还没打卡，无需取消".into());
    }
    conn.execute("DELETE FROM checkins WHERE plan_day_id = ?1", [plan_day_id]).map_err(e)?;
    Ok(())
}

/// 新建目标并直接生效第 1 版计划（日期从 start_date 起逐日连续）
pub fn create_goal_with_plan(conn: &mut Connection, g: &NewGoal, now: i64) -> R<i64> {
    let title = g.title.trim();
    if title.is_empty() {
        return Err("目标名称不能为空".into());
    }
    if g.days.is_empty() {
        return Err("计划至少要有 1 天".into());
    }
    if g.days.len() > 366 {
        return Err("计划最多 366 天".into());
    }
    if let Some((i, _)) = g.days.iter().enumerate().find(|(_, d)| d.title.trim().is_empty()) {
        return Err(format!("第 {} 天的标题为空", i + 1));
    }
    let source = g.source.clone().unwrap_or_else(|| "manual".into());
    if source != "chat" && source != "manual" {
        return Err("来源只能是 chat 或 manual".into());
    }
    let start = parse_date(&g.start_date)?;
    let end = start + Duration::days(g.days.len() as i64 - 1);
    let tx = conn.transaction().map_err(e)?;
    tx.execute(
        "INSERT INTO goals (title, description, icon, status, created_at, updated_at) VALUES (?1, ?2, ?3, 'active', ?4, ?4)",
        params![title, g.description, g.icon.clone().unwrap_or_else(|| "target".into()), now],
    )
    .map_err(e)?;
    let goal_id = tx.last_insert_rowid();
    tx.execute(
        "INSERT INTO plan_versions (goal_id, version_no, status, source, summary, start_date, end_date, created_at, activated_at)
         VALUES (?1, 1, 'active', ?2, ?3, ?4, ?5, ?6, ?6)",
        params![goal_id, source, g.summary, start.format("%Y-%m-%d").to_string(), end.format("%Y-%m-%d").to_string(), now],
    )
    .map_err(e)?;
    let vid = tx.last_insert_rowid();
    for (i, d) in g.days.iter().enumerate() {
        let date = (start + Duration::days(i as i64)).format("%Y-%m-%d").to_string();
        let tasks = serde_json::to_string(&d.tasks).unwrap_or_else(|_| "[]".into());
        tx.execute(
            "INSERT INTO plan_days (plan_version_id, day_index, date, title, detail, tasks, is_rest) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![vid, i as i64 + 1, date, d.title.trim(), d.detail, tasks, d.is_rest as i64],
        )
        .map_err(e)?;
    }
    tx.commit().map_err(e)?;
    Ok(goal_id)
}

/// 归档目标（不删除；生效版本一起归档，打卡保留）
pub fn archive_goal(conn: &mut Connection, goal_id: i64, now: i64) -> R<()> {
    let tx = conn.transaction().map_err(e)?;
    let n = tx
        .execute("UPDATE goals SET status='archived', updated_at=?2 WHERE id=?1 AND status IN ('active','completed')", params![goal_id, now])
        .map_err(e)?;
    if n == 0 {
        return Err("目标不存在或已经归档".into());
    }
    tx.execute("UPDATE plan_versions SET status='archived' WHERE goal_id=?1 AND status='active'", [goal_id]).map_err(e)?;
    tx.commit().map_err(e)?;
    Ok(())
}

/// 恢复已归档目标：最新版本重新生效，打卡记录原样保留；之后按日期由 refresh_statuses 判断进行中/已完成
pub fn restore_goal(conn: &mut Connection, goal_id: i64, now: i64) -> R<()> {
    let tx = conn.transaction().map_err(e)?;
    let n = tx
        .execute("UPDATE goals SET status='active', updated_at=?2 WHERE id=?1 AND status='archived'", params![goal_id, now])
        .map_err(e)?;
    if n == 0 {
        return Err("目标不存在或没有归档".into());
    }
    tx.execute(
        "UPDATE plan_versions SET status='active' WHERE id=(SELECT id FROM plan_versions WHERE goal_id=?1 AND status!='draft' ORDER BY version_no DESC LIMIT 1)",
        [goal_id],
    )
    .map_err(e)?;
    tx.commit().map_err(e)?;
    Ok(())
}

/// 导入示例：30 天减脂，从 7 天前开始；第 1-7 天除第 4 天外都已打卡，今天是第 8 天。
pub fn import_sample(conn: &mut Connection, today: &str, now: i64) -> R<i64> {
    let t = parse_date(today)?;
    let cycle: [(&str, &str, bool); 7] = [
        ("有氧快走40分钟", "心率保持在 60%-70%，饭后 1 小时再走", false),
        ("核心训练20分钟", "卷腹 3×15 · 平板支撑 3×45秒 · 死虫 3×12", false),
        ("有氧慢跑30分钟", "能说话的配速，跑后拉伸 5 分钟", false),
        ("上肢力量 + 拉伸", "俯卧撑 4×10 · 哑铃推举 3×12 · 肩背拉伸", false),
        ("哑铃力量训练30分钟", "深蹲 4×12 · 哑铃划船 3×10 · 平板支撑 3×45秒", false),
        ("HIIT 15分钟", "开合跳/高抬腿/波比跳 各 40 秒，休息 20 秒，4 轮", false),
        ("休息日 · 轻量拉伸", "全身拉伸 15 分钟，早点睡", true),
    ];
    let days: Vec<NewDay> = (0..30)
        .map(|i| {
            let (title, detail, rest) = cycle[(i + 3) % 7];
            NewDay { title: title.into(), detail: detail.into(), tasks: vec![], is_rest: rest }
        })
        .collect();
    let g = NewGoal {
        title: "30天减脂".into(),
        description: "30 天内降低体脂率 3-6%，提升体能与代谢".into(),
        icon: Some("flame".into()),
        source: Some("manual".into()),
        summary: "示例目标：饮食控制 + 有氧 + 力量".into(),
        start_date: (t - Duration::days(7)).format("%Y-%m-%d").to_string(),
        days,
    };
    let goal_id = create_goal_with_plan(conn, &g, now)?;
    let detail = get_goal_detail(conn, goal_id, today, 0)?;
    for d in detail.missed.iter().filter(|d| d.day_index != 4) {
        insert_checkin(conn, d.id, &d.date, "on_time", now)?;
    }
    Ok(goal_id)
}

/// 恢复出厂：一个事务里清空所有业务表和 settings，重置自增（保留 schema_migrations）
pub fn factory_reset(conn: &mut Connection) -> R<()> {
    let tx = conn.transaction().map_err(e)?;
    tx.execute_batch(
        "DELETE FROM reminder_log;
         DELETE FROM goal_reminders;
         DELETE FROM checkins;
         DELETE FROM weekly_reviews;
         DELETE FROM chat_messages;
         DELETE FROM chat_sessions;
         DELETE FROM plan_days;
         DELETE FROM plan_versions;
         DELETE FROM goals;
         DELETE FROM plan_templates;
         DELETE FROM weather_cache;
         DELETE FROM settings;
         DELETE FROM sqlite_sequence WHERE name IN
           ('plan_templates','goal_reminders','checkins','weekly_reviews','chat_messages','chat_sessions','plan_days','plan_versions','goals');",
    )
    .map_err(e)?;
    tx.commit().map_err(e)?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn setup() -> (Connection, i64) {
        let mut conn = Connection::open_in_memory().unwrap();
        crate::db::migrate(&conn).unwrap();
        let id = import_sample(&mut conn, "2026-10-14", 0).unwrap();
        (conn, id)
    }

    #[test]
    fn sample_has_one_missed_day() {
        let (conn, id) = setup();
        let d = get_goal_detail(&conn, id, "2026-10-14", 5).unwrap();
        assert_eq!(d.total, 30);
        assert_eq!(d.done, 6);
        assert_eq!(d.missed.len(), 1);
        assert_eq!(d.missed[0].day_index, 4);
        assert_eq!(d.today.as_ref().unwrap().day_index, 8);
        assert_eq!(d.upcoming.len(), 5);
        assert_eq!(d.upcoming[0].day_index, 9);
    }

    #[test]
    fn check_in_rules() {
        let (conn, id) = setup();
        let d = get_goal_detail(&conn, id, "2026-10-14", 5).unwrap();
        let today = d.today.unwrap().id;
        let missed = d.missed[0].id;
        let future = d.upcoming[0].id;

        assert!(check_in(&conn, future, "2026-10-14", 1).is_err());
        assert!(check_in(&conn, missed, "2026-10-14", 1).is_err());
        check_in(&conn, today, "2026-10-14", 1).unwrap();
        assert!(check_in(&conn, today, "2026-10-14", 1).is_err());

        make_up_check_in(&conn, missed, "2026-10-14", 1).unwrap();
        let d = get_goal_detail(&conn, id, "2026-10-14", 5).unwrap();
        assert_eq!(d.done, 8);
        assert!(d.missed.is_empty());
        let s = &list_goals(&conn, "2026-10-14").unwrap()[0];
        assert!(s.today_done);

        undo_check_in(&conn, today).unwrap();
        assert!(undo_check_in(&conn, today).is_err());
        // 过了一天：昨天没打卡就变成漏打
        let d = get_goal_detail(&conn, id, "2026-10-15", 5).unwrap();
        assert_eq!(d.missed.len(), 1);
        assert_eq!(d.missed[0].day_index, 8);
        assert_eq!(d.today.unwrap().day_index, 9);
    }

    #[test]
    fn archived_is_readonly() {
        let (mut conn, id) = setup();
        let today = get_goal_detail(&conn, id, "2026-10-14", 0).unwrap().today.unwrap().id;
        archive_goal(&mut conn, id, 2).unwrap();
        assert!(check_in(&conn, today, "2026-10-14", 3).is_err());
        let d = get_goal_detail(&conn, id, "2026-10-14", 0).unwrap();
        assert!(d.readonly);
        assert_eq!(d.done, 6);
        assert!(list_goals(&conn, "2026-10-14").unwrap().is_empty());
        let a = list_goals_by(&conn, "2026-10-14", true).unwrap();
        assert_eq!((a.len(), a[0].done, a[0].status.as_str()), (1, 6, "archived"));

        restore_goal(&mut conn, id, 4).unwrap();
        assert!(restore_goal(&mut conn, id, 4).is_err());
        assert!(list_goals_by(&conn, "2026-10-14", true).unwrap().is_empty());
        let d = get_goal_detail(&conn, id, "2026-10-14", 0).unwrap();
        assert!(!d.readonly);
        assert_eq!((d.version_no, d.done), (Some(1), 6));
        check_in(&conn, today, "2026-10-14", 5).unwrap();
    }

    #[test]
    fn factory_reset_clears_and_allows_reimport() {
        let (mut conn, id) = setup();
        crate::chat::set_setting(&conn, "model", "x").unwrap();
        let sid = crate::chat::new_session(&conn, 1).unwrap();
        crate::chat::add_user(&conn, sid, "你好", 1).unwrap();
        let today = get_goal_detail(&conn, id, "2026-10-14", 0).unwrap().today.unwrap().id;
        check_in(&conn, today, "2026-10-14", 1).unwrap();

        crate::review::save_review(&conn, id, "2026-10-12", &crate::review::ReviewText::default(), "2026-10-14", 1).unwrap();
        crate::reminder::save_goal_reminders(&conn, id, true, &["20:00".into()], 1).unwrap();
        crate::reminder::mark_sent(&conn, "goal:1:20:00", "2026-10-14", 1).unwrap();
        factory_reset(&mut conn).unwrap();
        for t in ["goal_reminders", "reminder_log", "weekly_reviews", "goals", "plan_versions", "plan_days", "checkins", "chat_sessions", "chat_messages", "settings"] {
            let n: i64 = conn.query_row(&format!("SELECT COUNT(*) FROM {t}"), [], |r| r.get(0)).unwrap();
            assert_eq!(n, 0, "{t} 没清空");
        }
        let mig: i64 = conn.query_row("SELECT COUNT(*) FROM schema_migrations", [], |r| r.get(0)).unwrap();
        assert!(mig >= 3);
        assert!(list_goals(&conn, "2026-10-14").unwrap().is_empty());
        assert_eq!(crate::chat::model_and_url(&conn).unwrap().0, crate::chat::DEFAULT_MODEL);

        let id2 = import_sample(&mut conn, "2026-10-14", 2).unwrap();
        assert_eq!(id2, 1, "自增应已重置");
        assert_eq!(get_goal_detail(&conn, id2, "2026-10-14", 0).unwrap().done, 6);
    }
}
