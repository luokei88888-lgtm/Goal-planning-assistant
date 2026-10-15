import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, LogOut, PanelBottomClose, Power } from "lucide-react";
import { closeWindowChoice } from "../lib/tauri";

/** 关闭窗口时的询问对话框；Esc = 取消 */
export function CloseDialog({ onClose }: { onClose: () => void }) {
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const pick = async (a: "tray" | "exit") => {
    setBusy(true); setErr("");
    try { await closeWindowChoice(a, remember); onClose(); } catch (e) { setErr(String(e)); setBusy(false); }
  };
  return createPortal(
    <div className="modal-mask" onClick={busy ? undefined : onClose}>
      <div className="close-modal" role="dialog" aria-modal="true" aria-labelledby="close-title" onClick={(e) => e.stopPropagation()}>
        <header className="close-head">
          <h2 id="close-title"><Power size={20} />关闭窗口</h2>
          <button type="button" className="icon-btn" title="取消（Esc）" disabled={busy} onClick={onClose}><X size={18} /></button>
        </header>
        <p className="close-desc">隐藏后程序还在托盘里，点图标可以再打开。退出才是真正关掉。</p>
        <label className="close-check">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span className="cbox" />下次不再询问
        </label>
        {err && <div className="error-line">{err}</div>}
        <footer className="close-foot">
          <button type="button" className="cl-btn" disabled={busy} onClick={onClose}>取消</button>
          <button type="button" className="cl-btn danger" disabled={busy} onClick={() => pick("exit")}><LogOut size={16} />退出程序</button>
          <button type="button" className="cl-btn primary" disabled={busy} autoFocus onClick={() => pick("tray")}><PanelBottomClose size={16} />隐藏到托盘</button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
