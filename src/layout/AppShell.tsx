import type { ReactNode } from "react";
import { Crosshair, Target, MessageCircle, Settings, ChartColumn } from "lucide-react";
import { StatusPill } from "../components/StatusPill";

export type PageId = "goals" | "chat" | "settings" | "goal-detail" | "revise" | "review" | "stats" | "templates";

type Props = { page: PageId; onNavigate: (page: PageId) => void; children: ReactNode };

export function AppShell({ page, onNavigate, children }: Props) {
  const active = page === "goal-detail" || page === "revise" || page === "review" || page === "templates" ? "goals" : page;
  const item = (id: PageId, label: string, Icon: typeof Target, tone: "cyan" | "pink") => (
    <button
      type="button"
      className={`nav-item tone-${tone} ${active === id ? "active" : ""}`}
      onClick={() => onNavigate(id)}
    >
      <Icon size={22} strokeWidth={1.8} />
      <span>{label}</span>
    </button>
  );
  return (
    <div className="app-bg">
      <div className="bg-grid" />
      <div className="bg-glow g1" />
      <div className="bg-glow g2" />
      <div className="app-shell">
        <aside className="sidebar glass">
          <div className="brand">
            <div className="brand-icon"><Crosshair size={40} strokeWidth={1.6} /></div>
            <div className="brand-name">目标计划助手</div>
            <div className="brand-en">GOAL PLAN ASSISTANT</div>
          </div>
          <nav className="nav-list">
            {item("goals", "目标", Target, "cyan")}
            {item("chat", "聊天", MessageCircle, "pink")}
            {item("stats", "统计", ChartColumn, "cyan")}
          </nav>
          <div className="nav-footer">
            {item("settings", "设置", Settings, "cyan")}
            <StatusPill />
          </div>
        </aside>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
