import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { AppShell, type PageId } from "./layout/AppShell";
import { GoalsPage } from "./pages/GoalsPage";
import { GoalDetailPage } from "./pages/GoalDetailPage";
import { ChatPage } from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ReviewPage } from "./pages/ReviewPage";
import { StatsPage } from "./pages/StatsPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { CloseDialog } from "./components/CloseDialog";
import { DbMissingGuard } from "./components/DbDialogs";
import "./styles/cyber-neon.css";
import "./styles/themes/index.css";
import { syncThemeFromDb } from "./lib/theme";

export default function App() {
  const [page, setPage] = useState<PageId>("goals");
  const [goalId, setGoalId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => { syncThemeFromDb(); }, []);
  const onReset = (text = "已恢复出厂设置") => {
    syncThemeFromDb();
    setGoalId(null);
    setResetKey((k) => k + 1);
    setPage("goals");
    setToast(text);
    setTimeout(() => setToast(""), 3000);
  };
  const [prefill, setPrefill] = useState("");
  const [chatPrefill, setChatPrefill] = useState("");
  const [chatKey, setChatKey] = useState(0);
  const nav = (p: PageId) => { if (p === "chat") setChatPrefill(""); setPage(p); };
  const adjustWithAssistant = (text: string) => { setChatPrefill(text); setChatKey((k) => k + 1); setPage("chat"); };
  const openGoal = (id: number) => { setGoalId(id); setPage("goal-detail"); };
  // 点提醒通知后打开窗口：跳到该目标
  useEffect(() => {
    const un = listen<number>("open-goal", (e) => openGoal(e.payload));
    return () => { un.then((f) => f()); };
  }, []);
  // 关闭窗口「每次询问」：后端拦截后通知前端弹窗
  const [askClose, setAskClose] = useState(false);
  useEffect(() => {
    const un = listen("close-requested", () => setAskClose(true));
    return () => { un.then((f) => f()); };
  }, []);
  const openRevise = (id: number, text = "") => { setGoalId(id); setPrefill(text); setPage("revise"); };
  const openReview = (id: number) => { setGoalId(id); setPage("review"); };

  return (
    <AppShell page={page} onNavigate={nav}>
      {page === "goals" && <GoalsPage key={resetKey} onOpenGoal={openGoal} onTemplates={() => setPage("templates")} />}
      {page === "goal-detail" && goalId !== null && (
        <GoalDetailPage goalId={goalId} onBack={() => { setPage("goals"); setGoalId(null); }}
          onRevise={() => openRevise(goalId)} onReview={() => openReview(goalId)} />
      )}
      {page === "revise" && goalId !== null && (
        <ChatPage key={`r${goalId}-${resetKey}`} goalId={goalId} prefill={prefill} onBack={() => openGoal(goalId)}
          onOpenGoal={openGoal} onGoSettings={() => setPage("settings")} />
      )}
      {page === "review" && goalId !== null && (
        <ReviewPage goalId={goalId} onBack={() => openGoal(goalId)} onRevise={(t) => openRevise(goalId, t)} onGoSettings={() => setPage("settings")} />
      )}
      {page === "chat" && <ChatPage key={`c${resetKey}-${chatKey}`} prefill={chatPrefill} onOpenGoal={openGoal} onGoSettings={() => setPage("settings")} />}
      {page === "stats" && <StatsPage key={resetKey} onOpenGoal={openGoal} />}
      {page === "templates" && <TemplatesPage key={resetKey} onBack={() => setPage("goals")} onOpenGoal={openGoal} onAdjust={adjustWithAssistant} />}
      {page === "settings" && <SettingsPage onReset={onReset} />}
      {toast && <div className="toast">{toast}</div>}
      {askClose && <CloseDialog onClose={() => setAskClose(false)} />}
      <DbMissingGuard onFixed={() => onReset("已切换数据库位置")} />
    </AppShell>
  );
}
