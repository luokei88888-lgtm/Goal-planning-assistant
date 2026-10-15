import { useEffect, useRef, useState } from "react";
import { AudioLines } from "lucide-react";
import { modelStatus, getSettings, type ModelStatus } from "../lib/tauri";

/** 侧栏底部状态：只显示模型名 + 圆点（绿=在线，红=不可用，检测中闪烁） */
type View = { tone: "checking" | "ok" | "bad"; detail: string; at: number | null };

const hm = (t: number) => { const d = new Date(t); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`; };

function reasonOf(s: ModelStatus): string {
  if (s.state === "no_key") return "未配置 API Key，请到「设置」填写";
  const short = s.state === "auth" ? "鉴权失败" : s.state === "busy" ? "服务繁忙" : s.state === "timeout" ? "检测超时" : s.state === "net" ? "连不上服务" : s.state === "billing" ? "余额不足" : "服务异常";
  return s.reason || short;
}

function fromChatError(err: string): string {
  if (err.startsWith("NO_KEY:")) return "未配置 API Key";
  if (/HTTP (401|403)|Key 无效|鉴权/.test(err)) return "鉴权失败";
  if (/HTTP 402|余额/.test(err)) return "余额不足";
  if (/HTTP (429|5\d\d)|繁忙|busy|频繁/i.test(err)) return "服务繁忙";
  if (/超时|timeout/i.test(err)) return "响应超时";
  if (/中断|连不上|网络/.test(err)) return "连接中断";
  return "请求失败";
}

export function StatusPill() {
  const [model, setModel] = useState("");
  const [v, setV] = useState<View>({ tone: "checking", detail: "正在检测…", at: null });
  const seq = useRef(0);

  const check = async () => {
    const my = ++seq.current;
    setV((x) => ({ ...x, tone: "checking" }));
    if (!navigator.onLine) {
      getSettings().then((s) => setModel(s.model.trim())).catch(() => {});
      setV({ tone: "bad", detail: "当前没有网络连接（目标、计划和打卡仍可正常使用）", at: Date.now() });
      return;
    }
    try {
      const s = await modelStatus();
      if (my !== seq.current) return;
      setModel(s.model.trim());
      setV(s.state === "ok" ? { tone: "ok", detail: `${s.provider} 在线，可以使用聊天规划`, at: Date.now() } : { tone: "bad", detail: `${s.provider}：${reasonOf(s)}`, at: Date.now() });
    } catch (e) {
      if (my === seq.current) setV({ tone: "bad", detail: `检测失败：${String(e)}`, at: Date.now() });
    }
  };

  useEffect(() => {
    check();
    const on = () => check();
    const rep = (e: Event) => {
      const d = (e as CustomEvent<{ ok: boolean; err: string }>).detail;
      if (!navigator.onLine) { check(); return; }
      seq.current++;
      setV(d.ok ? { tone: "ok", detail: "最近一次聊天请求成功", at: Date.now() } : { tone: "bad", detail: `最近一次聊天请求失败：${fromChatError(d.err)}`, at: Date.now() });
    };
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    window.addEventListener("model-status-check", on);
    window.addEventListener("model-status-report", rep);
    const timer = window.setInterval(check, 5 * 60 * 1000);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
      window.removeEventListener("model-status-check", on);
      window.removeEventListener("model-status-report", rep);
      window.clearInterval(timer);
    };
  }, []);

  const noModel = !model;
  const tone = noModel && v.tone !== "checking" ? "bad" : v.tone;
  const detail = noModel && v.tone !== "checking" ? `未配置模型名，请到「设置」选择模型${v.detail ? `\n${v.detail}` : ""}` : v.detail;
  const title = `${detail}${v.at ? `\n上次检测：${hm(v.at)}` : ""}\n点击立即重新检测`;
  return (
    <button type="button" className={`status-pill st-${tone}`} title={title} onClick={() => check()}>
      <AudioLines size={20} className="st-icon" />
      <span className="st-text">{noModel ? (v.tone === "checking" && v.at === null ? "检测中…" : "未配置模型") : model}</span>
      <i className="dot" />
    </button>
  );
}
