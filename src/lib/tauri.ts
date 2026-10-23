import { invoke, Channel } from "@tauri-apps/api/core";

export type AppInfo = { name: string; version: string; db_path: string; db_ready: boolean };

export type GoalSummary = {
  id: number; title: string; icon: string; status: string; version_no: number | null;
  done: number; total: number; rest: number; today_done: boolean; today_in_plan: boolean; today_is_rest: boolean;
};

export type DayItem = {
  id: number; day_index: number; date: string; title: string; detail: string;
  tasks: string[];
  is_rest: boolean; checked: boolean; kind: "on_time" | "make_up" | null; note: string;
};

export type GoalDetail = {
  id: number; title: string; icon: string; status: string; version_no: number | null;
  version_status: string | null; start_date: string | null; end_date: string | null;
  readonly: boolean; total: number; done: number; rest: number; today: DayItem | null;
  missed: DayItem[]; upcoming: DayItem[]; past?: DayItem[];
};

export type NewGoal = {
  title: string; description?: string; icon?: string; source?: "chat" | "manual"; summary?: string;
  start_date: string; days: { title: string; detail?: string; tasks?: string[]; is_rest?: boolean }[];
};

export const ping = () => invoke<string>("ping");
export const getAppInfo = () => invoke<AppInfo>("get_app_info");
export const listGoals = (archived = false) => invoke<GoalSummary[]>("list_goals", { archived });
export const restoreGoal = (goalId: number) => invoke<void>("restore_goal", { goalId });
export const getGoalDetail = (goalId: number) => invoke<GoalDetail>("get_goal_detail", { goalId });
export const checkIn = (planDayId: number) => invoke<void>("check_in", { planDayId });
export const makeUpCheckIn = (planDayId: number) => invoke<void>("make_up_check_in", { planDayId });
export const undoCheckIn = (planDayId: number) => invoke<void>("undo_check_in", { planDayId });
export const saveDayNote = (planDayId: number, note: string) => invoke<string>("save_day_note", { planDayId, note });
export const swapPlanDays = (aId: number, bId: number) => invoke<void>("swap_plan_days", { aId, bId });
export const createGoalWithPlan = (goal: NewGoal) => invoke<number>("create_goal_with_plan", { goal });
export const archiveGoal = (goalId: number) => invoke<void>("archive_goal", { goalId });
export const importSampleGoal = () => invoke<number>("import_sample_goal");

/** "2026-10-14" -> "10月14日" */
export const md = (d: string) => `${Number(d.slice(5, 7))}月${Number(d.slice(8, 10))}日`;

// ---------- 设置 / 聊天 ----------
export type ProviderView = {
  id: string; name: string; base_url: string; models: string[]; max_tokens: number; key_url: string; has_key: boolean; key_mask: string | null; fetched_models: string[];
};
export type SettingsView = { provider: string; model: string; base_url: string; has_key: boolean; key_mask: string | null; providers: ProviderView[] };
export type DraftDay = { title: string; detail: string; tasks: string[]; is_rest: boolean };
export type DraftPlan = { title: string; summary: string; start_date: string; days_count: number; days: DraftDay[] };
export type ChatAttachment = { id: string; mime: string; name: string; data_url: string };
export type ChatImageIn = { mime: string; dataBase64: string; name?: string };
export type ChatMessage = {
  id: number; role: "user" | "assistant"; text: string; draft: DraftPlan | null;
  draft_error: string | null; confirmed_goal_id: number | null; confirmed_version: number | null;
  diff: DraftDiff | null; created_at: number; attachments: ChatAttachment[];
};
export type DraftDiff = {
  base_version: number; next_version: number; keep_past: number; old_remaining: number; new_remaining: number;
  old_end: string; new_end: string; changed: number; old_rest: number; new_rest: number;
};
export type ChatSession = {
  id: number; title: string; goal_id: number | null; goal_title: string | null; base_version: number | null; messages: ChatMessage[];
};

export const getSettings = () => invoke<SettingsView>("get_settings");
export const saveSettings = (provider: string, model: string, baseUrl: string, apiKey?: string) =>
  invoke<SettingsView>("save_settings", { provider, model, baseUrl, apiKey: apiKey || null }).then((v) => { requestStatusCheck(); return v; });
export const deleteApiKey = (provider: string) => invoke<void>("delete_api_key", { provider }).then(() => requestStatusCheck());

// ---------- 模型在线状态 ----------
export type ModelStatus = { state: string; reason: string; provider: string; model: string };
export const modelStatus = () => invoke<ModelStatus>("model_status");
/** 请求侧栏立即重新检测 */
export const requestStatusCheck = () => window.dispatchEvent(new CustomEvent("model-status-check"));
/** 聊天请求结果顺便上报状态：ok=true 表示成功；否则带错误文字 */
export const reportChatResult = (ok: boolean, err?: string) => window.dispatchEvent(new CustomEvent("model-status-report", { detail: { ok, err: err ?? "" } }));
export const testConnection = () => invoke<string>("test_connection");
export const chatGetSession = (sessionId?: number) => invoke<ChatSession>("chat_get_session", { sessionId: sessionId ?? null });
export const chatNewSession = (goalId?: number) => invoke<ChatSession>("chat_new_session", { goalId: goalId ?? null });
export const chatGoalSession = (goalId: number) => invoke<ChatSession>("chat_goal_session", { goalId });
export type StreamEvent = { kind: "delta" | "reasoning"; text: string };
const channel = (onDelta: (t: string) => void, onReason?: (t: string) => void) => {
  const ch = new Channel<StreamEvent>();
  ch.onmessage = (e) => { if (e.kind === "delta") onDelta(e.text); else if (e.kind === "reasoning") onReason?.(e.text); };
  return ch;
};
export const newStreamId = () => `s${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
export const chatSend = (sessionId: number, text: string | null, streamId: string, onDelta: (t: string) => void, onReason?: (t: string) => void, images?: ChatImageIn[]) =>
  invoke<ChatSession>("chat_send", { sessionId, text, images: images?.length ? images : null, streamId, onEvent: channel(onDelta, onReason) }).then(
    (v) => {
      const last = v.messages[v.messages.length - 1];
      if (last?.draft_error?.startsWith("NET:")) reportChatResult(false, "连接中断"); else reportChatResult(true);
      return v;
    },
    (e) => { reportChatResult(false, String(e)); throw e; },
  );
export const chatStop = (streamId: string) => invoke<void>("chat_stop", { streamId });
export type SessionItem = {
  id: number; title: string; goal_id: number | null; goal_title: string | null; updated_at: number; message_count: number; confirmed: boolean;
};
export const chatListSessions = () => invoke<SessionItem[]>("chat_list_sessions");
export const chatRenameSession = (sessionId: number, title: string) => invoke<void>("chat_rename_session", { sessionId, title });
export const chatDeleteSession = (sessionId: number) => invoke<void>("chat_delete_session", { sessionId });
export const confirmDraft = (messageId: number, fromTomorrow = false) => invoke<number>("confirm_draft", { messageId, fromTomorrow });
export const chatUndoDeleteSession = (sessionId: number) => invoke<void>("chat_undo_delete_session", { sessionId });
export const goalTodayChecked = (goalId: number) => invoke<boolean>("goal_today_checked", { goalId });
export const factoryReset = () => invoke<void>("factory_reset").then(() => requestStatusCheck());

// ---------- 版本 / 周复盘 ----------
export type VersionInfo = {
  version_no: number; status: string; source: string; summary: string; start_date: string; end_date: string;
  created_at: number; activated_at: number | null; total: number; done: number;
};
export type WeekCell = { date: string; weekday: string; state: "done" | "missed" | "today" | "future" | "none"; title: string | null; is_rest: boolean; day_index: number | null; note: string };
export type Review = {
  id: number; goal_id: number; week_start: string; done: number; due: number; missed: number;
  went_well: string; hard: string; next_plan: string; ai_comment: string | null; updated_at: number;
};
export type WeekView = {
  goal_id: number; goal_title: string; readonly: boolean; week_start: string; week_end: string; is_current: boolean;
  done: number; due: number; missed: number; cells: WeekCell[]; review: Review | null;
};
export type ReviewText = { went_well: string; hard: string; next_plan: string };

export const listVersions = (goalId: number) => invoke<VersionInfo[]>("list_versions", { goalId });
export const versionDays = (goalId: number, versionNo: number) => invoke<DayItem[]>("version_days", { goalId, versionNo });
export const weekView = (goalId: number, weekStart?: string) => invoke<WeekView>("week_view", { goalId, weekStart: weekStart ?? null });
export const saveReview = (goalId: number, weekStart: string, text: ReviewText) => invoke<Review>("save_review", { goalId, weekStart, text });
export const listReviews = (goalId: number) => invoke<Review[]>("list_reviews", { goalId });
export const reviewAi = (goalId: number, weekStart: string, text: ReviewText, streamId: string, onDelta: (t: string) => void) =>
  invoke<Review>("review_ai", { goalId, weekStart, text, streamId, onEvent: channel(onDelta) });

export type FinalDay = {
  date: string; weekday: string; state: string; title: string | null;
  is_rest: boolean; day_index: number | null; note: string;
};
export type FinalReview = {
  id: number; goal_id: number; done: number; due: number; missed: number; longest_streak: number;
  went_well: string; hard: string; next_plan: string; ai_comment: string | null; updated_at: number;
};
export type FinalView = {
  goal_id: number; goal_title: string; status: string; readonly: boolean;
  start_date: string | null; end_date: string | null;
  done: number; due: number; missed: number; longest_streak: number;
  days: FinalDay[]; review: FinalReview | null;
};
export const finalView = (goalId: number) => invoke<FinalView>("final_view", { goalId });
export const getFinalReview = (goalId: number) => invoke<FinalReview | null>("get_final_review", { goalId });
export const saveFinalReview = (goalId: number, text: ReviewText) => invoke<FinalReview>("save_final_review", { goalId, text });
export const generateFinalReview = (goalId: number, text: ReviewText, streamId: string, onDelta: (t: string) => void) =>
  invoke<FinalReview>("generate_final_review", { goalId, text, streamId, onEvent: channel(onDelta) });


/** "2026-10-12" 加 n 天 -> "YYYY-MM-DD" */
export const shiftDate = (d: string, n: number) => {
  const [y, m, dd] = d.split("-").map(Number);
  const t = new Date(y, m - 1, dd + n);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
};

// ---------- 备份 ----------
export type BackupInfo = {
  exported_at: string; app_version: string; schema_version: number;
  goals: number; plan_versions: number; checkins: number; chat_messages: number; weekly_reviews: number;
  final_reviews?: number; goal_reminders?: number; plan_templates?: number; backup_version?: number;
};
export const exportBackup = (path: string) => invoke<BackupInfo>("export_backup", { path });
export const inspectBackup = (path: string) => invoke<BackupInfo>("inspect_backup", { path });
export const importBackup = (path: string) => invoke<BackupInfo>("import_backup", { path });

// ---------- 提醒 ----------
export type GoalReminders = { goal_id: number; enabled: boolean; times: string[] };
export type ReminderSettings = { enabled: boolean; summary_enabled: boolean; summary_time: string; close_to_tray: boolean };
export const getGoalReminders = (goalId: number) => invoke<GoalReminders>("get_goal_reminders", { goalId });
export const saveGoalReminders = (goalId: number, enabled: boolean, times: string[]) => invoke<GoalReminders>("save_goal_reminders", { goalId, enabled, times });
export const getReminderSettings = () => invoke<ReminderSettings>("get_reminder_settings");
export const saveReminderSettings = (settings: ReminderSettings) => invoke<ReminderSettings>("save_reminder_settings", { settings });

// ---------- 统计 ----------
export type WeekPoint = { week_start: string; done: number; due: number; rate: number | null };
export type HeatCell = { date: string; done: number; due: number; level: number; rest: boolean; future: boolean };
export type GoalRank = { id: number; title: string; icon: string; status: string; done: number; due: number; rate: number | null; streak: number };
export type Stats = {
  today: string; current_streak: number; longest_streak: number; total_checkins: number; week: WeekPoint;
  overall_done: number; overall_due: number; overall_rate: number | null; trend: WeekPoint[]; heatmap: HeatCell[];
  ranking: GoalRank[]; goals: { id: number; title: string; status: string }[];
};
export const getStats = (goalId?: number | null) => invoke<Stats>("get_stats", { goalId: goalId ?? null });

// ---------- 模板 ----------
export type Template = {
  id: string; title: string; summary: string; icon: string; category: string; builtin: boolean; days_count: number; days: DraftDay[];
};
export const listTemplates = () => invoke<Template[]>("list_templates");
export const applyTemplate = (templateId: string, startDate: string) => invoke<number>("apply_template", { templateId, startDate });
export const saveGoalAsTemplate = (goalId: number, title?: string) => invoke<string>("save_goal_as_template", { goalId, title: title || null });
export const deleteTemplate = (templateId: string) => invoke<void>("delete_template", { templateId });
export const todayStr = () => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
};

// ---------- 天气 ----------
export type City = { name: string; admin: string; country: string; latitude: number; longitude: number };
export type WeatherSettings = { enabled: boolean; city: City };
export type Weather = {
  city: City; fetched_at: number; tip: string; stale: boolean; error: string | null;
  current: { time: string; temp: number; feels: number; code: number; text: string; icon: string; humidity: number; wind_kmh: number; wind_level: number; wind_dir: string; is_day: boolean };
  today: { max: number; min: number; precip_max: number; code: number; text: string; sunrise: string; sunset: string };
  hourly: { time: string; temp: number; code: number; text: string; icon: string; precip: number; aqi?: number | null }[];
  /** 国标 HJ 633-2012 实时 AQI；tone 1～6 对应优～严重污染 */
  aqi: { aqi: number; level: string; tone: number; primary: string[]; pm2_5: number | null } | null;
};
export const weatherGet = (force = false) => invoke<Weather | null>("weather_get", { force });
export const weatherGetSettings = () => invoke<WeatherSettings>("weather_get_settings");
export const weatherSaveSettings = (settings: WeatherSettings) => invoke<WeatherSettings>("weather_save_settings", { settings });
export const weatherSearchCity = (name: string) => invoke<City[]>("weather_search_city", { name });
export const fetchModels = (provider: string, baseUrl: string) => invoke<string[]>("fetch_models", { provider, baseUrl });

// ---------- 关闭窗口行为 ----------
export type CloseAction = "ask" | "tray" | "exit";
export const getCloseAction = () => invoke<CloseAction>("get_close_action");
export type UiTheme = "glass" | "brutal" | "clay" | "neu";
export const getUiTheme = () => invoke<UiTheme>("get_ui_theme");
export const setUiTheme = (theme: UiTheme) => invoke<UiTheme>("set_ui_theme", { theme });
export const setCloseAction = (action: CloseAction) => invoke<CloseAction>("set_close_action", { action });
export const closeWindowChoice = (action: "tray" | "exit", remember: boolean) => invoke<void>("close_window_choice", { action, remember });

// ---------- 数据库位置 ----------
export type DbLocation = { path: string; dir: string; default_dir: string; custom: boolean; missing: boolean };
export type DbMoveResult = { path: string; backup: string | null; replaced_backup: string | null; used_existing: boolean; note: string };
export type DbConflict = "ask" | "use_existing" | "overwrite";
export const DB_EXISTS = "DB_EXISTS:";
export const DB_MISSING = "DB_MISSING:";
export const dbLocation = () => invoke<DbLocation>("db_location");
export const dbChangeLocation = (dir: string, conflict: DbConflict = "ask") => invoke<DbMoveResult>("db_change_location", { dir, conflict });
export const dbRestoreDefault = (conflict: DbConflict = "ask") => invoke<DbMoveResult>("db_restore_default", { conflict });
export const dbRelink = (dir: string) => invoke<DbLocation>("db_relink", { dir });
export const dbUseDefault = () => invoke<DbLocation>("db_use_default");
export const dbOpenFolder = () => invoke<void>("db_open_folder");

// ---------- 动效 ----------
export const getReduceMotion = () => invoke<boolean>("get_reduce_motion");
export const setReduceMotion = (on: boolean) => invoke<boolean>("set_reduce_motion", { on });
export const celebrateOnce = (goalId: number, key: string) => invoke<boolean>("celebrate_once", { goalId, key });

export type AutostartStatus = {
  enabled: boolean;
  exe_path: string;
  is_dev_build: boolean;
  message: string | null;
};
export const getAutostart = () => invoke<AutostartStatus>("get_autostart");
export const setAutostart = (enabled: boolean) =>
  invoke<AutostartStatus>("set_autostart", { enabled });
