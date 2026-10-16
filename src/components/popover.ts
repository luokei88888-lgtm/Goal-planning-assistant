/** 弹出层公共逻辑：挂到 body（portal）后用 fixed 定位贴着锚点；滚动跟随、窗口变化重算、点外部 / Esc 关闭。
 *  不放在卡片里，是因为卡片的 backdrop-filter / transform / 动画会各自形成层叠上下文，里面的 z-index 再大也盖不过后面的兄弟元素。 */
import { useCallback, useEffect, useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";

type Opts = { estH: number; width?: number; matchWidth?: boolean; gap?: number; align?: "left" | "right" };

export function useAnchoredPos(anchor: RefObject<HTMLElement | null>, open: boolean, o: Opts) {
  const [pos, setPos] = useState<CSSProperties>({ position: "fixed", visibility: "hidden" });
  const place = useCallback(() => {
    const r = anchor.current?.getBoundingClientRect();
    if (!r) return;
    const gap = o.gap ?? 6;
    const below = window.innerHeight - r.bottom - gap - 8;
    const above = r.top - gap - 8;
    const up = below < Math.min(o.estH, 200) && above > below;
    const maxH = Math.max(120, Math.min(o.estH, up ? above : below));
    const w = o.width ?? r.width;
    let left = o.align === "right" ? r.right - w : r.left;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    setPos({
      position: "fixed", left, maxHeight: maxH, ...(o.matchWidth ? { width: r.width } : o.width ? { width: o.width } : {}),
      ...(up ? { bottom: window.innerHeight - r.top + gap } : { top: r.bottom + gap }),
    });
    // 锚点被滚出可视区就隐藏，避免悬在别的内容上
    if (r.bottom < 0 || r.top > window.innerHeight) setPos((p) => ({ ...p, visibility: "hidden" }));
  }, [anchor, o.estH, o.width, o.matchWidth, o.gap, o.align]);
  useLayoutEffect(() => { if (open) place(); }, [open, place]);
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const re = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); };
    window.addEventListener("scroll", re, true);
    window.addEventListener("resize", re);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", re, true); window.removeEventListener("resize", re); };
  }, [open, place]);
  return { pos, place };
}

/** 点在 refs 之外（按下鼠标）、按 Esc、窗口失焦时关闭 */
export function useDismiss(open: boolean, refs: RefObject<HTMLElement | null>[], close: () => void) {
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!refs.some((r) => r.current?.contains(t))) close();
    };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); close(); } };
    const blur = () => close();
    window.addEventListener("mousedown", down, true);
    window.addEventListener("keydown", key, true);
    window.addEventListener("blur", blur);
    return () => { window.removeEventListener("mousedown", down, true); window.removeEventListener("keydown", key, true); window.removeEventListener("blur", blur); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}
