//! OpenAI 兼容 chat/completions 流式（SSE）解析。按字节缓冲，正确处理跨 chunk 的半行与被切开的多字节字符。

use serde_json::Value;

#[derive(Debug, PartialEq)]
pub enum SseEvent {
    Delta(String),
    /// 思考内容（reasoning_content / reasoning），不进正文
    Reasoning(String),
    Finish(String),
    Done,
    Error(String),
}

#[derive(Default)]
pub struct SseParser {
    buf: Vec<u8>,
}

impl SseParser {
    pub fn push(&mut self, chunk: &[u8]) -> Vec<SseEvent> {
        self.buf.extend_from_slice(chunk);
        let mut out = Vec::new();
        while let Some(pos) = self.buf.iter().position(|&b| b == b'\n') {
            let line: Vec<u8> = self.buf.drain(..=pos).collect();
            let line = String::from_utf8_lossy(&line);
            Self::line(line.trim_end_matches(['\r', '\n']), &mut out);
        }
        out
    }

    /// 流结束时处理没有换行结尾的最后一行
    pub fn finish(&mut self) -> Vec<SseEvent> {
        let mut out = Vec::new();
        if !self.buf.is_empty() {
            let line = String::from_utf8_lossy(&std::mem::take(&mut self.buf)).to_string();
            Self::line(line.trim_end_matches(['\r', '\n']), &mut out);
        }
        out
    }

    fn line(line: &str, out: &mut Vec<SseEvent>) {
        let Some(data) = line.strip_prefix("data:") else { return }; // 注释(:)、event:、id:、空行都忽略
        let data = data.trim();
        if data.is_empty() {
            return;
        }
        if data == "[DONE]" {
            out.push(SseEvent::Done);
            return;
        }
        let Ok(v) = serde_json::from_str::<Value>(data) else { return };
        if let Some(msg) = v.get("error").and_then(|e| e.get("message").and_then(|m| m.as_str()).or(e.as_str())) {
            out.push(SseEvent::Error(msg.chars().take(160).collect()));
            return;
        }
        let ch = &v["choices"][0];
        if let Some(t) = ch["delta"]["reasoning_content"].as_str().or(ch["delta"]["reasoning"].as_str()) {
            if !t.is_empty() {
                out.push(SseEvent::Reasoning(t.to_string()));
            }
        }
        if let Some(t) = ch["delta"]["content"].as_str() {
            if !t.is_empty() {
                out.push(SseEvent::Delta(t.to_string()));
            }
        }
        if let Some(f) = ch["finish_reason"].as_str() {
            out.push(SseEvent::Finish(f.to_string()));
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn d(s: &str) -> String {
        format!("data: {{\"choices\":[{{\"index\":0,\"delta\":{{\"content\":{}}},\"finish_reason\":null}}]}}\n\n", serde_json::to_string(s).unwrap())
    }

    #[test]
    fn parses_split_chunks_and_multibyte() {
        let all = format!(": keep-alive\n\n{}{}data: {{\"choices\":[{{\"delta\":{{}},\"finish_reason\":\"stop\"}}]}}\r\n\r\ndata: [DONE]\n\n", d("你好"), d("，第1天"));
        let bytes = all.as_bytes();
        // 每 3 个字节切一刀：会切开中文字符和 data 行
        let mut p = SseParser::default();
        let mut ev = vec![];
        for c in bytes.chunks(3) {
            ev.extend(p.push(c));
        }
        ev.extend(p.finish());
        let text: String = ev.iter().filter_map(|e| if let SseEvent::Delta(t) = e { Some(t.as_str()) } else { None }).collect();
        assert_eq!(text, "你好，第1天");
        assert!(ev.contains(&SseEvent::Finish("stop".into())));
        assert_eq!(ev.last(), Some(&SseEvent::Done));
    }

    #[test]
    fn length_finish_error_and_tail_without_newline() {
        let mut p = SseParser::default();
        let mut ev = p.push(b"event: x\nid: 1\ndata: {\"choices\":[{\"delta\":{\"content\":\"a\"},\"finish_reason\":\"length\"}]}\n");
        ev.extend(p.push(b"data: {\"error\":{\"message\":\"bad\"}}\ndata: not-json\ndata: {\"choices\":[{\"delta\":{\"content\":\"z\"}}]}"));
        assert_eq!(ev, vec![SseEvent::Delta("a".into()), SseEvent::Finish("length".into()), SseEvent::Error("bad".into())]);
        assert_eq!(p.finish(), vec![SseEvent::Delta("z".into())]);
        assert!(p.finish().is_empty());
    }

    #[test]
    fn reasoning_is_separate() {
        let mut p = SseParser::default();
        let ev = p.push("data: {\"choices\":[{\"delta\":{\"reasoning_content\":\"想\",\"content\":null}}]}\n\ndata: {\"choices\":[{\"delta\":{\"content\":\"ok\"}}]}\n\n".as_bytes());
        assert_eq!(ev, vec![SseEvent::Reasoning("想".into()), SseEvent::Delta("ok".into())]);
    }
}
