import { useEffect, useRef, useState } from "react";
import { askConfirm } from "../components/ConfirmDialog";
import { createPortal } from "react-dom";
import { KeyRound, Cpu, Link2, Activity, Save, PlugZap, Trash2, ShieldCheck, TriangleAlert, X, Download, Upload, DatabaseBackup, BellRing, Moon, Power, PanelBottomClose, Building2, ExternalLink, CloudSun, Search, MapPin, ChevronDown, Loader, Check, Palette, Database, FolderInput, FolderOpen, House, Sparkles } from "lucide-react";
import { NeonSelect } from "../components/NeonSelect";
import { THEMES, currentTheme, saveTheme } from "../lib/theme";
import type { UiTheme, DbLocation, DbMoveResult, DbConflict } from "../lib/tauri";
import { dbLocation, dbChangeLocation, dbRestoreDefault, dbOpenFolder, DB_EXISTS, DB_MISSING } from "../lib/tauri";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ChoiceDialog } from "../components/DbDialogs";
import { TimePicker } from "../components/TimePicker";
import { useAnchoredPos, useDismiss } from "../components/popover";
import { saveReduceMotion, userReduceMotion, useReduced } from "../lib/motion";
import { getAppInfo, getSettings, saveSettings, deleteApiKey, testConnection, factoryReset, exportBackup, inspectBackup, importBackup, type AppInfo, type SettingsView, type BackupInfo, getReminderSettings, saveReminderSettings, type ReminderSettings, weatherGetSettings, weatherSaveSettings, weatherSearchCity, type WeatherSettings, type City, fetchModels, getCloseAction, setCloseAction, type CloseAction, getAutostart, setAutostart, type AutostartStatus } from "../lib/tauri";
import { PROVINCE_OPTIONS, getCities, getDistricts, matchCitySelection, toWeatherCity } from "../lib/chinaCities";

function WeatherPanel() {
  const [ws, setWs] = useState<WeatherSettings | null>(null);
  const [prov, setProv] = useState("");
  const [city, setCity] = useState("");
  const [dist, setDist] = useState("");
  const [otherOpen, setOtherOpen] = useState(false);
  const [q, setQ] = useState("");
  const [res, setRes] = useState<City[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    weatherGetSettings()
      .then((s) => {
        setWs(s);
        const m = matchCitySelection(s.city);
        if (m) { setProv(m.province); setCity(m.city); setDist(m.district); }
      })
      .catch((e) => setMsg({ ok: false, text: String(e) }));
  }, []);

  const put = async (next: WeatherSettings, text?: string) => {
    setMsg(null);
    try { setWs(await weatherSaveSettings(next)); if (text) setMsg({ ok: true, text }); }
    catch (e) { setMsg({ ok: false, text: String(e) }); }
  };

  const applyCascade = (p: string, c: string, d: string) => {
    if (!ws || !p || !c || !d) return;
    const next = toWeatherCity(p, c, d);
    if (!next) return;
    put({ ...ws, city: next }, `已切换到 ${next.name}`);
  };

  const onProv = (v: string) => {
    setProv(v); setCity(""); setDist("");
  };
  const onCity = (v: string) => {
    setCity(v); setDist("");
  };
  const onDist = (v: string) => {
    setDist(v);
    applyCascade(prov, city, v);
  };

  const search = async () => {
    if (!q.trim()) return;
    setBusy(true); setMsg(null);
    try {
      const r = await weatherSearchCity(q);
      setRes(r);
      if (!r.length) setMsg({ ok: false, text: "没找到这个地名，换个写法试试（如「丰台」「东京」）" });
    } catch (e) { setMsg({ ok: false, text: String(e) }); }
    finally { setBusy(false); }
  };

  if (!ws) return null;
  const label = (c: City) => [c.name, c.admin, c.country].filter((x, i, a) => x && a.indexOf(x) === i).join(" · ");
  const cityOpts = getCities(prov).map((c) => ({ value: c.name, label: c.name }));
  const distOpts = getDistricts(prov, city).map((d) => ({ value: d.name, label: d.name }));

  return (
    <section className="glass neon-cyan panel">
      <div className="panel-title cyan-text"><CloudSun size={20} />天气</div>
      <label className="switch-row">
        <RowLabel icon={CloudSun} title="在目标页显示天气" desc={<>数据来自 Open-Meteo，免费免 Key；30 分钟内不重复请求，离线时显示上次结果</>} />
        <input type="checkbox" className="switch" checked={ws.enabled} onChange={(e) => put({ ...ws, enabled: e.target.checked })} />
      </label>
      <div className="muted"><MapPin size={14} /> 当前城市：<b className="cyan-text">{label(ws.city)}</b>（{ws.city.latitude.toFixed(2)}, {ws.city.longitude.toFixed(2)}）</div>
      <div className="city-cascade">
        <NeonSelect
          aria-label="省份"
          className="wide"
          value={prov}
          placeholder="选择省/直辖市"
          onChange={onProv}
          options={PROVINCE_OPTIONS}
        />
        <NeonSelect
          aria-label="城市"
          className="wide"
          value={city}
          placeholder="选择城市"
          disabled={!prov}
          onChange={onCity}
          options={cityOpts}
        />
        <NeonSelect
          aria-label="区县"
          className="wide"
          value={dist}
          placeholder="选择区/县"
          disabled={!city || distOpts.length === 0}
          onChange={onDist}
          options={distOpts}
        />
      </div>
      <button type="button" className="city-other-toggle muted" onClick={() => setOtherOpen((o) => !o)}>
        <ChevronDown size={14} className={otherOpen ? "rot" : ""} />
        {otherOpen ? "收起其他城市搜索" : "其他城市（联网搜索，备用）"}
      </button>
      {otherOpen && (
        <>
          <div className="city-search">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索国内外地名，如：东京、纽约"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) search(); }} />
            <button type="button" className="ghost-btn neon-cyan sm" disabled={busy || !q.trim()} onClick={search}><Search size={15} />{busy ? "搜索中…" : "搜索"}</button>
          </div>
          {res && res.length > 0 && (
            <div className="city-results">
              {res.map((c, i) => (
                <button key={i} type="button" className="city-item" onClick={() => {
                  setRes(null); setQ("");
                  const m = matchCitySelection(c);
                  if (m) { setProv(m.province); setCity(m.city); setDist(m.district); }
                  else { setProv(""); setCity(""); setDist(""); }
                  put({ ...ws, city: c }, `已切换到 ${c.name}`);
                }}>
                  <MapPin size={14} />{label(c)}<em>{c.latitude.toFixed(2)}, {c.longitude.toFixed(2)}</em>
                </button>
              ))}
            </div>
          )}
        </>
      )}
      {msg && <div className={msg.ok ? "ok-line" : "error-line"}>{msg.text}</div>}
    </section>
  );
}

function ReminderPanel() {
  const [rs, setRs] = useState<ReminderSettings | null>(null);
  const [auto, setAuto] = useState(false);
  const [autoInfo, setAutoInfo] = useState<AutostartStatus | null>(null);
  const [autoBusy, setAutoBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    getReminderSettings().then(setRs).catch((e) => setMsg({ ok: false, text: String(e) }));
    getAutostart().then((s) => { setAuto(s.enabled); setAutoInfo(s); })
      .catch((e) => setMsg({ ok: false, text: `读取开机自启状态失败：${String(e)}` }));
  }, []);
  const [ca, setCa] = useState<CloseAction | null>(null);
  useEffect(() => { getCloseAction().then(setCa).catch(() => setCa("ask")); }, []);
  const putClose = async (v: CloseAction) => {
    const old = ca; setCa(v);
    try { setCa(await setCloseAction(v)); } catch (e) { setCa(old); setMsg({ ok: false, text: String(e) }); }
  };
  const put = async (next: ReminderSettings) => {
    setRs(next); setMsg(null);
    try { setRs(await saveReminderSettings(next)); } catch (e) { setMsg({ ok: false, text: String(e) }); }
  };
  const toggleAuto = async (v: boolean) => {
    setMsg(null); setAutoBusy(true); const prev = auto; setAuto(v);
    try {
      const s = await setAutostart(v);
      setAuto(s.enabled); setAutoInfo(s);
      setMsg({ ok: true, text: s.message || (s.enabled ? "已开启开机自启" : "已关闭开机自启") });
    } catch (e) {
      setAuto(prev);
      setMsg({ ok: false, text: `设置开机自启失败：${String(e)}` });
    } finally { setAutoBusy(false); }
  };
  if (!rs) return null;
  return (
    <section className="glass neon-pink-soft panel">
      <div className="panel-title pink-text"><BellRing size={20} />打卡提醒</div>
      <label className="switch-row">
        <RowLabel icon={BellRing} title="启用提醒" desc={<>总开关；每个目标的提醒时间在目标详情页右上角「提醒」里设置</>} />
        <input type="checkbox" className="switch" checked={rs.enabled} onChange={(e) => put({ ...rs, enabled: e.target.checked })} />
      </label>
      <label className="switch-row">
        <RowLabel icon={Moon} title="睡前汇总提醒" desc={<>到点时列出今天还没打卡的目标（都打完了就不打扰）</>} />
        <TimePicker className="time-input" value={rs.summary_time} disabled={!rs.summary_enabled} aria-label="睡前汇总提醒时间"
          onChange={(v) => put({ ...rs, summary_time: v })} />
        <input type="checkbox" className="switch" checked={rs.summary_enabled} onChange={(e) => put({ ...rs, summary_enabled: e.target.checked })} />
      </label>
      <div className="switch-row">
        <RowLabel icon={PanelBottomClose} title="关闭窗口时" desc={<>点右上角关闭、任务栏关闭或 Alt+F4 时的行为。藏到托盘后仍会按时弹系统通知并打开窗口。</>} />
        <NeonSelect<CloseAction> aria-label="关闭窗口时" className="close-nsel" value={ca ?? "ask"} disabled={ca === null} onChange={putClose}
          options={[{ value: "ask", label: "每次询问" }, { value: "tray", label: "隐藏到托盘" }, { value: "exit", label: "退出程序" }]} />
      </div>
      <label className="switch-row">
        <RowLabel icon={Power} title="开机自动启动" desc={<>开机后静默运行在托盘并按时提醒；可在任务管理器「启动应用」里确认。{autoInfo?.is_dev_build ? "（当前是开发版，注册的是调试程序路径）" : ""}</>} />
        <input type="checkbox" className="switch" checked={auto} disabled={autoBusy} onChange={(e) => toggleAuto(e.target.checked)} />
      </label>
      {msg && <div className={msg.ok ? "ok-line" : "error-line"}>{msg.text}</div>}
    </section>
  );
}
import { save as saveDialog, open as openDialog } from "@tauri-apps/plugin-dialog";

const when = (s: string) => {
  const t = new Date(s);
  return isNaN(t.getTime()) ? s : `${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日 ${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
};
const counts = (b: BackupInfo) => `目标 ${b.goals} 个 · 计划版本 ${b.plan_versions} 个 · 打卡 ${b.checkins} 条 · 聊天消息 ${b.chat_messages} 条 · 周复盘 ${b.weekly_reviews} 条${b.plan_templates ? ` · 自建模板 ${b.plan_templates} 个` : ""}`;

function ImportDialog({ path, info, onClose, onDone }: { path: string; info: BackupInfo; onClose: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const go = async () => {
    setBusy(true); setErr("");
    try { await importBackup(path); onDone(); } catch (e) { setErr(String(e)); } finally { setBusy(false); }
  };
  return createPortal(
    <div className="modal-mask" onClick={busy ? undefined : onClose}>
      <div className="plan-modal danger-modal" onClick={(e) => e.stopPropagation()}>
        <header className="plan-head">
          <div><div className="plan-kicker danger-text"><TriangleAlert size={16} />导入备份</div><h2>用备份覆盖当前全部数据？</h2></div>
          <button type="button" className="icon-btn" title="关闭" disabled={busy} onClick={onClose}><X size={20} /></button>
        </header>
        <div className="plan-body">
          <p>当前的所有目标、计划版本、打卡、聊天记录、周复盘和模型设置都会被<b className="danger-text">替换</b>成备份里的内容，无法撤销。建议先「导出备份」保存一份当前数据。</p>
          <ul className="backup-info">
            <li><b>文件</b>{path}</li>
            <li><b>导出时间</b>{when(info.exported_at)}{info.app_version && ` · 应用 v${info.app_version}`}</li>
            <li><b>内容</b>{counts(info)}</li>
            <li><b>API Key</b>备份不含 Key，导入后本机已保存的 Key 保持不变</li>
          </ul>
          {err && <div className="error-line">{err}</div>}
        </div>
        <footer className="plan-foot">
          <button type="button" className="ghost-btn wide" disabled={busy} onClick={onClose}>取消</button>
          <button type="button" className="danger-btn wide" disabled={busy} onClick={go}><Upload size={18} />{busy ? "导入中…" : "覆盖并导入"}</button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

const PHRASE = "确认清空";

function ResetDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ok = text.trim() === PHRASE;
  const go = async () => {
    setBusy(true); setErr("");
    try { await factoryReset(); onDone(); } catch (e) { setErr(String(e)); setBusy(false); }
  };
  return createPortal(
    <div className="modal-mask" onClick={busy ? undefined : onClose}>
      <div className="danger-modal" onClick={(e) => e.stopPropagation()}>
        <header className="plan-head">
          <h2 className="danger-title"><TriangleAlert size={24} />恢复出厂设置</h2>
          <button type="button" className="icon-btn" disabled={busy} onClick={onClose}><X size={20} /></button>
        </header>
        <div className="danger-body">
          <p>将<b>永久清空</b>以下全部数据，<b>不可恢复</b>：</p>
          <ul>
            <li>所有目标与计划版本（含已归档）</li>
            <li>所有打卡、补打记录</li>
            <li>所有聊天会话与草案</li>
            <li>自建的计划模板（内置模板保留）</li>
            <li>天气城市和缓存（恢复为北京）</li>
            <li>模型设置（模型名、Base URL 恢复默认）</li>
            <li><b>会同时删除已保存的 API Key</b>（所有服务商）</li>
          </ul>
          <label className="field">
            <span>请输入「{PHRASE}」以继续</span>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={PHRASE} autoFocus />
          </label>
          {err && <div className="error-line">{err}</div>}
        </div>
        <footer className="plan-foot">
          <button type="button" className="ghost-btn wide" disabled={busy} onClick={onClose}>取消</button>
          <button type="button" className="danger-btn wide" disabled={!ok || busy} onClick={go}>
            <TriangleAlert size={18} />{busy ? "清空中…" : "清空全部数据"}
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

/** 模型名：只读输入 + 获取列表 + 下拉选择 */
function ModelPicker({ value, onChange, presets, fetched, editable, loading, onFetch }: {
  value: string; onChange: (v: string) => void; presets: string[]; fetched: string[]; editable: boolean; loading: boolean; onFetch: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const list = fetched.length ? fetched : presets;
  // 候选列表挂到 body（portal），fixed 定位贴着输入行，滚动跟随、点外部 / Esc 关闭
  const { pos } = useAnchoredPos(row, open, { estH: Math.min(list.length * 38 + 50, 320), matchWidth: true });
  useDismiss(open, [box, menu], () => setOpen(false));
  useEffect(() => { if (fetched.length) setHint(false); }, [fetched]);
  const toggle = () => {
    if (!list.length) { setHint(true); setTimeout(() => setHint(false), 2500); return; }
    setOpen((o) => !o);
  };
  return (
    <div className="model-picker" ref={box}>
      <div className="mp-row" ref={row}>
        <input value={value} readOnly={!editable} className={editable ? "" : "ro"}
          onChange={(e) => onChange(e.target.value)} onClick={() => { if (!editable) toggle(); }}
          placeholder={editable ? "手动输入模型名" : "点右侧获取模型列表后选择"} />
        <button type="button" className="mp-btn" title="获取模型列表" disabled={loading} onClick={onFetch}>
          {loading ? <Loader size={18} className="spin" /> : <Download size={18} />}
        </button>
        <button type="button" className={`mp-btn ${list.length ? "" : "dim"} ${open ? "on" : ""}`} title={list.length ? "选择模型" : "先点左边获取"} onClick={toggle}>
          <ChevronDown size={18} />
        </button>
      </div>
      {hint && <div className="mp-hint">先点左边的下载按钮获取模型列表</div>}
      {open && createPortal(
        <div className="mp-menu pop-solid" ref={menu} style={pos} onMouseDown={(e) => { if ((e.target as HTMLElement).closest(".mp-item")) e.preventDefault(); }}>
          <div className="mp-title">模型列表{!fetched.length && <small>（尚未获取，以下为预设候选）</small>}</div>
          <div className="mp-items">
            {list.map((m) => (
              <button key={m} type="button" className={`mp-item ${m === value ? "on" : ""}`} onClick={() => { onChange(m); setOpen(false); }}>
                <span>{m}</span>{m === value && <Check size={15} />}
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

/** 设置行左侧：图标与标题同行、垂直居中，说明文字缩进到图标右侧与标题左对齐 */
function RowLabel({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc?: ReactNode }) {
  return (
    <span className="row-label">
      <Icon size={16} className="row-ico" aria-hidden="true" />
      <b className="row-title">{title}</b>
      {desc && <small className="row-desc">{desc}</small>}
    </span>
  );
}

function MotionSwitch({ onErr }: { onErr: (e: string) => void }) {
  const eff = useReduced();
  const on = userReduceMotion();
  return (
    <label className="switch-row">
      <RowLabel icon={Sparkles} title="减少动画" desc={<>{!on && eff ? "系统已开启「减少动态效果」，已自动减少；" : ""}开启后动效几乎瞬间完成、不放彩带、背景静止</>} />
      <input type="checkbox" className="switch" checked={on} onChange={(e) => { saveReduceMotion(e.target.checked).catch((x) => onErr(String(x))); }} />
    </label>
  );
}

function ThemePanel() {
  const [cur, setCur] = useState<UiTheme>(currentTheme());
  const [err, setErr] = useState("");
  const pick = async (t: UiTheme) => {
    setCur(t); setErr("");
    try { await saveTheme(t); } catch (e) { setErr(`主题已切换，但保存失败：${String(e)}`); }
  };
  return (
    <section className="glass neon-cyan panel">
      <div className="panel-title cyan-text"><Palette size={20} />主题</div>
      <div className="theme-grid" role="radiogroup" aria-label="界面主题">
        {THEMES.map((t) => (
          <button key={t.id} type="button" role="radio" aria-checked={cur === t.id} className={`theme-card ${cur === t.id ? "on" : ""}`} onClick={() => pick(t.id)}>
            <span className="theme-sw" style={{ background: t.sw.bg }}>
              <i className="sw-side" style={{ background: t.sw.side, border: t.sw.border, borderRadius: t.sw.radius }} />
              <i className="sw-card" style={{ background: t.sw.card, border: t.sw.border, boxShadow: t.sw.shadow, borderRadius: t.sw.radius }}>
                <b style={{ background: t.sw.text }} /><b className="short" style={{ background: t.sw.text }} />
                <em style={{ background: t.sw.pri, borderRadius: t.sw.radius }} />
              </i>
            </span>
            <span className="theme-name">{cur === t.id && <Check size={14} />}{t.name}</span>
            <small className="theme-desc">{t.desc}</small>
          </button>
        ))}
      </div>
      <MotionSwitch onErr={setErr} />
      {err && <div className="error-line">{err}</div>}
    </section>
  );
}

function DbPanel({ info, onMoved }: { info: AppInfo | null; onMoved: (text: string) => void }) {
  const [loc, setLoc] = useState<DbLocation | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [conflict, setConflict] = useState<{ target: string; dir: string | null } | null>(null);
  const [askDefault, setAskDefault] = useState(false);
  const reload = () => dbLocation().then(setLoc).catch(() => {});
  useEffect(() => { reload(); }, [info]);
  const report = (r: DbMoveResult) => {
    const parts = [r.used_existing ? `已切换到该位置已有的数据库：${r.path}` : `数据库已迁移到：${r.path}`, r.note];
    if (r.replaced_backup) parts.push(`目标位置原来的数据库已改名备份为：${r.replaced_backup}`);
    setMsg({ ok: true, text: parts.join("\n") });
    reload();
    onMoved(r.used_existing ? "已切换数据库位置" : "数据库位置已更改");
  };
  // dir 为 null 表示恢复默认位置
  const doMove = async (dir: string | null, c: DbConflict) => {
    setBusy(true); setMsg(null);
    try {
      report(dir === null ? await dbRestoreDefault(c) : await dbChangeLocation(dir, c));
      setConflict(null);
    } catch (e) {
      const s = String(e);
      if (s.startsWith(DB_EXISTS)) setConflict({ target: s.slice(DB_EXISTS.length), dir });
      else { setConflict(null); setMsg({ ok: false, text: s.replace(DB_MISSING, "") }); }
    } finally { setBusy(false); }
  };
  const change = async () => {
    const dir = await openDialog({ directory: true, title: "选择新的数据库存放文件夹" });
    if (typeof dir === "string") doMove(dir, "ask");
  };
  const openFolder = () => dbOpenFolder().catch((e) => setMsg({ ok: false, text: String(e) }));
  return (
    <section className="glass panel">
      <div className="panel-title cyan-text"><Activity size={20} />运行状态</div>
      <div className="muted">{info ? <>{info.name} v{info.version} · 数据库：{info.db_ready ? "已就绪" : "未就绪"}</> : "…"}</div>
      <div className="field"><span><Database size={16} />数据库位置{loc && <small className="muted">　{loc.custom ? "自定义位置" : "默认位置"}</small>}</span>
        <code className="db-path">{loc?.path ?? info?.db_path ?? "…"}</code>
      </div>
      <div className="btn-row">
        <button type="button" className="ghost-btn neon-cyan" disabled={busy} onClick={change}><FolderInput size={18} />{busy ? "迁移中…" : "更改位置"}</button>
        <button type="button" className="ghost-btn" disabled={busy} onClick={openFolder}><FolderOpen size={18} />打开所在文件夹</button>
        {loc?.custom && <button type="button" className="ghost-btn neon-pink" disabled={busy} onClick={() => setAskDefault(true)}><House size={18} />恢复默认位置</button>}
      </div>
      {msg && <div className={msg.ok ? "ok-line pre" : "error-line pre"}>{msg.text}</div>}
      <div className="muted small">更改位置会先把数据完整复制到新文件夹并校验，确认无误后才切换；原文件不删除，改名为 .bak 留作备份。位置记录在应用数据目录的 config.json 里，备份文件中不包含路径。</div>
      {conflict && (
        <ChoiceDialog title={<><Database size={20} />目标位置已有数据库</>} busy={busy} onCancel={() => setConflict(null)}
          onPick={(k) => doMove(conflict.dir, k as DbConflict)}
          choices={[
            { key: "overwrite", label: "用当前数据覆盖", tone: "danger" },
            { key: "use_existing", label: "使用已有的那份数据", tone: "primary" },
          ]}>
          <p>这个文件夹里已经有一份数据库：<br /><code className="db-path">{conflict.target}</code></p>
          <p>「使用已有的那份数据」：直接切换过去，当前数据改名为 .bak 备份。<br />「用当前数据覆盖」：把当前数据复制过去，那份旧文件会先改名为 .replaced.bak，不会直接删除。</p>
        </ChoiceDialog>
      )}
      {askDefault && loc && (
        <ChoiceDialog title={<><House size={20} />恢复默认位置</>} busy={busy} onCancel={() => setAskDefault(false)}
          onPick={() => { setAskDefault(false); doMove(null, "ask"); }}
          choices={[{ key: "ok", label: "迁回默认位置", tone: "primary" }]}>
          <p>将把数据库从<br /><code className="db-path">{loc.path}</code><br />迁回默认位置<br /><code className="db-path">{loc.default_dir}</code></p>
          <p>当前位置的文件会改名为 .bak 保留。</p>
        </ChoiceDialog>
      )}
    </section>
  );
}

export function SettingsPage({ onReset }: { onReset: (text?: string) => void }) {
  const [imp, setImp] = useState<{ path: string; info: BackupInfo } | null>(null);
  const [bmsg, setBmsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [bbusy, setBbusy] = useState(false);
  const pad = (n: number) => String(n).padStart(2, "0");
  const doExport = async () => {
    setBmsg(null);
    const d = new Date();
    const path = await saveDialog({
      title: "导出备份",
      defaultPath: `目标计划助手备份-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.json`,
      filters: [{ name: "备份文件", extensions: ["json"] }],
    }).catch((e) => { setBmsg({ ok: false, text: String(e) }); return null; });
    if (!path) return;
    setBbusy(true);
    try { const info = await exportBackup(path); setBmsg({ ok: true, text: `已导出到 ${path}（${counts(info)}）` }); }
    catch (e) { setBmsg({ ok: false, text: String(e) }); } finally { setBbusy(false); }
  };
  const doImport = async () => {
    setBmsg(null);
    const path = await openDialog({ title: "选择备份文件", multiple: false, directory: false, filters: [{ name: "备份文件", extensions: ["json"] }] })
      .catch((e) => { setBmsg({ ok: false, text: String(e) }); return null; });
    if (!path || typeof path !== "string") return;
    setBbusy(true);
    try { setImp({ path, info: await inspectBackup(path) }); }
    catch (e) { setBmsg({ ok: false, text: `无法导入：${String(e)}` }); } finally { setBbusy(false); }
  };
  const [showReset, setShowReset] = useState(false);
  const [sv, setSv] = useState<SettingsView | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState("deepseek");
  const [model, setModel] = useState("deepseek-flash");
  const [baseUrl, setBaseUrl] = useState("https://api.deepseek.com");
  const [info, setInfo] = useState<AppInfo | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [mLoading, setMLoading] = useState(false);
  const [mFailed, setMFailed] = useState(false);
  const [fetchedMap, setFetchedMap] = useState<Record<string, string[]>>({});

  const apply = (v: SettingsView) => { setSv(v); setProvider(v.provider); setModel(v.model); setBaseUrl(v.base_url); };
  const pv = sv?.providers.find((p) => p.id === provider);
  const pick = (id: string) => {
    setProvider(id); setApiKey(""); setMsg(null); setMFailed(false);
    const p = sv?.providers.find((x) => x.id === id);
    if (!p) return;
    if (id === sv?.provider) { setModel(sv.model); setBaseUrl(sv.base_url); return; }
    if (p.base_url) setBaseUrl(p.base_url);
    else if (sv?.providers.some((x) => x.base_url === baseUrl)) setBaseUrl("https://");
    if (p.models[0]) setModel(p.models[0]);
  };
  useEffect(() => {
    getSettings().then(apply).catch((e) => setMsg({ ok: false, text: String(e) }));
    getAppInfo().then(setInfo).catch(() => {});
  }, []);

  const run = async (fn: () => Promise<string>) => {
    setBusy(true); setMsg(null);
    try { setMsg({ ok: true, text: await fn() }); } catch (e) { setMsg({ ok: false, text: String(e).replace(/^NO_KEY:/, "") }); } finally { setBusy(false); }
  };

  const fetched = fetchedMap[provider] ?? pv?.fetched_models ?? [];
  const doFetch = async () => {
    setMLoading(true); setMsg(null);
    try {
      // 输入框里有新 Key 先保存（Key 只在 Rust 里从凭据管理器读取）
      if (apiKey.trim()) { apply(await saveSettings(provider, model || "placeholder", baseUrl, apiKey.trim())); setApiKey(""); }
      const ids = await fetchModels(provider, baseUrl);
      setFetchedMap((m) => ({ ...m, [provider]: ids }));
      setMFailed(false);
      setMsg({ ok: true, text: `已获取 ${ids.length} 个模型，点右侧箭头选择` });
    } catch (e) {
      setMFailed(true);
      setMsg({ ok: false, text: `获取模型列表失败：${String(e).replace(/^NO_KEY:/, "")}（可暂时手动输入模型名）` });
    } finally { setMLoading(false); }
  };
  const save = () => run(async () => { apply(await saveSettings(provider, model, baseUrl, apiKey.trim() || undefined)); setApiKey(""); return `已保存，当前使用 ${pv?.name ?? provider}`; });
  const test = () => run(async () => { apply(await saveSettings(provider, model, baseUrl, apiKey.trim() || undefined)); setApiKey(""); return testConnection(); });
  const del = async () => { if (await askConfirm(`确定删除 ${pv?.name ?? ""} 的 API Key？`, { title: "删除 API Key", ok: "删除", danger: true })) run(async () => { await deleteApiKey(provider); const v = await getSettings(); setSv(v); return "已删除 API Key"; }); };

  return (
    <div className="page settings">
      <header className="page-head"><h1 className="page-title underline">设置</h1></header>
      <ThemePanel />
      <section className="glass neon-cyan panel">
        <div className="panel-title cyan-text"><Cpu size={20} />模型配置</div>
        <div className="field"><span><Building2 size={16} />服务商
          {pv?.key_url && <a className="key-link" href={pv.key_url} target="_blank" rel="noreferrer"><ExternalLink size={13} />获取 Key</a>}</span>
          <NeonSelect<string> aria-label="服务商" className="wide" value={provider} onChange={pick}
            options={(sv?.providers ?? []).map((p) => ({ value: p.id, label: p.name, badge: p.has_key ? "已存 Key" : undefined, badgeTone: "cyan" as const }))} />
        </div>
        <label className="field"><span><KeyRound size={16} />API Key
          {pv?.has_key && <em className="key-ok"><ShieldCheck size={14} />已保存 {pv.key_mask}</em>}</span>
          <input type="password" autoComplete="off" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
            placeholder={pv?.has_key ? "留空则保持不变；输入新 Key 可替换" : "粘贴该服务商的 Key（单独保存在 Windows 凭据管理器）"} />
        </label>
        <div className="field"><span><Cpu size={16} />模型名{(provider === "custom" || mFailed) && <small className="muted">　可手动输入</small>}</span>
          <ModelPicker value={model} onChange={setModel} presets={pv?.models ?? []} fetched={fetched}
            editable={provider === "custom" || mFailed} loading={mLoading} onFetch={doFetch} />
        </div>
        <label className="field"><span><Link2 size={16} />Base URL</span>
          <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
        </label>
        <div className="btn-row">
          <button type="button" className="checkin-btn small fit" disabled={busy} onClick={save}><Save size={20} />保存</button>
          <button type="button" className="ghost-btn neon-cyan" disabled={busy} onClick={test}><PlugZap size={18} />{busy ? "处理中…" : "测试连接"}</button>
          {pv?.has_key && <button type="button" className="ghost-btn neon-pink" disabled={busy} onClick={del}><Trash2 size={18} />删除 Key</button>}
        </div>
        {msg && <div className={msg.ok ? "ok-line" : "error-line"}>{msg.text}</div>}
        <div className="muted small">每家服务商的 Key 分别保存在本机 Windows 凭据管理器，不写入数据库、日志和备份，界面只显示掩码。单次回复上限 {pv?.max_tokens ?? "-"} tokens（按服务商设置）。</div>
      </section>
      <ReminderPanel />
      <WeatherPanel />
      <DbPanel info={info} onMoved={(t) => { getAppInfo().then(setInfo).catch(() => {}); onReset(t); }} />
      <section className="glass neon-cyan panel">
        <div className="panel-title cyan-text"><DatabaseBackup size={20} />备份与恢复</div>
        <div className="muted">把全部目标、计划版本、打卡、聊天、周复盘、提醒、自建模板和模型设置导出为一个 JSON 文件；不包含 API Key。</div>
        <div className="btn-row">
          <button type="button" className="ghost-btn neon-cyan" disabled={bbusy} onClick={doExport}><Download size={18} />导出备份</button>
          <button type="button" className="ghost-btn neon-pink" disabled={bbusy} onClick={doImport}><Upload size={18} />导入备份</button>
        </div>
        {bmsg && <div className={bmsg.ok ? "ok-line" : "error-line"}>{bmsg.text}</div>}
      </section>
      <section className="glass panel danger-zone">
        <div className="panel-title danger-text"><TriangleAlert size={20} />危险区</div>
        <div className="danger-row">
          <div className="muted">清空所有目标、计划、打卡、聊天记录和模型设置，并删除已保存的 API Key，回到刚安装时的状态。</div>
          <button type="button" className="danger-btn" onClick={() => setShowReset(true)}><TriangleAlert size={18} />恢复出厂设置</button>
        </div>
      </section>
      {imp && <ImportDialog path={imp.path} info={imp.info} onClose={() => setImp(null)} onDone={() => { setImp(null); onReset("已导入备份"); }} />}
      {showReset && <ResetDialog onClose={() => setShowReset(false)} onDone={() => { setShowReset(false); setApiKey(""); setMsg(null); setFetchedMap({}); setMFailed(false); getSettings().then(apply).catch(() => {}); onReset(); }} />}
    </div>
  );
}
