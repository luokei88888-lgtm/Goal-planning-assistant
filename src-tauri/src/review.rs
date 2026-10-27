//! 周复盘：本周（周一至周日）统计 + 感受 + 助手点评。

use chrono::{Datelike, Duration, NaiveDate};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};

use crate::service::{days_of, e, parse_date, version_for};

type R<T> = Result<T, String>;

const WD: [&str; 7] = ["一", "二", "三", "四", "五", "六", "日"];

#[derive(Debug, Serialize)]
pub struct Cell {
    pub date: String,
    pub weekday: String,
    /// done / missed / today / future / none
    pub state: String,
    pub title: Option<String>,
    pub is_rest: bool,
    pub day_index: Option<i64>,
    /// 当日备注（无计划天为空串）
    pub note: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct Review {
    pub id: i64,
    pub goal_id: i64,
    pub week_start: String,
    pub done: i64,
    pub due: i64,
    pub missed: i64,
    pub went_well: String,
    pub hard: String,
    pub next_plan: String,
    pub ai_comment: Option<String>,
    pub updated_at: i64,
}

#[derive(Debug, Serialize)]
pub struct WeekView {
    pub goal_id: i64,
    pub goal_title: String,
    pub readonly: bool,
    pub week_start: String,
    pub week_end: String,
    pub is_current: bool,
    pub done: i64,
    pub due: i64,
    pub missed: i64,
    pub cells: Vec<Cell>,
    pub review: Option<Review>,
}

#[derive(Debug, Deserialize, Default)]
pub struct ReviewText {
    #[serde(default)]
    pub went_well: String,
    #[serde(default)]
    pub hard: String,
    #[serde(default)]
    pub next_plan: String,
}

fn fmt(d: NaiveDate) -> String {
    d.format("%Y-%m-%d").to_string()
}

pub fn monday_of(d: NaiveDate) -> NaiveDate {
    d - Duration::days(d.weekday().num_days_from_monday() as i64)
}

fn row(r: &rusqlite::Row) -> rusqlite::Result<Review> {
    Ok(Review {
        id: r.get(0)?,
        goal_id: r.get(1)?,
        week_start: r.get(2)?,
        done: r.get(3)?,
        due: r.get(4)?,
        missed: r.get(5)?,
        went_well: r.get(6)?,
        hard: r.get(7)?,
        next_plan: r.get(8)?,
        ai_comment: r.get(9)?,
        updated_at: r.get(10)?,
    })
}
const COLS: &str = "id, goal_id, week_start, done, due, missed, went_well, hard, next_plan, ai_comment, updated_at";

pub fn get_review(conn: &Connection, goal_id: i64, week_start: &str) -> R<Option<Review>> {
    conn.query_row(&format!("SELECT {COLS} FROM weekly_reviews WHERE goal_id=?1 AND week_start=?2"), params![goal_id, week_start], row)
        .optional()
        .map_err(e)
}

pub fn list_reviews(conn: &Connection, goal_id: i64) -> R<Vec<Review>> {
    let mut st = conn.prepare(&format!("SELECT {COLS} FROM weekly_reviews WHERE goal_id=?1 ORDER BY week_start DESC")).map_err(e)?;
    let rows = st.query_map([goal_id], row).map_err(e)?;
    rows.collect::<Result<Vec<_>, _>>().map_err(e)
}

/// week_start 可以是这一周里的任意一天；None = 本周
pub fn week_view(conn: &Connection, goal_id: i64, week_start: Option<&str>, today: &str) -> R<WeekView> {
    let (goal_title, status): (String, String) = conn
        .query_row("SELECT title, status FROM goals WHERE id=?1", [goal_id], |r| Ok((r.get(0)?, r.get(1)?)))
        .optional()
        .map_err(e)?
        .ok_or("找不到这个目标")?;
    let t = parse_date(today)?;
    let mon = monday_of(match week_start {
        Some(s) => parse_date(s)?,
        None => t,
    });
    let v = version_for(conn, goal_id, status != "archived")?;
    let days = match &v {
        Some(v) => days_of(conn, v.id)?,
        None => vec![],
    };
    let (mut done, mut due, mut missed) = (0, 0, 0);
    let mut cells = Vec::with_capacity(7);
    for i in 0..7 {
        let date = fmt(mon + Duration::days(i));
        let d = days.iter().find(|x| x.date == date);
        let state = match d {
            None => "none",
            // 休息日与统计一致：不计入 due/漏打；过去的休息日视为已「完成」（无需打卡）
            Some(x) if x.is_rest => {
                if date == today {
                    "today"
                } else if date.as_str() > today {
                    "future"
                } else {
                    "done"
                }
            }
            Some(x) => {
                if date.as_str() <= today {
                    due += 1;
                }
                if x.checked {
                    done += 1;
                    "done"
                } else if date.as_str() < today {
                    missed += 1;
                    "missed"
                } else if date == today {
                    "today"
                } else {
                    "future"
                }
            }
        };
        cells.push(Cell {
            weekday: WD[i as usize].into(),
            state: state.into(),
            title: d.map(|x| x.title.clone()),
            is_rest: d.map(|x| x.is_rest).unwrap_or(false),
            day_index: d.map(|x| x.day_index),
            note: d.map(|x| x.note.clone()).unwrap_or_default(),
            date,
        });
    }
    let ws = fmt(mon);
    Ok(WeekView {
        goal_id,
        goal_title,
        readonly: status == "archived",
        review: get_review(conn, goal_id, &ws)?,
        is_current: mon == monday_of(t),
        week_end: fmt(mon + Duration::days(6)),
        week_start: ws,
        done,
        due,
        missed,
        cells,
    })
}

/// 保存手写感受（同一周覆盖），同时记下当时的统计快照
pub fn save_review(conn: &Connection, goal_id: i64, week_start: &str, text: &ReviewText, today: &str, now: i64) -> R<Review> {
    let w = week_view(conn, goal_id, Some(week_start), today)?;
    if w.week_start.as_str() > today {
        return Err("这一周还没开始，不能复盘".into());
    }
    let clip = |s: &str| s.trim().chars().take(2000).collect::<String>();
    conn.execute(
        "INSERT INTO weekly_reviews (goal_id, week_start, done, due, missed, went_well, hard, next_plan, created_at, updated_at)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?9)
         ON CONFLICT(goal_id, week_start) DO UPDATE SET done=excluded.done, due=excluded.due, missed=excluded.missed,
           went_well=excluded.went_well, hard=excluded.hard, next_plan=excluded.next_plan, updated_at=excluded.updated_at",
        params![goal_id, w.week_start, w.done, w.due, w.missed, clip(&text.went_well), clip(&text.hard), clip(&text.next_plan), now],
    )
    .map_err(e)?;
    get_review(conn, goal_id, &w.week_start)?.ok_or_else(|| "保存失败".into())
}

pub fn set_ai_comment(conn: &Connection, goal_id: i64, week_start: &str, comment: &str, now: i64) -> R<Review> {
    conn.execute(
        "UPDATE weekly_reviews SET ai_comment=?3, updated_at=?4 WHERE goal_id=?1 AND week_start=?2",
        params![goal_id, week_start, comment.trim(), now],
    )
    .map_err(e)?;
    get_review(conn, goal_id, week_start)?.ok_or_else(|| "找不到这次复盘".into())
}

pub const REVIEW_SYSTEM: &str = "你是「目标计划助手」的复盘教练。根据用户这一周的执行数据、每日备注，以及周复盘三个自述框，用简体中文 Markdown 写简洁、具体、鼓励式的点评。\n\n输出结构（必须用这些二级标题，不要改标题措辞）：\n## 本周判断\n一段肯定（基于真实数据与备注，不要空夸）。\n\n## 卡点\n1–2 条无序列表：分析原因；必须结合每日备注里写过的偏差、聚餐、偷懒、加班等。若「困难的」框为空但某天有备注，应引用该每日备注，不要说「没有留下备注」。\n\n## 下周建议\n2–4 条有序列表：可执行、写具体；需要调计划（降强度、换内容、调休息日、延长周期等）时明确怎么调。\n\n文末再加一句简短鼓励（不要单独成标题）。\n\n不要只复述「顺利的/困难的/下周打算」三个框；每日备注与打卡状态同等重要。\n不要输出 JSON；不要用代码块；不要空话。总共不超过 350 字。";

pub fn review_user_prompt(conn: &Connection, goal_id: i64, week_start: &str, today: &str) -> R<String> {
    let w = week_view(conn, goal_id, Some(week_start), today)?;
    let r = w.review.clone().unwrap_or(Review {
        id: 0, goal_id, week_start: w.week_start.clone(), done: 0, due: 0, missed: 0,
        went_well: String::new(), hard: String::new(), next_plan: String::new(), ai_comment: None, updated_at: 0,
    });
    let mut s = format!(
        "目标：{}\n本周：{} 至 {}（今天 {today}）\n完成 {} / 应完成 {}，漏打 {}\n",
        w.goal_title, w.week_start, w.week_end, w.done, w.due, w.missed
    );
    for c in &w.cells {
        let st = match c.state.as_str() {
            "done" => "已完成",
            "missed" => "漏打",
            "today" => "今天未打卡",
            "future" => "未到",
            _ => "无计划",
        };
        let note_part = if c.state == "none" {
            String::new()
        } else if c.note.trim().is_empty() {
            " 备注：（无）".to_string()
        } else {
            format!(" 备注：{}", c.note.trim())
        };
        s += &format!(
            "周{} {} {}{} [{st}]{note_part}\n",
            c.weekday,
            c.date,
            c.title.as_deref().unwrap_or("-"),
            if c.is_rest { "（休息）" } else { "" }
        );
    }
    let or = |x: &str| if x.is_empty() { "（没写）".to_string() } else { x.to_string() };
    s += &format!(
        "\n【周复盘自述】（可与上方每日备注对照，不要只看这一段）\n顺利的：{}\n困难的：{}\n下周打算：{}",
        or(&r.went_well),
        or(&r.hard),
        or(&r.next_plan)
    );
    Ok(s)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::service::*;

    #[test]
    fn week_stats_and_reviews() {
        let mut conn = Connection::open_in_memory().unwrap();
        crate::db::migrate(&conn).unwrap();
        // 2026-10-14 是周三；示例从 10-07 开始，第 5 天(10-11)漏打（休息日不算漏打）
        let id = import_sample(&mut conn, "2026-10-14", 0).unwrap();
        let w = week_view(&conn, id, None, "2026-10-14").unwrap();
        assert_eq!((w.week_start.as_str(), w.week_end.as_str(), w.is_current), ("2026-10-12", "2026-10-18", true));
        assert_eq!((w.done, w.due, w.missed), (2, 3, 0));
        let states: Vec<_> = w.cells.iter().map(|c| c.state.as_str()).collect();
        assert_eq!(states, ["done", "done", "today", "future", "future", "future", "future"]);
        assert_eq!(w.cells[0].weekday, "一");

        let today = get_goal_detail(&conn, id, "2026-10-14", 0).unwrap().today.unwrap().id;
        check_in(&conn, today, "2026-10-14", 1).unwrap();
        let w = week_view(&conn, id, None, "2026-10-14").unwrap();
        assert_eq!((w.done, w.due, w.missed), (3, 3, 0));

        // 上一周：10-05/06 没有计划；10-07..10-11 中休息日不计 due，漏打为第5天(周日)
        let p = week_view(&conn, id, Some("2026-10-08"), "2026-10-14").unwrap();
        assert_eq!(p.week_start, "2026-10-05");
        assert_eq!((p.done, p.due, p.missed), (3, 4, 1));
        assert_eq!(p.cells[0].state, "none");
        assert_eq!(p.cells[5].state, "done", "周六休息日不算漏打");
        assert_eq!(p.cells[6].state, "missed", "周日第5天漏打");

        // 保存 / 覆盖 / 点评 / 历史
        let t = ReviewText { went_well: "坚持了".into(), hard: "周六加班".into(), next_plan: "".into() };
        let r = save_review(&conn, id, "2026-10-05", &t, "2026-10-14", 2).unwrap();
        assert_eq!((r.done, r.due, r.missed), (3, 4, 1));
        save_review(&conn, id, "2026-10-12", &ReviewText { went_well: "a".into(), ..Default::default() }, "2026-10-14", 3).unwrap();
        save_review(&conn, id, "2026-10-14", &ReviewText { went_well: "b".into(), ..Default::default() }, "2026-10-14", 4).unwrap();
        let r = set_ai_comment(&conn, id, "2026-10-12", "不错", 5).unwrap();
        assert_eq!((r.went_well.as_str(), r.ai_comment.as_deref()), ("b", Some("不错")));
        let all = list_reviews(&conn, id).unwrap();
        assert_eq!(all.len(), 2);
        assert_eq!(all[0].week_start, "2026-10-12");
        assert!(save_review(&conn, id, "2026-10-20", &t, "2026-10-14", 6).is_err());
        assert!(review_user_prompt(&conn, id, "2026-10-05", "2026-10-14").unwrap().contains("周六加班"));
    }

    #[test]
    fn review_prompt_includes_daily_notes() {
        let mut conn = Connection::open_in_memory().unwrap();
        crate::db::migrate(&conn).unwrap();
        let id = import_sample(&mut conn, "2026-10-14", 0).unwrap();
        let detail = get_goal_detail(&conn, id, "2026-10-14", 0).unwrap();
        let today_id = detail.today.as_ref().unwrap().id;
        save_day_note(&conn, today_id, "今天晚上吃超了", "2026-10-14").unwrap();
        // 周复盘「困难的」留空，确保每日备注仍进入点评上下文
        save_review(
            &conn,
            id,
            "2026-10-12",
            &ReviewText {
                went_well: "基本打卡".into(),
                hard: "".into(),
                next_plan: "继续".into(),
            },
            "2026-10-14",
            10,
        )
        .unwrap();
        let prompt = review_user_prompt(&conn, id, "2026-10-12", "2026-10-14").unwrap();
        assert!(
            prompt.contains("今天晚上吃超了"),
            "prompt should include daily note: {prompt}"
        );
        assert!(
            prompt.contains("备注：今天晚上吃超了"),
            "note should be labeled: {prompt}"
        );
        assert!(
            prompt.contains("备注：（无）"),
            "days without notes should be marked: {prompt}"
        );
        assert!(
            prompt.contains("【周复盘自述】"),
            "self-review section header missing: {prompt}"
        );
        assert!(
            REVIEW_SYSTEM.contains("每日备注"),
            "system prompt should mention daily notes"
        );
        let w = week_view(&conn, id, Some("2026-10-12"), "2026-10-14").unwrap();
        let today_cell = w.cells.iter().find(|c| c.date == "2026-10-14").unwrap();
        assert_eq!(today_cell.note, "今天晚上吃超了");
        let empty = w.cells.iter().find(|c| c.date == "2026-10-12").unwrap();
        assert_eq!(empty.note, "");
    }
}
