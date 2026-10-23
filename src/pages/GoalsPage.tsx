import { useEffect, useRef, useState } from "react";
import { askConfirm } from "../components/ConfirmDialog";
import { useSlider } from "../lib/motion";
import { Flame, NotebookPen, BookOpen, Target, CalendarDays, Circle, CircleCheck, Coffee, Sparkles, Download, Archive, ArchiveRestore, LayoutTemplate, Trophy, type LucideIcon } from "lucide-react";
import { WeatherCard } from "../components/WeatherCard";
import { listGoals, importSampleGoal, restoreGoal, type GoalSummary } from "../lib/tauri";

const ICONS: Record<string, LucideIcon> = { flame: Flame, notebook: NotebookPen, book: BookOpen, target: Target };
const WEEK = ["日", "一", "二", "三", "四", "五", "六"];

export function GoalsPage({ onOpenGoal, onTemplates }: { onOpenGoal: (id: number) => void; onTemplates: () => void }) {
  const [cur, setCur] = useState<GoalSummary[] | null>(null);
  const [arch, setArch] = useState<GoalSummary[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [tab, setTab] = useState<"active" | "completed" | "archived">("active");
  const segRef = useRef<HTMLDivElement>(null);
  const segHl = useSlider(segRef, "button.on:not(.seg-hl)", [tab, cur, arch]);
  // 一次取全部（进行中+已完成、已归档），标签显示数量
  const load = () => Promise.all([listGoals(false), listGoals(true)]).then(([a, b]) => { setCur(a); setArch(b); }).catch((e) => setError(String(e)));
  useEffect(() => { load(); }, []);
  const lists = {
    active: cur?.filter((g) => g.status === "active") ?? null,
    completed: cur?.filter((g) => g.status === "completed") ?? null,
    archived: arch,
  };
  const goals = lists[tab];
  const cnt = (k: keyof typeof lists) => (lists[k] ? ` ${lists[k]!.length}` : "");
  const restore = async (id: number) => {
    if (!(await askConfirm("恢复后最新版本重新生效：计划还没结束的回到「进行中」，已过最后一天的显示为「已完成」。确定恢复？", { title: "恢复目标", ok: "恢复" }))) return;
    setBusy(true);
    try { await restoreGoal(id); await load(); } catch (e) { setError(String(e)); } finally { setBusy(false); }
  };

  const importSample = async () => {
    setBusy(true);
    try { await importSampleGoal(); await load(); } catch (e) { setError(String(e)); } finally { setBusy(false); }
  };

  const card = (g: GoalSummary, i: number) => {
    const arch = g.status === "archived";
    const done = g.status === "completed";
    const tone = arch || done ? "cyan" : g.today_is_rest || g.today_done ? "cyan" : "pink";
    const Icon = ICONS[g.icon] ?? Target;
    const due = Math.max(0, g.total - g.rest);
    const rate = due ? Math.round((g.done / due) * 100) : 0;
    return (
      <div key={g.id} className={`goal-card glass neon-${tone} ${arch ? "archived" : ""} ${done ? "completed" : ""}`} role="button" tabIndex={0} style={{ ["--i" as string]: Math.min(i, 12) }}
        onClick={() => onOpenGoal(g.id)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpenGoal(g.id); }}>
        <div className={`goal-icon neon-${tone}`}><Icon size={40} strokeWidth={1.5} /></div>
        <div className="goal-main">
          <div className="goal-title">{g.title}</div>
          <div className="goal-sub">
            {arch && <span className="tag cyan">已归档 · 只读</span>}
            {done && <span className="done-badge"><Trophy size={13} />已完成</span>}
            <span className="gs-seg">行动日 <b className={`${tone}-text`}>{g.done}/{due}</b>{g.rest > 0 || done ? " ·" : ""}</span>{" "}
            {g.rest > 0 && <><span className="gs-seg">休息 {g.rest}{done ? " ·" : ""}</span>{" "}</>}
            {done && <span className="gs-seg">完成率 <b className="green-text">{rate}%</b></span>}
          </div>
        </div>
        <div className="goal-right">
          {arch ? (
            <button type="button" className="today-pill neon-pink" disabled={busy}
              onClick={(e) => { e.stopPropagation(); restore(g.id); }}>恢复<ArchiveRestore size={18} /></button>
          ) : done ? (
            <span className="today-pill done-pill">最终 {rate}%<Trophy size={18} /></span>
          ) : (
            <span className={`today-pill neon-${tone}`}>
              {!g.today_in_plan
                ? "今天无计划"
                : g.today_is_rest
                  ? "今天休息"
                  : g.today_done
                    ? "今天已打"
                    : "今天未打"}
              {g.today_is_rest ? <Coffee size={20} /> : g.today_done ? <CircleCheck size={20} /> : <Circle size={20} />}
            </span>
          )}
          <div className="bar"><span className={done ? "fill-green" : `fill-${tone}`} style={{ width: `${rate}%` }} /></div>
        </div>
      </div>
    );
  };
  // 跨天：日期变化时重新加载（后端会把过了最后一天的目标转为已完成）
  useEffect(() => {
    let day = new Date().toDateString();
    const id = window.setInterval(() => { const n = new Date().toDateString(); if (n !== day) { day = n; load(); } }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const d = new Date();
  const dateText = `${d.getMonth() + 1}月${d.getDate()}日 · 周${WEEK[d.getDay()]}`;
  return (
    <div className="page">
      <header className="page-head goals-head">
        <div className="title-line">
          <h1 className="page-title underline nowrap">我的目标</h1>
          <span className="title-date nowrap"><CalendarDays size={14} />{dateText}</span>
        </div>
        <div className="head-right">
          <WeatherCard />
        </div>
      </header>
      <div className="toolbar">
        <div className={`seg glass ${segHl ? "has-hl" : ""}`} ref={segRef}>
          {segHl && <button type="button" tabIndex={-1} aria-hidden="true" className={`seg-hl on ${tab === "completed" ? "green" : tab === "archived" ? "pink" : ""}`} style={segHl} />}
          <button type="button" className={tab === "active" ? "on" : ""} onClick={() => setTab("active")}><Target size={15} />进行中<em className="seg-n">{cnt("active")}</em></button>
          <button type="button" className={tab === "completed" ? "on green" : ""} onClick={() => setTab("completed")}><Trophy size={15} />已完成<em className="seg-n">{cnt("completed")}</em></button>
          <button type="button" className={tab === "archived" ? "on pink" : ""} onClick={() => setTab("archived")}><Archive size={15} />已归档<em className="seg-n">{cnt("archived")}</em></button>
        </div>
        <button type="button" className="ghost-btn neon-pink" onClick={onTemplates}><LayoutTemplate size={18} />模板库</button>
      </div>
      {error && <div className="error-line">{error}</div>}
      {tab === "archived" && goals && goals.length === 0 && (
        <div className="empty-card glass neon-pink">
          <div className="empty-icon"><Archive size={56} strokeWidth={1.4} /></div>
          <div className="empty-title">没有已归档的目标</div>
          <div className="empty-sub">在目标详情页右上角可以归档；归档后只读，可随时恢复</div>
        </div>
      )}
      {tab === "active" && goals && goals.length === 0 && (
        <div className="empty-card glass neon-cyan">
          <div className="empty-icon"><Target size={56} strokeWidth={1.4} /></div>
          <div className="empty-title">还没有目标</div>
          <div className="empty-sub">从现成模板开始最快；也可以去「聊天」和助手定方案，或先导入示例体验打卡</div>
          <div className="btn-row center">
            <button type="button" className="checkin-btn small fit" onClick={onTemplates}>
              <LayoutTemplate size={20} />从模板开始
            </button>
            <button type="button" className="ghost-btn neon-cyan" disabled={busy} onClick={importSample}>
              <Download size={18} />{busy ? "导入中…" : "导入示例目标"}
            </button>
          </div>
          <div className="empty-hint"><Sparkles size={14} />示例：30天减脂，已进行到第 8 天，含 1 天漏打</div>
        </div>
      )}
      {tab === "completed" && goals && goals.length === 0 && (
        <div className="empty-card glass neon-green">
          <div className="empty-icon green-text"><Trophy size={56} strokeWidth={1.4} /></div>
          <div className="empty-title">还没有完成的计划</div>
          <div className="empty-sub">坚持到最后一天就会出现在这里；改方案延长计划后会回到「进行中」</div>
        </div>
      )}
      <div className="goal-list m-stagger" key={tab}>{goals?.map(card)}</div>
    </div>
  );
}
