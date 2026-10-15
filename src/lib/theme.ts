import { getUiTheme, setUiTheme, type UiTheme } from "./tauri";

export type ThemeMeta = {
  id: UiTheme; name: string; desc: string;
  /** 预览色：背景 / 侧栏 / 卡片 / 主色 / 文字 / 边框 / 卡片阴影 / 圆角 */
  sw: { bg: string; side: string; card: string; pri: string; text: string; border: string; shadow: string; radius: number };
};

export const THEMES: ThemeMeta[] = [
  { id: "glass", name: "玻璃拟态·极光", desc: "毛玻璃 + 极光渐变（默认）",
    sw: { bg: "radial-gradient(60% 70% at 15% 20%, #7c3aed, transparent 70%), radial-gradient(60% 70% at 90% 10%, #06b6d4, transparent 70%), radial-gradient(60% 60% at 70% 100%, #ec4899, transparent 70%), #0d0b1f",
      side: "rgba(255,255,255,.14)", card: "rgba(255,255,255,.16)", pri: "linear-gradient(135deg,#a78bfa,#22d3ee)", text: "#f3f1ff", border: "1px solid rgba(255,255,255,.3)", shadow: "none", radius: 8 } },
  { id: "bento", name: "Bento 便当盒", desc: "浅灰底 + 白色大圆角格子",
    sw: { bg: "#f2f2f0", side: "#111", card: "#fff", pri: "#ff5a1f", text: "#111", border: "none", shadow: "0 1px 2px rgba(0,0,0,.08)", radius: 9 } },
  { id: "brutal", name: "新野兽派", desc: "粗黑描边 + 硬投影 + 撞色",
    sw: { bg: "#fff4d6", side: "#ffd23f", card: "#fff", pri: "#ff6b9d", text: "#000", border: "2px solid #000", shadow: "3px 3px 0 #000", radius: 3 } },
  { id: "clay", name: "黏土风", desc: "糖果色 + 软胖立体",
    sw: { bg: "#eef0ff", side: "#fff", card: "#ffd9e8", pri: "#7c6cf0", text: "#3b3563", border: "none", shadow: "3px 3px 6px rgba(110,100,200,.3), inset 2px 2px 3px #fff", radius: 12 } },
  { id: "neu", name: "新拟物", desc: "同色凸起 / 内凹双阴影",
    sw: { bg: "#e4e9f0", side: "#e4e9f0", card: "#e4e9f0", pri: "#3d6cf2", text: "#3d4a5c", border: "none", shadow: "3px 3px 6px #c3c8cf, -3px -3px 6px #fff", radius: 9 } },
  { id: "ink", name: "东方水墨·宣纸", desc: "宣纸纹理 + 衬线 + 朱砂红",
    sw: { bg: "#f4efe4", side: "transparent", card: "rgba(255,253,247,.8)", pri: "#2a2622", text: "#2a2622", border: "1px solid #d9cfba", shadow: "none", radius: 1 } },
  { id: "neon", name: "赛博霓虹", desc: "深色霓虹发光（原版）",
    sw: { bg: "linear-gradient(180deg,#070818,#120a22)", side: "rgba(14,16,34,.8)", card: "rgba(14,16,34,.7)", pri: "linear-gradient(90deg,#ff2e97,#d946ef)", text: "#f4f6ff", border: "1px solid #22e6ff", shadow: "0 0 6px rgba(34,230,255,.6)", radius: 6 } },
];

const LS = "gpa-theme";
const ids = THEMES.map((t) => t.id);

export function currentTheme(): UiTheme {
  const v = document.documentElement.dataset.theme as UiTheme | undefined;
  return v && ids.includes(v) ? v : "glass";
}

export function applyTheme(t: UiTheme) {
  if (!ids.includes(t)) t = "glass";
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(LS, t); } catch { /* ignore */ }
}

/** 以数据库为准（恢复出厂/导入备份后也会同步）；localStorage 只用于首帧前预先套用，避免闪烁 */
export async function syncThemeFromDb(): Promise<UiTheme> {
  try { const t = await getUiTheme(); applyTheme(t); return t; } catch { return currentTheme(); }
}

export async function saveTheme(t: UiTheme) {
  applyTheme(t);
  await setUiTheme(t);
}
