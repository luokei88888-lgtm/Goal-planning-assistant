//! 从模型回复里提取并严格校验 JSON 计划草案。

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::service::{NewDay, NewGoal};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DraftDay {
    pub title: String,
    #[serde(default)]
    pub detail: String,
    pub tasks: Vec<String>,
    pub is_rest: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DraftPlan {
    pub title: String,
    #[serde(default)]
    pub summary: String,
    pub start_date: String,
    pub days_count: usize,
    pub days: Vec<DraftDay>,
}

/// 找到回复里的 JSON：返回 (起点, 终点, JSON 文本)
fn extract(text: &str) -> Option<(usize, usize, String)> {
    if let Some(s) = text.find("```json") {
        let body = s + 7;
        let end = text[body..].find("```").map(|i| body + i)?;
        return Some((s, end + 3, text[body..end].trim().to_string()));
    }
    if let Some(s) = text.find("```") {
        let body = s + 3;
        if let Some(i) = text[body..].find("```") {
            let inner = text[body..body + i].trim();
            if inner.starts_with('{') {
                return Some((s, body + i + 3, inner.to_string()));
            }
        }
    }
    let s = text.find('{')?;
    let e = text.rfind('}')?;
    if e > s && text[s..=e].contains("\"days\"") {
        return Some((s, e + 1, text[s..=e].to_string()));
    }
    None
}

/// 去掉没写完的 ```json 代码块（停止生成 / 被截断时用）
pub fn strip_unclosed_json(text: &str) -> String {
    if let Some(s) = text.find("```") {
        if !text[s + 3..].contains("```") {
            return text[..s].trim_end().to_string();
        }
    }
    text.to_string()
}

pub const TRUNCATED_HINT: &str = "回复太长，达到了长度上限被截断，计划草案不完整。建议缩短周期（例如先排 30 天以内），或分阶段：先生成第一阶段，之后用「改方案」续排后面的日程。";

/// 去掉 JSON 后给用户看的文字
pub fn display_text(text: &str) -> String {
    match extract(text) {
        Some((s, e, _)) => {
            let rest = format!("{}{}", &text[..s], &text[e..]);
            let rest = rest.trim();
            if rest.is_empty() { "这是为你生成的计划草案：".into() } else { rest.to_string() }
        }
        None => text.trim().to_string(),
    }
}

fn need_str(v: &Value, key: &str, ctx: &str) -> Result<String, String> {
    match v.get(key) {
        Some(Value::String(s)) if !s.trim().is_empty() => Ok(s.trim().to_string()),
        Some(Value::String(_)) => Err(format!("{ctx}的 {key} 是空的")),
        Some(_) => Err(format!("{ctx}的 {key} 应该是文字")),
        None => Err(format!("{ctx}缺少字段 {key}")),
    }
}

/// Ok(None)：回复里没有草案（还在追问）；Err：有草案但不合格
pub fn parse_draft(text: &str, today: &str) -> Result<Option<DraftPlan>, String> {
    let Some((_, _, json)) = extract(text) else { return Ok(None) };
    let v: Value = serde_json::from_str(&json).map_err(|e| format!("草案不是合法的 JSON（{e}）"))?;
    if !v.is_object() {
        return Err("草案应该是一个 JSON 对象".into());
    }
    let title = need_str(&v, "title", "草案")?;
    let summary = v.get("summary").and_then(|s| s.as_str()).unwrap_or("").trim().to_string();
    let start_date = need_str(&v, "start_date", "草案")?;
    let start = NaiveDate::parse_from_str(&start_date, "%Y-%m-%d")
        .map_err(|_| format!("开始日期 {start_date} 格式不对，应为 YYYY-MM-DD"))?;
    if let Ok(t) = NaiveDate::parse_from_str(today, "%Y-%m-%d") {
        if start < t {
            return Err(format!("开始日期 {start_date} 早于今天 {today}"));
        }
    }
    let days_count = match v.get("days_count") {
        Some(n) => n.as_u64().ok_or("days_count 应该是正整数")? as usize,
        None => return Err("草案缺少字段 days_count".into()),
    };
    if !(1..=366).contains(&days_count) {
        return Err(format!("天数必须在 1-366 之间，现在是 {days_count}"));
    }
    let arr = v.get("days").and_then(|d| d.as_array()).ok_or("草案缺少 days 数组")?;
    if arr.len() != days_count {
        return Err(format!("days_count 写的是 {days_count} 天，但 days 里实际有 {} 天", arr.len()));
    }
    let mut days = Vec::with_capacity(arr.len());
    for (i, d) in arr.iter().enumerate() {
        let ctx = format!("第 {} 天", i + 1);
        if !d.is_object() {
            return Err(format!("{ctx}应该是一个对象"));
        }
        let title = need_str(d, "title", &ctx)?;
        let tasks = match d.get("tasks") {
            Some(Value::Array(a)) => a
                .iter()
                .map(|t| t.as_str().map(|s| s.trim().to_string()).ok_or(format!("{ctx}的 tasks 里只能是文字")))
                .collect::<Result<Vec<_>, _>>()?,
            Some(_) => return Err(format!("{ctx}的 tasks 应该是文字数组")),
            None => return Err(format!("{ctx}缺少字段 tasks")),
        };
        let is_rest = match d.get("is_rest") {
            Some(Value::Bool(b)) => *b,
            Some(_) => return Err(format!("{ctx}的 is_rest 应该是 true 或 false")),
            None => return Err(format!("{ctx}缺少字段 is_rest")),
        };
        if !is_rest && tasks.iter().all(|t| t.is_empty()) {
            return Err(format!("{ctx}不是休息日，但没有任务"));
        }
        let detail = d.get("detail").and_then(|s| s.as_str()).unwrap_or("").trim().to_string();
        days.push(DraftDay { title, detail, tasks: tasks.into_iter().filter(|t| !t.is_empty()).collect(), is_rest });
    }
    Ok(Some(DraftPlan { title, summary, start_date, days_count, days }))
}

fn guess_icon(title: &str) -> &'static str {
    let has = |ks: &[&str]| ks.iter().any(|k| title.contains(k));
    if has(&["减脂", "减肥", "健身", "跑", "运动", "训练", "瘦"]) {
        "flame"
    } else if has(&["读", "书", "阅读"]) {
        "book"
    } else if has(&["写", "日记", "文章", "笔记"]) {
        "notebook"
    } else {
        "target"
    }
}

impl DraftPlan {
    pub fn to_new_goal(&self, start_date: String) -> NewGoal {
        NewGoal {
            title: self.title.clone(),
            description: self.summary.clone(),
            icon: Some(guess_icon(&self.title).into()),
            source: Some("chat".into()),
            summary: self.summary.clone(),
            start_date,
            days: self
                .days
                .iter()
                .map(|d| NewDay {
                    title: d.title.clone(),
                    detail: if d.detail.is_empty() { d.tasks.join(" · ") } else { d.detail.clone() },
                    tasks: d.tasks.clone(),
                    is_rest: d.is_rest,
                })
                .collect(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const OK: &str = r#"好的，方案如下：
```json
{"title":"7天早睡","summary":"每天23点前睡","start_date":"2026-10-15","days_count":2,
 "days":[{"title":"23点上床","tasks":["22:30 放下手机"],"is_rest":false},
         {"title":"放松日","tasks":[],"is_rest":true}]}
```
确认后就会生效。"#;

    #[test]
    fn parses_valid_draft_and_strips_json() {
        let d = parse_draft(OK, "2026-10-14").unwrap().unwrap();
        assert_eq!(d.title, "7天早睡");
        assert_eq!(d.days.len(), 2);
        assert!(d.days[1].is_rest);
        let shown = display_text(OK);
        assert!(shown.contains("好的") && shown.contains("确认后") && !shown.contains("days_count"));
    }

    #[test]
    fn options_block_is_not_a_draft() {
        let t = "你平时怎么吃早餐？\n```options\n自己做\n外卖\n食堂\n```";
        assert!(parse_draft(t, "2026-10-15").unwrap().is_none());
        assert!(display_text(t).contains("```options"), "选项块留给前端解析");
    }

    #[test]
    fn no_json_means_still_asking() {
        assert_eq!(parse_draft("你每天能抽出多少时间？", "2026-10-14").unwrap(), None);
    }

    #[test]
    fn rejects_bad_drafts() {
        let cases = [
            (OK.replace("\"days_count\":2", "\"days_count\":3"), "实际有 2 天"),
            (OK.replace("\"days_count\":2", "\"days_count\":0"), "1-366"),
            (OK.replace("\"is_rest\":true", "\"is_rest\":\"yes\""), "is_rest"),
            (OK.replace("\"tasks\":[\"22:30 放下手机\"],", ""), "第 1 天缺少字段 tasks"),
            (OK.replace("\"title\":\"7天早睡\",", ""), "缺少字段 title"),
            (OK.replace("2026-10-15", "2026/10/15"), "格式不对"),
            (OK.replace("2026-10-15", "2026-10-01"), "早于今天"),
            (OK.replace("}]}", "}]"), "不是合法的 JSON"),
        ];
        for (text, want) in cases {
            let err = parse_draft(&text, "2026-10-14").unwrap_err();
            assert!(err.contains(want), "期望包含「{want}」，实际：{err}");
        }
    }

    #[test]
    fn strips_unclosed_block() {
        assert_eq!(strip_unclosed_json("思路如下\n```json\n{\"title\":"), "思路如下");
        assert_eq!(strip_unclosed_json(OK), OK);
        assert_eq!(strip_unclosed_json("没有代码块"), "没有代码块");
    }

    #[test]
    fn big_plan_limit() {
        let day = r#"{"title":"t","tasks":["a"],"is_rest":false}"#;
        let days = vec![day; 367].join(",");
        let text = format!(r#"{{"title":"x","start_date":"2026-10-14","days_count":367,"days":[{days}]}}"#);
        assert!(parse_draft(&text, "2026-10-14").unwrap_err().contains("1-366"));
    }
}
