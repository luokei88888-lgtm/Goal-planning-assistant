use crate::service::{self, GoalDetail, GoalSummary, NewGoal};
use rusqlite::Connection;
use serde::Serialize;
use tauri::{AppHandle, Manager};

#[derive(Debug, Serialize)]
pub struct AppInfo {
    pub name: String,
    pub version: String,
    pub db_path: String,
    pub db_ready: bool,
}

fn app_dir(app: &AppHandle) -> Result<std::path::PathBuf, String> {
    app.path().app_data_dir().map_err(|e| format!("无法获取应用数据目录: {e}"))
}

/// 每次访问都按 config.json 解析数据库位置，所以更改位置后运行中即时切换
fn open(app: &AppHandle) -> Result<Connection, String> {
    let conn = crate::dblocation::open_current(&app_dir(app)?)?;
    // 每次访问前按本地日期切换进行中/已完成（覆盖启动、跨天、改方案、取消归档）
    let _ = service::refresh_statuses(&conn, &today());
    Ok(conn)
}

fn today() -> String {
    chrono::Local::now().date_naive().format("%Y-%m-%d").to_string()
}

fn now() -> i64 {
    chrono::Utc::now().timestamp()
}

#[tauri::command]
pub fn ping() -> String {
    "pong".into()
}

#[tauri::command]
pub fn get_app_info(app: AppHandle) -> Result<AppInfo, String> {
    let db_path = crate::dblocation::resolve(&app_dir(&app)?).path;
    let db_ready = open(&app).is_ok();
    Ok(AppInfo { name: "目标计划助手".into(), version: env!("CARGO_PKG_VERSION").into(), db_path, db_ready })
}

#[tauri::command]
pub fn list_goals(app: AppHandle, archived: Option<bool>) -> Result<Vec<GoalSummary>, String> {
    service::list_goals_by(&open(&app)?, &today(), archived.unwrap_or(false))
}

#[tauri::command]
pub fn restore_goal(app: AppHandle, goal_id: i64) -> Result<(), String> {
    service::restore_goal(&mut open(&app)?, goal_id, now())
}

#[tauri::command]
pub fn get_goal_detail(app: AppHandle, goal_id: i64) -> Result<GoalDetail, String> {
    service::get_goal_detail(&open(&app)?, goal_id, &today(), 7)
}

#[tauri::command]
pub fn check_in(app: AppHandle, plan_day_id: i64) -> Result<(), String> {
    service::check_in(&open(&app)?, plan_day_id, &today(), now())
}

#[tauri::command]
pub fn make_up_check_in(app: AppHandle, plan_day_id: i64) -> Result<(), String> {
    service::make_up_check_in(&open(&app)?, plan_day_id, &today(), now())
}

#[tauri::command]
pub fn undo_check_in(app: AppHandle, plan_day_id: i64) -> Result<(), String> {
    service::undo_check_in(&open(&app)?, plan_day_id)
}

#[tauri::command]
pub fn save_day_note(app: AppHandle, plan_day_id: i64, note: String) -> Result<String, String> {
    service::save_day_note(&open(&app)?, plan_day_id, &note, &today())
}

#[tauri::command]
pub fn create_goal_with_plan(app: AppHandle, goal: NewGoal) -> Result<i64, String> {
    service::create_goal_with_plan(&mut open(&app)?, &goal, now())
}

#[tauri::command]
pub fn archive_goal(app: AppHandle, goal_id: i64) -> Result<(), String> {
    service::archive_goal(&mut open(&app)?, goal_id, now())
}

#[tauri::command]
pub fn import_sample_goal(app: AppHandle) -> Result<i64, String> {
    service::import_sample(&mut open(&app)?, &today(), now())
}

// ---------------- 设置 / 聊天 ----------------

use crate::chat::{self, ChatSession};
use crate::llm::{self, LlmConfig};
use crate::secret;
use crate::providers;
use crate::{review, revise};

#[derive(Debug, Serialize)]
pub struct SettingsView {
    pub provider: String,
    pub model: String,
    pub base_url: String,
    pub has_key: bool,
    pub key_mask: Option<String>,
    pub providers: Vec<ProviderView>,
}

#[derive(Debug, Serialize)]
pub struct ProviderView {
    pub id: String,
    pub name: String,
    pub base_url: String,
    pub models: Vec<String>,
    pub max_tokens: u32,
    pub key_url: String,
    pub has_key: bool,
    pub key_mask: Option<String>,
    /// 上次从 /models 拉到的列表（空 = 还没拉过）
    pub fetched_models: Vec<String>,
}

const NO_KEY: &str = "NO_KEY:还没有设置当前服务商的 API Key，请先到「设置」里填写。查看目标和打卡不受影响。";

fn current_provider(conn: &Connection) -> Result<String, String> {
    Ok(chat::get_setting(conn, "provider")?.filter(|p| providers::valid(p)).unwrap_or_else(|| "deepseek".into()))
}

#[tauri::command]
pub fn get_settings(app: AppHandle) -> Result<SettingsView, String> {
    let conn = open(&app)?;
    let (model, base_url) = chat::model_and_url(&conn)?;
    let provider = current_provider(&conn)?;
    let providers = providers::PROVIDERS
        .iter()
        .map(|p| {
            let key = secret::get_key(p.id).unwrap_or(None);
            ProviderView {
                id: p.id.into(),
                name: p.name.into(),
                base_url: p.base_url.into(),
                models: p.models.iter().map(|m| m.to_string()).collect(),
                max_tokens: p.max_tokens,
                key_url: p.key_url.into(),
                has_key: key.is_some(),
                key_mask: key.as_deref().map(secret::mask),
                fetched_models: chat::get_setting(&conn, &format!("models_cache:{}", p.id))
                    .ok()
                    .flatten()
                    .and_then(|s| serde_json::from_str(&s).ok())
                    .unwrap_or_default(),
            }
        })
        .collect::<Vec<_>>();
    let cur = providers.iter().find(|p| p.id == provider);
    Ok(SettingsView {
        has_key: cur.map(|p| p.has_key).unwrap_or(false),
        key_mask: cur.and_then(|p| p.key_mask.clone()),
        provider,
        model,
        base_url,
        providers,
    })
}

/// api_key 为空 / 不传 = 保持该服务商原 Key 不变
#[tauri::command]
pub fn save_settings(app: AppHandle, provider: String, model: String, base_url: String, api_key: Option<String>) -> Result<SettingsView, String> {
    let model = model.trim();
    let base_url = base_url.trim().trim_end_matches('/');
    if !providers::valid(&provider) {
        return Err("未知的服务商".into());
    }
    if model.is_empty() {
        return Err("模型名不能为空".into());
    }
    if !(base_url.starts_with("https://") || base_url.starts_with("http://")) {
        return Err("Base URL 需要以 https:// 开头".into());
    }
    if let Some(k) = api_key.as_deref().map(str::trim).filter(|k| !k.is_empty()) {
        if k.chars().any(char::is_whitespace) {
            return Err("API Key 里不应有空格或换行".into());
        }
        secret::set_key(&provider, k)?;
    }
    let conn = open(&app)?;
    chat::set_setting(&conn, "provider", &provider)?;
    chat::set_setting(&conn, "model", model)?;
    chat::set_setting(&conn, "base_url", base_url)?;
    drop(conn);
    get_settings(app)
}

#[tauri::command]
pub fn delete_api_key(provider: String) -> Result<(), String> {
    if !providers::valid(&provider) {
        return Err("未知的服务商".into());
    }
    secret::delete_key(&provider)
}

fn llm_config(app: &AppHandle) -> Result<LlmConfig, String> {
    let conn = open(app)?;
    let provider = current_provider(&conn)?;
    let key = secret::get_key(&provider)?.ok_or(NO_KEY)?;
    let (model, base_url) = chat::model_and_url(&conn)?;
    Ok(LlmConfig { base_url, model, key, max_tokens: providers::max_tokens(&provider), provider })
}

#[tauri::command]
pub async fn test_connection(app: AppHandle) -> Result<String, String> {
    let cfg = llm_config(&app)?;
    llm::ping(&cfg).await
}

#[tauri::command]
pub fn chat_get_session(app: AppHandle, session_id: Option<i64>) -> Result<ChatSession, String> {
    let conn = open(&app)?;
    let sid = match session_id {
        Some(id) => id,
        None => chat::latest_or_new(&conn, now())?,
    };
    chat::get_session(&conn, sid, &today())
}

/// goal_id 有值 = 新建该目标的改方案会话
#[tauri::command]
pub fn chat_new_session(app: AppHandle, goal_id: Option<i64>) -> Result<ChatSession, String> {
    let conn = open(&app)?;
    let sid = match goal_id {
        Some(g) => chat::new_goal_session(&conn, g, now())?,
        None => chat::new_session(&conn, now())?,
    };
    chat::get_session(&conn, sid, &today())
}

/// 打开目标的改方案会话（最近一个，没有就新建）
#[tauri::command]
pub fn chat_goal_session(app: AppHandle, goal_id: i64) -> Result<ChatSession, String> {
    let conn = open(&app)?;
    let sid = chat::goal_session(&conn, goal_id, now())?;
    chat::get_session(&conn, sid, &today())
}

// ---------------- 流式 ----------------
use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use tauri::ipc::Channel;

#[derive(Default)]
pub struct Streams(Mutex<HashMap<String, Arc<AtomicBool>>>);

struct StreamGuard {
    app: AppHandle,
    id: String,
    flag: Arc<AtomicBool>,
}
impl StreamGuard {
    fn new(app: &AppHandle, id: &str) -> Self {
        let flag = Arc::new(AtomicBool::new(false));
        app.state::<Streams>().0.lock().unwrap().insert(id.to_string(), flag.clone());
        StreamGuard { app: app.clone(), id: id.to_string(), flag }
    }
}
impl Drop for StreamGuard {
    fn drop(&mut self) {
        self.app.state::<Streams>().0.lock().unwrap().remove(&self.id);
    }
}

#[derive(Clone, Serialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum StreamEvent {
    Delta { text: String },
    /// 思考内容（仅展示，不保存）
    Reasoning { text: String },
}

/// 停止生成
#[tauri::command]
pub fn chat_stop(app: AppHandle, stream_id: String) {
    if let Some(f) = app.state::<Streams>().0.lock().unwrap().get(&stream_id) {
        f.store(true, Ordering::SeqCst);
    }
}


/// text 为空 = 重试（对最后一条用户消息重新请求）。增量通过 on_event 推给前端，结束后返回完整会话
#[tauri::command]
pub async fn chat_send(app: AppHandle, session_id: i64, text: Option<String>, stream_id: String, on_event: Channel<StreamEvent>) -> Result<ChatSession, String> {
    let cfg = llm_config(&app)?;
    let msgs = {
        let conn = open(&app)?;
        if let Some(t) = text.as_deref().filter(|t| !t.trim().is_empty()) {
            chat::add_user(&conn, session_id, t, now())?;
        } else {
            chat::drop_interrupted_tail(&conn, session_id)?;
        }
        let system = match chat::session_goal(&conn, session_id)? {
            Some(g) => llm::revise_prompt(&today(), &revise::plan_context(&conn, g, &today())?),
            None => llm::system_prompt(&today()),
        };
        chat::history_for_model(&conn, session_id, system)?
    };
    let guard = StreamGuard::new(&app, &stream_id);
    let r = llm::stream_ex(&cfg, msgs, cfg.max_tokens.max(16384), &guard.flag, serde_json::json!({}), llm::IDLE_SECS, |c| {
        let _ = on_event.send(match c {
            llm::Chunk::Content(t) => StreamEvent::Delta { text: t.to_string() },
            llm::Chunk::Reasoning(t) => StreamEvent::Reasoning { text: t.to_string() },
        });
        false
    })
    .await?;
    drop(guard);
    let conn = open(&app)?;
    if r.finish.as_deref() == Some("network") && !r.stopped {
        chat::add_assistant_net(&conn, session_id, &r.text, now())?;
    } else if !(r.stopped && r.text.trim().is_empty()) {
        let truncated = r.finish.as_deref() == Some("length");
        chat::add_assistant_ex(&conn, session_id, &r.text, truncated, r.stopped, &today(), now())?;
    }
    chat::get_session(&conn, session_id, &today())
}

#[tauri::command]
pub fn chat_list_sessions(app: AppHandle) -> Result<Vec<chat::SessionItem>, String> {
    chat::list_sessions(&open(&app)?)
}

#[tauri::command]
pub fn chat_rename_session(app: AppHandle, session_id: i64, title: String) -> Result<(), String> {
    chat::rename_session(&open(&app)?, session_id, &title)
}

#[tauri::command]
pub fn chat_delete_session(app: AppHandle, session_id: i64) -> Result<(), String> {
    let mut conn = open(&app)?;
    let _ = chat::purge_deleted(&mut conn, now());
    chat::delete_session(&mut conn, session_id, now())
}

#[tauri::command]
pub fn chat_undo_delete_session(app: AppHandle, session_id: i64) -> Result<(), String> {
    chat::undo_delete_session(&open(&app)?, session_id, now())
}

/// 改方案确认时用：今天这个目标是否已打卡（已打卡默认「从明天起」）
#[tauri::command]
pub fn goal_today_checked(app: AppHandle, goal_id: i64) -> Result<bool, String> {
    let conn = open(&app)?;
    let n: i64 = conn
        .query_row("SELECT COUNT(*) FROM checkins c JOIN plan_days d ON d.id=c.plan_day_id JOIN plan_versions v ON v.id=d.plan_version_id
          WHERE v.goal_id=?1 AND v.status='active' AND d.date=?2", rusqlite::params![goal_id, today()], |r| r.get(0))
        .map_err(|e| e.to_string())?;
    Ok(n > 0)
}

/// 确认草案：建目标 + 生效第 1 版，返回目标 id
#[tauri::command]
pub fn confirm_draft(app: AppHandle, message_id: i64, from_tomorrow: Option<bool>) -> Result<i64, String> {
    let mut conn = open(&app)?;
    let (d, confirmed) = chat::draft_of(&conn, message_id)?;
    if let Some(gid) = confirmed {
        return Err(format!("CONFIRMED:{gid}"));
    }
    let t = today();
    if let Some(goal_id) = chat::message_goal(&conn, message_id)? {
        // 改方案：生效新版本（从今天或明天起替换）
        let start = if from_tomorrow.unwrap_or(false) { service::shift(&t, 1)? } else { t.clone() };
        let ng = d.to_new_goal(start.clone());
        let ver = revise::revise_plan(&mut conn, goal_id, &ng.days, &d.summary, "chat", &start, now())?;
        chat::mark_confirmed_version(&conn, message_id, goal_id, ver)?;
        return Ok(goal_id);
    }
    let start = if d.start_date < t { t } else { d.start_date.clone() };
    let gid = service::create_goal_with_plan(&mut conn, &d.to_new_goal(start), now())?;
    chat::mark_confirmed(&conn, message_id, gid)?;
    Ok(gid)
}

/// 恢复出厂设置：清空数据库，并删除所有服务商在凭据管理器里的 Key（不存在的条目忽略；不读取、不记录 Key 值）
#[tauri::command]
pub fn factory_reset(app: AppHandle) -> Result<(), String> {
    service::factory_reset(&mut open(&app)?)?;
    let failed: Vec<&str> = providers::PROVIDERS.iter()
        .filter(|p| secret::delete_key(p.id).is_err())
        .map(|p| p.name)
        .collect();
    if failed.is_empty() { Ok(()) } else { Err(format!("数据已清空，但删除以下服务商的 API Key 失败：{}", failed.join("、"))) }
}

// ---------------- 版本 / 周复盘 ----------------

#[tauri::command]
pub fn list_versions(app: AppHandle, goal_id: i64) -> Result<Vec<revise::VersionInfo>, String> {
    revise::list_versions(&open(&app)?, goal_id)
}

#[tauri::command]
pub fn version_days(app: AppHandle, goal_id: i64, version_no: i64) -> Result<Vec<service::DayItem>, String> {
    revise::version_days(&open(&app)?, goal_id, version_no)
}

#[tauri::command]
pub fn week_view(app: AppHandle, goal_id: i64, week_start: Option<String>) -> Result<review::WeekView, String> {
    review::week_view(&open(&app)?, goal_id, week_start.as_deref(), &today())
}

#[tauri::command]
pub fn save_review(app: AppHandle, goal_id: i64, week_start: String, text: review::ReviewText) -> Result<review::Review, String> {
    review::save_review(&open(&app)?, goal_id, &week_start, &text, &today(), now())
}

#[tauri::command]
pub fn list_reviews(app: AppHandle, goal_id: i64) -> Result<Vec<review::Review>, String> {
    review::list_reviews(&open(&app)?, goal_id)
}

/// 先保存手写内容，再请助手点评；无 Key / 离线时手写内容已保存
#[tauri::command]
pub async fn review_ai(app: AppHandle, goal_id: i64, week_start: String, text: review::ReviewText, stream_id: String, on_event: Channel<StreamEvent>) -> Result<review::Review, String> {
    let (ws, prompt) = {
        let conn = open(&app)?;
        let r = review::save_review(&conn, goal_id, &week_start, &text, &today(), now())?;
        let p = review::review_user_prompt(&conn, goal_id, &r.week_start, &today())?;
        (r.week_start, p)
    };
    let cfg = llm_config(&app).map_err(|m| format!("{m}（手写内容已保存）"))?;
    let msgs = vec![
        serde_json::json!({"role":"system","content":review::REVIEW_SYSTEM}),
        serde_json::json!({"role":"user","content":prompt}),
    ];
    let guard = StreamGuard::new(&app, &stream_id);
    let r = llm::stream_ex(&cfg, msgs, cfg.max_tokens.max(8192), &guard.flag, serde_json::json!({}), llm::IDLE_SECS, |c| {
        let _ = on_event.send(match c {
            llm::Chunk::Content(t) => StreamEvent::Delta { text: t.to_string() },
            llm::Chunk::Reasoning(t) => StreamEvent::Reasoning { text: t.to_string() },
        });
        false
    })
    .await
    .map_err(|m| format!("{m}（手写内容已保存）"))?;
    drop(guard);
    let conn = open(&app)?;
    let mut c = r.text.trim().to_string();
    if c.is_empty() {
        return review::get_review(&conn, goal_id, &ws)?.ok_or_else(|| "找不到这次复盘".into());
    }
    if r.stopped {
        c += "\n（已停止生成）";
    } else if r.finish.as_deref() == Some("length") {
        c += "\n（点评过长被截断）";
    } else if r.finish.as_deref() == Some("network") {
        c += "\n（连接中断，已保留收到的内容，可点「重新点评」重试）";
    }
    review::set_ai_comment(&conn, goal_id, &ws, &c, now())
}


// ---------------- 结项最终总结 ----------------
#[tauri::command]
pub fn final_view(app: AppHandle, goal_id: i64) -> Result<crate::final_review::FinalView, String> {
    crate::final_review::final_view(&open(&app)?, goal_id, &today())
}

#[tauri::command]
pub fn get_final_review(app: AppHandle, goal_id: i64) -> Result<Option<crate::final_review::FinalReview>, String> {
    crate::final_review::get_final_review(&open(&app)?, goal_id)
}

#[tauri::command]
pub fn save_final_review(app: AppHandle, goal_id: i64, text: review::ReviewText) -> Result<crate::final_review::FinalReview, String> {
    crate::final_review::save_final_review(&open(&app)?, goal_id, &text, &today(), now())
}

/// 先保存手写内容，再流式生成点评；没有 Key / 失败时手写内容已保存
#[tauri::command]
pub async fn generate_final_review(
    app: AppHandle,
    goal_id: i64,
    text: review::ReviewText,
    stream_id: String,
    on_event: Channel<StreamEvent>,
) -> Result<crate::final_review::FinalReview, String> {
    let prompt = {
        let conn = open(&app)?;
        let _ = crate::final_review::save_final_review(&conn, goal_id, &text, &today(), now())?;
        crate::final_review::final_review_user_prompt(&conn, goal_id, &today())?
    };
    let cfg = llm_config(&app).map_err(|m| format!("{m}（手写内容已保存）"))?;
    let msgs = vec![
        serde_json::json!({"role":"system","content":crate::final_review::FINAL_REVIEW_SYSTEM}),
        serde_json::json!({"role":"user","content":prompt}),
    ];
    let guard = StreamGuard::new(&app, &stream_id);
    let r = llm::stream_ex(&cfg, msgs, cfg.max_tokens.max(8192), &guard.flag, serde_json::json!({}), llm::IDLE_SECS, |c| {
        let _ = on_event.send(match c {
            llm::Chunk::Content(t) => StreamEvent::Delta { text: t.to_string() },
            llm::Chunk::Reasoning(t) => StreamEvent::Reasoning { text: t.to_string() },
        });
        false
    })
    .await
    .map_err(|m| format!("{m}（手写内容已保存）"))?;
    drop(guard);
    let conn = open(&app)?;
    let mut c = r.text.trim().to_string();
    if c.is_empty() {
        return crate::final_review::get_final_review(&conn, goal_id)?.ok_or_else(|| "找不到这次结项总结".into());
    }
    if r.stopped {
        c += "\n（已停止生成）";
    } else if r.finish.as_deref() == Some("length") {
        c += "\n（点评过长被截断）";
    } else if r.finish.as_deref() == Some("network") {
        c += "\n（连接中断，已保留收到的内容，可点「让助手点评」重试）";
    }
    crate::final_review::set_final_ai_comment(&conn, goal_id, &c, now())
}

// ---------------- 备份 ----------------
use crate::backup;

fn check_path(path: &str) -> Result<std::path::PathBuf, String> {
    let p = std::path::PathBuf::from(path.trim());
    if p.as_os_str().is_empty() {
        return Err("没有选择文件".into());
    }
    Ok(p)
}

/// 导出全部业务数据为 JSON（不含 API Key），返回概要
#[tauri::command]
pub fn export_backup(app: AppHandle, path: String) -> Result<backup::BackupInfo, String> {
    let p = check_path(&path)?;
    let conn = open(&app)?;
    let v = backup::export(&conn, &chrono::Local::now().to_rfc3339(), env!("CARGO_PKG_VERSION"))?;
    let info = backup::inspect(&conn, &v)?;
    let text = serde_json::to_string_pretty(&v).map_err(|_| "生成备份失败".to_string())?;
    std::fs::write(&p, text).map_err(|err| format!("写入备份文件失败：{err}"))?;
    Ok(info)
}

fn read_backup(path: &str) -> Result<serde_json::Value, String> {
    let p = check_path(path)?;
    let meta = std::fs::metadata(&p).map_err(|_| "找不到这个文件".to_string())?;
    if meta.len() > 50 * 1024 * 1024 {
        return Err("备份文件太大（超过 50MB）".into());
    }
    let text = std::fs::read_to_string(&p).map_err(|_| "读取文件失败，文件可能不是 UTF-8 文本".to_string())?;
    backup::parse(&text)
}

/// 只校验、不写库：给确认框显示内容
#[tauri::command]
pub fn inspect_backup(app: AppHandle, path: String) -> Result<backup::BackupInfo, String> {
    let v = read_backup(&path)?;
    backup::inspect(&open(&app)?, &v)
}

#[tauri::command]
pub fn import_backup(app: AppHandle, path: String) -> Result<backup::BackupInfo, String> {
    let v = read_backup(&path)?;
    backup::import(&mut open(&app)?, &v)
}

// ---------------- 提醒 / 托盘 / 自启 ----------------
use crate::reminder::{self, GoalReminders, ReminderSettings};
use tauri_plugin_notification::NotificationExt;

#[tauri::command]
pub fn get_goal_reminders(app: AppHandle, goal_id: i64) -> Result<GoalReminders, String> {
    reminder::goal_reminders(&open(&app)?, goal_id)
}

#[tauri::command]
pub fn save_goal_reminders(app: AppHandle, goal_id: i64, enabled: bool, times: Vec<String>) -> Result<GoalReminders, String> {
    reminder::save_goal_reminders(&open(&app)?, goal_id, enabled, &times, now())
}

#[tauri::command]
pub fn get_reminder_settings(app: AppHandle) -> Result<ReminderSettings, String> {
    reminder::settings(&open(&app)?)
}

#[tauri::command]
pub fn save_reminder_settings(app: AppHandle, settings: ReminderSettings) -> Result<ReminderSettings, String> {
    reminder::save_settings(&open(&app)?, &settings)
}

pub fn notify(app: &AppHandle, title: &str, body: &str) -> Result<(), String> {
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .map_err(|e| format!("发送通知失败：{e}（请检查 Windows 设置 → 系统 → 通知 是否允许本应用）"))
}

/// 后台每 30 秒检查一次
pub fn reminder_tick(app: &AppHandle) {
    let Ok(conn) = open(app) else { return };
    let local = chrono::Local::now().naive_local();
    let date = local.date().format("%Y-%m-%d").to_string();
    let Ok(list) = reminder::due_reminders(&conn, local) else { return };
    let mut raised = false;
    for d in list {
        if notify(app, &d.title, &d.body).is_ok() {
            let _ = reminder::mark_sent(&conn, &d.key, &date, now());
            // 窗口不在前台时记下目标：打开/获焦后跳到该目标
            let win = app.get_webview_window("main");
            let hidden = win
                .as_ref()
                .map(|w| !w.is_visible().unwrap_or(false) || w.is_minimized().unwrap_or(false) || !w.is_focused().unwrap_or(false))
                .unwrap_or(true);
            let in_tray_or_min = win
                .as_ref()
                .map(|w| !w.is_visible().unwrap_or(false) || w.is_minimized().unwrap_or(false))
                .unwrap_or(true);
            if hidden {
                *app.state::<PendingOpen>().0.lock().unwrap() = Some((d.goal_id, std::time::Instant::now()));
            }
            // 托盘/最小化时拉起窗口（与设置页文案一致）；同一轮只拉一次
            if in_tray_or_min && !raised {
                show_main(app);
                raised = true;
            }
        }
    }
}

/// 最近一次提醒对应的目标（10 分钟内有效）
#[derive(Default)]
pub struct PendingOpen(pub Mutex<Option<(Option<i64>, std::time::Instant)>>);

pub fn take_pending(app: &AppHandle) -> Option<i64> {
    let st = app.state::<PendingOpen>();
    let v = st.0.lock().unwrap().take()?;
    if v.1.elapsed().as_secs() > 600 {
        return None;
    }
    v.0
}

pub fn show_main(app: &AppHandle) {
    if let Some(w) = app.get_webview_window("main") {
        let _ = w.unminimize();
        let _ = w.show();
        let _ = w.set_focus();
    }
}

/// 关闭窗口时的行为（ask / tray / exit）；读不到设置时按「每次询问」
pub fn on_close(app: &AppHandle) -> String {
    open(app).and_then(|c| reminder::close_action(&c)).unwrap_or_else(|_| "ask".into())
}

/// 隐藏主窗口到托盘（首次隐藏时发一条说明通知）
pub fn hide_to_tray(app: &AppHandle) {
    if let Some(w) = app.get_webview_window("main") {
        let _ = w.hide();
    }
    if let Ok(conn) = open(app) {
        if reminder::take_close_hint(&conn).unwrap_or(false) {
            let _ = notify(app, "目标计划助手仍在后台运行", "已隐藏到系统托盘，到点会继续提醒打卡。点托盘图标可以再打开。");
        }
    }
}

#[tauri::command]
pub fn get_close_action(app: AppHandle) -> Result<String, String> {
    reminder::close_action(&open(&app)?)
}

#[tauri::command]
pub fn set_close_action(app: AppHandle, action: String) -> Result<String, String> {
    reminder::set_close_action(&open(&app)?, &action)
}

#[tauri::command]
pub fn get_ui_theme(app: AppHandle) -> Result<String, String> {
    reminder::ui_theme(&open(&app)?)
}

#[tauri::command]
pub fn set_ui_theme(app: AppHandle, theme: String) -> Result<String, String> {
    reminder::set_ui_theme(&open(&app)?, &theme)
}

#[tauri::command]
pub fn get_reduce_motion(app: AppHandle) -> Result<bool, String> {
    reminder::reduce_motion(&open(&app)?)
}

#[tauri::command]
pub fn set_reduce_motion(app: AppHandle, on: bool) -> Result<bool, String> {
    reminder::set_reduce_motion(&open(&app)?, on)
}

#[tauri::command]
pub fn celebrate_once(app: AppHandle, goal_id: i64, key: String) -> Result<bool, String> {
    reminder::celebrate_once(&open(&app)?, goal_id, &key)
}

/// 关闭询问对话框的选择：tray / exit；remember=true 时写入设置
#[tauri::command]
pub fn close_window_choice(app: AppHandle, action: String, remember: bool) -> Result<(), String> {
    if action != "tray" && action != "exit" {
        return Err("未知的选择".into());
    }
    if remember {
        reminder::set_close_action(&open(&app)?, &action)?;
    }
    if action == "exit" { app.exit(0); } else { hide_to_tray(&app); }
    Ok(())
}

// ---------------- 统计 / 模板 ----------------
use crate::{stats, templates};

#[tauri::command]
pub fn get_stats(app: AppHandle, goal_id: Option<i64>) -> Result<stats::Stats, String> {
    stats::get_stats(&open(&app)?, goal_id, &today())
}

#[tauri::command]
pub fn list_templates(app: AppHandle) -> Result<Vec<templates::Template>, String> {
    templates::list_templates(&open(&app)?)
}

#[tauri::command]
pub fn apply_template(app: AppHandle, template_id: String, start_date: String) -> Result<i64, String> {
    templates::apply_template(&mut open(&app)?, &template_id, &start_date, &today(), now())
}

#[tauri::command]
pub fn save_goal_as_template(app: AppHandle, goal_id: i64, title: Option<String>) -> Result<String, String> {
    templates::save_goal_as_template(&open(&app)?, goal_id, title.as_deref(), now())
}

#[tauri::command]
pub fn delete_template(app: AppHandle, template_id: String) -> Result<(), String> {
    templates::delete_template(&open(&app)?, &template_id)
}

// ---------------- 天气 ----------------
use crate::weather;

#[tauri::command]
pub fn weather_get_settings(app: AppHandle) -> Result<weather::WeatherSettings, String> {
    weather::get_settings(&open(&app)?)
}

#[tauri::command]
pub fn weather_save_settings(app: AppHandle, settings: weather::WeatherSettings) -> Result<weather::WeatherSettings, String> {
    weather::save_settings(&open(&app)?, &settings)
}

#[tauri::command]
pub async fn weather_search_city(name: String) -> Result<Vec<weather::City>, String> {
    weather::search_city(&name).await
}

/// 关闭显示时返回 None；30 分钟内用缓存；失败回退旧缓存（stale）
#[tauri::command]
pub async fn weather_get(app: AppHandle, force: Option<bool>) -> Result<Option<weather::Weather>, String> {
    let st = {
        let conn = open(&app)?;
        let st = weather::get_settings(&conn)?;
        if !st.enabled {
            return Ok(None);
        }
        if let Some(w) = weather::cached(&conn, &st.city, now(), force.unwrap_or(false))? {
            return Ok(Some(w));
        }
        st
    };
    match weather::fetch(&st.city, now()).await {
        Ok(w) => {
            weather::save(&open(&app)?, &w)?;
            Ok(Some(w))
        }
        Err(m) => weather::fallback(&open(&app)?, &st.city, m).map(Some),
    }
}

/// 获取当前服务商的模型列表（Key 只在 Rust 内从凭据管理器取），结果按服务商缓存
#[tauri::command]
pub async fn fetch_models(app: AppHandle, provider: String, base_url: String) -> Result<Vec<String>, String> {
    if !providers::valid(&provider) {
        return Err("未知的服务商".into());
    }
    let base = base_url.trim().trim_end_matches('/').to_string();
    if !(base.starts_with("https://") || base.starts_with("http://")) {
        return Err("Base URL 需要以 https:// 开头".into());
    }
    let key = secret::get_key(&provider)?.ok_or("NO_KEY:请先填写并保存这个服务商的 API Key")?;
    let ids = llm::list_models(&base, &key).await?;
    chat::set_setting(&open(&app)?, &format!("models_cache:{provider}"), &serde_json::to_string(&ids).map_err(|e| e.to_string())?)?;
    Ok(ids)
}

// ---------------- 模型在线状态 ----------------

#[derive(Serialize)]
pub struct ModelStatus {
    /// ok / no_key / auth / busy / timeout / net / billing / error
    pub state: String,
    pub reason: String,
    pub provider: String,
    pub model: String,
}

/// 轻量检测当前服务商是否可用（GET /models，8 秒超时，不打印 Key）
#[tauri::command]
pub async fn model_status(app: AppHandle) -> Result<ModelStatus, String> {
    let (pid, model, base_url) = {
        let conn = open(&app)?;
        let pid = current_provider(&conn)?;
        let (model, base_url) = chat::model_and_url(&conn)?;
        (pid, model, base_url)
    };
    let pname = providers::get(&pid).name.split('（').next().unwrap_or("").trim().to_string();
    let mk = |state: &str, reason: String| ModelStatus { state: state.into(), reason, provider: pname.clone(), model: model.clone() };
    let key = match secret::get_key(&pid) {
        Ok(Some(k)) => k,
        Ok(None) => return Ok(mk("no_key", "未配置 Key".into())),
        Err(e) => return Ok(mk("error", e)),
    };
    Ok(match llm::probe(&base_url, &key).await {
        Ok(()) => mk("ok", String::new()),
        Err((k, why)) => mk(k, why),
    })
}

// ---------------- 数据库位置 ----------------
use crate::dblocation::{self, Conflict, Location, MoveResult};

#[tauri::command]
pub fn db_location(app: AppHandle) -> Result<Location, String> {
    Ok(dblocation::resolve(&app_dir(&app)?))
}

/// 把数据库迁到 dir；conflict：ask / use_existing / overwrite。目标已有同名库且为 ask 时返回 DB_EXISTS: 前缀错误
#[tauri::command]
pub fn db_change_location(app: AppHandle, dir: String, conflict: Option<String>) -> Result<MoveResult, String> {
    let c = Conflict::parse(conflict.as_deref())?;
    dblocation::move_to(&app_dir(&app)?, std::path::Path::new(&dir), c)
}

/// 恢复默认位置：把当前数据库迁回应用数据目录
#[tauri::command]
pub fn db_restore_default(app: AppHandle, conflict: Option<String>) -> Result<MoveResult, String> {
    let c = Conflict::parse(conflict.as_deref())?;
    let d = app_dir(&app)?;
    dblocation::move_to(&d, &d, c)
}

/// 配置的位置找不到时：指向另一个已有数据库的文件夹
#[tauri::command]
pub fn db_relink(app: AppHandle, dir: String) -> Result<Location, String> {
    dblocation::relink(&app_dir(&app)?, std::path::Path::new(&dir))
}

/// 配置的位置找不到时：回到默认位置
#[tauri::command]
pub fn db_use_default(app: AppHandle) -> Result<Location, String> {
    dblocation::use_default(&app_dir(&app)?)
}

/// 在资源管理器里打开数据库所在文件夹（并选中文件）
#[tauri::command]
pub fn db_open_folder(app: AppHandle) -> Result<(), String> {
    let loc = dblocation::resolve(&app_dir(&app)?);
    let p = std::path::PathBuf::from(&loc.path);
    let r = if p.is_file() {
        std::process::Command::new("explorer").arg(format!("/select,{}", p.display())).spawn()
    } else if std::path::Path::new(&loc.dir).is_dir() {
        std::process::Command::new("explorer").arg(&loc.dir).spawn()
    } else {
        return Err(format!("文件夹不存在：{}", loc.dir));
    };
    r.map(|_| ()).map_err(|e| format!("打开文件夹失败：{e}"))
}

// ---------------- 开机自启 ----------------
#[tauri::command]
pub fn get_autostart() -> Result<crate::autostart_cmd::AutostartStatus, String> {
    crate::autostart_cmd::get_status()
}

#[tauri::command]
pub fn set_autostart(enabled: bool) -> Result<crate::autostart_cmd::AutostartStatus, String> {
    crate::autostart_cmd::set_enabled(enabled)
}
