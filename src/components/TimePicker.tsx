import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Clock } from "lucide-react";
import { useAnchoredPos, useDismiss } from "./popover";

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  className?: string;
  presets?: string[];
  "aria-label"?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const STEP_MIN = Array.from({ length: 12 }, (_, i) => i * 5);
/** 解析 "H:M" / "HHMM" / "HH:MM"，非法返回 null */
export function parseTime(s: string): [number, number] | null {
  const t = s.trim().replace("：", ":");
  const m = /^(\d{1,2})(?::?(\d{2}))?$/.exec(t);
  if (!m) return null;
  const h = Number(m[1]), mi = Number(m[2] ?? 0);
  return h < 24 && mi < 60 ? [h, mi] : null;
}

/** 跟随主题的时间选择器：小时 / 分钟两列（分钟 5 分一档，可直接键入任意分钟），常用时间快捷键，↑↓←→ / Enter / Esc */
export function TimePicker({ value, onChange, disabled, className, presets = ["21:00", "22:00", "23:00"], ...rest }: Props) {
  const [open, setOpen] = useState(false);
  const [col, setCol] = useState<"h" | "m">("h");
  const [text, setText] = useState(value);
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const hCol = useRef<HTMLDivElement>(null);
  const mCol = useRef<HTMLDivElement>(null);
  const { pos } = useAnchoredPos(btn, open, { estH: 300, width: 232, align: "left" });
  const [h, m] = parseTime(value) ?? [21, 0];
  const mins = STEP_MIN.includes(m) ? STEP_MIN : [...STEP_MIN, m].sort((a, b) => a - b);

  const close = (focus = true) => { setOpen(false); if (focus) btn.current?.focus(); };
  useDismiss(open, [btn, pop], () => close(false));
  useEffect(() => { setText(value); }, [value]);
  const set = (hh: number, mm: number) => { const v = `${pad(hh)}:${pad(mm)}`; if (v !== value) onChange(v); };

  // 让选中项滚到列中间（只滚列本身，不带动页面）
  useLayoutEffect(() => {
    if (!open) return;
    for (const c of [hCol.current, mCol.current]) {
      const on = c?.querySelector<HTMLElement>(".tp-cell.on");
      if (c && on) c.scrollTop = on.offsetTop - c.clientHeight / 2 + on.offsetHeight / 2;
    }
  }, [open, h, m]);
  useEffect(() => { if (open) requestAnimationFrame(() => pop.current?.focus()); }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const d = e.key === "ArrowUp" ? -1 : 1;
      if (col === "h") set((h + d + 24) % 24, m);
      else { const i = mins.indexOf(m); set(h, mins[(i + d + mins.length) % mins.length]); }
    } else if (e.key === "ArrowLeft") { e.preventDefault(); setCol("h"); }
    else if (e.key === "ArrowRight") { e.preventDefault(); setCol("m"); }
    else if (e.key === "Enter") { e.preventDefault(); close(); }
    else if (e.key === "Tab") close(false);
  };
  const commitText = () => { const p = parseTime(text); if (p) { set(p[0], p[1]); return true; } setText(value); return false; };

  return (
    <>
      <button ref={btn} type="button" className={`tp-btn time-input ${open ? "open" : ""} ${className ?? ""}`} disabled={disabled}
        aria-haspopup="dialog" aria-expanded={open} aria-label={rest["aria-label"] ?? "选择时间"}
        onClick={() => (open ? close() : setOpen(true))}
        onKeyDown={(e) => { if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); setOpen(true); } }}>
        <span className="tp-val">{value || "--:--"}</span><Clock size={15} className="tp-ico" />
      </button>
      {open && createPortal(
        <div ref={pop} className="tp-pop pop-solid" role="dialog" aria-label="选择时间" tabIndex={-1} style={pos} onKeyDown={onKey}>
          <input className="tp-input" value={text} inputMode="numeric" maxLength={5} aria-label="直接输入时间，如 22:37"
            onChange={(e) => setText(e.target.value)} onBlur={commitText}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); if (commitText()) close(); }
              else if (e.key === "Escape") { setText(value); }
            }} />
          <div className="tp-cols">
            <div ref={hCol} className={`tp-col ${col === "h" ? "act" : ""}`} role="listbox" aria-label="小时">
              {HOURS.map((x) => (
                <button key={x} type="button" tabIndex={-1} role="option" aria-selected={x === h}
                  className={`tp-cell ${x === h ? "on" : ""}`} onClick={() => { setCol("h"); set(x, m); }}>{pad(x)}</button>
              ))}
            </div>
            <div ref={mCol} className={`tp-col ${col === "m" ? "act" : ""}`} role="listbox" aria-label="分钟">
              {mins.map((x) => (
                <button key={x} type="button" tabIndex={-1} role="option" aria-selected={x === m}
                  className={`tp-cell ${x === m ? "on" : ""}`} onClick={() => { setCol("m"); set(h, x); }}>{pad(x)}</button>
              ))}
            </div>
          </div>
          <div className="tp-presets">
            {presets.map((p) => (
              <button key={p} type="button" className={`tp-chip ${p === value ? "on" : ""}`}
                onClick={() => { const t = parseTime(p); if (t) set(t[0], t[1]); close(); }}>{p}</button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
