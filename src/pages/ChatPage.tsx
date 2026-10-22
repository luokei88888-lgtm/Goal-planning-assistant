import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Markdown } from "../components/Markdown";
import { MessageSquareMore, SquarePen, Settings, UserRound, Crosshair, CircleCheck, FileText, PencilLine, Send, Sparkles, RotateCw, TriangleAlert, Loader, ListChecks, X, Coffee, ChevronLeft, GitCompare, Square, History, Pencil, Trash2, Check, Target, WifiOff, Undo2, ImagePlus } from "lucide-react";
import { chatGetSession, chatNewSession, chatSend, confirmDraft, chatGoalSession, chatStop, newStreamId, chatListSessions, chatRenameSession, chatDeleteSession, chatUndoDeleteSession, goalTodayChecked, type SessionItem, md, type ChatSession, type DraftPlan, type DraftDiff, type ChatAttachment, type ChatImageIn } from "../lib/tauri";

type Props = { onOpenGoal: (id: number) => void; onGoSettings: () => void; goalId?: number; prefill?: string; onBack?: () => void };

/** 流式中的显示：JSON 代码块不显示原文，只显示进度 */
/** 解析助手消息末尾的 ```options 选项块；没有或格式不对时 opts 为空 */
export function parseOptions(t: string): { body: string; opts: string[]; multi: boolean; closed: boolean } {
  const i = t.lastIndexOf("```options");
  if (i < 0) return { body: t, opts: [], multi: false, closed: false };
  const rest = t.slice(i + 10);
  const end = rest.indexOf("```");
  const inner = end < 0 ? rest : rest.slice(0, end);
  const after = end < 0 ? "" : rest.slice(end + 3).trim();
  let lines = inner.split("\n").map((x) => x.trim().replace(/^([-*+]|\d+[.)、])\s*/, "").trim()).filter(Boolean);
  // 第一行可为标记：「多选」「封闭」可组合（空格/顿号/逗号分隔）；旧格式只有「多选」或无标记（开放题）
  let multi = false; let closed = false;
  const FLAG = /^(\[?(多选|封闭|单选|开放)\]?|multi(ple)?|closed)$/i;
  const toks = lines.length ? lines[0].split(/[\s、,，|]+/).filter(Boolean) : [];
  if (toks.length && toks.every((x) => FLAG.test(x))) {
    multi = toks.some((x) => /多选|multi/i.test(x)); closed = toks.some((x) => /封闭|closed/i.test(x));
    lines = lines.slice(1);
  }
  lines = [...new Set(lines.filter((x) => !/^(其它|其他)/.test(x)))].slice(0, 8);
  const body = (t.slice(0, i).trimEnd() + (after ? "\n\n" + after : "")).trim();
  return { body, opts: end < 0 ? [] : lines, multi, closed };
}

/** 输入框只输入序号时换成对应选项：返回 {text} 发送；{other:true} 只聚焦自己填；null 原样发送 */
export function mapOptionIndex(raw: string, po: { opts: string[]; multi: boolean; closed: boolean } | null): { text: string } | { other: true } | null {
  if (!po || !po.opts.length) return null;
  const t = raw.replace(/[\uFF10-\uFF19]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).trim();
  if (!/^\d+[.。]?([\s,，、;；/]+\d+[.。]?)*$/.test(t)) return null;
  const nums = [...new Set(t.split(/[^\d]+/).filter(Boolean).map(Number))];
  const n = po.opts.length;
  const other = po.closed ? -1 : n + 1;
  if (nums.length === 1 && nums[0] === other) return { other: true };
  if (!po.multi && nums.length !== 1) return null;
  if (nums.some((x) => x < 1 || x > n)) return null;
  return { text: nums.map((x) => po.opts[x - 1]).join("、") };
}

function OptionPicker({ opts, multi, closed, disabled, onSend, onOther }: { opts: string[]; multi: boolean; closed: boolean; disabled: boolean; onSend: (t: string) => void; onOther: () => void }) {
  const [sel, setSel] = useState<string[]>([]);
  const tog = (o: string) => setSel((x) => (x.includes(o) ? x.filter((y) => y !== o) : [...x, o]));
  return (
    <div className="opt-pick">
      {multi && <div className="opt-hint">可多选</div>}
      <div className="opt-list">
        {opts.map((o, k) => (
          <button key={o} type="button" disabled={disabled} className={`opt-btn ${sel.includes(o) ? "on" : ""}`} style={{ ["--i" as string]: k }}
            onClick={() => (multi ? tog(o) : onSend(o))}>
            {multi && <span className="opt-box">{sel.includes(o) && <Check size={12} />}</span>}<span className="opt-no">{k + 1}.</span>{o}
          </button>
        ))}
        {!closed && <button type="button" disabled={disabled} className="opt-btn other" style={{ ["--i" as string]: opts.length }} onClick={onOther}><span className="opt-no">{opts.length + 1}.</span><Pencil size={14} />其它，自己填</button>}
        {multi && <button type="button" className="opt-btn ok" style={{ ["--i" as string]: opts.length + 1 }} disabled={disabled || !sel.length} onClick={() => onSend(sel.join("、"))}><CircleCheck size={15} />确定{sel.length ? `（${sel.length}）` : ""}</button>}
      </div>
    </div>
  );
}

export function liveView(t0: string): { prose: string; progress: string | null } {
  const oi = t0.indexOf("```options");
  const t = oi < 0 ? t0 : t0.slice(0, oi).trimEnd();
  const i = t.indexOf("```");
  const j = i < 0 ? t.search(/\{\s*"title"/) : i;
  if (j < 0) return { prose: t, progress: null };
  const json = t.slice(j);
  const days = (json.match(/"is_rest"/g) ?? []).length;
  const total = json.match(/"days_count"\s*:\s*(\d+)/)?.[1];
  const closed = i >= 0 && json.slice(3).includes("```");
  const after = closed ? json.slice(3).split("```").slice(1).join("```").trim() : "";
  const n = Math.min(days + 1, total ? Number(total) : Infinity);
  return {
    prose: (t.slice(0, j).trim() + (after ? "\n\n" + after : "")).trim(),
    progress: closed ? "计划草案已生成，正在检查…" : `正在生成计划草案…第 ${n} 天${total ? ` / 共 ${total} 天` : ""}`,
  };
}

const ago = (s: number) => {
  const t = new Date(s * 1000), now = new Date();
  const hm = `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
  return t.toDateString() === now.toDateString() ? `今天 ${hm}` : `${t.getMonth() + 1}月${t.getDate()}日 ${hm}`;
};

function SessionDrawer({ currentId, onPick, onClose, onDeleted }: {
  currentId: number | null; onPick: (id: number) => void; onClose: () => void; onDeleted: (x: SessionItem) => void;
}) {
  const [list, setList] = useState<SessionItem[]>([]);
  const [edit, setEdit] = useState<{ id: number; title: string } | null>(null);
  const [del, setDel] = useState<SessionItem | null>(null);
  const [err, setErr] = useState("");
  const load = () => chatListSessions().then(setList).catch((e) => setErr(String(e)));
  useEffect(() => { load(); }, []);
  const rename = async () => {
    if (!edit) return;
    try { await chatRenameSession(edit.id, edit.title); setEdit(null); load(); } catch (e) { setErr(String(e)); }
  };
  const remove = async (x: SessionItem) => {
    try { await chatDeleteSession(x.id); setDel(null); onDeleted(x); load(); } catch (e) { setErr(String(e)); }
  };
  return createPortal(
    <div className="drawer-mask" onClick={onClose}>
      <aside className="session-drawer glass neon-cyan" onClick={(e) => e.stopPropagation()}>
        <header className="plan-head">
          <div><div className="plan-kicker"><History size={16} />历史会话</div><h2>共 {list.length} 个</h2></div>
          <button type="button" className="icon-btn" title="关闭" onClick={onClose}><X size={20} /></button>
        </header>
        {err && <div className="error-line">{err}</div>}
        <div className="session-list">
          {list.map((x) => (
            <div key={x.id} className={`session-item ${x.id === currentId ? "on" : ""}`}>
              {edit?.id === x.id ? (
                <div className="session-edit">
                  <input autoFocus value={edit.title} maxLength={40} onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) rename(); if (e.key === "Escape") setEdit(null); }} />
                  <button type="button" className="icon-plain" title="保存" onClick={rename}><Check size={18} /></button>
                  <button type="button" className="icon-plain" title="取消" onClick={() => setEdit(null)}><X size={18} /></button>
                </div>
              ) : del?.id === x.id ? (
                <div className="session-edit danger">
                  <span>删除「{x.title}」？删除后 5 秒内可撤销（已生成的目标不受影响）</span>
                  <button type="button" className="danger-btn sm" onClick={() => remove(x)}>删除</button>
                  <button type="button" className="ghost-btn sm" onClick={() => setDel(null)}>取消</button>
                </div>
              ) : (
                <>
                  <button type="button" className="session-main" onClick={() => onPick(x.id)}>
                    <div className="session-title">{x.title}</div>
                    <div className="session-meta">
                      {x.goal_id !== null && <span className="tag pink"><Target size={12} />改方案 · {x.goal_title ?? "目标已删除"}</span>}
                      {x.confirmed && <span className="tag cyan"><CircleCheck size={12} />{x.goal_id !== null ? "已生效新版" : "已生成目标"}</span>}
                      <span>{ago(x.updated_at)} · {x.message_count} 条</span>
                    </div>
                  </button>
                  <button type="button" className="icon-plain" title="重命名" onClick={() => setEdit({ id: x.id, title: x.title })}><Pencil size={16} /></button>
                  <button type="button" className="icon-plain" title="删除" onClick={() => setDel(x)}><Trash2 size={16} /></button>
                </>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>,
    document.body,
  );
}

function diffLines(x: DraftDiff): string[] {
  const out = [`保留今天以前的 ${x.keep_past} 天及打卡，今天起替换`];
  const delta = x.new_remaining - x.old_remaining;
  out.push(`剩余天数 ${x.old_remaining} → ${x.new_remaining}${delta ? `（${delta > 0 ? "+" : ""}${delta}）` : "（不变）"}`);
  if (x.old_end !== x.new_end) out.push(`结束日期 ${md(x.old_end)} → ${md(x.new_end)}`);
  const same = Math.min(x.old_remaining, x.new_remaining);
  out.push(same ? `重叠的 ${same} 天里有 ${x.changed} 天内容变化` : "原计划已结束，全部为新增日程");
  if (x.old_rest !== x.new_rest) out.push(`休息日 ${x.old_rest} → ${x.new_rest} 天`);
  return out;
}

const addDays = (d: string, n: number) => {
  const [y, m, dd] = d.split("-").map(Number);
  const t = new Date(y, m - 1, dd + n);
  return `${t.getMonth() + 1}月${t.getDate()}日`;
};
const WEEKDAY = ["日", "一", "二", "三", "四", "五", "六"];
const weekday = (d: string, n: number) => {
  const [y, m, dd] = d.split("-").map(Number);
  return "周" + WEEKDAY[new Date(y, m - 1, dd + n).getDay()];
};

export function PlanModal({ d, diff, confirmedId, busy, onClose, onConfirm, onEdit, onOpen, kicker, confirmLabel, editLabel, footExtra, hideDates }: {
  d: DraftPlan; diff: DraftDiff | null; confirmedId: number | null; busy: boolean; onClose: () => void; onConfirm: () => void; onEdit: () => void; onOpen: (id: number) => void;
  kicker?: string; confirmLabel?: string; editLabel?: string; footExtra?: ReactNode; hideDates?: boolean;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const rest = d.days.filter((x) => x.is_rest).length;
  const weeks: { idx: number; days: { i: number; day: DraftPlan["days"][number] }[] }[] = [];
  d.days.forEach((day, i) => {
    const w = Math.floor(i / 7);
    (weeks[w] ??= { idx: w + 1, days: [] }).days.push({ i, day });
  });
  const endLabel = addDays(d.start_date, d.days.length - 1);
  return createPortal(
    <div className="modal-mask" onClick={onClose}>
      <div className="plan-modal" onClick={(e) => e.stopPropagation()}>
        <header className="plan-head">
          <div>
            <div className="plan-kicker"><FileText size={16} />{kicker ?? (diff ? `v${diff.next_version} 草案 · 从今天起替换` : "计划草案")}</div>
            <h2>{d.title}</h2>
          </div>
          <button type="button" className="icon-btn" title="关闭" onClick={onClose}><X size={20} /></button>
        </header>
        <div className="plan-meta">
          {d.summary && <div><b>总目标</b>{d.summary}</div>}
          <div><b>周期</b>{d.days_count} 天{hideDates ? "" : ` · ${addDays(d.start_date, 0)} 至 ${endLabel}`}</div>
          {diff && <div><b>变化</b>{diffLines(diff).join("；")}</div>}
          <div><b>休息</b><span className="rest-text">{rest} 天</span> · 训练/执行 {d.days_count - rest} 天</div>
        </div>
        <div className="plan-body">
          {weeks.map((w) => (
            <section key={w.idx} className="plan-week">
              <div className="week-label">第 {w.idx} 周 <span>第 {w.days[0].i + 1}–{w.days[w.days.length - 1].i + 1} 天</span></div>
              {w.days.map(({ i, day }) => (
                <div key={i} className={`plan-day ${day.is_rest ? "rest" : ""}`}>
                  <div className="pd-left">
                    <div className="pd-n">第{i + 1}天</div>
                    {!hideDates && <div className="pd-date">{addDays(d.start_date, i)} {weekday(d.start_date, i)}</div>}
                  </div>
                  <div className="pd-main">
                    <div className="pd-title">{day.is_rest && <Coffee size={15} />}{day.title}{day.is_rest && <em>休息日</em>}</div>
                    {day.detail && <div className="pd-detail">{day.detail}</div>}
                    {day.tasks.length > 0 && <ul>{day.tasks.map((t, k) => <li key={k}>{t}</li>)}</ul>}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
        <footer className={`plan-foot ${footExtra ? "has-extra" : ""}`}>
          {footExtra && <div className="pf-left">{footExtra}</div>}
          {confirmedId ? (
            <button type="button" className="checkin-btn small done" onClick={() => onOpen(confirmedId)}><CircleCheck size={22} />已生效 · 去打卡</button>
          ) : footExtra ? (
            <div className="pf-right">
              <button type="button" className="ghost-btn neon-pink pf-btn" disabled={busy} onClick={onEdit}><PencilLine size={18} />{editLabel ?? "改一改"}</button>
              <button type="button" className="checkin-btn small pf-btn pf-main" disabled={busy} onClick={onConfirm}><CircleCheck size={20} />{confirmLabel ?? "确认生效"}</button>
            </div>
          ) : (
            <>
              <button type="button" className="checkin-btn small" disabled={busy} onClick={onConfirm}><CircleCheck size={22} />{confirmLabel ?? "确认生效"}</button>
              <button type="button" className="ghost-btn neon-pink wide" disabled={busy} onClick={onEdit}><PencilLine size={20} />{editLabel ?? "改一改"}</button>
            </>
          )}
        </footer>
      </div>
    </div>,
    document.body,
  );
}

function DraftCard({ d, diff, confirmedVersion, confirmedId, busy, onConfirm, onEdit, onOpen }: {
  d: DraftPlan; diff: DraftDiff | null; confirmedVersion: number | null; confirmedId: number | null; busy: boolean; onConfirm: () => void; onEdit: () => void; onOpen: (id: number) => void;
}) {
  const rest = d.days.filter((x) => x.is_rest).length;
  const [open, setOpen] = useState(false);
  return (
    <div className="draft-card">
      {open && (
        <PlanModal d={d} diff={diff} confirmedId={confirmedId} busy={busy} onOpen={onOpen} onClose={() => setOpen(false)}
          onConfirm={() => { setOpen(false); onConfirm(); }} onEdit={() => { setOpen(false); onEdit(); }} />
      )}
      <div className="draft-title"><FileText size={20} />{diff ? `v${diff.next_version} 草案` : confirmedVersion ? `v${confirmedVersion} 方案` : "草案"}：{d.title}</div>
      {diff && !confirmedId && (
        <div className="diff-box">
          <div className="diff-head"><GitCompare size={16} />与当前 v{diff.base_version} 相比</div>
          {diffLines(diff).map((l, i) => <div key={i}>· {l}</div>)}
        </div>
      )}
      <ul>
        {d.summary && <li><b>总目标：</b>{d.summary}</li>}
        <li><b>周期：</b>{d.days_count} 天（{md(d.start_date)} 开始），其中休息 {rest} 天</li>
        {d.days.slice(0, 4).map((x, i) => (
          <li key={i}><b>第 {i + 1} 天：</b>{x.title}{x.is_rest ? "（休息）" : x.tasks.length ? ` · ${x.tasks.join("、")}` : ""}</li>
        ))}
        {d.days.length > 4 && <li className="muted">……共 {d.days.length} 天，点「查看完整计划」看全部</li>}
      </ul>
      <button type="button" className="view-plan-btn" onClick={() => setOpen(true)}><ListChecks size={18} />查看完整计划（{d.days.length} 天）</button>
      <div className="draft-actions">
        {confirmedId ? (
          <button type="button" className="checkin-btn small done" onClick={() => onOpen(confirmedId)}><CircleCheck size={22} />{confirmedVersion ? `v${confirmedVersion} 已生效 · 去打卡` : "已生效 · 去打卡"}</button>
        ) : (
          <>
            <button type="button" className="checkin-btn small" disabled={busy} onClick={onConfirm}><CircleCheck size={22} />{diff ? `确认生效 v${diff.next_version}` : "确认生效"}</button>
            <button type="button" className="ghost-btn neon-pink wide" disabled={busy} onClick={onEdit}><PencilLine size={20} />改一改</button>
          </>
        )}
      </div>
    </div>
  );
}


const MAX_CHAT_IMAGES = 4;
const MAX_EDGE = 1280;
const JPEG_QUALITY = 0.8;

type PendingImage = { key: string; mime: string; dataBase64: string; name: string; preview: string };

async function fileToPending(file: File): Promise<PendingImage> {
  if (!file.type.startsWith("image/")) throw new Error("只能发送图片文件");
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("无法处理图片");
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("压缩失败"))), "image/jpeg", JPEG_QUALITY),
    );
    if (blob.size > 4 * 1024 * 1024) throw new Error("图片过大，请换一张更小的");
    const buf = new Uint8Array(await blob.arrayBuffer());
    let bin = "";
    for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
    const dataBase64 = btoa(bin);
    const preview = `data:image/jpeg;base64,${dataBase64}`;
    return { key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, mime: "image/jpeg", dataBase64, name: file.name || "image.jpg", preview };
  } finally {
    bitmap.close();
  }
}

export function ChatPage({ onOpenGoal, onGoSettings, goalId, prefill, onBack }: Props) {
  const [s, setS] = useState<ChatSession | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const streamRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [live, setLive] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [drawer, setDrawer] = useState(false);
  const sidRef = useRef("");
  const [undo, setUndo] = useState<{ item: SessionItem; wasCurrent: boolean } | null>(null);
  const undoTimer = useRef<number | undefined>(undefined);
  const [otherHint, setOtherHint] = useState(false);
  const [ask, setAsk] = useState<{ mid: number; tomorrow: boolean; checked: boolean } | null>(null);
  const [pending, setPending] = useState<PendingImage[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const reviseMode = s ? s.goal_id !== null : goalId !== undefined;
  const busyRef = useRef(false);
  busyRef.current = busy;
  const focusInput = () => requestAnimationFrame(() => {
    const el = inputRef.current;
    if (!el || drawerRef.current) return;
    el.focus();
    const n = el.value.length; el.setSelectionRange(n, n);
  });
  const drawerRef = useRef(false);
  drawerRef.current = drawer;
  // 进入页面、新建/切换会话、回复结束（含出错/取消）后自动聚焦输入框
  useEffect(() => { if (!busy) focusInput(); }, [s?.id, busy, drawer]);
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 8 * 24 + 16)}px`;
  }, [input]);
  useEffect(() => {
    (goalId !== undefined ? chatGoalSession(goalId) : prefill ? chatNewSession() : chatGetSession()).then(setS).catch((e) => setError(String(e)));
    if (prefill) { setInput(prefill); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [goalId]);
  useEffect(() => { streamRef.current?.scrollTo({ top: streamRef.current.scrollHeight }); }, [s, busy, live]);

  const send = async (text: string | null, imgs?: PendingImage[]) => {
    if (!s || busy || busyRef.current) return;
    const batch = imgs ?? [];
    if (text !== null && !text.trim() && !batch.length) return;
    busyRef.current = true;
    setBusy(true); setError("");
    focusInput();
    const payload: ChatImageIn[] | undefined = batch.length
      ? batch.map((x) => ({ mime: x.mime, dataBase64: x.dataBase64, name: x.name }))
      : undefined;
    if (text !== null) {
      const atts: ChatAttachment[] = batch.map((x) => ({ id: x.key, mime: x.mime, name: x.name, data_url: x.preview }));
      setS({ ...s, messages: [...s.messages, { id: -Date.now(), role: "user", text: text.trim(), draft: null, draft_error: null, confirmed_goal_id: null, confirmed_version: null, diff: null, created_at: 0, attachments: atts }] });
      setInput("");
      setPending([]);
    }
    const sid = newStreamId();
    sidRef.current = sid;
    setLive(""); setReason("");
    try { setS(await chatSend(s.id, text, sid, (t) => setLive((x) => (x ?? "") + t), (t) => setReason((x) => x + t), payload)); }
    catch (e) { setError(String(e)); setS(await chatGetSession(s.id).catch(() => s)); }
    finally { setBusy(false); setLive(null); setReason(""); sidRef.current = ""; }
  };

  const addFiles = async (files: FileList | File[]) => {
    const list = [...files].filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setError("");
    try {
      const room = MAX_CHAT_IMAGES - pending.length;
      if (room <= 0) { setError(`一次最多发送 ${MAX_CHAT_IMAGES} 张图片`); return; }
      const next: PendingImage[] = [];
      for (const f of list.slice(0, room)) next.push(await fileToPending(f));
      setPending((p) => [...p, ...next].slice(0, MAX_CHAT_IMAGES));
      if (list.length > room) setError(`一次最多发送 ${MAX_CHAT_IMAGES} 张图片，已加入前 ${room} 张`);
    } catch (e) { setError(String(e)); }
  };

  const confirm = async (mid: number) => {
    if (reviseMode && s?.goal_id != null) {
      // 改方案：先选「从今天起 / 从明天起」，今天已打卡默认明天
      const checked = await goalTodayChecked(s.goal_id).catch(() => false);
      setAsk({ mid, tomorrow: checked, checked });
      return;
    }
    doConfirm(mid, false);
  };
  const doConfirm = async (mid: number, tomorrow: boolean) => {
    setAsk(null);
    setBusy(true); setError("");
    try { onOpenGoal(await confirmDraft(mid, tomorrow)); }
    catch (e) {
      const m = String(e);
      if (m.startsWith("CONFIRMED:")) onOpenGoal(Number(m.slice(10)));
      else setError(m);
    } finally { setBusy(false); }
  };

  const fresh = async () => { setError(""); try { setS(await chatNewSession(s?.goal_id ?? goalId)); } catch (e) { setError(String(e)); } };
  const stop = () => { if (sidRef.current) chatStop(sidRef.current); };
  const pick = async (id: number) => { setDrawer(false); setError(""); try { setS(await chatGetSession(id)); } catch (e) { setError(String(e)); } };
  const onDeleted = async (x: SessionItem) => {
    const wasCurrent = s?.id === x.id;
    window.clearTimeout(undoTimer.current);
    setUndo({ item: x, wasCurrent });
    undoTimer.current = window.setTimeout(() => setUndo(null), 5000);
    if (!wasCurrent) return;
    try { setS(await (goalId !== undefined ? chatGoalSession(goalId) : chatGetSession())); } catch (e) { setError(String(e)); }
  };
  const doUndo = async () => {
    if (!undo) return;
    window.clearTimeout(undoTimer.current);
    const u = undo;
    setUndo(null);
    try {
      await chatUndoDeleteSession(u.item.id);
      if (u.wasCurrent) { setDrawer(false); setS(await chatGetSession(u.item.id)); }
    } catch (e) { setError(String(e)); }
  };
  useEffect(() => () => window.clearTimeout(undoTimer.current), []);
  const lv = live !== null ? liveView(live) : null;

  const msgs = s?.messages ?? [];
  const last = msgs[msgs.length - 1];
  const canRetry = !busy && last?.role === "user";
  const curOpts = !busy && last && last.role === "assistant" && !last.draft ? parseOptions(last.text) : null;
  useEffect(() => { setOtherHint(false); }, [last?.id]);
  const submit = (raw: string) => {
    const m = mapOptionIndex(raw, curOpts);
    if (m && "other" in m) { setInput(""); setOtherHint(true); focusInput(); return; }
    setOtherHint(false);
    const imgs = pending;
    send(m ? m.text : raw, imgs);
  };
  const noKey = error.startsWith("NO_KEY:");

  return (
    <div className="page chat">
      <header className="chat-head">
        <div className="chat-title">
          {onBack && <button type="button" className="icon-btn" title="返回目标" onClick={onBack}><ChevronLeft size={22} /></button>}
          <MessageSquareMore size={26} className={reviseMode ? "pink-text" : "cyan-text"} />
          {reviseMode ? (
            <div><div className="t">改方案 · {s?.goal_title ?? ""}</div><div className="s">当前生效 v{s?.base_version ?? "-"} · 今天以前的日子和打卡会保留</div></div>
          ) : (
            <div><div className="t">{s?.title && s.title !== "新对话" ? s.title : "聊天"}</div><div className="s">与助手规划你的目标</div></div>
          )}
        </div>
        <div className="head-icons">
          <button type="button" className="icon-plain" title="历史会话" onClick={() => setDrawer(true)} disabled={busy}><History size={22} /></button>
          <button type="button" className="icon-plain" title="新对话" onClick={fresh} disabled={busy}><SquarePen size={22} /></button>
          <button type="button" className="icon-plain" title="设置" onClick={onGoSettings}><Settings size={22} /></button>
        </div>
      </header>

      <div className="chat-stream" ref={streamRef}>
        {msgs.length === 0 && reviseMode && (
          <div className="row-ai">
            <div className="avatar bot"><Crosshair size={28} /></div>
            <div className="bubble-ai glass">
              <div className="ai-intro">我已经看过当前计划和打卡情况。想怎么调整？比如：</div>
              {["这周太累了，强度降一点", "把计划再延长一周", "下周出差，改成在酒店能做的"].map((x) => (
                <button key={x} type="button" className="suggest" onClick={() => send(x)}>{x}</button>
              ))}
              <div className="ai-foot">我会给出新版完整计划和变化摘要，你确认后才会切换版本。</div>
            </div>
          </div>
        )}
        {msgs.length === 0 && !reviseMode && (
          <div className="row-ai">
            <div className="avatar bot"><Crosshair size={28} /></div>
            <div className="bubble-ai glass">
              <div className="ai-intro">你好！告诉我你想达成什么目标，比如：</div>
              {["30天减脂 5 斤", "21天读完一本书", "每天写 300 字，坚持一个月"].map((x) => (
                <button key={x} type="button" className="suggest" onClick={() => send(x)}>{x}</button>
              ))}
              <div className="ai-foot">我会先问几个问题，再给你一份按天的计划草案，确认后才会生效。</div>
            </div>
          </div>
        )}
        {msgs.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className={`row-user ${m.id < 0 ? "m-in" : ""}`}>
              <div className="bubble-user">
                {!!m.attachments?.length && (
                  <div className="bubble-imgs">
                    {m.attachments.map((a) => (
                      <img key={a.id} src={a.data_url} alt={a.name || "图片"} className="bubble-img" />
                    ))}
                  </div>
                )}
                {m.text}
              </div>
              <div className="avatar cyan"><UserRound size={24} /></div>
            </div>
          ) : (
            <div key={m.id} className="ai-block">
              <div className="row-ai">
                <div className="avatar bot"><Crosshair size={28} /></div>
                <div className="bubble-ai glass md-bubble"><Markdown text={parseOptions(m.text).body} /></div>
              </div>
              {(() => {
                if (m.draft || m.id !== last?.id || busy) return null;
                const po = parseOptions(m.text);
                if (!po.opts.length) return null;
                return <OptionPicker key={m.id} opts={po.opts} multi={po.multi} closed={po.closed} disabled={busy} onSend={(t) => send(t)}
                  onOther={() => { setInput(""); setOtherHint(true); focusInput(); }} />;
              })()}
              {m.draft && (
                <DraftCard d={m.draft} diff={m.diff} confirmedVersion={m.confirmed_version} confirmedId={m.confirmed_goal_id} busy={busy} onOpen={onOpenGoal}
                  onConfirm={() => confirm(m.id)}
                  onEdit={() => { setInput("我想改一下："); inputRef.current?.focus(); }} />
              )}
              {m.draft_error?.startsWith("NET:") && (
                <div className="draft-card warn net">
                  <div className="draft-title"><WifiOff size={20} />连接中断，已保留收到的内容</div>
                  <div className="muted">网络在回复途中断开了，上面是已经收到的部分。</div>
                  {m.id === last?.id && (
                    <div className="draft-actions">
                      <button type="button" className="ghost-btn neon-pink wide" disabled={busy} onClick={() => send(null)}>
                        <RotateCw size={20} />重试（重新生成这条回复）
                      </button>
                    </div>
                  )}
                </div>
              )}
              {m.draft_error && !m.draft_error.startsWith("NET:") && (
                <div className="draft-card warn">
                  <div className="draft-title"><TriangleAlert size={20} />草案没通过检查</div>
                  <div className="muted">{m.draft_error}</div>
                  {m.id === last?.id && (
                    <div className="draft-actions">
                      <button type="button" className="ghost-btn neon-pink wide" disabled={busy}
                        onClick={() => send(`你上一次输出的计划 JSON 没通过检查：${m.draft_error}。请修正后重新输出完整的 JSON。`)}>
                        <RotateCw size={20} />让助手重新生成
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ),
        )}
        {busy && (
          <div className="row-ai m-in">
            <div className="avatar bot"><Crosshair size={28} /></div>
            {lv && (lv.prose || lv.progress) ? (
              <div className="bubble-ai glass md-bubble live">
                {reason && <details className="think-box"><summary>已思考 {reason.length} 字（点开查看）</summary><div className="think-text">{reason}</div></details>}
                {lv.prose && <Markdown text={lv.prose} />}{!lv.progress && <span className="caret" />}
                {lv.progress && <div className="gen-progress"><Loader size={16} className="spin" />{lv.progress}</div>}
              </div>
            ) : reason ? (
              <div className="bubble-ai glass thinking col">
                <div className="think-head"><Loader size={18} className="spin" />思考中…（{reason.length} 字）</div>
                <details className="think-box"><summary>查看思考过程</summary><div className="think-text">{reason}</div></details>
              </div>
            ) : (
              <div className="bubble-ai glass thinking" aria-label="助手思考中"><span className="typing"><i /><i /><i /></span></div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="error-line chat-error">
          <span>{noKey ? error.slice(7) : error}</span>
          {noKey ? (
            <button type="button" className="mini-btn" onClick={onGoSettings}>去设置</button>
          ) : canRetry ? (
            <button type="button" className="mini-btn" onClick={() => send(null)}>重试</button>
          ) : null}
        </div>
      )}

      <div className="chat-compose">
        {pending.length > 0 && (
          <div className="chat-thumbs">
            {pending.map((x) => (
              <div key={x.key} className="chat-thumb">
                <img src={x.preview} alt={x.name} />
                <button type="button" className="thumb-x" title="移除" disabled={busy} onClick={() => setPending((p) => p.filter((y) => y.key !== x.key))}><X size={12} /></button>
              </div>
            ))}
          </div>
        )}
        <div className="chat-input">
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/*" multiple hidden
            onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }} />
          <button type="button" className="attach-btn" title="添加图片" disabled={busy || pending.length >= MAX_CHAT_IMAGES}
            onClick={() => fileRef.current?.click()}><ImagePlus size={22} /></button>
          <textarea ref={inputRef} rows={1} value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={otherHint && curOpts?.opts.length ? "请直接输入你自己的答案…（Enter 发送）" : curOpts?.opts.length ? "点选上方选项，或输入序号（如 2、3）/ 自己的答案" : "输入文字或添加图片…（Enter 发送，可粘贴截图）"}
            aria-busy={busy}
            onPaste={(e) => {
              const files = [...e.clipboardData.items].filter((i) => i.type.startsWith("image/")).map((i) => i.getAsFile()).filter((f): f is File => !!f);
              if (files.length) { e.preventDefault(); addFiles(files); }
            }}
            onKeyDown={(e) => {
              // 回复生成中可以先打字，但 Enter 不发送
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); if (!busy && !busyRef.current) submit(input); }
            }} />
          {busy ? (
            <button type="button" className="stop-btn" title="停止生成" onClick={stop}><Square size={16} fill="currentColor" />停止生成</button>
          ) : (
            <button type="button" className="send-btn" disabled={!input.trim() && !pending.length} onClick={() => submit(input)}><Send size={24} /></button>
          )}
        </div>
      </div>
      {undo && (
        <div className="undo-bar glass">
          <Trash2 size={16} />已删除「{undo.item.title}」
          <button type="button" className="mini-btn" onClick={doUndo}><Undo2 size={14} />撤销</button>
          <i className="undo-timer" />
        </div>
      )}
      {ask && createPortal(
        <div className="modal-mask" onClick={() => setAsk(null)}>
          <div className="confirm-modal glass neon-pink" onClick={(e) => e.stopPropagation()}>
            <h3><GitCompare size={20} />新方案从哪天开始生效？</h3>
            <label className={`start-opt ${!ask.tomorrow ? "on" : ""}`}>
              <input type="radio" checked={!ask.tomorrow} onChange={() => setAsk({ ...ask, tomorrow: false })} />
              <div><b>从今天起</b><span>今天的安排换成新方案第 1 天{ask.checked ? "（今天的打卡会保留在新的今天上）" : ""}</span></div>
            </label>
            <label className={`start-opt ${ask.tomorrow ? "on" : ""}`}>
              <input type="radio" checked={ask.tomorrow} onChange={() => setAsk({ ...ask, tomorrow: true })} />
              <div><b>从明天起</b><span>今天保持原安排{ask.checked ? "（今天已打卡，推荐）" : ""}，新方案第 1 天从明天开始</span></div>
            </label>
            <div className="muted small-note">当前版本会归档（可在详情页查看），生效日以前的日子和打卡都保留。</div>
            <div className="confirm-actions">
              <button type="button" className="checkin-btn small" onClick={() => doConfirm(ask.mid, ask.tomorrow)}><CircleCheck size={20} />确认生效</button>
              <button type="button" className="ghost-btn wide" onClick={() => setAsk(null)}>取消</button>
            </div>
          </div>
        </div>,
        document.body,
      )}
      {drawer && <SessionDrawer currentId={s?.id ?? null} onPick={pick} onClose={() => setDrawer(false)} onDeleted={onDeleted} />}
      <div className="chat-slogan"><Sparkles size={16} />目标清晰 · 计划智能 · 行动落地</div>
    </div>
  );
}
