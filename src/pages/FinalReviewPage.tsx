import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, Trophy, Save, Bot, Loader, Square, Check, X, Coffee, StickyNote } from "lucide-react";
import {
  finalView, saveFinalReview, generateFinalReview, chatStop, newStreamId, md,
  type FinalView, type ReviewText,
} from "../lib/tauri";
import { Markdown } from "../components/Markdown";

type Props = { goalId: number; onBack: () => void; onGoSettings: () => void };

const EMPTY: ReviewText = { went_well: "", hard: "", next_plan: "" };

export function FinalReviewPage({ goalId, onBack, onGoSettings }: Props) {
  const [v, setV] = useState<FinalView | null>(null);
  const [text, setText] = useState<ReviewText>(EMPTY);
  const [busy, setBusy] = useState<"" | "save" | "ai">("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [live, setLive] = useState<string | null>(null);
  const [sid, setSid] = useState("");

  const load = useCallback(async () => {
    setError(""); setMsg("");
    try {
      const x = await finalView(goalId);
      setV(x);
      setText(x.review ? { went_well: x.review.went_well, hard: x.review.hard, next_plan: x.review.next_plan } : EMPTY);
    } catch (e) { setError(String(e)); }
  }, [goalId]);
  useEffect(() => { load(); }, [load]);

  if (!v) return <div className="page">{error ? <div className="error-line">{error}</div> : <div className="muted">加载中…</div>}</div>;

  const pct = v.due ? Math.round((v.done / v.due) * 100) : 0;
  const save = async () => {
    setBusy("save"); setError(""); setMsg("");
    try { await saveFinalReview(goalId, text); await load(); setMsg("已保存"); }
    catch (e) { setError(String(e)); } finally { setBusy(""); }
  };
  const ai = async () => {
    setBusy("ai"); setError(""); setMsg("");
    const id = newStreamId();
    setSid(id); setLive("");
    try {
      await generateFinalReview(goalId, text, id, (t) => setLive((x) => (x ?? "") + t));
      await load(); setMsg("助手点评已生成");
    } catch (e) {
      const m = String(e); await load().catch(() => {}); setError(m);
    } finally { setBusy(""); setLive(null); setSid(""); }
  };
  const noKey = error.startsWith("NO_KEY:");
  const comment = v.review?.ai_comment;
  const field = (k: keyof ReviewText, label: string, ph: string, tone: string) => (
    <label className={`rv-field ${tone}`}>
      <span>{label}</span>
      <textarea value={text[k]} placeholder={ph} maxLength={2000} disabled={v.readonly}
        onChange={(e) => setText({ ...text, [k]: e.target.value })} />
    </label>
  );

  return (
    <div className="page review final-review">
      <header className="page-head">
        <div className="head-left">
          <button type="button" className="icon-btn" onClick={onBack} title="返回目标"><ChevronLeft size={22} /></button>
          <h1 className="page-title">最终总结</h1>
          <span className="ver-pill neon-cyan"><Trophy size={18} />{v.goal_title}</span>
        </div>
        <div className="week-nav glass">
          <span>
            {v.start_date && v.end_date ? `${md(v.start_date)} – ${md(v.end_date)}` : "整段计划"}
            {v.status === "completed" ? " · 已完成" : v.status === "archived" ? " · 已归档" : ""}
          </span>
        </div>
      </header>

      <div className="scroll-area rv-scroll">
        <section className="rv-stats glass neon-cyan">
          <div className="rv-nums">
            <div><b className="cyan-text">{v.done}</b><span>完成</span></div>
            <div><b>{v.due}</b><span>应完成</span></div>
            <div><b className="pink-text">{v.missed}</b><span>漏打</span></div>
            <div><b>{v.longest_streak}</b><span>最长连续</span></div>
            <div className="rv-bar"><div className="bar big"><span className="fill-cyan" style={{ width: `${pct}%` }} /></div><small>{pct}% 行动日完成率</small></div>
          </div>
        </section>

        <div className="section-label cyan-text"><StickyNote size={18} />全程日摘要</div>
        <section className="fr-days glass">
          {v.days.map((c) => {
            const hasNote = !!c.note.trim();
            return (
              <div key={c.date} className={`fr-day s-${c.state}${hasNote ? " has-note" : ""}`}>
                <span className="fr-day-ic">
                  {c.state === "done" ? <Check size={16} /> : c.state === "missed" ? <X size={16} /> : c.is_rest ? <Coffee size={14} /> : "·"}
                </span>
                <span className="fr-day-meta">周{c.weekday} · {md(c.date)}{c.day_index != null ? ` · 第${c.day_index}天` : ""}</span>
                <span className="fr-day-title">{c.title ?? "—"}{c.is_rest ? "（休息）" : ""}</span>
                <span className={`fr-day-st s-${c.state}`}>
                  {c.state === "done" ? "已完成" : c.state === "missed" ? "漏打" : c.state === "today" ? "今天" : c.state === "future" ? "未到" : "—"}
                </span>
                <span className={`fr-day-note${hasNote ? " on" : ""}`}>{hasNote ? c.note : "备注：（无）"}</span>
              </div>
            );
          })}
        </section>

        <section className="rv-form fr-form">
          {field("went_well", "这段做得好的", "整段计划里值得肯定的地方…", "tone-cyan")}
          {field("hard", "卡在哪", "漏打、破戒、拖延的原因…", "tone-pink")}
          {field("next_plan", "下次同类计划怎么改", "强度、内容、休息日、周期…", "tone-cyan")}
        </section>

        {!v.readonly && (
          <div className="rv-actions">
            <button type="button" className="ghost-btn neon-cyan" disabled={!!busy} onClick={save}>
              {busy === "save" ? <Loader size={18} className="spin" /> : <Save size={18} />}保存总结
            </button>
            <button type="button" className="ghost-btn neon-pink" disabled={!!busy} onClick={ai}>
              {busy === "ai" ? <Loader size={18} className="spin" /> : <Bot size={18} />}
              {busy === "ai" ? "助手点评中…" : "让助手点评"}
            </button>
            {busy === "ai" && sid && (
              <button type="button" className="stop-btn" onClick={() => chatStop(sid)}><Square size={14} fill="currentColor" />停止生成</button>
            )}
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
            <div className="rv-ai-body md-bubble">
              {live ? <Markdown text={live} /> : null}<span className="caret" />
            </div>
          </section>
        )}
        {live === null && comment && (
          <section className="rv-ai glass neon-pink">
            <div className="rv-ai-head"><Bot size={18} />助手点评</div>
            <div className="rv-ai-body md-bubble"><Markdown text={comment} /></div>
          </section>
        )}
      </div>
    </div>
  );
}
