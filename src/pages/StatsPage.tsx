import { useEffect, useMemo, useState } from "react";
import { useRoll } from "../lib/motion";
import { ChartColumn, Flame, Trophy, CircleCheck, CalendarRange, TrendingUp, Grid3x3, ListOrdered, Target } from "lucide-react";
import { NeonSelect } from "../components/NeonSelect";
import { getStats, md, type Stats, type WeekPoint } from "../lib/tauri";

const pct = (r: number | null) => (r === null ? "—" : `${Math.round(r * 100)}%`);

/** KPI 数字：进入页面从 0 滚到真实值 */
function Num({ v }: { v: number }) {
  return <>{useRoll(v, 800, true)}</>;
}
function PctNum({ r }: { r: number | null }) {
  const n = useRoll(r === null ? 0 : Math.round(r * 100), 800, true);
  return <>{r === null ? "—" : `${n}%`}</>;
}
/** 近 8 周完成率折线 + 柱，纯 SVG */
function TrendChart({ data }: { data: WeekPoint[] }) {
  const W = 560, H = 214, L = 36, R = 12, T = 30, B = 34;
  const iw = W - L - R, ih = H - T - B;
  const step = iw / data.length;
  const x = (i: number) => L + step * i + step / 2;
  const y = (r: number) => T + ih * (1 - r);
  const pts = data.map((d, i) => (d.rate === null ? null : [x(i), y(d.rate)] as const));
  const segs: string[] = [];
  let cur = "";
  pts.forEach((p) => {
    if (!p) { if (cur) segs.push(cur); cur = ""; return; }
    cur += `${cur ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  });
  if (cur) segs.push(cur);
  return (
    <svg className="trend-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="近 8 周完成率趋势">
      <defs>
        <linearGradient id="tbar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--cyan)" }} stopOpacity="0.55" />
          <stop offset="1" style={{ stopColor: "var(--cyan)" }} stopOpacity="0.04" />
        </linearGradient>
        <filter id="tglow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {[0, 0.5, 1].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} className="trend-grid" />
          <text x={L - 6} y={y(g) + 4} className="trend-axis" textAnchor="end">{g * 100}%</text>
        </g>
      ))}
      {data.map((d, i) => (
        <g key={d.week_start}>
          {d.rate !== null && (
            <rect className="trend-bar" style={{ ["--i" as string]: i }} x={x(i) - step * 0.28} width={step * 0.56} y={y(d.rate)} height={Math.max(ih * d.rate, 1)} rx="4" fill="url(#tbar)" />
          )}
          <text x={x(i)} y={H - 12} className={`trend-axis ${i === data.length - 1 ? "now" : ""}`} textAnchor="middle">
            {i === data.length - 1 ? "本周" : md(d.week_start)}
          </text>
          <title>{`${md(d.week_start)} 起：${d.due ? `${d.done}/${d.due}（${pct(d.rate)}）` : "无计划"}`}</title>
        </g>
      ))}
      {segs.map((s, i) => <path key={i} d={s} className="trend-line" filter="url(#tglow)" />)}
      {pts.map((p, i) => p && (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="4.5" className="trend-dot" />
          <text x={p[0]} y={p[1] - 12} className="trend-val" textAnchor="middle">{pct(data[i].rate)}</text>
        </g>
      ))}
    </svg>
  );
}

const WD = ["一", "", "三", "", "五", "", "日"];

function Heatmap({ cells }: { cells: Stats["heatmap"] }) {
  const weeks = useMemo(() => {
    const w: Stats["heatmap"][] = [];
    cells.forEach((c, i) => (w[Math.floor(i / 7)] ??= []).push(c));
    return w;
  }, [cells]);
  return (
    <div className="heatmap">
      <div className="hm-wrap" style={{ ["--weeks" as string]: weeks.length }}>
        <span />
        <div className="hm-months">
          {(() => {
            // 月份标签：换月的那一列显示；与上一个标签间隔不足 3 列时跳过，避免「4月 5月」挤在一起
            let last = -99;
            return weeks.map((w, i) => {
              const first = w[0].date;
              const change = i === 0 || first.slice(5, 7) !== weeks[i - 1][0].date.slice(5, 7);
              const show = change && i - last >= 3 && !(i === 0 && weeks[1] && weeks.slice(1, 3).some((x) => x[0].date.slice(5, 7) !== first.slice(5, 7)));
              if (show) last = i;
              return <span key={i}>{show ? `${Number(first.slice(5, 7))}月` : ""}</span>;
            });
          })()}
        </div>
        <div className="hm-wd">{WD.map((d, i) => <span key={i}>{d}</span>)}</div>
        <div className="hm-grid">
          {weeks.flatMap((w, wi) => w.map((c, di) => (
            <i key={c.date} style={{ ["--i" as string]: wi * 7 + di }}
              className={`hm-cell ${c.future ? "future" : c.rest ? "rest" : c.level < 0 ? "none" : `l${c.level}`}`}
              title={`${md(c.date)}：${c.future ? "未到" : c.rest ? "休息日" : c.level < 0 ? "无计划" : `完成 ${c.done}/${c.due}`}`} />
          )))}
        </div>
      </div>
      <div className="hm-legend">
        <span>少</span>{[0, 1, 2, 3, 4].map((l) => <i key={l} className={`hm-cell l${l}`} />)}<span>多</span>
        <i className="hm-cell rest" /><span>休息日</span>
        <i className="hm-cell none" /><span>无计划</span>
      </div>
    </div>
  );
}

export function StatsPage({ onOpenGoal }: { onOpenGoal: (id: number) => void }) {
  const [goal, setGoal] = useState<number | null>(null);
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    getStats(goal).then((x) => {
      // 选中的目标已被归档（不再出现在列表里）→ 回到全部目标
      if (goal != null && !x.goals.some((g) => g.id === goal)) { setGoal(null); return; }
      setS(x);
    }).catch((e) => setErr(String(e)));
  }, [goal]);

  return (
    <div className="page stats">
      <header className="page-head">
        <div className="head-left">
          <h1 className="page-title underline">数据统计</h1>
        </div>
        <div className="stats-filter glass">
          <Target size={16} />
          <NeonSelect<string> aria-label="筛选目标" className="stats-nsel" value={goal == null ? "" : String(goal)}
            onChange={(v) => setGoal(v ? Number(v) : null)}
            options={[{ value: "", label: "全部目标" }, ...(s?.goals ?? []).map((g) => ({ value: String(g.id), label: g.title, }))]} />
        </div>
      </header>
      {err && <div className="error-line">{err}</div>}
      {!s ? <div className="muted">加载中…</div> : s.goals.length === 0 ? (
        <div className="empty-card glass neon-cyan">
          <div className="empty-icon"><ChartColumn size={56} strokeWidth={1.4} /></div>
          <div className="empty-title">还没有进行中的目标</div>
          <div className="empty-sub">统计只计入进行中的目标，已完成和已归档的都不计入（改方案延长或取消归档回到进行中后会重新计入）。新建目标或从模板开始并打卡后，这里会显示连续天数、完成率和打卡热力图。</div>
        </div>
      ) : (
        <>
          <div className="kpi-row" key={goal ?? "all"}>
            <div className="kpi glass neon-pink"><Flame size={22} className="pink-text" /><b><Num v={s.current_streak} /><small>天</small></b><span>当前连续</span></div>
            <div className="kpi glass neon-cyan"><Trophy size={22} className="cyan-text" /><b><Num v={s.longest_streak} /><small>天</small></b><span>最长连续</span></div>
            <div className="kpi glass neon-cyan"><CircleCheck size={22} className="cyan-text" /><b><Num v={s.total_checkins} /><small>次</small></b><span>总打卡</span></div>
            <div className="kpi glass neon-pink"><CalendarRange size={22} className="pink-text" /><b><PctNum r={s.overall_rate} /></b><span>总完成率</span></div>
          </div>
          <div className="muted small stats-note">总完成率 = 从计划开始到今天已完成的行动日占比；休息日不计入，今天还没打卡不算未完成，也不算连续中断。多个目标时，当天所有安排都完成才算连续。只统计进行中的目标，已完成和已归档的不计入。</div>
          <section className="glass neon-cyan panel">
            <div className="panel-title cyan-text"><TrendingUp size={20} />近 8 周完成率</div>
            <TrendChart key={goal ?? "all"} data={s.trend} />
          </section>
          <section className="glass neon-pink-soft panel">
            <div className="panel-title pink-text"><Grid3x3 size={20} />近半年打卡热力图</div>
            <Heatmap key={goal ?? "all"} cells={s.heatmap} />
          </section>
          <section className="glass panel">
            <div className="panel-title cyan-text"><ListOrdered size={20} />目标完成率排行</div>
            <div className="rank-list">
              {s.ranking.map((r, i) => (
                <button key={r.id} type="button" className="rank-item" onClick={() => onOpenGoal(r.id)}>
                  <span className={`rank-no n${i + 1}`}>{i + 1}</span>
                  <span className="rank-title">{r.title}{r.status === "completed" && <em className="done-badge">已完成</em>}</span>
                  <span className="rank-bar"><i style={{ width: `${Math.round((r.rate ?? 0) * 100)}%` }} /></span>
                  <span className="rank-val">{pct(r.rate)}</span>
                  <span className="rank-sub">{r.done}/{r.due} 行动日 · 连续 {r.streak} 天</span>
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
