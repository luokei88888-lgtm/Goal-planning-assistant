import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { ChoiceDialog } from "./DbDialogs";

/** 主题内确认弹窗，替代原生 confirm()（原生弹窗不跟随主题）。用法：if (!(await askConfirm("确定？"))) return; */
type Req = { message: string; title: string; ok: string; danger: boolean; resolve: (v: boolean) => void };
let push: ((r: Req) => void) | null = null;

export function askConfirm(message: string, o: { title?: string; ok?: string; danger?: boolean } = {}): Promise<boolean> {
  return new Promise((resolve) => {
    const req = { message, title: o.title ?? "请确认", ok: o.ok ?? "确定", danger: o.danger ?? false, resolve };
    if (push) push(req); else resolve(window.confirm(message));
  });
}

export function ConfirmHost() {
  const [q, setQ] = useState<Req[]>([]);
  useEffect(() => { push = (r) => setQ((x) => [...x, r]); return () => { push = null; }; }, []);
  const cur = q[0];
  if (!cur) return null;
  const done = (v: boolean) => { cur.resolve(v); setQ((x) => x.slice(1)); };
  return (
    <ChoiceDialog title={<><TriangleAlert size={20} />{cur.title}</>} onCancel={() => done(false)} onPick={() => done(true)}
      choices={[{ key: "ok", label: cur.ok, tone: cur.danger ? "danger" : "primary" }]}>
      <p className="confirm-msg">{cur.message}</p>
    </ChoiceDialog>
  );
}
