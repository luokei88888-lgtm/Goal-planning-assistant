import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarCheck, Save, Bot, Loader, RefreshCw, History, Coffee, Check, X, Sun, Square } from "lucide-react";
import { weekView, saveReview, reviewAi, chatStop, newStreamId, listReviews, md, shiftDate, type WeekView, type Review, type ReviewText } from "../lib/tauri";

type Props = { goalId: number; onBack: () => void; onRevise: (prefill: string) => void; onGoSettings: () => void };

const EMPTY: ReviewText = { went_well: "", hard: "", next_plan: "" };
const stamp = (s: number) => {
  const t = new Date(s * 1000);
  return `${t.getMonth() + 1}月${t.getDate()}日 ${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
};

export function ReviewPage({ goalId, onBack, onRevise, onGoSettings }: Props) {
  const [w, setW] = useState<WeekView | null>(null);
  const [text, setText] = useState<ReviewText>(EMPTY);
  const [hist, setHist] = useState<Review[]>([]);
  const [busy, setBusy] = useState<"" | "save" | "ai">("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [live, setLive] = useState<string | null>(null);
  const [sid, setSid] = useState("");

  const load = useCallback(async (ws?: string) => {
    setError(""); setMsg("");
    try {
      const v = await weekView(goalId, ws);
      setW(v);
      setText(v.review ? { went_well: v.review.went_well, hard: v.review.hard, next_plan: v.review.next_plan } : EMPTY);
      setHist(await listReviews(goalId));
    } catch (e) { setError(String(e)); }
  }, [goalId]);
  useEffect(() => { load(); }, [load]);

  if (!w) return <div className="page">{error ? <div className="error-line">{error}</div> : <div className="muted">加载中…</div>}</div>;

  const pct = w.due ? Math.round((w.done / w.due) * 100) : 0;

  const save = async () => {
    setBusy("save"); setError(""); setMsg("");
    try { await saveReview(goalId, w.week_start, text); await load(w.week_start); setMsg("已保存"); }
    catch (e) { setError(String(e)); } finally { setBusy(""); }
  };
  const ai = async () => {
    setBusy("ai"); setError(""); setMsg("");
    const id = newStreamId();
    setSid(id); setLive("");
    try { await reviewAi(goalId, w.week_start, text, id, (t) => setLive((x) => (x ?? "") + t)); await load(w.week_start); setMsg("助手点评已生成"); }
    catch (e) { const m = String(e); await load(w.week_start).catch(() => {}); setError(m); }
    finally { setBusy(""); setLive(null); setSid(""); }
  };
  const noKey = error.startsWith("NO_KEY:");
  const comment = w.review?.ai_comment;
  const field = (k: keyof ReviewText, label: string, ph: string, tone: string) => (
    <label className={`rv-field ${tone}`}>
      <span>{label}</span>
      <textarea value={text[k]} placeholder={ph} maxLength={2000} disabled={w.readonly}
        onChange={(e) => setText({ ...text, [k]: e.target.value })} />
    </label>
  );

  return (
    <div className="page review">
      <header className="page-head">
        <div className="head-left">
          <button type="button" className="icon-btn" onClick={onBack} title="返回目标"><ChevronLeft size={22} /></button>
          <h1 className="page-title">周复盘</h1>
          <span className="ver-pill neon-cyan"><CalendarCheck size={18} />{w.goal_title}</span>
        </div>
        <div className="week-nav glass">
          <button type="button" className="icon-plain" title="上一周" onClick={() => load(shiftDate(w.week_start, -7))}><ChevronLeft size={20} /></button>
          <span>{md(w.week_start)} – {md(w.week_end)}{w.is_current ? " · 本周" : ""}</span>
          <button type="button" className="icon-plain" title="下一周" disabled={w.is_current} onClick={() => load(shiftDate(w.week_start, 7))}><ChevronRight size={20} /></button>
        </div>
      </header>

      <div className="scroll-area rv-scroll">
        <section className="rv-stats glass neon-cyan">
          <div className="rv-nums">
            <div><b className="cyan-text">{w.done}</b><span>完成</span></div>
            <div><b>{w.due}</b><span>应完成</span></div>
            <div><b className="pink-text">{w.missed}</b><span>漏打</span></div>
            <div className="rv-bar"><div className="bar big"><span className="fill-cyan" style={{ width: `${pct}%` }} /></div><small>{pct}% 完成率（截至今天）</small></div>
          </div>
          <div className="rv-cells">
            {w.cells.map((c) => (
              <div key={c.date} className={`rv-cell s-${c.state}`} title={c.title ?? "无计划"}>
                <div className="rv-wd">周{c.weekday}</div>
                <div className="rv-ic">
                  {c.state === "done" ? <Check size={20} /> : c.state === "missed" ? <X size={20} /> : c.state === "today" ? <Sun size={18} /> : c.is_rest ? <Coffee size={16} /> : "·"}
                </div>
                <div className="rv-dt">{Number(c.date.slice(5, 7))}/{Number(c.date.slice(8, 10))}</div>
                <div className="rv-tt">{c.title ?? "—"}</div>
              </div>
            ))}
          </div>
        </section>

        {(
          <>
            <section className="rv-form">
              {field("went_well", "顺利的", "这周做得好的地方…", "tone-cyan")}
              {field("hard", "困难的", "卡住了什么？为什么漏打…", "tone-pink")}
              {field("next_plan", "下周打算", "下周想怎么做…", "tone-cyan")}
            </section>
            {!w.readonly && (
              <div className="rv-actions">
                <button type="button" className="ghost-btn neon-cyan" disabled={!!busy} onClick={save}>{busy === "save" ? <Loader size={18} className="spin" /> : <Save size={18} />}保存复盘</button>
                <button type="button" className="ghost-btn neon-pink" disabled={!!busy} onClick={ai}>{busy === "ai" ? <Loader size={18} className="spin" /> : <Bot size={18} />}{busy === "ai" ? "助手点评中…" : "让助手点评"}</button>
                {busy === "ai" && sid && <button type="button" className="stop-btn" onClick={() => chatStop(sid)}><Square size={14} fill="currentColor" />停止生成</button>}
                {msg && <span className="cyan-text">{msg}</span>}
              </div>
            )}
            {error && (
              <div className="error-line">
                <span>{noKey ? error.slice(7) : error}</span>
                {noKey && <button type="button" className="mini-btn" onClick={onGoSettings}>去设置</button>}
              </div>
            )}
            {live !== null && (
              <section className="rv-ai glass neon-pink">
                <div className="rv-ai-head"><Loader size={18} className="spin" />助手点评中…</div>
                <div className="pre">{live}<span className="caret" /></div>
              </section>
            )}
            {live === null && comment && (
              <section className="rv-ai glass neon-pink">
                <div className="rv-ai-head"><Bot size={18} />助手点评</div>
                <div className="pre">{comment}</div>
                {!w.readonly && (
                  <button type="button" className="checkin-btn small fit" onClick={() => onRevise(`参考这次周复盘（${md(w.week_start)}–${md(w.week_end)}）的建议调整计划：${comment.replace(/\s+/g, " ").slice(0, 300)}`)}>
                    <RefreshCw size={18} />据此改方案
                  </button>
                )}
              </section>
            )}
          </>
        )}

        <div className="section-label cyan-text"><History size={18} />历史周复盘</div>
        {hist.length === 0 && <div className="muted">还没有保存过周复盘。</div>}
        {hist.map((r) => (
          <button key={r.id} type="button" className={`day-row glass rv-hist ${r.week_start === w.week_start ? "neon-cyan" : ""}`} onClick={() => load(r.week_start)}>
            <span className="day-tag">{md(r.week_start)} 周</span>
            <span className="day-task">完成 {r.done}/{r.due} · 漏打 {r.missed}{r.went_well ? ` · ${r.went_well.slice(0, 24)}` : ""}</span>
            <span className="day-meta">{r.ai_comment ? <><Bot size={14} />有点评</> : "手写"} · {stamp(r.updated_at)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
