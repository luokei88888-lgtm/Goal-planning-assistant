//! 打卡提醒：每个目标可设多个时间；睡前汇总；判定「现在该不该提醒」（纯函数，方便测试）。

use chrono::{NaiveDateTime, NaiveTime};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};

use crate::chat::{get_setting, set_setting};
use crate::service::{days_of, e, version_for};

type R<T> = Result<T, String>;

/// 错过超过这个分钟数（比如电脑睡眠）就不补发
pub const GRACE_MINUTES: i64 = 30;
pub const MAX_TIMES: usize = 6;

#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct GoalReminders {
    pub goal_id: i64,
    pub enabled: bool,
    pub times: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct ReminderSettings {
    pub enabled: bool,
    pub summary_enabled: bool,
    pub summary_time: String,
    /// 兼容旧前端：= 关闭行为不是「退出」；只读，保存时忽略（改用 close_action）
    #[serde(default)]
    pub close_to_tray: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Due {
    pub key: String,
    pub goal_id: Option<i64>,
    pub title: String,
    pub body: String,
}

pub fn norm_time(t: &str) -> R<String> {
    let t = t.trim();
    NaiveTime::parse_from_str(t, "%H:%M")
        .map(|x| x.format("%H:%M").to_string())
        .map_err(|_| format!("时间 {t} 格式不对，应为 HH:MM（如 08:30）"))
}

pub fn goal_reminders(conn: &Connection, goal_id: i64) -> R<GoalReminders> {
    let mut st = conn.prepare("SELECT time, enabled FROM goal_reminders WHERE goal_id=?1 ORDER BY time").map_err(e)?;
    let rows = st
        .query_map([goal_id], |r| Ok((r.get::<_, String>(0)?, r.get::<_, i64>(1)? != 0)))
        .map_err(e)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(e)?;
    Ok(GoalReminders { goal_id, enabled: rows.iter().any(|x| x.1), times: rows.into_iter().map(|x| x.0).collect() })
}

/// 整体替换一个目标的提醒时间；enabled=false 时保留时间但关闭
pub fn save_goal_reminders(conn: &Connection, goal_id: i64, enabled: bool, times: &[String], now: i64) -> R<GoalReminders> {
    let mut ts = times.iter().map(|t| norm_time(t)).collect::<R<Vec<_>>>()?;
    ts.sort();
    ts.dedup();
    if ts.len() > MAX_TIMES {
        return Err(format!("每个目标最多设 {MAX_TIMES} 个提醒时间"));
    }
    if enabled && ts.is_empty() {
        return Err("打开提醒前请至少添加一个时间".into());
    }
    let exists: Option<i64> = conn.query_row("SELECT id FROM goals WHERE id=?1", [goal_id], |r| r.get(0)).optional().map_err(e)?;
    exists.ok_or("找不到这个目标")?;
    conn.execute("DELETE FROM goal_reminders WHERE goal_id=?1", [goal_id]).map_err(e)?;
    for t in &ts {
        conn.execute(
            "INSERT INTO goal_reminders (goal_id, time, enabled, created_at) VALUES (?1, ?2, ?3, ?4)",
            params![goal_id, t, enabled as i64, now],
        )
        .map_err(e)?;
    }
    goal_reminders(conn, goal_id)
}

fn flag(conn: &Connection, k: &str, default: bool) -> R<bool> {
    Ok(get_setting(conn, k)?.map(|v| v == "1").unwrap_or(default))
}

pub fn settings(conn: &Connection) -> R<ReminderSettings> {
    Ok(ReminderSettings {
        enabled: flag(conn, "reminders_enabled", true)?,
        summary_enabled: flag(conn, "summary_enabled", false)?,
        summary_time: get_setting(conn, "summary_time")?.unwrap_or_else(|| "22:00".into()),
        close_to_tray: close_action(conn)? != "exit",
    })
}

pub fn save_settings(conn: &Connection, s: &ReminderSettings) -> R<ReminderSettings> {
    let t = norm_time(&s.summary_time)?;
    let b = |x: bool| if x { "1" } else { "0" };
    set_setting(conn, "reminders_enabled", b(s.enabled))?;
    set_setting(conn, "summary_enabled", b(s.summary_enabled))?;
    set_setting(conn, "summary_time", &t)?;
    settings(conn)
}

pub const CLOSE_ACTIONS: [&str; 3] = ["ask", "tray", "exit"];

/// 关闭窗口时的行为：ask（每次询问，默认）/ tray（隐藏到托盘）/ exit（退出程序）。
/// 旧版「关闭时最小化到托盘」开关（close_to_tray）在首次读取时迁移：1→tray，0→exit。
pub fn close_action(conn: &Connection) -> R<String> {
    if let Some(v) = get_setting(conn, "close_action")? {
        if CLOSE_ACTIONS.contains(&v.as_str()) {
            return Ok(v);
        }
    }
    let v = match get_setting(conn, "close_to_tray")?.as_deref() {
        Some("0") => "exit",
        Some(_) => "tray",
        None => return Ok("ask".into()),
    };
    set_setting(conn, "close_action", v)?;
    conn.execute("DELETE FROM settings WHERE key='close_to_tray'", []).map_err(e)?;
    Ok(v.into())
}

pub fn set_close_action(conn: &Connection, v: &str) -> R<String> {
    if !CLOSE_ACTIONS.contains(&v) {
        return Err("未知的关闭行为".into());
    }
    set_setting(conn, "close_action", v)?;
    conn.execute("DELETE FROM settings WHERE key='close_to_tray'", []).map_err(e)?;
    Ok(v.into())
}

pub const UI_THEMES: [&str; 7] = ["glass", "bento", "brutal", "clay", "neu", "ink", "neon"];

/// 界面主题，默认玻璃拟态；存在 settings 表中（恢复出厂会清空，备份会包含）
pub fn ui_theme(conn: &Connection) -> R<String> {
    Ok(get_setting(conn, "ui_theme")?.filter(|v| UI_THEMES.contains(&v.as_str())).unwrap_or_else(|| "glass".into()))
}

pub fn set_ui_theme(conn: &Connection, v: &str) -> R<String> {
    if !UI_THEMES.contains(&v) {
        return Err("未知的主题".into());
    }
    set_setting(conn, "ui_theme", v)?;
    Ok(v.into())
}

/// 「减少动画」开关，默认关闭
pub fn reduce_motion(conn: &Connection) -> R<bool> {
    Ok(get_setting(conn, "reduce_motion")?.as_deref() == Some("1"))
}

pub fn set_reduce_motion(conn: &Connection, on: bool) -> R<bool> {
    set_setting(conn, "reduce_motion", if on { "1" } else { "0" })?;
    Ok(on)
}

pub const MILESTONES: [&str; 5] = ["streak7", "streak14", "streak21", "streak30", "all_done"];

/// 里程碑庆祝只放一次：第一次调用返回 true 并记下，之后（含撤销后重新打卡）都返回 false
pub fn celebrate_once(conn: &Connection, goal_id: i64, key: &str) -> R<bool> {
    if !MILESTONES.contains(&key) {
        return Err("未知的里程碑".into());
    }
    let k = format!("celebrated:{goal_id}:{key}");
    if get_setting(conn, &k)?.is_some() {
        return Ok(false);
    }
    set_setting(conn, &k, "1")?;
    Ok(true)
}

pub fn mark_sent(conn: &Connection, key: &str, date: &str, now: i64) -> R<()> {
    conn.execute("INSERT OR IGNORE INTO reminder_log (key, date, sent_at) VALUES (?1, ?2, ?3)", params![key, date, now]).map_err(e)?;
    Ok(())
}

fn sent(conn: &Connection, key: &str, date: &str) -> R<bool> {
    conn.query_row("SELECT 1 FROM reminder_log WHERE key=?1 AND date=?2", params![key, date], |_| Ok(()))
        .optional()
        .map(|x| x.is_some())
        .map_err(e)
}

/// 在提醒窗口内：到点了，且没超过 GRACE_MINUTES
fn in_window(now: NaiveDateTime, hhmm: &str) -> bool {
    let Ok(t) = NaiveTime::parse_from_str(hhmm, "%H:%M") else { return false };
    let at = now.date().and_time(t);
    let diff = (now - at).num_seconds();
    diff >= 0 && diff <= GRACE_MINUTES * 60
}

struct Pending {
    goal_id: i64,
    goal: String,
    day_index: i64,
    title: String,
    detail: String,
}

/// 今天有计划、不是休息日、还没打卡的进行中目标
fn pending_today(conn: &Connection, today: &str) -> R<Vec<Pending>> {
    let mut st = conn.prepare("SELECT id, title FROM goals WHERE status='active' ORDER BY id").map_err(e)?;
    let goals = st
        .query_map([], |r| Ok((r.get::<_, i64>(0)?, r.get::<_, String>(1)?)))
        .map_err(e)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(e)?;
    let mut out = vec![];
    for (gid, goal) in goals {
        let Some(v) = version_for(conn, gid, true)? else { continue };
        if let Some(d) = days_of(conn, v.id)?.into_iter().find(|d| d.date == today) {
            if !d.is_rest && !d.checked {
                out.push(Pending { goal_id: gid, goal, day_index: d.day_index, title: d.title, detail: d.detail });
            }
        }
    }
    Ok(out)
}

/// 现在应该弹哪些通知（不写库；发送后调用 mark_sent）
pub fn due_reminders(conn: &Connection, now: NaiveDateTime) -> R<Vec<Due>> {
    let s = settings(conn)?;
    if !s.enabled {
        return Ok(vec![]);
    }
    let today = now.date().format("%Y-%m-%d").to_string();
    let pend = pending_today(conn, &today)?;
    let mut out = vec![];
    let mut st = conn
        .prepare("SELECT r.goal_id, r.time FROM goal_reminders r JOIN goals g ON g.id=r.goal_id WHERE r.enabled=1 AND g.status='active' ORDER BY r.time, r.goal_id")
        .map_err(e)?;
    let rows = st
        .query_map([], |r| Ok((r.get::<_, i64>(0)?, r.get::<_, String>(1)?)))
        .map_err(e)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(e)?;
    for (gid, time) in rows {
        let key = format!("goal:{gid}:{time}");
        if !in_window(now, &time) || sent(conn, &key, &today)? {
            continue;
        }
        if let Some(p) = pend.iter().find(|p| p.goal_id == gid) {
            out.push(Due {
                key,
                goal_id: Some(gid),
                title: format!("{} · 今天：{}", p.goal, p.title),
                body: format!(
                    "第 {} 天还没打卡{}",
                    p.day_index,
                    if p.detail.is_empty() { "，点开去完成吧".to_string() } else { format!("：{}", p.detail.chars().take(80).collect::<String>()) }
                ),
            });
        }
    }
    if s.summary_enabled && in_window(now, &s.summary_time) && !sent(conn, "summary", &today)? && !pend.is_empty() {
        let names: Vec<String> = pend.iter().map(|p| format!("{}（{}）", p.goal, p.title)).collect();
        out.push(Due {
            key: "summary".into(),
            goal_id: if pend.len() == 1 { Some(pend[0].goal_id) } else { None },
            title: format!("睡前汇总：还有 {} 个目标今天没打卡", pend.len()),
            body: names.join("、").chars().take(200).collect(),
        });
    }
    Ok(out)
}

/// 首次关闭窗口提示过没有
pub fn take_close_hint(conn: &Connection) -> R<bool> {
    if get_setting(conn, "close_hint_shown")?.is_some() {
        return Ok(false);
    }
    set_setting(conn, "close_hint_shown", "1")?;
    Ok(true)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::service::*;

    fn at(s: &str) -> NaiveDateTime {
        NaiveDateTime::parse_from_str(s, "%Y-%m-%d %H:%M:%S").unwrap()
    }

    #[test]
    fn should_remind_rules() {
        let mut conn = Connection::open_in_memory().unwrap();
        crate::db::migrate(&conn).unwrap();
        // 示例：10-14 是第 8 天（非休息、未打卡）；10-17 是休息日
        let id = import_sample(&mut conn, "2026-10-14", 0).unwrap();
        assert!(save_goal_reminders(&conn, id, true, &["25:00".into()], 0).is_err());
        assert!(save_goal_reminders(&conn, id, true, &[], 0).is_err());
        let r = save_goal_reminders(&conn, id, true, &["20:00".into(), "8:05".into(), "20:00".into()], 0).unwrap();
        assert_eq!(r.times, ["08:05", "20:00"]);

        assert!(due_reminders(&conn, at("2026-10-14 19:59:59")).unwrap().is_empty(), "没到点");
        let d = due_reminders(&conn, at("2026-10-14 20:00:10")).unwrap();
        assert_eq!(d.len(), 1);
        assert_eq!(d[0].key, "goal:1:20:00");
        assert!(d[0].title.contains("30天减脂") && d[0].title.contains("上肢力量"), "{}", d[0].title);
        assert_eq!(d[0].goal_id, Some(id));
        assert!(due_reminders(&conn, at("2026-10-14 20:31:00")).unwrap().is_empty(), "错过 30 分钟以上不补发");
        assert_eq!(due_reminders(&conn, at("2026-10-14 20:30:00")).unwrap().len(), 1, "30 分钟内仍补发");

        mark_sent(&conn, &d[0].key, "2026-10-14", 1).unwrap();
        assert!(due_reminders(&conn, at("2026-10-14 20:05:00")).unwrap().is_empty(), "当天只弹一次");
        assert_eq!(due_reminders(&conn, at("2026-10-15 20:05:00")).unwrap().len(), 1, "第二天重新提醒");
        assert!(due_reminders(&conn, at("2026-10-17 20:05:00")).unwrap().is_empty(), "休息日不提醒");
        assert!(due_reminders(&conn, at("2026-12-01 20:05:00")).unwrap().is_empty(), "计划外的日子不提醒");

        // 打卡后不提醒
        let today = get_goal_detail(&conn, id, "2026-10-14", 0).unwrap().today.unwrap().id;
        assert_eq!(due_reminders(&conn, at("2026-10-14 08:10:00")).unwrap().len(), 1);
        check_in(&conn, today, "2026-10-14", 2).unwrap();
        assert!(due_reminders(&conn, at("2026-10-14 08:10:00")).unwrap().is_empty(), "已打卡不提醒");
        undo_check_in(&conn, today).unwrap();

        // 目标关提醒 / 全局关
        save_goal_reminders(&conn, id, false, &["08:05".into()], 3).unwrap();
        assert!(due_reminders(&conn, at("2026-10-14 08:10:00")).unwrap().is_empty());
        save_goal_reminders(&conn, id, true, &["08:05".into()], 3).unwrap();
        let mut s = settings(&conn).unwrap();
        assert!(s.enabled && !s.summary_enabled);
        s.enabled = false;
        save_settings(&conn, &s).unwrap();
        assert!(due_reminders(&conn, at("2026-10-14 08:10:00")).unwrap().is_empty(), "全局关闭");

        // 睡前汇总
        s.enabled = true;
        s.summary_enabled = true;
        s.summary_time = "22:30".into();
        save_settings(&conn, &s).unwrap();
        let d = due_reminders(&conn, at("2026-10-14 22:31:00")).unwrap();
        assert_eq!(d.len(), 1);
        assert!(d[0].title.contains("1 个目标") && d[0].body.contains("30天减脂"));
        mark_sent(&conn, "summary", "2026-10-14", 4).unwrap();
        assert!(due_reminders(&conn, at("2026-10-14 22:35:00")).unwrap().is_empty());

        // 归档目标不提醒
        archive_goal(&mut conn, id, 5).unwrap();
        assert!(due_reminders(&conn, at("2026-10-15 08:06:00")).unwrap().is_empty());

        assert!(take_close_hint(&conn).unwrap());
        assert!(!take_close_hint(&conn).unwrap());
    }

    #[test]
    fn close_action_default_set_and_migrate() {
        let c = Connection::open_in_memory().unwrap();
        crate::db::migrate(&c).unwrap();
        assert_eq!(close_action(&c).unwrap(), "ask");
        assert_eq!(set_close_action(&c, "tray").unwrap(), "tray");
        assert_eq!(close_action(&c).unwrap(), "tray");
        assert!(set_close_action(&c, "bad").is_err());
        // 旧开关迁移
        c.execute("DELETE FROM settings WHERE key='close_action'", []).unwrap();
        set_setting(&c, "close_to_tray", "0").unwrap();
        assert_eq!(close_action(&c).unwrap(), "exit");
        assert!(get_setting(&c, "close_to_tray").unwrap().is_none());
        c.execute("DELETE FROM settings WHERE key='close_action'", []).unwrap();
        set_setting(&c, "close_to_tray", "1").unwrap();
        assert_eq!(close_action(&c).unwrap(), "tray");
        // 保存提醒设置不再改关闭行为
        let s = settings(&c).unwrap();
        save_settings(&c, &ReminderSettings { close_to_tray: false, ..s }).unwrap();
        assert_eq!(close_action(&c).unwrap(), "tray");
    }

    #[test]
    fn ui_theme_default_and_set() {
        let c = Connection::open_in_memory().unwrap();
        crate::db::migrate(&c).unwrap();
        assert_eq!(ui_theme(&c).unwrap(), "glass");
        assert_eq!(set_ui_theme(&c, "ink").unwrap(), "ink");
        assert_eq!(ui_theme(&c).unwrap(), "ink");
        assert!(set_ui_theme(&c, "bad").is_err());
        set_setting(&c, "ui_theme", "zzz").unwrap();
        assert_eq!(ui_theme(&c).unwrap(), "glass");
    }

    #[test]
    fn reduce_motion_and_celebrate_once() {
        let c = Connection::open_in_memory().unwrap();
        crate::db::migrate(&c).unwrap();
        assert!(!reduce_motion(&c).unwrap());
        assert!(set_reduce_motion(&c, true).unwrap());
        assert!(reduce_motion(&c).unwrap());
        assert!(celebrate_once(&c, 1, "streak7").unwrap());
        assert!(!celebrate_once(&c, 1, "streak7").unwrap(), "同一里程碑只庆祝一次");
        assert!(celebrate_once(&c, 2, "streak7").unwrap(), "按目标分别记录");
        assert!(celebrate_once(&c, 1, "all_done").unwrap());
        assert!(celebrate_once(&c, 1, "nope").is_err());
    }
}
