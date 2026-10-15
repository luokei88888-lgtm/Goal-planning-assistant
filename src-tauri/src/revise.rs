//! 改方案：计划版本切换 + 历史版本查看 + 草案变化摘要。
//!
//! 规则（v1.1）：新版本 = 旧版里「今天以前」的日子原样复制（内容不变）+ 草案里从今天起的新日程。
//! 旧版的打卡按日期映射复制到新版同日期的那一天（今天已打卡也会保留）；
//! 旧版归档后仍保留自己的打卡，可只读查看。

use chrono::Duration;
use rusqlite::{params, Connection, OptionalExtension};
use serde::Serialize;

use crate::draft::DraftPlan;
use crate::service::{days_of, e, parse_date, version_for, DayItem, NewDay};

type R<T> = Result<T, String>;

#[derive(Debug, Serialize)]
pub struct VersionInfo {
    pub version_no: i64,
    pub status: String,
    pub source: String,
    pub summary: String,
    pub start_date: String,
    pub end_date: String,
    pub created_at: i64,
    pub activated_at: Option<i64>,
    pub total: i64,
    pub done: i64,
}

#[derive(Debug, Serialize, Clone)]
pub struct DraftDiff {
    pub base_version: i64,
    pub next_version: i64,
    /// 保留的过去天数
    pub keep_past: i64,
    pub old_remaining: i64,
    pub new_remaining: i64,
    pub old_end: String,
    pub new_end: String,
    /// 同一天内容变了的天数
    pub changed: i64,
    pub old_rest: i64,
    pub new_rest: i64,
}

fn goal_status(conn: &Connection, goal_id: i64) -> R<(String, String)> {
    conn.query_row("SELECT title, status FROM goals WHERE id=?1", [goal_id], |r| Ok((r.get(0)?, r.get(1)?)))
        .optional()
        .map_err(e)?
        .ok_or_else(|| "找不到这个目标".to_string())
}

pub fn list_versions(conn: &Connection, goal_id: i64) -> R<Vec<VersionInfo>> {
    let mut st = conn
        .prepare(
            "SELECT v.version_no, v.status, v.source, v.summary, v.start_date, v.end_date, v.created_at, v.activated_at,
                    (SELECT COUNT(*) FROM plan_days d WHERE d.plan_version_id=v.id),
                    (SELECT COUNT(*) FROM plan_days d JOIN checkins c ON c.plan_day_id=d.id WHERE d.plan_version_id=v.id)
             FROM plan_versions v WHERE v.goal_id=?1 AND v.status!='draft' ORDER BY v.version_no DESC",
        )
        .map_err(e)?;
    let rows = st
        .query_map([goal_id], |r| {
            Ok(VersionInfo {
                version_no: r.get(0)?,
                status: r.get(1)?,
                source: r.get(2)?,
                summary: r.get(3)?,
                start_date: r.get(4)?,
                end_date: r.get(5)?,
                created_at: r.get(6)?,
                activated_at: r.get(7)?,
                total: r.get(8)?,
                done: r.get(9)?,
            })
        })
        .map_err(e)?;
    rows.collect::<Result<Vec<_>, _>>().map_err(e)
}

pub fn version_days(conn: &Connection, goal_id: i64, version_no: i64) -> R<Vec<DayItem>> {
    let vid: i64 = conn
        .query_row("SELECT id FROM plan_versions WHERE goal_id=?1 AND version_no=?2", params![goal_id, version_no], |r| r.get(0))
        .optional()
        .map_err(e)?
        .ok_or("找不到这个版本")?;
    days_of(conn, vid)
}

/// 发给模型的当前计划上下文
pub fn plan_context(conn: &Connection, goal_id: i64, today: &str) -> R<String> {
    let (title, _) = goal_status(conn, goal_id)?;
    let v = version_for(conn, goal_id, true)?.ok_or("这个目标没有生效中的计划")?;
    let days = days_of(conn, v.id)?;
    let mut st = conn.prepare("SELECT day_index, tasks FROM plan_days WHERE plan_version_id=?1").map_err(e)?;
    let tasks: std::collections::HashMap<i64, Vec<String>> = st
        .query_map([v.id], |r| Ok((r.get::<_, i64>(0)?, r.get::<_, String>(1)?)))
        .map_err(e)?
        .filter_map(|x| x.ok())
        .map(|(i, t)| (i, serde_json::from_str(&t).unwrap_or_default()))
        .collect();
    let done = days.iter().filter(|d| d.checked).count();
    let missed = days.iter().filter(|d| d.date.as_str() < today && !d.checked).count();
    let mut out = format!(
        "目标：{title}\n当前生效版本：v{}（{} 至 {}，共 {} 天）\n已完成 {done} 天，漏打 {missed} 天。\n\n【今天以前（不会改动）】\n",
        v.no, v.start, v.end, days.len()
    );
    for d in days.iter().filter(|d| d.date.as_str() < today) {
        let s = match d.kind.as_deref() {
            Some("on_time") => "已打卡",
            Some(_) => "补打",
            None => "漏打",
        };
        out += &format!("第{}天 {} {}{} [{s}]\n", d.day_index, d.date, d.title, if d.is_rest { "（休息）" } else { "" });
    }
    out += "\n【今天及以后（可以重新安排）】\n";
    let future: Vec<_> = days.iter().filter(|d| d.date.as_str() >= today).collect();
    if future.is_empty() {
        out += "（原计划已经结束）\n";
    }
    for d in future {
        let t = tasks.get(&d.day_index).map(|t| t.join("、")).unwrap_or_default();
        out += &format!(
            "第{}天 {} {}{}{}{}\n",
            d.day_index,
            d.date,
            d.title,
            if d.is_rest { "（休息）" } else { "" },
            if t.is_empty() { String::new() } else { format!(" | 任务：{t}") },
            if d.checked { " [今天已打卡]" } else { "" }
        );
    }
    if let Some((w, h, n, c)) = conn
        .query_row(
            "SELECT went_well, hard, next_plan, ai_comment FROM weekly_reviews WHERE goal_id=?1 ORDER BY week_start DESC LIMIT 1",
            [goal_id],
            |r| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?, r.get::<_, String>(2)?, r.get::<_, Option<String>>(3)?)),
        )
        .optional()
        .map_err(e)?
    {
        out += &format!("\n【最近一次周复盘】顺利：{w}；困难：{h}；下周打算：{n}");
        if let Some(c) = c {
            out += &format!("；助手点评：{}", c.chars().take(400).collect::<String>());
        }
        out += "\n";
    }
    Ok(out)
}

/// 草案与当前生效版的变化摘要（草案从今天起排）
pub fn diff_for(conn: &Connection, goal_id: i64, d: &DraftPlan, today: &str) -> R<Option<DraftDiff>> {
    let Some(v) = version_for(conn, goal_id, true)? else { return Ok(None) };
    let days = days_of(conn, v.id)?;
    let next: i64 = conn
        .query_row("SELECT COALESCE(MAX(version_no),0)+1 FROM plan_versions WHERE goal_id=?1", [goal_id], |r| r.get(0))
        .map_err(e)?;
    let past = days.iter().filter(|x| x.date.as_str() < today).count() as i64;
    let rem: Vec<_> = days.iter().filter(|x| x.date.as_str() >= today).collect();
    let changed = rem
        .iter()
        .zip(d.days.iter())
        .filter(|(o, n)| o.title.trim() != n.title.trim() || o.is_rest != n.is_rest)
        .count() as i64;
    let t = parse_date(today)?;
    let new_end = (t + Duration::days(d.days.len() as i64 - 1)).format("%Y-%m-%d").to_string();
    Ok(Some(DraftDiff {
        base_version: v.no,
        next_version: next,
        keep_past: past,
        old_remaining: rem.len() as i64,
        new_remaining: d.days.len() as i64,
        old_end: v.end,
        new_end,
        changed,
        old_rest: rem.iter().filter(|x| x.is_rest).count() as i64,
        new_rest: d.days.iter().filter(|x| x.is_rest).count() as i64,
    }))
}

/// 生效新版本，返回新版本号
pub fn revise_plan(conn: &mut Connection, goal_id: i64, days: &[NewDay], summary: &str, source: &str, today: &str, now: i64) -> R<i64> {
    let (_, gstatus) = goal_status(conn, goal_id)?;
    if gstatus == "archived" {
        return Err("目标已归档，不能再改方案".into());
    }
    if days.is_empty() {
        return Err("新方案至少要有 1 天".into());
    }
    if days.len() > 366 {
        return Err("新方案最多 366 天".into());
    }
    if let Some((i, _)) = days.iter().enumerate().find(|(_, d)| d.title.trim().is_empty()) {
        return Err(format!("新方案第 {} 天的标题为空", i + 1));
    }
    let t = parse_date(today)?;
    let old = version_for(conn, goal_id, true)?.ok_or("这个目标没有生效中的计划")?;
    let tx = conn.transaction().map_err(e)?;
    let past: Vec<(String, String, String, String, i64)> = {
        let mut st = tx
            .prepare("SELECT date, title, detail, tasks, is_rest FROM plan_days WHERE plan_version_id=?1 AND date < ?2 ORDER BY day_index")
            .map_err(e)?;
        let rows = st
            .query_map(params![old.id, today], |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?, r.get(3)?, r.get(4)?)))
            .map_err(e)?;
        rows.collect::<Result<Vec<_>, _>>().map_err(e)?
    };
    let next: i64 = tx
        .query_row("SELECT COALESCE(MAX(version_no),0)+1 FROM plan_versions WHERE goal_id=?1", [goal_id], |r| r.get(0))
        .map_err(e)?;
    let start = past.first().map(|p| p.0.clone()).unwrap_or_else(|| today.to_string());
    let end = (t + Duration::days(days.len() as i64 - 1)).format("%Y-%m-%d").to_string();
    tx.execute("UPDATE plan_versions SET status='archived' WHERE id=?1", [old.id]).map_err(e)?;
    tx.execute(
        "INSERT INTO plan_versions (goal_id, version_no, status, source, summary, start_date, end_date, created_at, activated_at)
         VALUES (?1, ?2, 'active', ?3, ?4, ?5, ?6, ?7, ?7)",
        params![goal_id, next, source, summary, start, end, now],
    )
    .map_err(e)?;
    let vid = tx.last_insert_rowid();
    let mut idx = 0i64;
    for (date, title, detail, tasks, rest) in &past {
        idx += 1;
        tx.execute(
            "INSERT INTO plan_days (plan_version_id, day_index, date, title, detail, tasks, is_rest) VALUES (?1,?2,?3,?4,?5,?6,?7)",
            params![vid, idx, date, title, detail, tasks, rest],
        )
        .map_err(e)?;
    }
    for (i, d) in days.iter().enumerate() {
        idx += 1;
        let date = (t + Duration::days(i as i64)).format("%Y-%m-%d").to_string();
        let tasks = serde_json::to_string(&d.tasks).unwrap_or_else(|_| "[]".into());
        tx.execute(
            "INSERT INTO plan_days (plan_version_id, day_index, date, title, detail, tasks, is_rest) VALUES (?1,?2,?3,?4,?5,?6,?7)",
            params![vid, idx, date, d.title.trim(), d.detail, tasks, d.is_rest as i64],
        )
        .map_err(e)?;
    }
    // 打卡按日期映射到新版同日期
    tx.execute(
        "INSERT INTO checkins (plan_day_id, date, kind, done_at, note)
         SELECT nd.id, c.date, c.kind, c.done_at, c.note FROM checkins c
         JOIN plan_days od ON od.id = c.plan_day_id
         JOIN plan_days nd ON nd.plan_version_id = ?2 AND nd.date = od.date
         WHERE od.plan_version_id = ?1",
        params![old.id, vid],
    )
    .map_err(e)?;
    tx.execute("UPDATE goals SET updated_at=?2 WHERE id=?1", params![goal_id, now]).map_err(e)?;
    tx.commit().map_err(e)?;
    // 已完成目标改方案/延长后结束日期在今天或之后 → 自动回到进行中
    crate::service::refresh_statuses(conn, today)?;
    Ok(next)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::service::*;

    #[test]
    fn revise_keeps_checkins_and_archives_old() {
        let mut conn = Connection::open_in_memory().unwrap();
        crate::db::migrate(&conn).unwrap();
        let id = import_sample(&mut conn, "2026-10-14", 0).unwrap();
        let d = get_goal_detail(&conn, id, "2026-10-14", 0).unwrap();
        let old_today = d.today.unwrap().id;
        check_in(&conn, old_today, "2026-10-14", 1).unwrap();
        let draft: DraftPlan = serde_json::from_str(
            r#"{"title":"30天减脂","summary":"降强度","start_date":"2026-10-14","days_count":3,
                "days":[{"title":"散步30分钟","tasks":["散步"],"is_rest":false},{"title":"休息","tasks":[],"is_rest":true},{"title":"慢跑20分钟","tasks":["跑"],"is_rest":false}]}"#,
        )
        .unwrap();
        let diff = diff_for(&conn, id, &draft, "2026-10-14").unwrap().unwrap();
        assert_eq!((diff.base_version, diff.next_version, diff.keep_past, diff.old_remaining, diff.new_remaining), (1, 2, 7, 23, 3));
        assert_eq!(diff.new_end, "2026-10-16");
        let ng = draft.to_new_goal("2026-10-14".into());
        let ver = revise_plan(&mut conn, id, &ng.days, "降强度", "chat", "2026-10-14", 2).unwrap();
        assert_eq!(ver, 2);

        let d = get_goal_detail(&conn, id, "2026-10-14", 5).unwrap();
        assert_eq!(d.version_no, Some(2));
        assert_eq!(d.total, 10);
        assert_eq!(d.done, 7, "过去 6 天 + 今天的打卡都保留");
        assert_eq!(d.missed.len(), 1);
        assert_eq!(d.missed[0].day_index, 4);
        let t = d.today.unwrap();
        assert_eq!((t.day_index, t.title.as_str(), t.checked), (8, "散步30分钟", true));
        assert_eq!(d.end_date.as_deref(), Some("2026-10-16"));
        // 过去日子内容保持旧版
        let v2 = version_days(&conn, id, 2).unwrap();
        let v1 = version_days(&conn, id, 1).unwrap();
        assert_eq!(v2[0].title, v1[0].title);
        // 旧版归档、只读、打卡仍在
        let vs = list_versions(&conn, id).unwrap();
        assert_eq!(vs.len(), 2);
        assert_eq!((vs[0].version_no, vs[0].status.as_str(), vs[0].done), (2, "active", 7));
        assert_eq!((vs[1].version_no, vs[1].status.as_str(), vs[1].done), (1, "archived", 7));
        assert!(undo_check_in(&conn, old_today).is_err());
        // 新版可以继续打卡/取消
        undo_check_in(&conn, t.id).unwrap();
        check_in(&conn, t.id, "2026-10-14", 3).unwrap();
        // 再改一次 → v3
        assert_eq!(revise_plan(&mut conn, id, &ng.days[..1], "", "chat", "2026-10-15", 4).unwrap(), 3);
        let d = get_goal_detail(&conn, id, "2026-10-15", 0).unwrap();
        assert_eq!((d.total, d.done), (9, 7));
        assert!(plan_context(&conn, id, "2026-10-15").unwrap().contains("v3"));
    }

    #[test]
    fn revise_from_tomorrow_keeps_today() {
        let mut conn = Connection::open_in_memory().unwrap();
        crate::db::migrate(&conn).unwrap();
        let id = import_sample(&mut conn, "2026-10-14", 0).unwrap();
        let d = get_goal_detail(&conn, id, "2026-10-14", 0).unwrap();
        let old_today = d.today.unwrap();
        check_in(&conn, old_today.id, "2026-10-14", 1).unwrap();
        let days: Vec<NewDay> = (0..3).map(|_| NewDay { title: "新安排".into(), detail: String::new(), tasks: vec!["x".into()], is_rest: false }).collect();
        let draft = DraftPlan { title: "t".into(), summary: String::new(), start_date: "2026-10-15".into(), days_count: 3, days: vec![] };
        let diff = diff_for(&conn, id, &draft, "2026-10-15").unwrap().unwrap();
        assert_eq!(diff.keep_past, 8, "今天也保留旧版");
        // 从明天起：start = 明天
        revise_plan(&mut conn, id, &days, "从明天起", "chat", "2026-10-15", 2).unwrap();
        let d = get_goal_detail(&conn, id, "2026-10-14", 5).unwrap();
        let t = d.today.unwrap();
        assert_eq!((t.title.as_str(), t.checked, t.day_index), (old_today.title.as_str(), true, 8), "今天保持旧内容和打卡");
        assert_eq!(d.upcoming[0].title, "新安排");
        assert_eq!(d.upcoming[0].date, "2026-10-15");
        assert_eq!((d.total, d.end_date.as_deref()), (11, Some("2026-10-17")));
    }
}
