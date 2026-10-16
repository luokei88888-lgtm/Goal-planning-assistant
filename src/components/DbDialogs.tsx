import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, Database, FolderSearch, House, RefreshCw, TriangleAlert } from "lucide-react";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { dbLocation, dbRelink, dbUseDefault, type DbLocation } from "../lib/tauri";

export type Choice = { key: string; label: ReactNode; tone?: "primary" | "danger" };

/** 通用选择对话框（风格跟随主题：复用关闭对话框的样式） */
export function ChoiceDialog({ title, children, choices, onPick, onCancel, busy, err }: {
  title: ReactNode; children: ReactNode; choices: Choice[]; onPick: (k: string) => void; onCancel?: () => void; busy?: boolean; err?: string;
}) {
  useEffect(() => {
    if (!onCancel) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape" && !busy) { e.preventDefault(); onCancel(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onCancel, busy]);
  return createPortal(
    <div className="modal-mask" onClick={busy || !onCancel ? undefined : onCancel}>
      <div className="close-modal db-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <header className="close-head">
          <h2>{title}</h2>
          {onCancel && <button type="button" className="icon-btn" title="取消（Esc）" disabled={busy} onClick={onCancel}><X size={18} /></button>}
        </header>
        <div className="close-desc">{children}</div>
        {err && <div className="error-line">{err}</div>}
        <footer className="close-foot">
          {onCancel && <button type="button" className="cl-btn" disabled={busy} onClick={onCancel}>取消</button>}
          {choices.map((c) => (
            <button key={c.key} type="button" className={`cl-btn ${c.tone ?? ""}`} disabled={busy} onClick={() => onPick(c.key)}>{c.label}</button>
          ))}
        </footer>
      </div>
    </div>,
    document.body,
  );
}

/** 启动时检查：配置的数据库位置找不到（如 U 盘拔了）时提示，不静默新建空库 */
export function DbMissingGuard({ onFixed }: { onFixed: () => void }) {
  const [loc, setLoc] = useState<DbLocation | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [confirmDefault, setConfirmDefault] = useState(false);
  const check = () => dbLocation().then(setLoc).catch(() => {});
  useEffect(() => { check(); }, []);
  if (!loc?.missing) return null;
  const done = () => { setLoc(null); onFixed(); };
  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true); setErr("");
    try { await fn(); } catch (e) { setErr(String(e)); } finally { setBusy(false); }
  };
  const pick = async (k: string) => {
    if (k === "retry") return run(async () => { const l = await dbLocation(); setLoc(l); if (l.missing) setErr("还是找不到，请确认磁盘已连接。"); else done(); });
    if (k === "relink") return run(async () => {
      const dir = await openDialog({ directory: true, title: "选择数据库所在的文件夹" });
      if (typeof dir !== "string") return;
      await dbRelink(dir); done();
    });
    if (k === "default") setConfirmDefault(true);
  };
  if (confirmDefault) {
    return (
      <ChoiceDialog title={<><House size={20} />回到默认位置</>} busy={busy} err={err} onCancel={() => setConfirmDefault(false)}
        choices={[{ key: "ok", label: "确定回到默认位置", tone: "primary" }]}
        onPick={() => run(async () => { await dbUseDefault(); setConfirmDefault(false); done(); })}>
        <p>将改用默认位置的数据库：<br /><code className="db-path">{loc.default_dir}</code></p>
        <p>如果默认位置还没有数据库，会新建一个空的。原位置 <code className="db-path">{loc.dir}</code> 的数据不会被删除，磁盘重新连接后可以在「设置 → 运行状态」里再选回去。</p>
      </ChoiceDialog>
    );
  }
  return (
    <ChoiceDialog title={<><TriangleAlert size={20} />找不到数据库</>} busy={busy} err={err} onPick={pick}
      choices={[
        { key: "retry", label: <><RefreshCw size={16} />重试</> },
        { key: "default", label: <><House size={16} />回到默认位置</> },
        { key: "relink", label: <><FolderSearch size={16} />重新选择位置</>, tone: "primary" },
      ]}>
      <p><Database size={14} /> 设置的数据库位置当前不可用：<br /><code className="db-path">{loc.path}</code></p>
      <p>可能是 U 盘或移动硬盘没有连接，数据并没有丢失。连接后点「重试」；也可以选择数据库所在的另一个文件夹，或者回到默认位置。</p>
    </ChoiceDialog>
  );
}
