/** 动效小工具：减少动画开关、数字滚动、滑动高亮块、彩带、庆祝提示条、后台暂停 */
import { useEffect, useLayoutEffect, useRef, useState, type RefObject, type CSSProperties } from "react";
import { getReduceMotion, setReduceMotion } from "./tauri";

const LS = "gpa-reduce-motion";
const mq = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
let userReduce = (() => { try { return localStorage.getItem(LS) === "1"; } catch { return false; } })();

/** 实际是否减少动画：用户开关 或 系统 prefers-reduced-motion */
export const reduced = () => userReduce || !!mq?.matches;
const listeners = new Set<() => void>();

function applyAttr() {
  const r = reduced();
  if (r) document.documentElement.dataset.motion = "reduce";
  else delete document.documentElement.dataset.motion;
  listeners.forEach((f) => f());
}
mq?.addEventListener?.("change", applyAttr);

export function applyReduceMotion(on: boolean) {
  userReduce = on;
  try { localStorage.setItem(LS, on ? "1" : "0"); } catch { /* ignore */ }
  applyAttr();
}
export const userReduceMotion = () => userReduce;

export async function syncMotionFromDb() {
  try { applyReduceMotion(await getReduceMotion()); } catch { applyAttr(); }
}
export async function saveReduceMotion(on: boolean) {
  applyReduceMotion(on);
  await setReduceMotion(on);
}

/** 窗口最小化 / 藏到托盘（页面不可见）时暂停所有动画 */
export function installVisibilityPause() {
  const f = () => {
    if (document.hidden) document.documentElement.dataset.paused = "1";
    else delete document.documentElement.dataset.paused;
  };
  document.addEventListener("visibilitychange", f);
  f();
}

/** 数字滚动（easeOutCubic）。fromZero=true 时挂载就从 0 滚到目标值，否则只在值变化时从旧值滚过去；传入负数表示未就绪 */
export function useRoll(value: number, dur = 600, fromZero = false): number {
  const [v, setV] = useState(fromZero && !reduced() ? 0 : value);
  const prev = useRef(fromZero ? 0 : value);
  useEffect(() => {
    const from = prev.current;
    prev.current = value;
    // 旧值 <0 表示数据还没加载：直接显示，不滚
    if (from === value || from < 0 || reduced()) { setV(value); return; }
    const t0 = performance.now();
    let raf = 0;
    const f = (t: number) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (value - from) * e));
      if (p < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [value, dur]);
  return v;
}

/** 滑动高亮块：返回高亮块的定位样式（相对容器），active 元素用 selector 找 */
export function useSlider(box: RefObject<HTMLElement | null>, selector: string, deps: unknown[]) {
  const [st, setSt] = useState<{ x: number; y: number; w: number; h: number; ready: boolean } | null>(null);
  const first = useRef(true);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const a = el.querySelector<HTMLElement>(selector);
      if (!a) { setSt(null); return; }
      const b = el.getBoundingClientRect(), r = a.getBoundingClientRect();
      setSt({ x: r.left - b.left - el.clientLeft, y: r.top - b.top - el.clientTop, w: r.width, h: r.height, ready: !first.current });
      first.current = false;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.querySelectorAll(":scope > *, :scope nav > *, :scope .nav-list > *, :scope .nav-footer > *").forEach((c) => ro.observe(c));
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  if (!st) return undefined;
  return {
    width: st.w, height: st.h, transform: `translate(${st.x}px, ${st.y}px)`,
    // 首次定位不做过渡，之后切换才滑动
    transition: st.ready ? undefined : "none",
  } as CSSProperties;
}

/** canvas 彩带（参数同原型：140 片、重力 .28、2.2 秒） */
export function confetti() {
  if (reduced()) return;
  const cv = document.createElement("canvas");
  const W = window.innerWidth, H = window.innerHeight, dpr = window.devicePixelRatio || 1;
  cv.width = W * dpr; cv.height = H * dpr;
  cv.className = "confetti-canvas";
  document.body.appendChild(cv);
  const x = cv.getContext("2d")!;
  x.scale(dpr, dpr);
  const cs = getComputedStyle(document.documentElement);
  const theme = [cs.getPropertyValue("--cyan"), cs.getPropertyValue("--pink"), cs.getPropertyValue("--pink2")].map((c) => c.trim()).filter(Boolean);
  const cols = [...theme, "#fde68a", "#86efac"];
  const ox = W / 2, oy = H * 0.42;
  const ps = Array.from({ length: 140 }, (_, i) => ({
    x: ox + (Math.random() - 0.5) * 200, y: oy, vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 11 - 4,
    r: Math.random() * 6, s: 4 + Math.random() * 5, c: cols[i % cols.length], w: Math.random() * 0.3,
  }));
  const t0 = performance.now();
  const f = (t: number) => {
    const el = t - t0;
    x.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.vy += 0.28; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.w;
      x.save(); x.globalAlpha = Math.max(0, 1 - el / 2200); x.translate(p.x, p.y); x.rotate(p.r);
      x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore();
    }
    if (el < 2200) requestAnimationFrame(f); else cv.remove();
  };
  requestAnimationFrame(f);
}

/** 庆祝提示条：顶部滑入，2.6 秒后消失 */
export function celebrateToast(text: string) {
  const t = document.createElement("div");
  t.className = "celebrate-toast glass";
  t.textContent = text;
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("on")));
  setTimeout(() => { t.classList.remove("on"); setTimeout(() => t.remove(), 300); }, 2600);
}

export function useReduced() {
  const [r, setR] = useState(reduced());
  useEffect(() => { const f = () => setR(reduced()); listeners.add(f); return () => { listeners.delete(f); }; }, []);
  return r;
}
