//! 计划结项最终总结：全程 KPI + 每日备注 + 自述 + 助手点评（每目标一条）。
use chrono::Datelike;
use rusqlite::{params, Connection, OptionalExtension};
use serde::Serialize;

use crate::review::ReviewText;
use crate::service::{days_of, e, parse_date, version_for};
use crate::stats;

type R<T> = Result<T, String>;

const WD: [&str; 7] = ["一", "二", "三", "四", "五", "六", "日"];

#[derive(Debug, Serialize)]
pub struct FinalDay {
    pub date: String,
    pub weekday: String,
    /// done / missed / today / future / none
    pub state: String,
    pub title: Option<String>,
    pub is_rest: bool,
    pub day_index: Option<i64>,
    pub note: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct FinalReview {
    pub id: i64,
    pub goal_id: i64,
    pub done: i64,
    pub due: i64,
    pub missed: i64,
    pub longest_streak: i64,
    pub went_well: String,
    pub hard: String,
    pub next_plan: String,
    pub ai_comment: Option<String>,
    pub updated_at: i64,
}

#[derive(Debug, Serialize)]
pub struct FinalView {
    pub goal_id: i64,
    pub goal_title: String,
    pub status: String,
    pub readonly: bool,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub done: i64,
    pub due: i64,
    pub missed: i64,
    pub longest_streak: i64,
    pub days: Vec<FinalDay>,
    pub review: Option<FinalReview>,
}


fn row(r: &rusqlite::Row) -> rusqlite::Result<FinalReview> {
    Ok(FinalReview {
        id: r.get(0)?,
        goal_id: r.get(1)?,
        done: r.get(2)?,
        due: r.get(3)?,
        missed: r.get(4)?,
        longest_streak: r.get(5)?,
        went_well: r.get(6)?,
        hard: r.get(7)?,
        next_plan: r.get(8)?,
        ai_comment: r.get(9)?,
        updated_at: r.get(10)?,
    })
}

const COLS: &str =
    "id, goal_id, done, due, missed, longest_streak, went_well, hard, next_plan, ai_comment, updated_at";

pub fn get_final_review(conn: &Connection, goal_id: i64) -> R<Option<FinalReview>> {
    conn.query_row(
        &format!("SELECT {COLS} FROM final_reviews WHERE goal_id=?1"),
        params![goal_id],
        row,
    )
    .optional()
    .map_err(e)
}

fn compute_view(conn: &Connection, goal_id: i64, today: &str) -> R<FinalView> {
    let (goal_title, status): (String, String) = conn
        .query_row(
            "SELECT title, status FROM goals WHERE id=?1",
            [goal_id],
            |r| Ok((r.get(0)?, r.get(1)?)),
        )
        .optional()
        .map_err(e)?
        .ok_or("找不到这个目标")?;
    let v = version_for(conn, goal_id, status != "archived")?;
    let days_src = match &v {
        Some(v) => days_of(conn, v.id)?,
        None => vec![],
    };
    let (mut done, mut due, mut missed) = (0, 0, 0);
    let mut days = Vec::with_capacity(days_src.len());
    for d in &days_src {
        let date = d.date.clone();
        let nd = parse_date(&date)?;
        let weekday = WD[nd.weekday().num_days_from_monday() as usize].into();
        let state = if d.is_rest {
            if date == today {
                "today"
            } else if date.as_str() > today {
                "future"
            } else {
                "done"
            }
        } else {
            if date.as_str() <= today {
                due += 1;
            }
            if d.checked {
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
        };
        days.push(FinalDay {
            weekday,
            state: state.into(),
            title: Some(d.title.clone()),
            is_rest: d.is_rest,
            day_index: Some(d.day_index),
            note: d.note.clone(),
            date,
        });
    }
    let longest_streak = stats::get_stats(conn, Some(goal_id), today)?.longest_streak;
    Ok(FinalView {
        goal_id,
        goal_title,
        status: status.clone(),
        readonly: status != "completed",
        start_date: v.as_ref().map(|x| x.start.clone()),
        end_date: v.as_ref().map(|x| x.end.clone()),
        done,
        due,
        missed,
        longest_streak,
        days,
        review: get_final_review(conn, goal_id)?,
    })
}

/// 结项页数据；非 completed 只读（进行中/归档可看），仅 completed 可写。
pub fn final_view(conn: &Connection, goal_id: i64, today: &str) -> R<FinalView> {
    compute_view(conn, goal_id, today)
}

fn ensure_writable(status: &str) -> R<()> {
    match status {
        "completed" => Ok(()),
        "archived" => Err("目标已归档，结项总结只读".into()),
        "active" => Err("计划还没结束，结束后才能写最终总结".into()),
        _ => Err("当前状态不能写最终总结".into()),
    }
}

pub fn save_final_review(conn: &Connection, goal_id: i64, text: &ReviewText, today: &str, now: i64) -> R<FinalReview> {
    let w = compute_view(conn, goal_id, today)?;
    ensure_writable(&w.status)?;
    let clip = |s: &str| s.trim().chars().take(2000).collect::<String>();
    conn.execute(
        "INSERT INTO final_reviews (goal_id, done, due, missed, longest_streak, went_well, hard, next_plan, created_at, updated_at)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?9)
         ON CONFLICT(goal_id) DO UPDATE SET done=excluded.done, due=excluded.due, missed=excluded.missed,
           longest_streak=excluded.longest_streak, went_well=excluded.went_well, hard=excluded.hard,
           next_plan=excluded.next_plan, updated_at=excluded.updated_at",
        params![
            goal_id,
            w.done,
            w.due,
            w.missed,
            w.longest_streak,
            clip(&text.went_well),
            clip(&text.hard),
            clip(&text.next_plan),
            now
        ],
    )
    .map_err(e)?;
    get_final_review(conn, goal_id)?.ok_or_else(|| "保存失败".into())
}

pub fn set_final_ai_comment(conn: &Connection, goal_id: i64, comment: &str, now: i64) -> R<FinalReview> {
    conn.execute(
        "UPDATE final_reviews SET ai_comment=?2, updated_at=?3 WHERE goal_id=?1",
        params![goal_id, comment.trim(), now],
    )
    .map_err(e)?;
    get_final_review(conn, goal_id)?.ok_or_else(|| "找不到这次结项总结".into())
}

pub const FINAL_REVIEW_SYSTEM: &str = "\
你是「目标计划助手」的结项教练。根据用户整段计划的执行数据、每日备注，以及结项三个自述框，用简体中文 Markdown 写简洁、具体、鼓励式的最终点评。\n\n\
输出结构（必须用这些二级标题，不要改标题措辞）：\n\
## 全程判断\n\
一段肯定（基于真实数据与备注，不要空夸）。\n\n\
## 卡点\n\
1–3 条无序列表：分析原因；必须结合每日备注里写过的偏差、聚餐、偷懒、加班等。若「卡在哪」框为空但某天有备注，应引用该每日备注，不要说「没有留下备注」。\n\n\
## 下次建议\n\
2–4 条有序列表：下次同类计划可执行的建议（强度、内容、休息日、周期等要写具体）。\n\n\
文末再加一句简短鼓励（不要单独成标题）。\n\n\
不要只复述三个自述框；每日备注与打卡状态同等重要。\n\
不要输出 JSON；不要用代码块；不要空话。总共不超过 400 字。";

pub fn final_review_user_prompt(conn: &Connection, goal_id: i64, today: &str) -> R<String> {
    let w = compute_view(conn, goal_id, today)?;
    let r = w.review.clone().unwrap_or(FinalReview {
        id: 0,
        goal_id,
        done: 0,
        due: 0,
        missed: 0,
        longest_streak: 0,
        went_well: String::new(),
        hard: String::new(),
        next_plan: String::new(),
        ai_comment: None,
        updated_at: 0,
    });
    let rate = if w.due > 0 {
        format!("{}%", ((w.done as f64 / w.due as f64) * 100.0).round() as i64)
    } else {
        "—".into()
    };
    let mut s = format!(
        "目标：{}\n周期：{} 至 {}（今天 {today}）\n行动日完成 {} / {}（{}），漏打 {}，最长连续 {} 天\n\n【全程日摘要】\n",
        w.goal_title,
        w.start_date.as_deref().unwrap_or("—"),
        w.end_date.as_deref().unwrap_or("—"),
        w.done,
        w.due,
        rate,
        w.missed,
        w.longest_streak
    );
    for c in &w.days {
        let st = match c.state.as_str() {
            "done" => "已完成",
            "missed" => "漏打",
            "today" => "今天未打",
            "future" => "未到",
            _ => "无计划",
        };
        let note_part = if c.note.trim().is_empty() {
            " 备注：（无）".to_string()
        } else {
            format!(" 备注：{}", c.note.trim())
        };
        s += &format!(
            "周{} {} 第{}天 {}{} [{st}]{note_part}\n",
            c.weekday,
            c.date,
            c.day_index.unwrap_or(0),
            c.title.as_deref().unwrap_or("-"),
            if c.is_rest { "（休息）" } else { "" }
        );
    }
    let or = |x: &str| {
        if x.is_empty() {
            "（没写）".to_string()
        } else {
            x.to_string()
        }
    };
    s += &format!(
        "\n【结项自述】（可与上方每日备注对照，不要只看这一段）\n这段做得好的：{}\n卡在哪：{}\n下次同类计划怎么改：{}",
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

    fn done_goal(conn: &mut Connection) -> i64 {
        // sample：从 today-7 开始共 30 天，end 约在 today+22；用更晚的日期触发 completed
        let id = import_sample(conn, "2026-10-14", 0).unwrap();
        crate::service::refresh_statuses(conn, "2026-11-20").unwrap();
        let st: String = conn
            .query_row("SELECT status FROM goals WHERE id=?1", [id], |r| r.get(0))
            .unwrap();
        assert_eq!(st, "completed", "status={st}");
        id
    }

    #[test]
    fn final_review_unique_and_prompt_notes() {
        let mut conn = Connection::open_in_memory().unwrap();
        crate::db::migrate(&conn).unwrap();
        let id = done_goal(&mut conn);

        let v = final_view(&conn, id, "2026-11-20").unwrap();
        assert_eq!(v.status, "completed");
        assert!(!v.readonly);
        assert!(v.due > 0);
        assert!(v.days.len() >= 7);

        // 给第 1 天写备注（计划从 7 天前相对 2026-10-14 开始 → sample start 2026-10-07）
        let days = days_of(&conn, version_for(&conn, id, true).unwrap().unwrap().id).unwrap();
        let day0 = &days[0];
        save_day_note(&conn, day0.id, "第一天就加班没练", "2026-11-20").unwrap();
        let mid = days.iter().find(|d| !d.is_rest && d.day_index == 3).unwrap();
        save_day_note(&conn, mid.id, "聚餐破戒", "2026-11-20").unwrap();

        let t = ReviewText {
            went_well: "整体打卡还行".into(),
            hard: "".into(),
            next_plan: "下次降强度".into(),
        };
        let r = save_final_review(&conn, id, &t, "2026-11-20", 10).unwrap();
        assert_eq!(r.went_well, "整体打卡还行");
        assert!(r.due > 0);

        // 覆盖同一条
        let r2 = save_final_review(
            &conn,
            id,
            &ReviewText {
                went_well: "覆盖".into(),
                hard: "周末偷懒".into(),
                next_plan: "提前睡".into(),
            },
            "2026-11-20",
            11,
        )
        .unwrap();
        assert_eq!(r2.id, r.id);
        assert_eq!(r2.went_well, "覆盖");
        let n: i64 = conn
            .query_row("SELECT COUNT(*) FROM final_reviews WHERE goal_id=?1", [id], |x| x.get(0))
            .unwrap();
        assert_eq!(n, 1, "goal 只能一条结项");

        let prompt = final_review_user_prompt(&conn, id, "2026-11-20").unwrap();
        assert!(prompt.contains("第一天就加班没练"), "{prompt}");
        assert!(prompt.contains("备注：聚餐破戒"), "{prompt}");
        assert!(prompt.contains("备注：（无）"), "{prompt}");
        assert!(prompt.contains("【结项自述】"), "{prompt}");
        assert!(prompt.contains("覆盖"), "{prompt}");
        assert!(FINAL_REVIEW_SYSTEM.contains("每日备注"));
        assert!(FINAL_REVIEW_SYSTEM.contains("没有留下备注"));

        set_final_ai_comment(&conn, id, "结项点评测试", 12).unwrap();
        let got = get_final_review(&conn, id).unwrap().unwrap();
        assert_eq!(got.ai_comment.as_deref(), Some("结项点评测试"));
    }

    #[test]
    fn final_review_rejects_active_and_empty_note_ok() {
        let mut conn = Connection::open_in_memory().unwrap();
        crate::db::migrate(&conn).unwrap();
        let id = import_sample(&mut conn, "2026-10-14", 0).unwrap();
        assert!(final_view(&conn, id, "2026-10-14").unwrap().readonly, "进行中结项页应只读");
        let err = save_final_review(&conn, id, &ReviewText::default(), "2026-10-14", 1).unwrap_err();
        assert!(err.contains("还没结束"), "{err}");

        // 空备注兼容：已完成且无每日备注也能生成 prompt
        let id2 = done_goal(&mut conn);
        save_final_review(&conn, id2, &ReviewText::default(), "2026-11-20", 2).unwrap();
        let prompt = final_review_user_prompt(&conn, id2, "2026-11-20").unwrap();
        assert!(prompt.contains("备注：（无）"));
        assert!(prompt.contains("（没写）"));
    }

    #[test]
    fn final_review_archived_readonly() {
        let mut conn = Connection::open_in_memory().unwrap();
        crate::db::migrate(&conn).unwrap();
        let id = done_goal(&mut conn);
        save_final_review(
            &conn,
            id,
            &ReviewText {
                went_well: "ok".into(),
                ..Default::default()
            },
            "2026-11-20",
            3,
        )
        .unwrap();
        let before = final_view(&conn, id, "2026-11-20").unwrap();
        assert!(before.due > 0);
        archive_goal(&mut conn, id, 4).unwrap();
        let v = final_view(&conn, id, "2026-11-20").unwrap();
        assert!(v.readonly);
        assert!(v.review.is_some());
        assert_eq!(v.due, before.due, "归档后行动日 due 不应丢");
        assert_eq!(v.longest_streak, before.longest_streak, "归档后最长连续不应被 get_stats 算成 0");
        let err = save_final_review(&conn, id, &ReviewText::default(), "2026-11-20", 5).unwrap_err();
        assert!(err.contains("归档"), "{err}");
    }
}
