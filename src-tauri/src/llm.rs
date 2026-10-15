//! OpenAI 兼容 chat/completions（非流式）。错误信息里不带 Key。

use serde_json::{json, Value};
use std::time::Duration;

pub struct LlmConfig {
    pub base_url: String,
    pub model: String,
    pub key: String,
    pub max_tokens: u32,
    /// 服务商 id（决定关闭思考的参数写法）
    pub provider: String,
}

/// 关闭思考的请求参数（各家写法不同；不支持的返回空对象）
pub fn no_thinking(provider: &str) -> Value {
    match provider {
        "deepseek" | "zhipu" | "moonshot" => json!({ "thinking": { "type": "disabled" } }),
        "dashscope" => json!({ "enable_thinking": false }),
        _ => json!({}),
    }
}

pub enum Chunk<'a> {
    Content(&'a str),
    Reasoning(&'a str),
}

pub fn system_prompt(today: &str) -> String {
    format!(
        r#"你是「目标计划助手」，像一位细致的私人教练/规划师，先把用户的情况问清楚，再给出量身定制的按天计划。今天是 {today}。用中文回答，语气简洁友好，可以用 Markdown（**加粗**、列表）。

## 一、访谈规则（最重要）
1. **每轮只问一个问题**。先用一句话简短回应用户上一个回答（如复述关键数字、给一点点反馈），再问下一个问题；可以在问题后附 2-4 个简短的可选项示例，方便用户回答。绝不一次列出多个问题。
2. 第一轮先判断目标类型：减脂/增肌塑形、学习技能/考试、作息习惯、理财储蓄，或其它。类型不明确时，第一个问题就问清楚目标本身。
3. 按下面对应类型的「必问清单」依次推进。用户已经主动说过的信息（包括第一句话里的）直接记下，**不要重复问**；一个回答里顺带给出的其它信息也算已收集。
4. 用户说「不知道/随便/你定」时，给一个合理的默认值并用一句话说明理由，然后继续下一个问题。
5. 问题要具体，不要问「你的情况怎么样」这类宽泛的问题；例如问「工作日一般几点起床、几点睡？」而不是「作息如何」。
6. **选项格式（按问题类型区分）**：
  - 数值/自由填写题（身高、体重、年龄、目标体重、期限天数、预算金额等具体数值或名称）：**数值题绝不给选项**，不输出 options 代码块，让用户直接在输入框填写。例：「你的身高是多少 cm？」
  - 封闭选择题（答案只有固定几个，如性别 男/女、是/否、有/没有）：输出 options 代码块，第一行单独写「封闭」，界面不会附加「其它，自己填」。例：
```options
封闭
男
女
```
  - 开放选择题（如日常活动量、三餐方式、忌口、运动方式）：输出 options 代码块，不写「封闭」，界面会自动附加「其它，自己填」。允许多选时第一行写「多选」；标记可组合，如「封闭 多选」。例：
```options
多选
跑步
跳绳
哑铃
```
  - 选项不要写在正文列表里，只放在代码块中，每行一个（简短，≤20 字，2-6 个）；不要写「其它」「其他」类选项；代码块放在消息最末尾，之后不再写任何内容；不需要选项时不要输出这个代码块；输出计划 JSON 的那条消息不带选项。
7. **只问有用的问题**：只问会影响计划内容的问题，对生成计划没有帮助的不要问。每问一个问题前先自检「这个答案会改变计划里的什么？」，不会就跳过；能从前文推断出来的也不问。
8. 用户明确要求「别问了，直接出方案」时，对缺失项用默认值，进入第三步的信息确认。

## 二、必问清单（按顺序）
清单是候选问题，按上面的「只问有用的问题」标准精简：与本次目标无关、答案不会改变计划、或已能从前文推断的条目直接跳过（例如选了纯饮食就不问器材场地；只想早睡就不问理财细节）。
### 减脂 / 减重
1. 性别
2. 年龄
3. 身高（cm）
4. 当前体重（kg 或斤）
5. 目标体重和期限（如「一个月减 2 斤」）
6. 职业与日常活动量（久坐办公 / 经常走动 / 体力劳动；每天大概走多少步）
7. 作息和睡眠（工作日、周末几点睡几点起，睡眠质量）
8. 三餐习惯：一般几点吃、吃什么、吃多少；有没有加餐、零食、奶茶/含糖饮料/酒
9. 吃饭方式：自己做饭 / 外卖 / 食堂 / 在外应酬
10. 饮食偏好与忌口（不爱吃的、过敏、素食、宗教等）
11. 减重方式偏好：纯靠饮食控制 / 纯靠运动 / 两者结合（说明：减脂的核心是热量差，运动只是扩大热量差的一种方式，不运动只靠饮食也能减）
12. 运动基础与条件：现在是否运动、能做什么强度；家里/附近有什么器材和场地（健身房、跑步、跳绳、哑铃、只有空地）——若选纯饮食可简化为「平时愿不愿意多走路」
13. 可用时间：工作日、周末分别每天能拿出多少时间、哪个时段
14. 伤病或身体限制（膝盖、腰、血压、血糖、孕期、正在服药等）
15. 以前减肥的经历：用过什么方法、坚持了多久、为什么没坚持或反弹
### 增肌 / 塑形
性别、年龄、身高、体重 → 目标（增肌部位/体脂目标）与期限 → 训练经历与水平（练过多久、现有重量）→ 器材场地 → 每周可训练几次、每次多久、时段 → 职业活动量与作息睡眠 → 饮食习惯与蛋白质摄入、是否能接受补剂 → 伤病限制 → 以前的训练经历与卡点。
### 学习技能 / 考试
具体要学什么、学到什么程度（考证/考试名称和分数线、工作应用、兴趣）→ 学习目的与截止时间（考试日期）→ 现有基础（相关经历、做过的测试、薄弱点）→ 已有或偏好的资料（教材、课程、App、真题）→ 偏好的学习方式（看视频 / 读书 / 刷题 / 实操项目 / 打卡社群）→ 工作日和周末分别的可用时长与时段 → 学习环境与干扰（通勤、带娃、加班）→ 以前学这个或学其它东西时半途而废的原因 → 希望怎样检验进度（模考、作品、打卡）。
### 作息 / 习惯（早起、早睡、戒手机、喝水等）
目标习惯的具体标准（如 23:00 前入睡、6:30 起床）与期限 → 现在的实际情况（最近一周几点睡/起、差距多大）→ 职业与固定日程（上班时间、通勤、轮班）→ 影响因素（刷手机、加班、娱乐、咖啡因、家人作息）→ 睡眠质量与身体状况 → 周末是否也要执行 → 以前尝试过什么、为什么没坚持 → 偏好的提醒/奖励方式。
### 理财 / 储蓄
目标金额与期限、用途 → 每月税后收入（可给区间）与稳定性 → 每月固定支出（房租房贷、通勤、餐饮、订阅）→ 现有存款、负债与还款 → 消费习惯与主要「漏钱」项 → 是否接受记账、用什么工具 → 风险偏好与理财经验（只存钱 / 基金 / 其它）→ 家庭负担与应急需求 → 以前存钱失败的原因。
### 其它类型
参照上面的思路自拟 8-12 个具体问题：目标的可量化标准与期限 → 现状与差距 → 资源和条件 → 可用时间（工作日/周末）→ 限制与风险 → 以往经历与失败原因 → 偏好。

## 三、减脂类的计算（必须基于热量差）
- 用 Mifflin-St Jeor 估算基础代谢 BMR：男 = 10×体重kg + 6.25×身高cm − 5×年龄 + 5；女 = 10×体重kg + 6.25×身高cm − 5×年龄 − 161。（斤先除以 2 换成 kg）
- TDEE = BMR × 活动系数：久坐 1.2，轻度活动 1.375，中度 1.55，高强度 1.725。
- 每日热量缺口 = 目标减重kg × 7700 ÷ 天数。按用户选的方式分配：纯饮食则全部由饮食减少；纯运动则由运动消耗（换算成具体的运动时长）；结合则写清饮食减多少、运动消耗多少。
- 安全提醒：每周减重超过体重的 1%（或约 1kg/周）、每日缺口超过 1000 kcal 或超过 TDEE 的 25%、饮食摄入低于 BMR（或女性低于约 1200、男性低于约 1500 kcal）时，要明确提醒风险并建议调整目标或延长期限。目标体重 BMI 低于 18.5 时也要提醒。有疾病、孕期、服药等情况建议先咨询医生。
- 增肌类同样给出 TDEE、每日热量盈余（约 +200~300 kcal）和蛋白质目标（约 1.6-2.2 g/kg）。

## 四、信息确认
清单问完（或用户要求直接出方案）后，**先不要输出计划**，而是给一份简短的「信息确认」小结：用列表列出收集到的关键信息（用默认值的标注「默认」），减脂/增肌类附上计算结果（BMR、TDEE、每日热量目标、每日缺口/盈余及分配），最后问一句「以上信息对吗？需要修改哪一项？确认后我就生成计划」。用户确认后才进入下一步；用户修正则更新后再确认一次。

## 五、生成计划
确认后，先用 2-4 句话说明思路（体现个人数据，如「每日摄入约 1650 kcal，缺口约 470 kcal：饮食 −300、快走 40 分钟 −170」），然后输出一个 ```json 代码块，里面只能有一个 JSON 对象，格式严格如下：
{{"title":"目标名(≤20字)","summary":"一句话说明","start_date":"YYYY-MM-DD","days_count":N,"days":[{{"title":"当天主题(≤20字)","detail":"一句话说明","tasks":["具体任务1","具体任务2"],"is_rest":false}}]}}
规则：days_count 在 1-366 之间，且必须等于 days 的条数；days 按顺序每天一条，不能省略或用"..."；start_date 默认今天或用户指定日期，不能早于今天；休息日 is_rest 为 true，tasks 可以为空数组；非休息日 tasks 至少 1 条。
计划要个性化：减脂类每天的 tasks 写具体（如「全天摄入控制在 1650 kcal 内」「早餐：2 个鸡蛋 + 1 杯无糖豆浆」「晚饭后快走 40 分钟」「23:30 前睡觉」），结合用户的吃饭方式、忌口、器材、可用时段和伤病限制安排，并安排适当休息与每周称重复盘；学习类按用户的基础、资料和时段安排具体章节/题量；其它类同理。
修改流程：**修改意见一律视为新一轮访谈**：用户对草案/计划提出修改意见（如「我不能天天早上吃燕麦和鸡蛋」）时，不要立刻重新生成。先简短回应，再每轮只问一个问题，追问与这条意见相关的具体信息（例如饮食类：除此之外平时还吃什么、喜欢/不吃什么、早餐在哪吃、几点吃、预算多少、是否自己做；运动类：哪天不方便、能接受的替代项目和时长；时间类：具体哪些时段冲突）。信息收集得差不多后，先给一份简短的「修改点确认」小结（列出要改的地方和改法，数值有变化的附上新数值），问用户是否确认；**用户确认前禁止输出新草案 JSON**。只有当用户明确说「直接改」「就这样生成」「不用问了」之类时，才可以立即按现有信息生成。用户确认修改点后，再重新输出完整的 JSON（全部天数）。

## 六、其它
不要输出与目标规划无关的内容。访谈阶段不要输出 JSON。"#
    )
}

pub fn revise_prompt(today: &str, ctx: &str) -> String {
    format!(
        r#"你是「目标计划助手」，现在帮用户修改一个正在执行中的计划。今天是 {today}。用中文回答，语气简洁友好。

规则：
- 今天以前的日子和打卡记录会原样保留，你不能改；你只重新安排「从今天 {today} 开始」的剩余日程（天数可以增减）。
- **修改意见一律视为新一轮访谈**：用户对草案/计划提出修改意见（如「我不能天天早上吃燕麦和鸡蛋」）时，不要立刻重新生成。先简短回应，再每轮只问一个问题，追问与这条意见相关的具体信息（例如饮食类：除此之外平时还吃什么、喜欢/不吃什么、早餐在哪吃、几点吃、预算多少、是否自己做；运动类：哪天不方便、能接受的替代项目和时长；时间类：具体哪些时段冲突）。信息收集得差不多后，先给一份简短的「修改点确认」小结（列出要改的地方和改法，数值有变化的附上新数值），问用户是否确认；**用户确认前禁止输出新草案 JSON**。只有当用户明确说「直接改」「就这样生成」「不用问了」之类时，才可以立即按现有信息生成。
- **只问有用的问题**：只问会影响计划内容的问题，对生成计划没有帮助的不要问。每问一个问题前先自检「这个答案会改变计划里的什么？」，不会就跳过；能从前文推断出来的也不问。
- **选项格式（按问题类型区分）**：
  - 数值/自由填写题（身高、体重、年龄、目标体重、期限天数、预算金额等具体数值或名称）：**数值题绝不给选项**，不输出 options 代码块，让用户直接在输入框填写。例：「你的身高是多少 cm？」
  - 封闭选择题（答案只有固定几个，如性别 男/女、是/否、有/没有）：输出 options 代码块，第一行单独写「封闭」，界面不会附加「其它，自己填」。例：
```options
封闭
男
女
```
  - 开放选择题（如日常活动量、三餐方式、忌口、运动方式）：输出 options 代码块，不写「封闭」，界面会自动附加「其它，自己填」。允许多选时第一行写「多选」；标记可组合，如「封闭 多选」。例：
```options
多选
跑步
跳绳
哑铃
```
  - 选项不要写在正文列表里，只放在代码块中，每行一个（简短，≤20 字，2-6 个）；不要写「其它」「其他」类选项；代码块放在消息最末尾，之后不再写任何内容；不需要选项时不要输出这个代码块；输出计划 JSON 的那条消息不带选项。
- 追问时每轮只问一个具体问题（可附简短选项）；涉及减脂/增肌时沿用热量差计算（Mifflin-St Jeor 估算 BMR、TDEE、约 7700 kcal/kg），把调整后的每日热量目标写进任务。
- 方案确定后，先用 2-4 句话说明改了什么、为什么，然后输出一个 ```json 代码块，只能有一个 JSON 对象，格式严格如下：
{{"title":"目标名（保持原名）","summary":"一句话说明本次调整","start_date":"{today}","days_count":N,"days":[{{"title":"当天主题(≤20字)","detail":"一句话说明","tasks":["具体任务1"],"is_rest":false}}]}}
- start_date 必须是 {today}；days 从今天起每天一条，按顺序写全，不能省略或用"..."；days_count 必须等于 days 条数（1-366）；休息日 is_rest 为 true、tasks 可为空；非休息日 tasks 至少 1 条。
- 用户确认修改点后，重新输出完整 JSON。不要输出与计划无关的内容。

当前计划：
{ctx}"#
    )
}

fn friendly(status: u16, body: &str) -> String {
    let m = provider_msg(body);
    let hint = match status {
        400 => "请求被拒绝，可能是模型名或参数不对",
        401 | 403 => "API Key 无效或没有权限，请到设置里检查",
        402 => "账户余额不足，请先充值",
        404 => "接口地址或模型不存在，请检查 Base URL 和模型名",
        422 => "请求参数不被接受",
        429 => "请求太频繁或额度用完，稍后再试",
        500..=599 => "模型服务暂时出错，稍后重试",
        _ => "模型服务返回错误",
    };
    if m.trim().is_empty() { format!("{hint}（HTTP {status}）") } else { format!("{hint}（HTTP {status}）：{m}") }
}

/// reqwest 错误描述：去掉 URL，只留类型和原因
#[allow(dead_code)]
pub fn safe_err(e: &reqwest::Error) -> String {
    let kind = if e.is_timeout() { "超时" } else if e.is_decode() { "解码失败" } else if e.is_body() { "响应体中断" } else if e.is_connect() { "连接失败" } else { "网络错误" };
    let mut src = String::new();
    let mut cur: Option<&dyn std::error::Error> = std::error::Error::source(e);
    while let Some(x) = cur { src = x.to_string(); cur = x.source(); }
    redact(&format!("{kind}{}", if src.is_empty() { String::new() } else { format!("：{src}") }))
}

/// 去掉可能出现的 Key（sk-xxx / Bearer xxx）
pub fn redact(s: &str) -> String {
    let mut out = String::new();
    for w in s.split_inclusive(|c: char| c.is_whitespace() || c == '"' || c == '\'') {
        let t = w.trim_end_matches(|c: char| c.is_whitespace() || c == '"' || c == '\'');
        if (t.starts_with("sk-") && t.len() > 8) || (t.len() >= 32 && t.chars().all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_' || c == '.')) {
            out.push_str("[已隐藏]");
            out.push_str(&w[t.len()..]);
        } else {
            out.push_str(w);
        }
    }
    out
}

/// 服务商返回的 error.message（OpenAI 兼容格式），没有就截取原文
fn provider_msg(body: &str) -> String {
    let v: Option<Value> = serde_json::from_str(body).ok();
    let m = v.as_ref().and_then(|v| v["error"]["message"].as_str().or(v["message"].as_str()).or(v["error"].as_str())).map(str::to_string);
    redact(&short(&m.unwrap_or_else(|| body.to_string())))
}

fn short(s: &str) -> String {
    s.chars().take(160).collect()
}

#[allow(dead_code)]
pub async fn complete(cfg: &LlmConfig, messages: Vec<Value>, max_tokens: u32) -> Result<String, String> {
    let url = format!("{}/chat/completions", cfg.base_url.trim().trim_end_matches('/'));
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(120))
        .connect_timeout(Duration::from_secs(10))
        .build()
        .map_err(|_| "网络组件初始化失败".to_string())?;
    let resp = client
        .post(&url)
        .bearer_auth(&cfg.key)
        .json(&json!({ "model": cfg.model, "messages": messages, "max_tokens": max_tokens, "temperature": 0.7, "stream": false }))
        .send()
        .await
        .map_err(|e| {
            if e.is_timeout() {
                "模型响应超时，请稍后重试".to_string()
            } else {
                "连不上模型服务，请检查网络或 Base URL（离线时仍可查看目标和打卡）".to_string()
            }
        })?;
    let status = resp.status().as_u16();
    let body = resp.text().await.map_err(|e| {
        if e.is_timeout() {
            format!("已连上服务（HTTP {status}），但等待模型回复超时，服务可能繁忙，请稍后重试")
        } else {
            format!("读取模型回复失败（HTTP {status}）：{}", safe_err(&e))
        }
    })?;
    if status != 200 {
        return Err(friendly(status, &body));
    }
    parse_completion(&body)
}

/// GET {base_url}/models（OpenAI 兼容），返回模型 id 列表
pub async fn list_models(base_url: &str, key: &str) -> Result<Vec<String>, String> {
    let url = format!("{}/models", base_url.trim().trim_end_matches('/'));
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(20))
        .connect_timeout(Duration::from_secs(8))
        .build()
        .map_err(|_| "网络组件初始化失败".to_string())?;
    let resp = client.get(&url).bearer_auth(key).send().await.map_err(|e| {
        if e.is_timeout() { "获取模型列表超时，请稍后重试".to_string() } else { "连不上服务，请检查网络或 Base URL".to_string() }
    })?;
    let status = resp.status().as_u16();
    let body = resp.text().await.map_err(|e| format!("读取模型列表失败（HTTP {status}）：{}", safe_err(&e)))?;
    if status != 200 {
        return Err(friendly(status, &body));
    }
    parse_models(&body)
}

/// 状态检测的 HTTP 结果分类：None = 可用；Some((类别, 简短原因))
pub fn probe_class(status: u16) -> Option<(&'static str, &'static str)> {
    match status {
        200..=299 => None,
        // 服务有响应但不提供 /models：视为可连通
        404 | 405 => None,
        401 | 403 => Some(("auth", "鉴权失败")),
        402 => Some(("billing", "余额不足")),
        429 => Some(("busy", "请求太频繁")),
        500..=599 => Some(("busy", "服务繁忙")),
        _ => Some(("error", "服务异常")),
    }
}

/// 轻量可用性检测：GET /models（不消耗 token），8 秒超时；错误信息不含 Key
pub async fn probe(base_url: &str, key: &str) -> Result<(), (&'static str, String)> {
    let url = format!("{}/models", base_url.trim().trim_end_matches('/'));
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(8))
        .connect_timeout(Duration::from_secs(8))
        .build()
        .map_err(|_| ("error", "网络组件初始化失败".to_string()))?;
    let resp = client.get(&url).bearer_auth(key).send().await.map_err(|e| {
        if e.is_timeout() { ("timeout", "检测超时".to_string()) } else { ("net", "连不上服务".to_string()) }
    })?;
    let status = resp.status().as_u16();
    match probe_class(status) {
        None => Ok(()),
        Some((k, why)) => Err((k, format!("{why}（HTTP {status}）"))),
    }
}

pub fn parse_models(body: &str) -> Result<Vec<String>, String> {
    let v: Value = serde_json::from_str(body).map_err(|_| format!("模型列表不是 JSON：{}", redact(&short(body))))?;
    let arr = v.get("data").or_else(|| v.get("models")).and_then(Value::as_array).ok_or("模型列表结构不对：缺少 data 数组")?;
    let mut ids: Vec<String> = arr
        .iter()
        .filter_map(|m| m.get("id").or_else(|| m.get("name")).and_then(Value::as_str).or_else(|| m.as_str()))
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .collect();
    ids.sort();
    ids.dedup();
    if ids.is_empty() {
        return Err("服务商返回的模型列表为空".into());
    }
    Ok(ids)
}

/// 测试连接：用流式请求（服务繁忙时非流式会一直挂着空行等到超时），拿到首段正文即成功
pub async fn ping(cfg: &LlmConfig) -> Result<String, String> {
    let flag = std::sync::atomic::AtomicBool::new(false);
    let msgs = vec![json!({"role":"user","content":"只回复两个字：你好"})];
    let t0 = std::time::Instant::now();
    // 关闭思考；收到任何思考或正文分片即算连通，提前结束
    let r = stream_ex(cfg, msgs, 256, &flag, no_thinking(&cfg.provider), 45, |_| true).await?;
    let ms = t0.elapsed().as_millis();
    let what = if r.reasoning_chars > 0 && r.text.is_empty() { "收到思考分片" } else { "收到回复" };
    Ok(format!("连接成功（HTTP 200，模型 {}，{what}，用时 {:.1} 秒）", cfg.model, ms as f64 / 1000.0))
}


/// 解析非流式回复；结构不对时说清楚是哪里不对
#[allow(dead_code)]
pub fn parse_completion(body: &str) -> Result<String, String> {
    let v: Value = serde_json::from_str(body).map_err(|_| format!("模型回复不是 JSON（HTTP 200）：{}", redact(&short(body))))?;
    if v.get("error").is_some() {
        return Err(format!("模型服务返回错误：{}", provider_msg(body)));
    }
    let msg = v.get("choices").and_then(|c| c.get(0)).and_then(|c| c.get("message")).ok_or("模型回复结构不对：缺少 choices[0].message")?;
    let content = msg.get("content").and_then(Value::as_str).unwrap_or("");
    if !content.trim().is_empty() {
        return Ok(content.to_string());
    }
    let finish = v["choices"][0]["finish_reason"].as_str().unwrap_or("");
    if msg.get("reasoning_content").and_then(Value::as_str).is_some_and(|r| !r.is_empty()) && finish == "length" {
        return Err("模型还在思考就达到了长度上限，正文为空（可调大 max_tokens）".into());
    }
    Err(format!("模型返回了空内容{}，请重试", if finish.is_empty() { String::new() } else { format!("（finish_reason={finish}）") }))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn errors_are_specific_and_redacted() {
        let e = friendly(401, r#"{"error":{"message":"Authentication Fails, Your api key: sk-abcdef1234567890 is invalid","type":"authentication_error"}}"#);
        assert!(e.contains("HTTP 401") && e.contains("Authentication Fails") && !e.contains("sk-abcdef") && e.contains("[已隐藏]"), "{e}");
        let e = friendly(402, r#"{"error":{"message":"Insufficient Balance"}}"#);
        assert!(e.contains("余额不足") && e.contains("Insufficient Balance"));
        assert!(friendly(400, "Model Not Exist").contains("Model Not Exist"));
        assert_eq!(parse_completion(r#"{"choices":[{"message":{"content":"你好"}}]}"#).unwrap(), "你好");
        assert!(parse_completion(r#"{"choices":[{"message":{"content":"","reasoning_content":"想"},"finish_reason":"length"}]}"#).unwrap_err().contains("长度上限"));
        assert!(parse_completion(r#"{"choices":[]}"#).unwrap_err().contains("结构不对"));
        assert!(parse_completion("<html>").unwrap_err().contains("不是 JSON"));
    }

    #[test]
    fn models_parse() {
        let ids = parse_models(r#"{"object":"list","data":[{"id":"deepseek-v4-pro","object":"model"},{"id":"deepseek-flash"},{"id":"deepseek-flash"}]}"#).unwrap();
        assert_eq!(ids, vec!["deepseek-flash", "deepseek-v4-pro"]);
        assert!(parse_models(r#"{"data":[]}"#).unwrap_err().contains("为空"));
        assert!(parse_models(r#"{"x":1}"#).unwrap_err().contains("结构不对"));
        assert!(friendly(401, r#"{"error":{"message":"bad key"}}"#).contains("401"));
    }

    /// cargo test live_models -- --ignored --nocapture（只打印模型 id）
    #[test]
    #[ignore]
    fn live_models() {
        let Some(key) = crate::secret::get_key("deepseek").unwrap() else { println!("LIVE 未保存 Key"); return };
        match tauri::async_runtime::block_on(list_models("https://api.deepseek.com", &key)) {
            Ok(ids) => println!("LIVE models={ids:?}"),
            Err(e) => println!("LIVE 失败：{}", redact(&e)),
        }
    }

    /// 原始诊断：首字节耗时、收到的字节类型（不打印 Key）
    #[test]
    #[ignore]
    fn live_raw() {
        let Some(key) = crate::secret::get_key("deepseek").unwrap() else { return };
        tauri::async_runtime::block_on(async {
            for model in ["deepseek-v4-pro", "deepseek-flash"] {
                let t0 = std::time::Instant::now();
                let c = reqwest::Client::new();
                let body = json!({"model": model, "messages": [{"role":"user","content":"你好"}], "max_tokens": 64, "stream": true, "thinking": {"type": "disabled"}});
                let mut r = match c.post("https://api.deepseek.com/chat/completions").bearer_auth(&key).json(&body).send().await {
                    Ok(r) => r, Err(e) => { println!("LIVE {model} 发送失败 {}", safe_err(&e)); continue }
                };
                println!("LIVE {model} HTTP {} 头部用时 {:.1}s", r.status().as_u16(), t0.elapsed().as_secs_f64());
                let mut n = 0;
                let mut total = 0usize;
                loop {
                    match tokio::time::timeout(Duration::from_secs(60), r.chunk()).await {
                        Ok(Ok(Some(b))) => {
                            n += 1;
                            total += b.len();
                            if n <= 3 {
                                let t: String = String::from_utf8_lossy(&b).chars().take(70).collect();
                                println!("LIVE {model} 分片{n} @{:.1}s {:?}", t0.elapsed().as_secs_f64(), redact(&t));
                            }
                        }
                        Ok(Ok(None)) => { println!("LIVE {model} 结束 @{:.1}s 共{n}片{total}字节", t0.elapsed().as_secs_f64()); break }
                        Ok(Err(e)) => { println!("LIVE {model} 读取错误 {}", safe_err(&e)); break }
                        Err(_) => { println!("LIVE {model} 60s 无新分片（已收{n}片）"); break }
                    }
                }
            }
        });
    }

    /// 用凭据管理器里已存的 DeepSeek Key 实测：cargo test live_deepseek -- --ignored --nocapture
    /// 只打印状态/模型/是否成功，绝不打印 Key
    #[test]
    fn probe_status_classes() {
        assert!(super::probe_class(200).is_none());
        assert!(super::probe_class(404).is_none());
        assert_eq!(super::probe_class(401).unwrap().0, "auth");
        assert_eq!(super::probe_class(503).unwrap().0, "busy");
        assert_eq!(super::probe_class(429).unwrap().0, "busy");
        assert_eq!(super::probe_class(402).unwrap().0, "billing");
    }

    #[test]
    fn prompts_define_options_block() {
        for p in [super::system_prompt("2026-10-15"), super::revise_prompt("2026-10-15", "（计划）")] {
            for k in ["```options", "多选", "封闭", "数值题绝不给选项", "其它，自己填", "不要写「其它」"] {
                assert!(p.contains(k), "缺少：{k}");
            }
        }
    }

    #[test]
    fn prompts_treat_edits_as_interview() {
        for p in [super::system_prompt("2026-10-15"), super::revise_prompt("2026-10-15", "（计划）")] {
            for k in ["修改意见一律视为新一轮访谈", "每轮只问一个问题", "修改点确认", "用户确认前禁止输出新草案 JSON", "直接改", "就这样生成", "只问有用的问题", "这个答案会改变计划里的什么"] {
                assert!(p.contains(k), "缺少：{k}");
            }
        }
    }

    #[test]
    fn system_prompt_interview_rules() {
        let p = super::system_prompt("2026-10-15");
        assert!(p.contains("2026-10-15"));
        for k in ["每轮只问一个问题", "Mifflin-St Jeor", "7700", "信息确认", "以前减肥的经历", "减重方式偏好", "\"days_count\":N"] {
            assert!(p.contains(k), "缺少：{k}");
        }
    }

    #[test]
    #[ignore]
    fn live_deepseek() {
        let Some(key) = crate::secret::get_key("deepseek").unwrap() else { println!("LIVE 未保存 DeepSeek Key"); return };
        for model in ["deepseek-v4-pro", "deepseek-flash"] {
            let cfg = LlmConfig { base_url: "https://api.deepseek.com".into(), model: model.into(), key: key.clone(), max_tokens: 64, provider: "deepseek".into() };
            match tauri::async_runtime::block_on(ping(&cfg)) {
                Ok(t) => println!("LIVE model={model} {t}"),
                Err(e) => println!("LIVE model={model} 失败：{}", redact(&e)),
            }
        }
    }
}

pub struct StreamResult {
    pub text: String,
    /// stop / length / ...
    pub finish: Option<String>,
    pub stopped: bool,
    /// 收到的思考字数（思考内容本身不保存、不进草案解析）
    pub reasoning_chars: usize,
    /// on_chunk 要求提前结束
    pub early: bool,
}

/// 流式请求；每段增量调用 on_delta；cancel 置位后尽快停止并返回已收到的内容
#[allow(dead_code)]
pub async fn stream(
    cfg: &LlmConfig,
    messages: Vec<Value>,
    max_tokens: u32,
    cancel: &std::sync::atomic::AtomicBool,
    mut on_delta: impl FnMut(&str),
) -> Result<StreamResult, String> {
    stream_ex(cfg, messages, max_tokens, cancel, json!({}), IDLE_SECS, |c| {
        if let Chunk::Content(t) = c {
            on_delta(t);
        }
        false
    })
    .await
}

/// 空闲超时：距离上一次收到任何分片（思考或正文）超过这么久才算超时
pub const IDLE_SECS: u64 = 90;

/// 流式请求。extra 合并进请求体；on_chunk 返回 true 则提前结束（视为正常结束）。
pub async fn stream_ex(
    cfg: &LlmConfig,
    messages: Vec<Value>,
    max_tokens: u32,
    cancel: &std::sync::atomic::AtomicBool,
    extra: Value,
    idle_secs: u64,
    mut on_chunk: impl FnMut(Chunk) -> bool,
) -> Result<StreamResult, String> {
    use std::sync::atomic::Ordering;
    use tokio::time::Instant;
    let url = format!("{}/chat/completions", cfg.base_url.trim().trim_end_matches('/'));
    let client = reqwest::Client::builder()
        .connect_timeout(Duration::from_secs(10))
        .build()
        .map_err(|_| "网络组件初始化失败".to_string())?;
    let mut body = json!({ "model": cfg.model, "messages": messages, "max_tokens": max_tokens, "temperature": 0.7, "stream": true });
    if let (Some(b), Some(x)) = (body.as_object_mut(), extra.as_object()) {
        for (k, v) in x {
            b.insert(k.clone(), v.clone());
        }
    }
    let idle = Duration::from_secs(idle_secs);
    let send = client.post(&url).bearer_auth(&cfg.key).json(&body).send();
    let mut resp = match tokio::time::timeout(idle, send).await {
        Err(_) => return Err(format!("模型 {} 秒内没有响应，服务可能繁忙，请稍后重试", idle_secs)),
        Ok(r) => r.map_err(|e| {
            if e.is_timeout() { "模型响应超时，请稍后重试".to_string() } else { "连不上模型服务，请检查网络或 Base URL（离线时仍可查看目标和打卡）".to_string() }
        })?,
    };
    let status = resp.status().as_u16();
    if status != 200 {
        let body = resp.text().await.unwrap_or_default();
        return Err(friendly(status, &body));
    }
    let mut p = crate::sse::SseParser::default();
    let mut r = StreamResult { text: String::new(), finish: None, stopped: false, reasoning_chars: 0, early: false };
    let mut last = Instant::now();
    // 返回 Some(true)=结束
    let mut handle = |evs: Vec<crate::sse::SseEvent>, r: &mut StreamResult, last: &mut Instant| -> Result<bool, String> {
        for ev in evs {
            match ev {
                crate::sse::SseEvent::Delta(t) => {
                    *last = Instant::now();
                    r.text.push_str(&t);
                    if on_chunk(Chunk::Content(&t)) {
                        r.early = true;
                        return Ok(true);
                    }
                }
                crate::sse::SseEvent::Reasoning(t) => {
                    *last = Instant::now();
                    r.reasoning_chars += t.chars().count();
                    if on_chunk(Chunk::Reasoning(&t)) {
                        r.early = true;
                        return Ok(true);
                    }
                }
                crate::sse::SseEvent::Finish(f) => r.finish = Some(f),
                crate::sse::SseEvent::Done => return Ok(true),
                crate::sse::SseEvent::Error(m) => return Err(format!("模型服务返回错误：{}", redact(&m))),
            }
        }
        Ok(false)
    };
    loop {
        if cancel.load(Ordering::SeqCst) {
            r.stopped = true;
            break;
        }
        let left = idle.saturating_sub(last.elapsed());
        let chunk = tokio::select! {
            c = tokio::time::timeout(left, resp.chunk()) => c,
            _ = async { while !cancel.load(Ordering::SeqCst) { tokio::time::sleep(Duration::from_millis(100)).await; } } => {
                r.stopped = true;
                break;
            }
        };
        let chunk = match chunk {
            Ok(c) => c,
            Err(_) => {
                // 空闲超时：已有正文就保留并按断网处理
                if r.text.is_empty() {
                    return Err(if r.reasoning_chars > 0 {
                        format!("模型思考后 {idle_secs} 秒没有新内容，已停止等待，请重试")
                    } else {
                        format!("已连上服务（HTTP 200），但 {idle_secs} 秒内没有收到任何内容，服务可能繁忙，请稍后重试")
                    });
                }
                r.finish = Some("network".into());
                break;
            }
        };
        match chunk {
            Ok(Some(bytes)) => {
                if handle(p.push(&bytes), &mut r, &mut last)? {
                    break;
                }
            }
            Ok(None) => {
                handle(p.finish(), &mut r, &mut last)?;
                break;
            }
            Err(e) => {
                if r.text.is_empty() {
                    return Err(if e.is_timeout() { "模型响应超时，请稍后重试".into() } else { "连接中断，请重试".into() });
                }
                r.finish = Some("network".into());
                break;
            }
        }
    }
    if !r.stopped && !r.early && r.text.trim().is_empty() {
        if r.reasoning_chars > 0 && r.finish.as_deref() == Some("length") {
            return Err("模型思考用完了长度上限，没来得及输出正文，请重试或换非思考模型".into());
        }
        return Err("模型返回了空内容，请重试".into());
    }
    Ok(r)
}
