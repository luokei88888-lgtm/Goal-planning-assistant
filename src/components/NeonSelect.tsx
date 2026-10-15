import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export type NeonOption<V extends string | number> = { value: V; label: string; badge?: string; badgeTone?: "muted" | "cyan" | "pink" | "green" };

type Props<V extends string | number> = {
  value: V;
  options: NeonOption<V>[];
  onChange: (v: V) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  title?: string;
  "aria-label"?: string;
};

/** 赛博霓虹下拉：键盘 ↑↓/Home/End/Enter/Esc，点外部关闭，靠近底部向上弹出 */
export function NeonSelect<V extends string | number>({ value, options, onChange, disabled, className, placeholder, title, ...rest }: Props<V>) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const [pos, setPos] = useState<CSSProperties>({});
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const cur = options.findIndex((o) => o.value === value);
  const sel = cur >= 0 ? options[cur] : null;

  const place = () => {
    const r = btn.current?.getBoundingClientRect();
    if (!r) return;
    const want = Math.min(options.length * 38 + 10, 300);
    const below = window.innerHeight - r.bottom - 8;
    const above = r.top - 8;
    const up = below < Math.min(want, 200) && above > below;
    const maxH = Math.max(120, Math.min(want, up ? above : below));
    setPos({
      position: "fixed", left: r.left, minWidth: r.width, maxWidth: Math.max(r.width, Math.min(420, window.innerWidth - r.left - 8)), maxHeight: maxH,
      ...(up ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }),
    });
  };
  const show = () => { if (disabled) return; place(); setHi(cur >= 0 ? cur : 0); setOpen(true); };
  const close = (focus = true) => { setOpen(false); if (focus) btn.current?.focus(); };
  const choose = (i: number) => { const o = options[i]; if (o) { if (o.value !== value) onChange(o.value); } close(); };

  useLayoutEffect(() => { if (open) list.current?.querySelector<HTMLElement>(`[data-i="${hi}"]`)?.scrollIntoView({ block: "nearest" }); }, [open, hi]);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!btn.current?.contains(t) && !list.current?.contains(t)) close(false);
    };
    const away = (e: Event) => { if (!list.current?.contains(e.target as Node)) close(false); };
    window.addEventListener("mousedown", down, true);
    window.addEventListener("scroll", away, true);
    window.addEventListener("resize", away);
    window.addEventListener("blur", away);
    return () => {
      window.removeEventListener("mousedown", down, true);
      window.removeEventListener("scroll", away, true);
      window.removeEventListener("resize", away);
      window.removeEventListener("blur", away);
    };
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const n = options.length;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); show(); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => (h + 1) % n); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => (h - 1 + n) % n); }
    else if (e.key === "Home") { e.preventDefault(); setHi(0); }
    else if (e.key === "End") { e.preventDefault(); setHi(n - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(hi); }
    else if (e.key === "Tab") close(false);
  };

  return (
    <>
      <button ref={btn} type="button" className={`nsel ${open ? "open" : ""} ${className ?? ""}`} disabled={disabled} title={title}
        aria-haspopup="listbox" aria-expanded={open} aria-label={rest["aria-label"]}
        onClick={() => (open ? close() : show())} onKeyDown={onKey}>
        <span className="nsel-val">
          {sel ? sel.label : <em className="nsel-ph">{placeholder ?? "请选择"}</em>}
          {sel?.badge && <i className={`nsel-badge ${sel.badgeTone ?? "muted"}`}>{sel.badge}</i>}
        </span>
        <ChevronDown size={15} className="nsel-arrow" />
      </button>
      {open && createPortal(
        <ul ref={list} className="nsel-list" role="listbox" style={pos} onMouseDown={(e) => e.preventDefault()}>
          {options.map((o, i) => (
            <li key={String(o.value)} data-i={i} role="option" aria-selected={o.value === value}
              className={`nsel-opt ${i === hi ? "hi" : ""} ${o.value === value ? "on" : ""}`}
              onMouseEnter={() => setHi(i)} onClick={() => choose(i)}>
              <span className="nsel-check">{o.value === value && <Check size={14} />}</span>
              <span className="nsel-label">{o.label}</span>
              {o.badge && <i className={`nsel-badge ${o.badgeTone ?? "muted"}`}>{o.badge}</i>}
            </li>
          ))}
        </ul>,
        document.body,
      )}
    </>
  );
}
