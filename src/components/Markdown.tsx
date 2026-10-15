import { Fragment, type ReactNode } from "react";

/** 轻量 Markdown 渲染（不使用 innerHTML）：标题、加粗、斜体、行内代码、有序/无序列表、引用、分隔线、换行 */
function inline(s: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let last = 0; let m: RegExpExecArray | null; let i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const t = m[0];
    const k = `${key}-${i++}`;
    if (t.startsWith("**") || t.startsWith("__")) out.push(<strong key={k}>{inline(t.slice(2, -2), k)}</strong>);
    else if (t.startsWith("`")) out.push(<code key={k}>{t.slice(1, -1)}</code>);
    else out.push(<em key={k}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0; let b = 0;
  while (i < lines.length) {
    const ln = lines[i];
    const k = `b${b++}`;
    if (!ln.trim()) { i++; continue; }
    const h = /^(#{1,6})\s+(.*)$/.exec(ln);
    if (h) { blocks.push(<div key={k} className={`md-h md-h${Math.min(h[1].length, 3)}`}>{inline(h[2], k)}</div>); i++; continue; }
    if (/^\s*([-*_])\s*\1\s*\1[\s\-*_]*$/.test(ln)) { blocks.push(<hr key={k} className="md-hr" />); i++; continue; }
    if (/^\s*[-*+]\s+/.test(ln)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) { items.push(<li key={i}>{inline(lines[i].replace(/^\s*[-*+]\s+/, ""), `${k}-${i}`)}</li>); i++; }
      blocks.push(<ul key={k} className="md-ul">{items}</ul>); continue;
    }
    if (/^\s*\d+[.)、]\s*/.test(ln)) {
      const start = parseInt(/\d+/.exec(ln)![0], 10);
      const items: ReactNode[] = [];
      while (i < lines.length && /^\s*\d+[.)、]\s*/.test(lines[i])) { items.push(<li key={i}>{inline(lines[i].replace(/^\s*\d+[.)、]\s*/, ""), `${k}-${i}`)}</li>); i++; }
      blocks.push(<ol key={k} className="md-ol" start={start}>{items}</ol>); continue;
    }
    if (/^\s*>/.test(ln)) {
      const q: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) { q.push(lines[i].replace(/^\s*>\s?/, "")); i++; }
      blocks.push(<blockquote key={k} className="md-quote">{q.map((x, j) => <Fragment key={j}>{j > 0 && <br />}{inline(x, `${k}-${j}`)}</Fragment>)}</blockquote>); continue;
    }
    const p: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|\s*[-*+]\s+|\s*\d+[.)、]\s*|\s*>)/.test(lines[i])) { p.push(lines[i]); i++; }
    if (!p.length) { p.push(ln); i++; }
    blocks.push(<p key={k} className="md-p">{p.map((x, j) => <Fragment key={j}>{j > 0 && <br />}{inline(x, `${k}-${j}`)}</Fragment>)}</p>);
  }
  return <div className="md">{blocks}</div>;
}
