//! 设置表 + 聊天会话/消息存储

use crate::draft::{self, DraftPlan};
use rusqlite::{params, Connection, OptionalExtension};
use serde::Serialize;
use serde_json::{json, Value};

type R<T> = Result<T, String>;
fn e(err: rusqlite::Error) -> String {
    format!("数据库错误：{err}")
}

pub const DEFAULT_BASE_URL: &str = "https://api.deepseek.com";
pub const DEFAULT_MODEL: &str = "deepseek-flash";

pub fn get_setting(conn: &Connection, key: &str) -> R<Option<String>> {
    conn.query_row("SELECT value FROM settings WHERE key=?1", [key], |r| r.get(0)).optional().map_err(e)
}

pub fn set_setting(conn: &Connection, key: &str, value: &str) -> R<()> {
    conn.execute(
        "INSERT INTO settings (key, value) VALUES (?1, ?2) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        params![key, value],
    )
    .map_err(e)?;
    Ok(())
}

pub fn model_and_url(conn: &Connection) -> R<(String, String)> {
    Ok((
        get_setting(conn, "model")?.unwrap_or_else(|| DEFAULT_MODEL.into()),
        get_setting(conn, "base_url")?.unwrap_or_else(|| DEFAULT_BASE_URL.into()),
    ))
}

#[derive(Debug, Serialize)]
pub struct ChatMessage {
    pub id: i64,
    pub role: String,
    pub text: String,
    pub draft: Option<DraftPlan>,
    pub draft_error: Option<String>,
    pub confirmed_goal_id: Option<i64>,
    pub confirmed_version: Option<i64>,
    pub diff: Option<crate::revise::DraftDiff>,
    pub created_at: i64,
}

#[derive(Debug, Serialize)]
pub struct ChatSession {
    pub id: i64,
    pub title: String,
    /// 改方案会话绑定的目标
    pub goal_id: Option<i64>,
    pub goal_title: Option<String>,
    pub base_version: Option<i64>,
    pub messages: Vec<ChatMessage>,
}

pub fn new_session(conn: &Connection, now: i64) -> R<i64> {
    conn.execute("INSERT INTO chat_sessions (title, created_at, updated_at) VALUES ('新对话', ?1, ?1)", [now]).map_err(e)?;
    Ok(conn.last_insert_rowid())
}

pub fn new_goal_session(conn: &Connection, goal_id: i64, now: i64) -> R<i64> {
    let title: String = conn
        .query_row("SELECT title FROM goals WHERE id=?1", [goal_id], |r| r.get(0))
        .optional()
        .map_err(e)?
        .ok_or("找不到这个目标")?;
    conn.execute(
        "INSERT INTO chat_sessions (title, goal_id, created_at, updated_at) VALUES (?1, ?2, ?3, ?3)",
        params![format!("改方案：{title}"), goal_id, now],
    )
    .map_err(e)?;
    Ok(conn.last_insert_rowid())
}

/// 目标的改方案会话：最近一个，没有就新建
pub fn goal_session(conn: &Connection, goal_id: i64, now: i64) -> R<i64> {
    match conn
        .query_row("SELECT id FROM chat_sessions WHERE goal_id=?1 AND deleted_at IS NULL ORDER BY updated_at DESC, id DESC LIMIT 1", [goal_id], |r| r.get(0))
        .optional()
        .map_err(e)?
    {
        Some(id) => Ok(id),
        None => new_goal_session(conn, goal_id, now),
    }
}

#[derive(Debug, Serialize)]
pub struct SessionItem {
    pub id: i64,
    pub title: String,
    pub goal_id: Option<i64>,
    pub goal_title: Option<String>,
    pub updated_at: i64,
    pub message_count: i64,
    /// 已经确认生成过目标/新版本
    pub confirmed: bool,
}

pub fn list_sessions(conn: &Connection) -> R<Vec<SessionItem>> {
    let mut st = conn
        .prepare(
            "SELECT s.id, s.title, s.goal_id, g.title, s.updated_at,
                    (SELECT COUNT(*) FROM chat_messages m WHERE m.session_id=s.id),
                    EXISTS(SELECT 1 FROM chat_messages m WHERE m.session_id=s.id AND m.confirmed_goal_id IS NOT NULL)
             FROM chat_sessions s LEFT JOIN goals g ON g.id=s.goal_id WHERE s.deleted_at IS NULL ORDER BY s.updated_at DESC, s.id DESC",
        )
        .map_err(e)?;
    let rows = st
        .query_map([], |r| {
            Ok(SessionItem {
                id: r.get(0)?,
                title: r.get(1)?,
                goal_id: r.get(2)?,
                goal_title: r.get(3)?,
                updated_at: r.get(4)?,
                message_count: r.get(5)?,
                confirmed: r.get::<_, i64>(6)? != 0,
            })
        })
        .map_err(e)?;
    rows.collect::<Result<Vec<_>, _>>().map_err(e)
}

pub fn rename_session(conn: &Connection, id: i64, title: &str) -> R<()> {
    let t: String = title.trim().chars().take(40).collect();
    if t.is_empty() {
        return Err("名称不能为空".into());
    }
    if conn.execute("UPDATE chat_sessions SET title=?2 WHERE id=?1", params![id, t]).map_err(e)? == 0 {
        return Err("找不到这个对话".into());
    }
    Ok(())
}

/// 软删除：先标记，UNDO_SECS 内可撤销；之后由 purge_deleted 真正删除
pub const UNDO_SECS: i64 = 5;

pub fn delete_session(conn: &mut Connection, id: i64, now: i64) -> R<()> {
    if conn.execute("UPDATE chat_sessions SET deleted_at=?2 WHERE id=?1 AND deleted_at IS NULL", params![id, now]).map_err(e)? == 0 {
        return Err("找不到这个对话".into());
    }
    Ok(())
}

pub fn undo_delete_session(conn: &Connection, id: i64, now: i64) -> R<()> {
    let n = conn
        .execute("UPDATE chat_sessions SET deleted_at=NULL WHERE id=?1 AND deleted_at IS NOT NULL AND deleted_at >= ?2", params![id, now - UNDO_SECS - 2])
        .map_err(e)?;
    if n == 0 {
        return Err("已超过撤销时间".into());
    }
    Ok(())
}

/// 真正删除过了撤销期的对话及其消息（已生成的目标/版本不受影响）
pub fn purge_deleted(conn: &mut Connection, now: i64) -> R<usize> {
    let tx = conn.transaction().map_err(e)?;
    let cut = now - UNDO_SECS - 2;
    tx.execute("DELETE FROM chat_messages WHERE session_id IN (SELECT id FROM chat_sessions WHERE deleted_at IS NOT NULL AND deleted_at < ?1)", [cut]).map_err(e)?;
    let n = tx.execute("DELETE FROM chat_sessions WHERE deleted_at IS NOT NULL AND deleted_at < ?1", [cut]).map_err(e)?;
    tx.commit().map_err(e)?;
    Ok(n)
}

pub fn session_goal(conn: &Connection, sid: i64) -> R<Option<i64>> {
    conn.query_row("SELECT goal_id FROM chat_sessions WHERE id=?1", [sid], |r| r.get(0))
        .optional()
        .map_err(e)?
        .ok_or_else(|| "找不到这个对话".to_string())
}

pub fn message_goal(conn: &Connection, mid: i64) -> R<Option<i64>> {
    conn.query_row("SELECT s.goal_id FROM chat_messages m JOIN chat_sessions s ON s.id=m.session_id WHERE m.id=?1", [mid], |r| r.get(0))
        .optional()
        .map_err(e)?
        .ok_or_else(|| "找不到这条消息".to_string())
}

pub fn latest_or_new(conn: &Connection, now: i64) -> R<i64> {
    match conn.query_row("SELECT id FROM chat_sessions WHERE goal_id IS NULL AND deleted_at IS NULL ORDER BY updated_at DESC, id DESC LIMIT 1", [], |r| r.get(0)).optional().map_err(e)? {
        Some(id) => Ok(id),
        None => new_session(conn, now),
    }
}

pub fn get_session(conn: &Connection, id: i64, today: &str) -> R<ChatSession> {
    let (title, goal_id): (String, Option<i64>) = conn
        .query_row("SELECT title, goal_id FROM chat_sessions WHERE id=?1", [id], |r| Ok((r.get(0)?, r.get(1)?)))
        .optional()
        .map_err(e)?
        .ok_or("找不到这个对话")?;
    let mut st = conn
        .prepare("SELECT id, role, content, draft_json, draft_error, confirmed_goal_id, created_at, confirmed_version FROM chat_messages WHERE session_id=?1 ORDER BY id")
        .map_err(e)?;
    let messages = st
        .query_map([id], |r| {
            let role: String = r.get(1)?;
            let content: String = r.get(2)?;
            let dj: Option<String> = r.get(3)?;
            Ok(ChatMessage {
                id: r.get(0)?,
                text: if role == "assistant" { draft::display_text(&content) } else { content },
                role,
                draft: dj.and_then(|s| serde_json::from_str(&s).ok()),
                draft_error: r.get(4)?,
                confirmed_goal_id: r.get(5)?,
                created_at: r.get(6)?,
                confirmed_version: r.get(7)?,
                diff: None,
            })
        })
        .map_err(e)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(e)?;
    let mut messages = messages;
    let (mut goal_title, mut base_version) = (None, None);
    if let Some(gid) = goal_id {
        goal_title = conn.query_row("SELECT title FROM goals WHERE id=?1", [gid], |r| r.get(0)).optional().map_err(e)?;
        base_version = crate::service::version_for(conn, gid, true)?.map(|v| v.no);
        for m in messages.iter_mut().filter(|m| m.confirmed_version.is_none()) {
            if let Some(d) = &m.draft {
                m.diff = crate::revise::diff_for(conn, gid, d, today)?;
            }
        }
    }
    Ok(ChatSession { id, title, goal_id, goal_title, base_version, messages })
}

pub fn add_user(conn: &Connection, sid: i64, text: &str, now: i64) -> R<()> {
    let text = text.trim();
    if text.is_empty() {
        return Err("消息不能为空".into());
    }
    conn.execute("INSERT INTO chat_messages (session_id, role, content, created_at) VALUES (?1, 'user', ?2, ?3)", params![sid, text, now]).map_err(e)?;
    let title: String = text.chars().take(20).collect();
    conn.execute("UPDATE chat_sessions SET title = CASE WHEN title='新对话' THEN ?2 ELSE title END, updated_at=?3 WHERE id=?1", params![sid, title, now]).map_err(e)?;
    Ok(())
}

#[allow(dead_code)]
pub fn add_assistant(conn: &Connection, sid: i64, content: &str, today: &str, now: i64) -> R<()> {
    add_assistant_ex(conn, sid, content, false, false, today, now)
}

/// truncated：因长度上限截断；stopped：用户停止生成
/// 流式中途断网：保留已收到的内容，draft_error 以此开头，前端据此显示「重试」
pub const NET_HINT: &str = "NET:连接中断，已保留收到的内容。可以点「重试」重新生成这条回复。";

pub fn add_assistant_net(conn: &Connection, sid: i64, raw: &str, now: i64) -> R<()> {
    let content = draft::strip_unclosed_json(raw);
    conn.execute(
        "INSERT INTO chat_messages (session_id, role, content, draft_json, draft_error, created_at) VALUES (?1, 'assistant', ?2, NULL, ?3, ?4)",
        params![sid, content.trim(), NET_HINT, now],
    )
    .map_err(e)?;
    conn.execute("UPDATE chat_sessions SET updated_at=?2 WHERE id=?1", params![sid, now]).map_err(e)?;
    Ok(())
}

/// 重试前：最后一条若是断网残留的回复，删掉它
pub fn drop_interrupted_tail(conn: &Connection, sid: i64) -> R<bool> {
    let n = conn
        .execute(
            "DELETE FROM chat_messages WHERE id=(SELECT id FROM chat_messages WHERE session_id=?1 ORDER BY id DESC LIMIT 1)
             AND role='assistant' AND draft_error LIKE 'NET:%'",
            [sid],
        )
        .map_err(e)?;
    Ok(n > 0)
}

pub fn add_assistant_ex(conn: &Connection, sid: i64, raw: &str, truncated: bool, stopped: bool, today: &str, now: i64) -> R<()> {
    let mut content = if truncated || stopped { draft::strip_unclosed_json(raw) } else { raw.to_string() };
    if stopped {
        content = format!("{}\n\n（已停止生成）", content.trim_end()).trim().to_string();
    }
    let (dj, derr) = if truncated {
        (None, Some(draft::TRUNCATED_HINT.to_string()))
    } else {
        match draft::parse_draft(&content, today) {
            Ok(Some(d)) => (Some(serde_json::to_string(&d).unwrap_or_default()), None),
            Ok(None) => (None, None),
            Err(msg) => (None, Some(msg)),
        }
    };
    let content = content.as_str();
    conn.execute(
        "INSERT INTO chat_messages (session_id, role, content, draft_json, draft_error, created_at) VALUES (?1, 'assistant', ?2, ?3, ?4, ?5)",
        params![sid, content, dj, derr, now],
    )
    .map_err(e)?;
    conn.execute("UPDATE chat_sessions SET updated_at=?2 WHERE id=?1", params![sid, now]).map_err(e)?;
    Ok(())
}

/// 发给模型的历史（最近 30 条）；最后一条必须是用户消息
pub fn history_for_model(conn: &Connection, sid: i64, system: String) -> R<Vec<Value>> {
    let mut st = conn
        .prepare("SELECT role, content FROM (SELECT id, role, content FROM chat_messages WHERE session_id=?1 ORDER BY id DESC LIMIT 30) ORDER BY id")
        .map_err(e)?;
    let rows = st
        .query_map([sid], |r| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?)))
        .map_err(e)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(e)?;
    match rows.last() {
        Some((role, _)) if role == "user" => {}
        _ => return Err("没有需要回复的消息，请先输入内容".into()),
    }
    let mut out = vec![json!({"role":"system","content":system})];
    out.extend(rows.into_iter().map(|(role, content)| json!({"role":role,"content":content})));
    Ok(out)
}

pub fn draft_of(conn: &Connection, message_id: i64) -> R<(DraftPlan, Option<i64>)> {
    let (dj, gid): (Option<String>, Option<i64>) = conn
        .query_row("SELECT draft_json, confirmed_goal_id FROM chat_messages WHERE id=?1", [message_id], |r| Ok((r.get(0)?, r.get(1)?)))
        .optional()
        .map_err(e)?
        .ok_or("找不到这条草案")?;
    let d = dj.and_then(|s| serde_json::from_str(&s).ok()).ok_or("这条消息没有可用的草案")?;
    Ok((d, gid))
}

pub fn mark_confirmed(conn: &Connection, message_id: i64, goal_id: i64) -> R<()> {
    conn.execute("UPDATE chat_messages SET confirmed_goal_id=?2 WHERE id=?1", params![message_id, goal_id]).map_err(e)?;
    Ok(())
}

pub fn mark_confirmed_version(conn: &Connection, message_id: i64, goal_id: i64, version: i64) -> R<()> {
    conn.execute("UPDATE chat_messages SET confirmed_goal_id=?2, confirmed_version=?3 WHERE id=?1", params![message_id, goal_id, version]).map_err(e)?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn chat_roundtrip_and_confirm() {
        let mut conn = Connection::open_in_memory().unwrap();
        crate::db::migrate(&conn).unwrap();
        assert_eq!(model_and_url(&conn).unwrap().0, DEFAULT_MODEL);
        let sid = latest_or_new(&conn, 1).unwrap();
        add_user(&conn, sid, "帮我做个早睡计划", 1).unwrap();
        assert_eq!(history_for_model(&conn, sid, "sys".into()).unwrap().len(), 2);
        let reply = "好的\n```json\n{\"title\":\"早睡\",\"start_date\":\"2026-10-14\",\"days_count\":1,\"days\":[{\"title\":\"23点睡\",\"tasks\":[\"关手机\"],\"is_rest\":false}]}\n```";
        add_assistant(&conn, sid, reply, "2026-10-14", 2).unwrap();
        let s = get_session(&conn, sid, "2026-10-14").unwrap();
        assert_eq!(s.title, "帮我做个早睡计划");
        let m = &s.messages[1];
        assert_eq!(m.text, "好的");
        let (d, _) = draft_of(&conn, m.id).unwrap();
        let gid = crate::service::create_goal_with_plan(&mut conn, &d.to_new_goal(d.start_date.clone()), 3).unwrap();
        mark_confirmed(&conn, m.id, gid).unwrap();
        assert_eq!(draft_of(&conn, m.id).unwrap().1, Some(gid));
        assert!(history_for_model(&conn, sid, "sys".into()).is_err());

        // 改方案会话：绑定目标、不影响普通会话、草案带变化摘要
        let g = goal_session(&conn, gid, 4).unwrap();
        assert_ne!(g, sid);
        assert_eq!(goal_session(&conn, gid, 5).unwrap(), g);
        assert_eq!(latest_or_new(&conn, 6).unwrap(), sid);
        add_user(&conn, g, "改成2天", 7).unwrap();
        add_assistant(&conn, g, &reply.replace("\"days_count\":1", "\"days_count\":1"), "2026-10-14", 8).unwrap();
        let s = get_session(&conn, g, "2026-10-14").unwrap();
        assert_eq!((s.goal_id, s.base_version), (Some(gid), Some(1)));
        assert_eq!(s.messages[1].diff.as_ref().unwrap().next_version, 2);
        assert_eq!(message_goal(&conn, s.messages[1].id).unwrap(), Some(gid));

        // 会话列表 / 重命名 / 删除
        let l = list_sessions(&conn).unwrap();
        assert_eq!(l.len(), 2);
        assert_eq!((l[0].id, l[0].goal_title.as_deref(), l[0].confirmed), (g, Some("早睡"), false));
        assert!(l[1].confirmed);
        rename_session(&conn, sid, "  我的早睡  ").unwrap();
        assert!(rename_session(&conn, sid, " ").is_err());
        assert_eq!(get_session(&conn, sid, "2026-10-14").unwrap().title, "我的早睡");
        delete_session(&mut conn, g, 100).unwrap();
        assert_eq!(list_sessions(&conn).unwrap().len(), 1);
        assert!(delete_session(&mut conn, g, 100).is_err());
        undo_delete_session(&conn, g, 103).unwrap();
        assert_eq!(list_sessions(&conn).unwrap().len(), 2, "5 秒内可撤销");
        delete_session(&mut conn, g, 110).unwrap();
        assert_eq!(goal_session(&conn, gid, 111).unwrap() != g, true, "已删会话不再复用");
        assert_eq!(purge_deleted(&mut conn, 112).unwrap(), 0, "撤销期内不清理");
        assert!(purge_deleted(&mut conn, 130).unwrap() >= 1);
        assert!(undo_delete_session(&conn, g, 131).is_err());
        assert_eq!(crate::service::list_goals(&conn, "2026-10-14").unwrap().len(), 1, "删对话不删目标");

        // 截断 / 停止
        add_user(&conn, sid, "30天", 9).unwrap();
        add_assistant_ex(&conn, sid, "思路\n```json\n{\"title\":\"x\",\"days\":[", true, false, "2026-10-14", 10).unwrap();
        let m = get_session(&conn, sid, "2026-10-14").unwrap().messages.pop().unwrap();
        assert_eq!(m.text, "思路");
        assert!(m.draft.is_none() && m.draft_error.unwrap().contains("长度上限"));
        add_assistant_ex(&conn, sid, "好的，先问\n```json\n{", false, true, "2026-10-14", 11).unwrap();
        let m = get_session(&conn, sid, "2026-10-14").unwrap().messages.pop().unwrap();
        assert!(m.text.contains("已停止生成") && !m.text.contains('{') && m.draft_error.is_none());

        // 断网：保留内容 + 重试时删掉残留
        add_user(&conn, sid, "再来", 12).unwrap();
        add_assistant_net(&conn, sid, "收到一半", 13).unwrap();
        let m = get_session(&conn, sid, "2026-10-14").unwrap().messages.pop().unwrap();
        assert!(m.text == "收到一半" && m.draft_error.unwrap().starts_with("NET:"));
        assert!(drop_interrupted_tail(&conn, sid).unwrap());
        assert!(!drop_interrupted_tail(&conn, sid).unwrap());
        assert_eq!(get_session(&conn, sid, "2026-10-14").unwrap().messages.pop().unwrap().role, "user");
    }
}
