import { useEffect, useState } from "react";
import { LayoutTemplate, ChevronLeft, Eye, Play, Bot, Trash2, Flame, NotebookPen, BookOpen, Target, CalendarDays, type LucideIcon } from "lucide-react";
import { listTemplates, applyTemplate, deleteTemplate, todayStr, shiftDate, md, type Template } from "../lib/tauri";
import { PlanModal } from "./ChatPage";

const ICONS: Record<string, LucideIcon> = { flame: Flame, notebook: NotebookPen, book: BookOpen, target: Target };

/** 带入聊天的文字：模板概要 + 每天标题 */
function adjustText(t: Template): string {
  const outline = t.days.map((d, i) => `${i + 1}.${d.title}${d.is_rest ? "(休)" : ""}`).join("；");
  return `我想参考模板「${t.title}」（${t.days_count} 天）来定计划。模板简介：${t.summary}\n模板每天安排：${outline}\n请先问我几个关键问题（比如我的基础、每天可用时间、限制条件），再按我的情况调整成一份完整的按天计划。`;
}

export function TemplatesPage({ onBack, onOpenGoal, onAdjust }: { onBack: () => void; onOpenGoal: (id: number) => void; onAdjust: (text: string) => void }) {
  const [list, setList] = useState<Template[] | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<Template | null>(null);
  const today = todayStr();
  const [start, setStart] = useState(today);
  const load = () => listTemplates().then(setList).catch((e) => setErr(String(e)));
  useEffect(() => { load(); }, []);

  const apply = async (t: Template, date = start) => {
    if (!confirm(`用模板「${t.title}」新建目标，从 ${md(date)} 开始，共 ${t.days_count} 天？`)) return;
    setBusy(true); setErr("");
    try { onOpenGoal(await applyTemplate(t.id, date)); } catch (e) { setErr(String(e)); } finally { setBusy(false); }
  };
  const remove = async (t: Template) => {
    if (!confirm(`删除自建模板「${t.title}」？已经用它建的目标不受影响。`)) return;
    try { await deleteTemplate(t.id); load(); } catch (e) { setErr(String(e)); }
  };

  const dateInput = (
    <label className="start-date">
      <CalendarDays size={16} />开始日期
      <input type="date" className="time-input" value={start} min={today} onChange={(e) => setStart(e.target.value && e.target.value >= today ? e.target.value : today)} />
      <button type="button" className={`mini-btn ${start === today ? "on" : ""}`} onClick={() => setStart(today)}>今天</button>
      <button type="button" className={`mini-btn ${start === shiftDate(today, 1) ? "on" : ""}`} onClick={() => setStart(shiftDate(today, 1))}>明天</button>
    </label>
  );

  return (
    <div className="page templates">
      <header className="page-head">
        <div className="head-left">
          <button type="button" className="icon-btn" onClick={onBack} title="返回目标"><ChevronLeft size={22} /></button>
          <h1 className="page-title underline">计划模板库</h1>
        </div>
        <div className="glass tpl-date">{dateInput}</div>
      </header>
      {err && <div className="error-line">{err}</div>}
      <div className="muted small">选一个模板即可一键生成按天计划；想按自己的情况改，点「让助手按我情况调整」。在目标详情页右上角可以把自己的目标「存为模板」。</div>
      <div className="tpl-grid">
        {list?.map((t) => {
          const Icon = ICONS[t.icon] ?? Target;
          const rest = t.days.filter((d) => d.is_rest).length;
          return (
            <div key={t.id} className={`tpl-card glass ${t.builtin ? "neon-cyan" : "neon-pink"}`}>
              <div className="tpl-head">
                <div className={`goal-icon ${t.builtin ? "neon-cyan" : "neon-pink"}`}><Icon size={30} strokeWidth={1.5} /></div>
                <div>
                  <div className="tpl-title">{t.title}</div>
                  <div className="tpl-meta"><span className={`tag ${t.builtin ? "cyan" : "pink"}`}>{t.builtin ? t.category : "我的模板"}</span>{t.days_count} 天{rest ? ` · 休息 ${rest} 天` : ""}</div>
                </div>
                {!t.builtin && <button type="button" className="icon-plain tpl-del" title="删除模板" onClick={() => remove(t)}><Trash2 size={16} /></button>}
              </div>
              <div className="tpl-sum">{t.summary || "（无简介）"}</div>
              <ul className="tpl-days">
                {t.days.slice(0, 3).map((d, i) => <li key={i}><b>第{i + 1}天</b>{d.title}</li>)}
              </ul>
              <div className="tpl-actions">
                <button type="button" className="ghost-btn neon-cyan sm" onClick={() => setView(t)}><Eye size={16} />预览完整计划</button>
                <button type="button" className="checkin-btn small fit sm" disabled={busy} onClick={() => apply(t)}><Play size={16} />{start === today ? "今天开始" : `${md(start)}开始`}</button>
                <button type="button" className="ghost-btn neon-pink sm" onClick={() => onAdjust(adjustText(t))}><Bot size={16} />让助手按我情况调整</button>
              </div>
            </div>
          );
        })}
      </div>
      {list && list.length === 0 && <div className="muted"><LayoutTemplate size={16} />暂无模板</div>}
      {view && (
        <PlanModal
          d={{ title: view.title, summary: view.summary, start_date: start, days_count: view.days_count, days: view.days }}
          diff={null} confirmedId={null} busy={busy} onOpen={onOpenGoal} onClose={() => setView(null)}
          kicker={view.builtin ? `内置模板 · ${view.category}` : "我的模板"}
          confirmLabel="开始生效" editLabel="让助手按我情况调整"
          footExtra={dateInput}
          onConfirm={() => { const t = view; setView(null); apply(t); }}
          onEdit={() => { const t = view; setView(null); onAdjust(adjustText(t)); }} />
      )}
    </div>
  );
}
