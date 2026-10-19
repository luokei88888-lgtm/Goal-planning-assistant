import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useRoll, confetti, celebrateToast } from "../lib/motion";
import { TimePicker } from "../components/TimePicker";
import { createPortal } from "react-dom";
import { Activity, RefreshCw, CalendarCheck, History, X, CircleCheck, CloudRain, Sparkles, Lock, ChevronLeft, Undo2, Archive, Coffee, ArchiveRestore, Bell, BellOff, Plus, Trash2, BookmarkPlus, Trophy, ClipboardPen, Bot } from "lucide-react";
import { getGoalDetail, checkIn, undoCheckIn, makeUpCheckIn, saveDayNote, archiveGoal, restoreGoal, md, listVersions, versionDays, type GoalDetail, type VersionInfo, type DayItem, getGoalReminders, saveGoalReminders, type GoalReminders, saveGoalAsTemplate, getStats, celebrateOnce, todayStr, getFinalReview, type FinalReview } from "../lib/tauri";

function ReminderModal({ goalId, title, onClose, onSaved }: { goalId: number; title: string; onClose: () => void; onSaved: (r: GoalReminders) => void }) {
  const [on, setOn] = useState(false);
  const [times, setTimes] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    getGoalReminders(goalId).then((r) => { setOn(r.enabled); setTimes(r.times.length ? r.times : ["20:00"]); }).catch((e) => setErr(String(e)));
  }, [goalId]);
  const save = async () => {
    setBusy(true); setErr("");
    try { onSaved(await saveGoalReminders(goalId, on, times.filter((t) => t))); } catch (e) { setErr(String(e)); } finally { setBusy(false); }
  };
  return createPortal(
    <div className="modal-mask" onClick={onClose}>
      <div className="plan-modal remind-modal" onClick={(e) => e.stopPropagation()}>
        <header className="plan-head">
          <div><div className="plan-kicker"><Bell size={16} />打卡提醒</div><h2>{title}</h2></div>
          <button type="button" className="icon-btn" title="关闭" onClick={onClose}><X size={20} /></button>
        </header>
        <div className="plan-body">
          <label className="switch-row">
            <span>开启提醒<small>到点且今天有计划、不是休息日、还没打卡时，弹 Windows 通知；每个时间当天只提醒一次</small></span>
            <input type="checkbox" className="switch" checked={on} onChange={(e) => setOn(e.target.checked)} />
          </label>
          <div className={`time-list ${on ? "" : "off"}`}>
            {times.map((t, i) => (
              <div key={i} className="time-item">
                <Bell size={16} />
                <TimePicker value={t} disabled={!on} aria-label={`提醒时间 ${i + 1}`} onChange={(v) => setTimes(times.map((x, k) => (k === i ? v : x)))} />
                {times.length > 1 && <button type="button" className="icon-plain" title="删除" onClick={() => setTimes(times.filter((_, k) => k !== i))}><Trash2 size={16} /></button>}
              </div>
            ))}
            {times.length < 6 && <button type="button" className="ghost-btn neon-cyan sm" onClick={() => setTimes([...times, "21:00"])}><Plus size={16} />添加时间</button>}
          </div>
          <div className="muted small">电脑睡眠错过提醒时间超过 30 分钟就不再补发。全局开关在「设置」里。</div>
          {err && <div className="error-line">{err}</div>}
        </div>
        <footer className="plan-foot">
          <button type="button" className="ghost-btn wide" onClick={onClose}>取消</button>
          <button type="button" className="checkin-btn small" disabled={busy} onClick={save}>保存</button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

/** 每日备注：与打卡独立；今天/漏打可写，未来不可写。 */
function useDayNoteApi(
  dayId: number, note: string, readonly: boolean | undefined,
  onSaved: () => void, onError: (e: string) => void,
) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<"saved" | "deleted" | null>(null);
  const skipBlur = useRef(false);
  const flashTimer = useRef<number | null>(null);
  useEffect(() => { setText(note); setEditing(false); }, [note, dayId]);
  useEffect(() => () => { if (flashTimer.current) window.clearTimeout(flashTimer.current); }, []);
  const showFlash = (kind: "saved" | "deleted") => {
    setFlash(kind);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlash(null), 1600);
  };
  const flashLabel = flash === "deleted" ? "已删除" : flash === "saved" ? "已保存" : null;
  const hasNote = Boolean(note.trim());
  const save = async (closeAfter = true) => {
    if (readonly || busy) return;
    if (text.trim() === note.trim()) {
      if (closeAfter) setEditing(false);
      if (text.trim()) showFlash("saved");
      return;
    }
    setBusy(true);
    try {
      const saved = await saveDayNote(dayId, text);
      setText(saved);
      onSaved();
      if (closeAfter) setEditing(false);
      showFlash(saved.trim() ? "saved" : "deleted");
    } catch (e) { onError(String(e)); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    if (readonly || busy || !note.trim()) return;
    if (!confirm("确定删除这条备注？")) return;
    setBusy(true);
    try {
      await saveDayNote(dayId, "");
      setText("");
      setEditing(false);
      onSaved();
      showFlash("deleted");
    } catch (e) { onError(String(e)); }
    finally { setBusy(false); }
  };
  const cancel = () => {
    skipBlur.current = true;
    setText(note);
    setEditing(false);
    setFlash(null);
  };
  const startEdit = () => {
    setText(note);
    setEditing(true);
    setFlash(null);
  };
  return {
    note, text, setText, editing, busy, flash, setFlash, flashLabel, hasNote, readonly: Boolean(readonly),
    skipBlur, save, remove, cancel, startEdit,
  };
}

type DayNoteApi = ReturnType<typeof useDayNoteApi>;
const DayNoteCtx = createContext<DayNoteApi | null>(null);

function DayNoteProvider({
  dayId, note, readonly, onSaved, onError, children,
}: {
  dayId: number; note: string; readonly?: boolean;
  onSaved: () => void; onError: (e: string) => void; children: ReactNode;
}) {
  const api = useDayNoteApi(dayId, note, readonly, onSaved, onError);
  return <DayNoteCtx.Provider value={api}>{children}</DayNoteCtx.Provider>;
}

function DayNoteBody({ compact }: { compact?: boolean }) {
  const api = useContext(DayNoteCtx);
  if (!api) return null;
  const { note, text, setText, editing, busy, flash, setFlash, flashLabel, hasNote, readonly, skipBlur, save, remove, cancel, startEdit } = api;

  if (readonly) {
    if (!hasNote) return null;
    return (
      <div className={`day-note-row ${compact ? "compact" : "in-today"} readonly`}>
        <span className="day-note-label">备注</span>
        <span className="day-note-body" title={note}>{note}</span>
      </div>
    );
  }

  if (!editing) {
    if (!hasNote) return null;
    return (
      <div className={`day-note-row ${compact ? "compact" : "in-today"}`}>
        <span className="day-note-label">备注</span>
        <span className="day-note-body" title={note}>{note}</span>
        <span className="day-note-ops">
          <button type="button" className="day-note-edit" onClick={startEdit}>编辑</button>
          <button type="button" className="day-note-del" disabled={busy} onClick={() => void remove()}>删除</button>
          {flashLabel && <span className="day-note-flash">{flashLabel}</span>}
        </span>
      </div>
    );
  }

  return (
    <div className={`day-note-box ${compact ? "compact" : "in-today"}`}>
      <textarea
        className="day-note-input"
        rows={compact ? 2 : 3}
        maxLength={500}
        autoFocus
        placeholder="今天没完全按计划？写一句说明，方便以后回顾"
        value={text}
        onChange={(e) => { setText(e.target.value); setFlash(null); }}
        onBlur={() => {
          if (skipBlur.current) { skipBlur.current = false; return; }
          void save(true);
        }}
      />
      <div className="day-note-actions">
        <span className="day-note-count">{text.length}/500</span>
        <div className="day-note-btns">
          {hasNote && (
            <button
              type="button"
              className="day-note-del"
              disabled={busy}
              onMouseDown={() => { skipBlur.current = true; }}
              onClick={() => void remove()}
            >
              删除
            </button>
          )}
          <button
            type="button"
            className="day-note-cancel"
            disabled={busy}
            onMouseDown={() => { skipBlur.current = true; }}
            onClick={cancel}
          >
            取消
          </button>
          <button
            type="button"
            className={`day-note-save ${flash === "saved" ? "on" : ""}`}
            disabled={busy}
            onMouseDown={() => { skipBlur.current = true; }}
            onClick={() => void save(true)}
          >
            {busy ? "保存中…" : flash === "saved" ? "已保存" : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DayNoteWriteLink({ compact }: { compact?: boolean }) {
  const api = useContext(DayNoteCtx);
  if (!api || api.readonly || api.editing || api.hasNote) return null;
  return (
    <div className={`day-note-idle ${compact ? "compact" : "in-foot"}`}>
      <button type="button" className="day-note-write" onClick={api.startEdit}>＋ 写备注</button>
      {api.flashLabel && <span className="day-note-flash">{api.flashLabel}</span>}
    </div>
  );
}

/** compact：漏打行；今天卡用 DayNoteProvider + DayNoteBody + DayNoteWriteLink */
function DayNoteEditor({
  dayId, note, readonly, compact, onSaved, onError,
}: {
  dayId: number; note: string; readonly?: boolean; compact?: boolean;
  onSaved: () => void; onError: (e: string) => void;
}) {
  return (
    <DayNoteProvider dayId={dayId} note={note} readonly={readonly} onSaved={onSaved} onError={onError}>
      <DayNoteBody compact={compact} />
      <DayNoteWriteLink compact={compact} />
    </DayNoteProvider>
  );
}


function VersionsModal({ goalId, onClose }: { goalId: number; onClose: () => void }) {
  const [list, setList] = useState<VersionInfo[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [days, setDays] = useState<DayItem[]>([]);
  const [err, setErr] = useState("");
  useEffect(() => {
    listVersions(goalId).then((l) => { setList(l); if (l[0]) setSel(l[0].version_no); }).catch((e) => setErr(String(e)));
  }, [goalId]);
  useEffect(() => { if (sel !== null) versionDays(goalId, sel).then(setDays).catch((e) => setErr(String(e))); }, [goalId, sel]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const cur = list.find((v) => v.version_no === sel);
  return createPortal(
    <div className="modal-mask" onClick={onClose}>
      <div className="plan-modal" onClick={(e) => e.stopPropagation()}>
        <header className="plan-head">
          <div><div className="plan-kicker"><History size={16} />版本历史 · 只读</div><h2>共 {list.length} 个版本</h2></div>
          <button type="button" className="icon-btn" title="关闭" onClick={onClose}><X size={20} /></button>
        </header>
        {err && <div className="error-line">{err}</div>}
        <div className="ver-tabs">
          {list.map((v) => (
            <button key={v.version_no} type="button" className={`ver-tab ${v.version_no === sel ? "on" : ""} ${v.status === "active" ? "live" : ""}`}
              onClick={() => setSel(v.version_no)}>
              v{v.version_no}<small>{v.status === "active" ? "生效中" : "已归档"}</small>
            </button>
          ))}
        </div>
        {cur && (
          <div className="plan-meta">
            <div><b>周期</b>{md(cur.start_date)} 至 {md(cur.end_date)} · {cur.total} 天 · 已打卡 {cur.done} 天</div>
            <div><b>来源</b>{cur.source === "chat" ? "聊天生成" : "手动/示例"} · 生效于 {ts(cur.activated_at ?? cur.created_at)}</div>
            {cur.summary && <div><b>说明</b>{cur.summary}</div>}
          </div>
        )}
        <div className="plan-body">
          {days.map((x) => (
            <div key={x.id} className={`plan-day ${x.is_rest ? "rest" : ""}`}>
              <div className="pd-left"><div className="pd-n">第{x.day_index}天</div><div className="pd-date">{md(x.date)}</div></div>
              <div className="pd-main">
                <div className="pd-title">{x.is_rest && <Coffee size={15} />}{x.title}{x.is_rest && <em>休息日</em>}
                  {x.checked && <span className="ck-tag">{x.kind === "make_up" ? "补打" : "已打卡"}</span>}</div>
                {x.detail && <div className="pd-detail">{x.detail}</div>}
                {x.note && <div className="pd-note"><span>备注</span>{x.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** 按日历差算相对解锁文案：明天→明日，后天→后日，其余用绝对日期。勿用列表下标（计划若从后天起，第1项不是「明日」）。 */
type Props = {
  goalId: number;
  onBack: () => void;
  onRevise: () => void;
  onReview: () => void;
  onFinalReview: () => void;
};

const ts = (s: number) => {
  const t = new Date(s * 1000);
  return `${t.getMonth() + 1}月${t.getDate()}日 ${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
};

const unlockText = (date: string) => {
  const today = todayStr();
  const [y, m, d] = today.split("-").map(Number);
  const [Y, M, D] = date.split("-").map(Number);
  const days = Math.round((Date.UTC(Y, M - 1, D) - Date.UTC(y, m - 1, d)) / 86400000);
  if (days === 1) return "明日解锁";
  if (days === 2) return "后日解锁";
  return `${md(date)}解锁`;
};

export function GoalDetailPage({ goalId, onBack, onRevise, onReview, onFinalReview }: Props) {
  const [showVers, setShowVers] = useState(false);
  const [rem, setRem] = useState<GoalReminders | null>(null);
  const [showRem, setShowRem] = useState(false);
  useEffect(() => { getGoalReminders(goalId).then(setRem).catch(() => {}); }, [goalId]);
  const [d, setD] = useState<GoalDetail | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const saveTpl = async () => {
    if (!d) return;
    const name = window.prompt("模板名称（以后可在「模板库」里一键使用）", d.title);
    if (name === null) return;
    setError(""); setOkMsg("");
    try { await saveGoalAsTemplate(goalId, name); setOkMsg(`已存为模板「${name.trim() || d.title}」，可在目标页「模板库」查看`); }
    catch (e) { setError(String(e)); }
  };

  const [sum, setSum] = useState<{ done: number; due: number; rate: number | null; longest: number } | null>(null);
  const [finalRv, setFinalRv] = useState<FinalReview | null>(null);
  const load = useCallback(() => getGoalDetail(goalId).then((x) => {
    setD(x);
    if (x.status === "completed" || x.status === "archived") {
      getFinalReview(goalId).then(setFinalRv).catch(() => setFinalRv(null));
    } else setFinalRv(null);
    if (x.status === "completed") {
      // 完成总结：完成率（不含休息日）与最长连续，来自统计
      getStats(goalId).then((s) => {
        const r = s.ranking.find((y) => y.id === goalId);
        setSum(r ? { done: r.done, due: r.due, rate: r.rate, longest: s.longest_streak } : null);
      }).catch(() => setSum(null));
    } else setSum(null);
  }).catch((e) => setError(String(e))), [goalId]);
  useEffect(() => { load(); }, [load]);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true); setError("");
    try { await fn(); await load(); } catch (e) { setError(String(e)); } finally { setBusy(false); }
  };

  // 动效：完成数 / 百分比滚动、勾选弹跳、里程碑庆祝
  const dueTotal = d ? Math.max(0, d.total - (d.rest ?? 0)) : 0;
  const rawPct = dueTotal ? Math.round((d!.done / dueTotal) * 100) : 0;
  const doneN = useRoll(d ? d.done : -1, 500);
  const pctN = useRoll(d ? rawPct : -1, 500);
  const [pop, setPop] = useState(0);
  const barInit = useRef(true);
  useEffect(() => { if (d) { const t = requestAnimationFrame(() => { barInit.current = false; }); return () => cancelAnimationFrame(t); } }, [d]);
  const doCheckIn = (id: number) => run(async () => {
    await checkIn(id);
    setPop((p) => p + 1);
    try {
      const [x, s] = await Promise.all([getGoalDetail(goalId), getStats(goalId)]);
      const keys: [string, string][] = [];
      const due = Math.max(0, x.total - (x.rest ?? 0));
      if (due > 0 && x.done >= due) keys.push(["all_done", "🏆 目标全部完成，了不起！"]);
      const st = s.current_streak;
      if ([7, 14, 21, 30].includes(st)) keys.push([`streak${st}`, `🎉 连续打卡 ${st} 天，太棒了！`]);
      for (const [k, text] of keys) {
        if (await celebrateOnce(goalId, k)) { confetti(); celebrateToast(text); break; }
      }
    } catch { /* 庆祝失败不影响打卡 */ }
  });

  if (!d) return <div className="page">{error ? <div className="error-line">{error}</div> : <div className="muted">加载中…</div>}</div>;

  const pct = rawPct;
  const t = d.today;
  const ro = d.readonly;

  return (
    <div className="page detail">
      <header className="gd-head">
        <div className="gd-title-row">
          <button type="button" className="gd-btn gd-back" onClick={onBack} title="返回目标"><ChevronLeft size={16} />返回</button>
          <h1 className="page-title gd-title">{d.title}</h1>
          {d.version_no && (
            <button type="button" title="查看版本历史" onClick={() => setShowVers(true)} className={`ver-pill clickable gd-pill ${ro ? "neon-cyan" : "neon-pink"}`}><Activity size={16} />v{d.version_no}{ro ? "已归档" : "生效"}<History size={14} /></button>
          )}
        </div>
        <div className="gd-actions">
          {!ro && d.status !== "completed" && (
            <button type="button" className={`gd-btn ${rem?.enabled ? "on" : ""}`} title={rem?.enabled ? `打卡提醒 ${rem.times.join(" ")}` : "打卡提醒"} onClick={() => setShowRem(true)}>
              {rem?.enabled ? <Bell size={16} /> : <BellOff size={16} />}<span className="gd-lbl">{rem?.enabled ? `提醒 ${rem.times.join(" ")}` : "提醒"}</span>
            </button>
          )}
          <button type="button" className="gd-btn" title="周复盘" onClick={onReview}><CalendarCheck size={16} /><span className="gd-lbl">周复盘</span></button>
          {d.status === "archived" && finalRv && (
            <button type="button" className="gd-btn" title="查看最终总结" onClick={onFinalReview}><ClipboardPen size={16} /><span className="gd-lbl">最终总结</span></button>
          )}
          <button type="button" className="gd-btn" title="把当前方案存为模板" onClick={saveTpl}><BookmarkPlus size={16} /><span className="gd-lbl">存为模板</span></button>
          {!ro && <button type="button" className="gd-btn primary" title="改方案" onClick={onRevise}><RefreshCw size={16} /><span className="gd-lbl">改方案</span></button>}
          {d.status === "archived" && (
            <button type="button" className="gd-btn primary" title="恢复目标" disabled={busy}
              onClick={() => { if (confirm("恢复后目标回到「进行中」，最新版本重新生效，可以继续打卡。确定恢复？")) run(() => restoreGoal(goalId)); }}>
              <ArchiveRestore size={16} /><span className="gd-lbl">恢复</span>
            </button>
          )}
          {!ro && (
            <button type="button" className="gd-btn weak gd-end" title="归档目标（只读保留记录）" disabled={busy}
              onClick={() => { if (confirm("归档后只能查看、不能再打卡，打卡记录会保留。确定归档？")) run(async () => { await archiveGoal(goalId); onBack(); }); }}>
              <Archive size={16} /><span className="gd-lbl">归档</span>
            </button>
          )}
        </div>
      </header>

      {error && <div className="error-line">{error}</div>}
      {okMsg && <div className="ok-line">{okMsg}</div>}
      {showRem && <ReminderModal goalId={goalId} title={d.title} onClose={() => setShowRem(false)} onSaved={(r) => { setRem(r); setShowRem(false); }} />}
      {showVers && <VersionsModal goalId={goalId} onClose={() => setShowVers(false)} />}

      {d.status === "archived" && finalRv && (finalRv.went_well || finalRv.hard || finalRv.next_plan || finalRv.ai_comment) && (
        <section className="fr-card-summary glass" style={{ margin: "0 0 12px" }}>
          {finalRv.went_well && <div className="fr-card-line"><span>做得好</span>{finalRv.went_well}</div>}
          {finalRv.hard && <div className="fr-card-line"><span>卡在哪</span>{finalRv.hard}</div>}
          {finalRv.next_plan && <div className="fr-card-line"><span>下次改</span>{finalRv.next_plan}</div>}
          {finalRv.ai_comment && <div className="fr-card-ai"><Bot size={16} />{finalRv.ai_comment}</div>}
          <button type="button" className="ghost-btn neon-cyan fr-entry" onClick={onFinalReview}>
            <ClipboardPen size={18} />查看最终总结
          </button>
        </section>
      )}

      <section className={`today-card ${d.status === "completed" ? "completed" : ""}`}>
        {d.status === "completed" ? (
          <div className="done-summary">
            <div className="today-date"><span className="done-badge big"><Trophy size={15} />已完成</span><span>{d.start_date && d.end_date ? `${md(d.start_date)} – ${md(d.end_date)}` : ""}</span></div>
            <h2 className="today-task"><Trophy size={34} className="green-text" /> 计划已全部结束</h2>
            <div className="done-kpis">
              <div><b>{sum ? `${sum.done}/${sum.due}` : `${d.done}/${dueTotal}`}</b><span>行动日</span></div>
              <div><b className="green-text">{sum?.rate != null ? `${Math.round(sum.rate * 100)}%` : `${pct}%`}</b><span>完成率</span></div>
              <div><b>{sum ? sum.longest : "–"}<small>天</small></b><span>最长连续</span></div>
            </div>
            <p className="today-note">{d.missed.length ? `还有 ${d.missed.length} 天漏打，可以在下方补打。` : "每一天都完成了，太棒了！"}想继续？用「改方案」延长计划会回到进行中。</p>
            {finalRv && (finalRv.went_well || finalRv.hard || finalRv.next_plan || finalRv.ai_comment) && (
              <div className="fr-card-summary">
                {finalRv.went_well && <div className="fr-card-line"><span>做得好</span>{finalRv.went_well}</div>}
                {finalRv.hard && <div className="fr-card-line"><span>卡在哪</span>{finalRv.hard}</div>}
                {finalRv.next_plan && <div className="fr-card-line"><span>下次改</span>{finalRv.next_plan}</div>}
                {finalRv.ai_comment && <div className="fr-card-ai"><Bot size={16} />{finalRv.ai_comment}</div>}
              </div>
            )}
            <button type="button" className="ghost-btn neon-cyan fr-entry" onClick={onFinalReview}>
              <ClipboardPen size={18} />{finalRv ? "查看 / 编辑最终总结" : "写最终总结"}
            </button>
          </div>
        ) : t ? (
          <>
            <div className="today-date"><span>{md(t.date)} 第{t.day_index}天{t.is_rest ? " · 休息日" : ""}</span></div>
            <h2 className="today-task">{t.title}</h2>
            <p className="today-note">{t.detail || " "}</p>
            {ro ? (
              <div className="muted">归档版本只读{t.checked ? " · 当天已完成" : ""}</div>
            ) : t.is_rest ? (
              <div className="muted">今天是休息日，不用打卡{t.checked ? " · 若误打可撤销" : ""}
                {t.checked && (
                  <button type="button" className="mini-btn" style={{ marginLeft: 8 }} disabled={busy}
                    onClick={() => run(() => undoCheckIn(t.id))}>撤销</button>
                )}
              </div>
            ) : (
              <button type="button" className={`checkin-btn ${t.checked ? "done" : ""}`} disabled={busy}
                title={t.checked ? "再点一次可撤销今天的打卡" : undefined}
                onClick={() => (t.checked ? run(() => undoCheckIn(t.id)) : doCheckIn(t.id))}>
                {t.checked
                  ? <>今天已打<span key={pop} className={pop ? "m-pop" : ""}><CircleCheck size={26} /></span><Undo2 size={18} className="undo-hint" /></>
                  : <>完成今天<CircleCheck size={30} /></>}
              </button>
            )}
          </>
        ) : (
          <>
            <div className="today-date"><span>今天</span></div>
            <h2 className="today-task"><Coffee size={34} /> 今天没有计划</h2>
            <p className="today-note">
              {d.start_date && d.end_date ? `计划周期 ${d.start_date} 至 ${d.end_date}` : "这个目标还没有生效的计划"}
            </p>
          </>
        )}
        {t && d.status !== "completed" ? (
          <DayNoteProvider
            dayId={t.id}
            note={t.note || ""}
            readonly={ro}
            onSaved={() => { setError(""); void load(); }}
            onError={(e) => { setOkMsg(""); setError(e); }}
          >
            <div className="progress-box">
              <div className="progress-row">
                <span>
                  总进度 · 已完成 {doneN} / {dueTotal} 个行动日
                  <span className="muted progress-cycle"> · 周期共 {d.total} 天{(d.rest ?? 0) > 0 ? `（含休息 ${d.rest} 天）` : ""}</span>
                </span>
                <span>{pctN}%</span>
              </div>
              <div className="bar big"><span className={`fill-cyan m-fill ${barInit.current ? "m-init" : ""}`} style={{ ["--p" as string]: pct / 100 }} /></div>
              <DayNoteBody />
              <div className="progress-foot">
                <span className="pink-text"><CloudRain size={20} />漏打 {d.missed.length}</span>
                <span className="divider" />
                <span className="muted">{d.upcoming.length ? `接下来 ${d.upcoming.length} 天` : "没有后续日程"}</span>
                <DayNoteWriteLink />
              </div>
            </div>
          </DayNoteProvider>
        ) : (
          <div className="progress-box">
            <div className="progress-row">
              <span>
                总进度 · 已完成 {doneN} / {dueTotal} 个行动日
                <span className="muted progress-cycle"> · 周期共 {d.total} 天{(d.rest ?? 0) > 0 ? `（含休息 ${d.rest} 天）` : ""}</span>
              </span>
              <span>{pctN}%</span>
            </div>
            <div className="bar big"><span className={`fill-cyan m-fill ${barInit.current ? "m-init" : ""}`} style={{ ["--p" as string]: pct / 100 }} /></div>
            <div className="progress-foot">
              <span className="pink-text"><CloudRain size={20} />漏打 {d.missed.length}</span>
              <span className="divider" />
              <span className="muted">{d.upcoming.length ? `接下来 ${d.upcoming.length} 天` : "没有后续日程"}</span>
            </div>
          </div>
        )}
      </section>

      <div className="scroll-area m-stagger">
        {d.missed.length > 0 && (
          <>
            <div className="section-label pink-text"><CloudRain size={18} />漏打</div>
            {d.missed.map((m) => (
              <div key={m.id} className="day-row-wrap" style={{ ["--i" as string]: 0 }}>
              <div className="day-row glass neon-pink-soft">
                <span className="day-tag pink-text">第{m.day_index}天</span>
                <span className="day-task">{m.title}</span>
                <span className="day-meta">{md(m.date)}</span>
                {!ro && <button type="button" className="mini-btn" disabled={busy} onClick={() => run(() => makeUpCheckIn(m.id))}>补打</button>}
              </div>
              <DayNoteEditor dayId={m.id} note={m.note || ""} readonly={ro} compact onSaved={() => { setError(""); void load(); }} onError={(e) => { setOkMsg(""); setError(e); }} />
            </div>
            ))}
          </>
        )}
        {d.upcoming.length > 0 && <div className="section-label cyan-text"><Sparkles size={18} />接下来</div>}
        {d.upcoming.map((f, i) => (
          <div key={f.id} className="day-row glass locked" style={{ ["--i" as string]: Math.min(i + 1, 10) }}>
            <Lock size={18} />
            <span className="day-tag">第{f.day_index}天</span>
            <span className="day-task">{f.title}</span>
            <span className="day-meta"><Lock size={16} />{unlockText(f.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
