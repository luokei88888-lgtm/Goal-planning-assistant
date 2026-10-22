//! 计划模板库：内置模板（代码里生成完整按天内容，不写入数据库）+ 用户自建模板（plan_templates 表）。

use rusqlite::{params, Connection, OptionalExtension};
use serde::Serialize;

use crate::draft::{DraftDay, DraftPlan};
use crate::service::{create_goal_with_plan, e, parse_date};

type R<T> = Result<T, String>;

#[derive(Debug, Serialize, Clone)]
pub struct Template {
    /// 内置 "b:xxx"，自建 "u:{id}"
    pub id: String,
    pub title: String,
    pub summary: String,
    pub icon: String,
    pub category: String,
    pub builtin: bool,
    pub days_count: usize,
    pub days: Vec<DraftDay>,
}

fn day(title: &str, detail: &str, tasks: &[&str]) -> DraftDay {
    DraftDay { title: title.into(), detail: detail.into(), tasks: tasks.iter().map(|t| t.to_string()).collect(), is_rest: false }
}

fn rest(title: &str, detail: &str, tasks: &[&str]) -> DraftDay {
    DraftDay { is_rest: true, ..day(title, detail, tasks) }
}

type Row<'a> = (bool, &'a str, &'a str, &'a [&'a str]);

/// (是否休息日, 标题, 说明, 任务)
fn plan(list: &[Row]) -> Vec<DraftDay> {
    list.iter().map(|(r, t, d, k)| if *r { rest(t, d, k) } else { day(t, d, k) }).collect()
}

fn shape_fat_loss() -> Vec<DraftDay> {
    plan(&[
        // 第 1 周：算清热量缺口，学会基础动作
        (false, "算出每日热量目标", "用身高、体重、年龄估算每日消耗（TDEE），减 300～500 千卡作为每日摄入目标；量好体重、腰围做起点。", &["记录空腹体重和腰围", "用在线 TDEE 计算器算出每日消耗", "写下每日摄入目标（消耗 − 300～500 千卡）"]),
        (false, "全身力量入门 A", "学基础动作，重量宁轻勿重，动作标准优先。饮食：开始记录今天吃的每一样东西。", &["徒手深蹲 3组×12次", "跪姿俯卧撑 3组×8次", "臀桥 3组×15次"]),
        (false, "有氧入门：快走 30 分钟", "保持能说话但略喘的强度（中等强度）。饮食：每餐保证一掌心蛋白质。", &["快走 30 分钟", "三餐各有一份蛋白质"]),
        (false, "全身力量入门 B", "饮食：主食换一半为粗粮（燕麦、糙米、红薯）。", &["箱式/椅子深蹲 3组×12次", "弹力带或哑铃划船 3组×12次", "平板支撑 3组×30秒"]),
        (false, "有氧：快走 35 分钟 + 拉伸", "饮食：今天不喝含糖饮料。", &["快走 35 分钟", "全身拉伸 10 分钟", "全天零含糖饮料"]),
        (false, "全身力量入门 A（复练）", "对照第 2 天，每个动作尝试多做 1～2 次。饮食：对比摄入和目标，差多少？", &["徒手深蹲 3组×14次", "跪姿俯卧撑 3组×10次", "臀桥 3组×18次", "核对今天摄入是否在目标内"]),
        (true, "休息 · 第 1 周复盘", "主动恢复：散步、拉伸即可。复盘本周饮食记录，找出热量最高的 2 样食物。", &["散步 20 分钟（可选）", "称体重、量腰围并记录", "找出本周 2 个高热量来源，写下替代方案"]),
        // 第 2 周：加量，饮食精细化
        (false, "下肢力量 + 核心", "本周开始分上下肢训练，组数加到 4 组。饮食：每天喝水 2 升左右。", &["深蹲 4组×12次", "弓步蹲每侧 3组×10次", "臀桥 4组×15次", "卷腹 3组×15次", "喝够 8 杯水"]),
        (false, "有氧：快走/慢跑交替 35 分钟", "快走 3 分钟 + 慢跑 1 分钟循环；膝盖不适就全程快走。", &["快走慢跑交替 35 分钟"]),
        (false, "上肢力量 + 核心", "饮食：晚饭在睡前 3 小时前吃完。", &["俯卧撑（跪姿或标准）4组×10次", "哑铃/水瓶划船 4组×12次", "哑铃肩推 3组×12次", "平板支撑 3组×40秒", "晚饭睡前 3 小时前吃完"]),
        (false, "有氧：40 分钟中等强度", "快走、骑车、椭圆机任选。饮食：零食换成水果或无糖酸奶。", &["中等强度有氧 40 分钟", "零食只吃水果/无糖酸奶"]),
        (false, "全身力量循环", "4 个动作连做为 1 轮，轮间休息 90 秒。饮食：外卖选少油少酱，米饭半份。", &["深蹲 15 + 俯卧撑 10 + 划船 12 + 登山跑 20，共 4 轮"]),
        (false, "有氧 40 分钟 + 拉伸", "饮食：计划好明天的三餐，提前准备。", &["有氧 40 分钟", "拉伸 10 分钟", "写下明天三餐计划"]),
        (true, "休息 · 第 2 周复盘", "对比第 1 周体重、腰围变化（每周降 0.3～0.8 公斤为合理）。", &["称体重、量腰围并记录", "统计本周热量达标天数", "写下下周要改进的一点"]),
        // 第 3 周：提强度，加入间歇
        (false, "下肢力量加重", "加负重（哑铃或装水背包），每组最后 2 次要吃力。", &["负重深蹲 4组×12次", "罗马尼亚硬拉 4组×12次", "保加利亚分腿蹲每侧 3组×10次", "侧桥每侧 3组×30秒"]),
        (false, "间歇有氧 HIIT 20 分钟", "30 秒快（开合跳/快跑/高抬腿）+ 60 秒慢，共 12 轮；前后各热身放松 5 分钟。", &["热身 5 分钟", "HIIT 12 轮", "放松拉伸 5 分钟"]),
        (false, "上肢力量加重", "饮食：蛋白质按每公斤体重 1.2～1.6 克估算，看今天够不够。", &["俯卧撑 4组×12次", "负重划船 4组×12次", "肩推 4组×10次", "估算今天蛋白质摄入"]),
        (false, "有氧：45 分钟", "饮食：本周挑一天不吃夜宵，就从今天开始。", &["中等强度有氧 45 分钟", "今晚不吃夜宵"]),
        (false, "全身力量循环（加量）", "5 轮，轮间休息 75 秒。", &["深蹲 15 + 俯卧撑 12 + 划船 12 + 登山跑 30，共 5 轮"]),
        (false, "HIIT 20 分钟 + 核心", "", &["HIIT 12 轮", "卷腹 3组×20次", "平板支撑 3组×50秒"]),
        (true, "休息 · 第 3 周复盘", "如果连续两周体重不降，把每日摄入再减 100～200 千卡，或每天多走 3000 步。", &["称体重、量腰围并记录", "检查热量缺口是否需要调整", "散步或拉伸 20 分钟"]),
        // 第 4 周：冲刺与巩固
        (false, "下肢力量 · 冲刺周", "在第 3 周基础上每组加 2 次。", &["负重深蹲 4组×14次", "罗马尼亚硬拉 4组×14次", "分腿蹲每侧 3组×12次"]),
        (false, "有氧：50 分钟", "", &["中等强度有氧 50 分钟", "喝够 8 杯水"]),
        (false, "上肢力量 · 冲刺周", "", &["俯卧撑 4组×14次", "负重划船 4组×14次", "肩推 4组×12次", "平板支撑 3组×60秒"]),
        (false, "HIIT 25 分钟", "30 秒快 + 45 秒慢，共 15 轮。", &["热身 5 分钟", "HIIT 15 轮", "放松拉伸 5 分钟"]),
        (false, "全身力量循环（冲刺）", "", &["深蹲 20 + 俯卧撑 14 + 划船 14 + 登山跑 30，共 5 轮"]),
        (false, "有氧 45 分钟 + 拉伸", "饮食：总结哪些饮食习惯可以长期保持。", &["有氧 45 分钟", "拉伸 10 分钟", "写下 3 条能长期坚持的饮食习惯"]),
        (true, "休息 · 第 4 周复盘", "", &["称体重、量腰围并记录", "对比第 1 天的数据", "散步 20 分钟（可选）"]),
        (false, "体能测试", "测一次最大次数，和第 2 天对比进步。", &["1 分钟深蹲最多次数", "俯卧撑最多次数", "平板支撑最长时间"]),
        (false, "第 30 天：总结与下一步", "写下 30 天的变化和收获，定下接下来的每周训练频率和饮食底线。", &["拍照并记录体重、腰围", "写 30 天总结", "制定下一阶段计划（每周练几次、热量目标）"]),
    ])
}

fn read_hour() -> Vec<DraftDay> {
    plan(&[
        // 第 1 周：选书与建立阅读环境
        (false, "确定阅读目标，列书单", "想清楚这 30 天读书为了什么（放松、成长、专业）；列出 5 本候选书。", &["写下阅读目标", "列 5 本候选书", "读任意一本书 60 分钟"]),
        (false, "选定第一本书", "看目录、序言和一章试读，选一本难度适中、自己感兴趣的书；按页数排好每天进度。", &["试读 2～3 本候选书的目录和第一章", "选定第一本书并算出每天要读多少页", "阅读 60 分钟"]),
        (false, "固定阅读时间和地点", "把一小时拆成 2×30 分钟（如早上和睡前）；手机放到另一个房间。", &["定好每天两个阅读时段", "阅读时手机静音并远离", "阅读 60 分钟"]),
        (false, "学会边读边标记", "用笔或便签标出关键句、疑问和想法，不要整段划线。", &["阅读 60 分钟", "标记至少 5 处关键句"]),
        (false, "写第一篇阅读笔记", "用三句话：这部分讲了什么、我最认同的一点、我能用在哪里。", &["阅读 60 分钟", "写 3 句话笔记"]),
        (false, "分段阅读：番茄法", "25 分钟阅读 + 5 分钟休息，读两轮再加 10 分钟回顾标记。", &["2 个番茄钟阅读", "10 分钟回顾今天的标记"]),
        (true, "第 1 周复盘", "回顾本周读了多少页、哪个时段最专注；调整下周计划。", &["统计本周阅读页数", "写一段本周复盘", "轻松阅读 30 分钟（可选）"]),
        // 第 2 周：深度阅读与笔记
        (false, "预读：先看结构再读内容", "每章开始前先扫标题、小结和图表，预测这一章要讲什么。", &["预读接下来一章 5 分钟", "阅读 60 分钟"]),
        (false, "提问式阅读", "读之前写下 2 个想从这章得到答案的问题，读完回答。", &["写 2 个问题", "阅读 60 分钟", "写下问题的答案"]),
        (false, "做一张章节思维导图", "用纸或工具画出本章主要观点和它们的关系。", &["阅读 60 分钟", "画一张章节思维导图"]),
        (false, "用自己的话复述", "合上书，用 3 分钟口述或写下刚读的内容（费曼法）。", &["阅读 60 分钟", "合书复述 3 分钟"]),
        (false, "摘录金句并写感想", "", &["阅读 60 分钟", "摘录 3 句话，每句写一行感想"]),
        (false, "把一个观点用到生活里", "从书里挑一个方法，今天就试一次。", &["阅读 60 分钟", "实践书中一个方法并记录结果"]),
        (true, "第 2 周复盘", "整理本周笔记，检查第一本书进度；如果读不下去，可以换书，不必硬撑。", &["整理本周笔记", "检查进度，决定继续还是换书", "写一段本周复盘"]),
        // 第 3 周：读完第一本，开始第二本
        (false, "冲刺第一本书", "", &["阅读 60 分钟", "写 3 句话笔记"]),
        (false, "冲刺第一本书", "遇到难懂的部分先标记跳过，读完再回看。", &["阅读 60 分钟", "标记难点"]),
        (false, "读完第一本书，写书评", "300 字：主要内容、最大收获、推荐给谁。", &["读完第一本书", "写 300 字书评"]),
        (false, "选第二本书", "可以换一种类型（如小说 ↔ 非虚构），保持新鲜感。", &["从书单中选第二本书", "排好每天进度", "阅读 60 分钟"]),
        (false, "第二本书：预读 + 阅读", "", &["预读 5 分钟", "阅读 60 分钟", "写 3 句话笔记"]),
        (false, "分享你读到的内容", "给朋友讲或发一段读书分享，讲出来记得更牢。", &["阅读 60 分钟", "向一个人分享本周读到的一个观点"]),
        (true, "第 3 周复盘", "", &["统计本周阅读页数和笔记数", "写一段本周复盘", "轻松阅读 30 分钟（可选）"]),
        // 第 4 周：巩固习惯
        (false, "连读 60 分钟不中断", "挑战一次完整一小时，不看手机。", &["连续阅读 60 分钟", "写 3 句话笔记"]),
        (false, "主题阅读：对比观点", "找一篇和书中观点不同的文章对比着读。", &["阅读 45 分钟书", "阅读 15 分钟相关文章并写对比"]),
        (false, "整理笔记卡片", "把这几周的笔记按主题归类，方便以后翻查。", &["阅读 60 分钟", "整理笔记并分类"]),
        (false, "正常阅读", "", &["阅读 60 分钟", "摘录 1 句话并写感想"]),
        (false, "正常阅读", "", &["阅读 60 分钟", "合书复述 3 分钟"]),
        (false, "写第二本书阶段笔记", "", &["阅读 60 分钟", "写 200 字阶段笔记"]),
        (true, "第 4 周复盘", "", &["统计本月阅读总页数", "写一段本周复盘"]),
        (false, "规划下个月书单", "根据这个月的兴趣，列出下个月想读的 3 本书。", &["阅读 60 分钟", "列下个月书单 3 本"]),
        (false, "第 30 天：总结", "回顾 30 天：读了几本书、多少页、哪种方法最有效，决定下个月每天读多久。", &["阅读 60 分钟", "写 30 天阅读总结", "定下下个月的阅读目标"]),
    ])
}

fn sleep_wake() -> Vec<DraftDay> {
    // 前 3 天记录现状；之后先固定起床，再逐步把入睡提前
    let mut v = plan(&[
        (false, "记录当前作息", "照常作息，如实记录入睡和起床时间，作为基线。", &["记录昨晚入睡时间和今早起床时间", "设定目标：起床时间（如 7:00）和入睡时间（如 23:00）"]),
        (false, "固定起床时间（第 1 天）", "从今天起，不管几点睡，都在目标时间起床，周末也一样；闹钟放远处。", &["按目标时间起床", "起床后 10 分钟内拉开窗帘晒光", "记录入睡、起床时间"]),
        (false, "固定起床时间 + 晨光", "早上晒 10～15 分钟太阳能帮生物钟校准。", &["按目标时间起床", "户外或窗边晒光 10 分钟", "下午 2 点后不喝咖啡和浓茶"]),
        (false, "固定起床时间 + 不赖床", "闹钟响后直接坐起来，喝一杯水。", &["按目标时间起床，不按贪睡", "起床喝一杯温水", "记录入睡、起床时间"]),
        (false, "设计睡前仪式", "睡前 30 分钟固定做几件放松的事：洗漱、拉伸、读纸质书或听轻音乐。", &["按目标时间起床", "写下自己的睡前仪式（3 个步骤）", "今晚执行一次睡前仪式"]),
        (false, "睡前 30 分钟放下手机", "手机充电器放到卧室外或远离床的位置。", &["按目标时间起床", "睡前 30 分钟不看手机", "执行睡前仪式"]),
        (true, "第 1 周复盘", "看看起床时间是否稳定；周末也别睡懒觉，最多比平时晚 30 分钟。", &["按目标时间起床（周末也坚持）", "统计本周按时起床天数", "写一段复盘"]),
    ]);
    // 第 8～28 天：入睡时间每 3 天提前 15 分钟（相对基线，最多 60 分钟），配合每周主题
    let themes: [(&str, &[&str]); 3] = [
        ("屏幕管理", &["睡前 45 分钟起不看屏幕", "手机开启夜间模式/专注模式"]),
        ("卧室环境", &["卧室遮光、安静、偏凉（约 20℃）", "床只用来睡觉，不在床上刷手机"]),
        ("白天习惯", &["白天运动 20 分钟（不在睡前 2 小时内）", "午睡不超过 20 分钟"]),
    ];
    for i in 0..21 {
        let w = i / 7; // 0..2
        let step = (i / 3 + 1).min(4); // 每 3 天提前 15 分钟，最多提前 60 分钟
        let (theme, tips) = themes[w];
        if i % 7 == 6 {
            v.push(rest(
                &format!("第 {} 周复盘", w + 2),
                "检查本周入睡、起床是否达标；如果连续几天睡不着，就退回上一档时间再稳定 3 天。",
                &["按目标时间起床", "统计本周按时入睡/起床天数", "写一段复盘"],
            ));
            continue;
        }
        let tip = tips[i % 2];
        v.push(day(
            &format!("入睡提前 {} 分钟 · {theme}", step * 15),
            &format!("今晚比基线入睡时间提前 {} 分钟上床（达到目标时间后就保持）；起床时间不变。", step * 15),
            &["按目标时间起床", &format!("按计划时间上床（比基线早 {} 分钟）", step * 15), tip, "执行睡前仪式"],
        ));
    }
    v.extend(plan(&[
        (false, "巩固：全天按计划作息", "", &["按目标时间起床", "按目标时间上床", "睡前 45 分钟不看屏幕"]),
        (false, "第 30 天：总结", "对比第 1 天的作息记录，写下最有效的 3 个方法，定好之后的固定作息。", &["按目标时间起床", "写 30 天作息总结", "定下长期作息时间表"]),
    ]));
    v
}

fn learn_ai() -> Vec<DraftDay> {
    plan(&[
        // 第 1 周：认识 AI 与对话技巧
        (false, "认识 AI 助手", "了解 AI 能做什么、不能做什么：会编造事实（幻觉），重要信息要核实；不要输入身份证号、密码等隐私。", &["注册/打开一个 AI 对话工具（如 DeepSeek、豆包、Kimi、通义千问）", "问它 3 个日常问题", "写下它答错或答得不好的一处"]),
        (false, "对话技巧：说清楚背景", "告诉 AI：你是谁、要做什么、给谁看。对比有背景和没背景的回答。", &["同一个问题分别不带背景和带背景各问一次", "记录两次回答的差别"]),
        (false, "对话技巧：追问和修改", "不满意就追问：「更简短」「换个语气」「举个例子」。", &["让 AI 写一段自我介绍", "追问修改至少 3 次直到满意"]),
        (false, "对话技巧：指定格式", "要求用表格、列表、分步骤输出，并限定字数。", &["让 AI 用表格对比两款手机/两个方案", "让 AI 用 5 步列出一件事的做法"]),
        (false, "让 AI 帮你学习", "让它出题考你、用打比方解释一个难概念。", &["让 AI 用打比方解释一个你不懂的概念", "让它出 5 道题考你"]),
        (false, "核实 AI 的回答", "对 AI 给出的事实和数据，用搜索引擎或官方来源核对。", &["让 AI 回答一个带数据的问题", "用搜索引擎核对其中 2 个事实"]),
        (true, "第 1 周复盘", "整理本周最好用的 3 种问法，存成自己的笔记。", &["整理 3 种好用的问法", "写一段本周复盘"]),
        // 第 2 周：提示词与写作
        (false, "提示词公式：角色 + 任务 + 要求", "例如：「你是资深 HR，帮我改简历，突出项目成果，300 字以内」。", &["用公式写 3 条提示词", "对比效果最好的一条"]),
        (false, "给示例：照着样子写", "给 AI 一个范例，让它按同样风格写新的内容。", &["提供一段范例文字", "让 AI 仿写 2 段"]),
        (false, "写作：工作邮件和消息", "让 AI 起草一封请假/沟通邮件，再自己改成你的语气。", &["让 AI 起草一封工作邮件", "自己修改后保存"]),
        (false, "写作：总结和改写", "把一篇长文章交给 AI 总结要点，再让它改写成朋友圈文案。", &["让 AI 总结一篇长文（3 个要点）", "改写成 100 字短文案"]),
        (false, "写作：头脑风暴", "让 AI 给出 10 个想法（如周末活动、礼物、文章标题），再挑选和组合。", &["让 AI 列 10 个点子", "选出 2 个并让它展开"]),
        (false, "建立自己的提示词库", "把这两周好用的提示词整理到一个文档，以后直接复用。", &["整理至少 5 条常用提示词"]),
        (true, "第 2 周复盘", "", &["回顾提示词库", "写一段本周复盘"]),
        // 第 3 周：办公、搜索与图像
        (false, "办公：Excel/表格公式", "让 AI 根据你的需求写公式，并解释每一步。", &["描述一个表格需求让 AI 写公式", "在表格里实际用一次"]),
        (false, "办公：整理数据", "把杂乱的文字（如名单、账单）交给 AI 整理成表格。", &["让 AI 把一段杂乱文字整理成表格"]),
        (false, "办公：做 PPT 大纲", "让 AI 生成一份 10 页 PPT 的大纲和每页要点。", &["让 AI 生成 PPT 大纲", "挑 2 页让它细化文字"]),
        (false, "AI 搜索资料", "用带联网搜索的 AI 查资料，要求附上来源链接，并点开核对。", &["用 AI 搜索一个问题并要求给出处", "打开 2 个来源核对"]),
        (false, "图像工具：AI 生成图片", "试用一个 AI 绘图工具，用「主体 + 场景 + 风格 + 构图」描述画面。", &["生成 3 张图片", "修改描述词，对比效果"]),
        (false, "图像工具：识图与处理", "拍一张照片让 AI 识别内容（菜单翻译、植物识别、看图解题），或用 AI 抠图/修图。", &["用 AI 识别一张照片的内容", "试一次 AI 抠图或修图"]),
        (true, "第 3 周复盘", "", &["写下本周最有用的 2 个工具和用法", "写一段本周复盘"]),
        // 第 4 周：自动化与小项目
        (false, "自动化入门：批量处理", "让 AI 一次性处理多条内容（如 10 条评论分类、20 个标题改写）。", &["让 AI 批量处理一组内容"]),
        (false, "自动化：让 AI 写小脚本", "描述一个重复操作（如批量重命名文件），让 AI 写脚本并教你运行；先在备份文件上试。", &["让 AI 写一个小脚本", "在测试文件上运行一次"]),
        (false, "确定你的小项目", "选一个实用的小目标：旅行攻略、家庭菜谱、学习计划、个人简历、小网页等。", &["写下项目目标和完成标准", "让 AI 帮你拆成 5 个步骤"]),
        (false, "小项目：完成第 1～2 步", "", &["完成项目前两步", "记录遇到的问题"]),
        (false, "小项目：完成第 3～4 步", "", &["完成项目第 3～4 步", "让 AI 检查并给改进建议"]),
        (false, "小项目：完成并打磨", "", &["完成项目最后一步", "自己检查一遍，修改不满意的地方"]),
        (true, "第 4 周复盘", "", &["回顾小项目过程", "写一段本周复盘"]),
        (false, "分享你的成果", "把小项目给家人朋友看，收集反馈。", &["向至少一个人展示成果", "记录反馈"]),
        (false, "第 30 天：总结", "总结 30 天学会了什么，挑 3 个场景以后每周都用 AI 来做。", &["写 30 天学习总结", "列出 3 个以后常用的 AI 场景"]),
    ])
}

pub fn builtins() -> Vec<Template> {
    let mk = |id: &str, title: &str, summary: &str, icon: &str, cat: &str, days: Vec<DraftDay>| Template {
        id: format!("b:{id}"),
        title: title.into(),
        summary: summary.into(),
        icon: icon.into(),
        category: cat.into(),
        builtin: true,
        days_count: days.len(),
        days,
    };
    vec![
        mk("shape-fat-loss", "30天塑形减脂", "以每日 300～500 千卡热量缺口为核心，饮食记录 + 力量训练 + 有氧，4 周逐周递进：打基础 → 加量 → 加入间歇 → 冲刺巩固。", "flame", "健身", shape_fat_loss()),
        mk("read-hour", "30天每天阅读一小时", "选书、固定时段、分段阅读、标记与笔记、每周复盘，30 天读完一本并开始第二本。", "book", "阅读", read_hour()),
        mk("sleep-wake", "30天养成早睡早起", "先固定起床时间，再每 3 天把入睡时间提前 15 分钟，配合睡前仪式、屏幕管理和卧室环境。", "target", "作息", sleep_wake()),
        mk("learn-ai", "30天学会用AI", "面向普通人：对话技巧 → 提示词与写作 → 办公、搜索、图像工具 → 自动化与完成一个小项目。", "notebook", "学习", learn_ai()),
    ]
}

fn user_templates(conn: &Connection) -> R<Vec<Template>> {
    let mut st = conn.prepare("SELECT id, title, summary, days_json FROM plan_templates ORDER BY id DESC").map_err(e)?;
    let rows = st
        .query_map([], |r| Ok((r.get::<_, i64>(0)?, r.get::<_, String>(1)?, r.get::<_, String>(2)?, r.get::<_, String>(3)?)))
        .map_err(e)?;
    let mut out = Vec::new();
    for row in rows {
        let (id, title, summary, dj) = row.map_err(e)?;
        let days: Vec<DraftDay> = serde_json::from_str(&dj).unwrap_or_default();
        out.push(Template {
            id: format!("u:{id}"),
            icon: if title.contains("读") { "book" } else if title.contains("写") { "notebook" } else { "target" }.into(),
            title,
            summary,
            category: "我的".into(),
            builtin: false,
            days_count: days.len(),
            days,
        });
    }
    Ok(out)
}

/// 自建在前，内置在后
pub fn list_templates(conn: &Connection) -> R<Vec<Template>> {
    let mut v = user_templates(conn)?;
    v.extend(builtins());
    Ok(v)
}

pub fn get_template(conn: &Connection, id: &str) -> R<Template> {
    list_templates(conn)?.into_iter().find(|t| t.id == id).ok_or_else(|| "找不到这个模板".into())
}

pub fn as_draft(t: &Template, start_date: &str) -> DraftPlan {
    DraftPlan { title: t.title.clone(), summary: t.summary.clone(), start_date: start_date.into(), days_count: t.days.len(), days: t.days.clone() }
}

/// 一键生效：从 start_date 开始建目标，返回目标 id
pub fn apply_template(conn: &mut Connection, id: &str, start_date: &str, today: &str, now: i64) -> R<i64> {
    parse_date(start_date)?;
    if start_date < today {
        return Err("开始日期不能早于今天".into());
    }
    let t = get_template(conn, id)?;
    let mut ng = as_draft(&t, start_date).to_new_goal(start_date.into());
    ng.source = Some("manual".into());
    ng.icon = Some(t.icon.clone());
    create_goal_with_plan(conn, &ng, now)
}

/// 把目标当前（或最后一版）计划存为模板，返回模板 id
pub fn save_goal_as_template(conn: &Connection, goal_id: i64, title: Option<&str>, now: i64) -> R<String> {
    let (gtitle, desc): (String, String) = conn
        .query_row("SELECT title, description FROM goals WHERE id=?1", [goal_id], |r| Ok((r.get(0)?, r.get(1)?)))
        .optional()
        .map_err(e)?
        .ok_or("找不到这个目标")?;
    let v = crate::service::version_for(conn, goal_id, false)?.ok_or("这个目标还没有计划")?;
    let mut st = conn.prepare("SELECT title, detail, tasks, is_rest FROM plan_days WHERE plan_version_id=?1 ORDER BY day_index").map_err(e)?;
    let days = st
        .query_map([v.id], |r| {
            let tasks: String = r.get(2)?;
            Ok(DraftDay {
                title: r.get(0)?,
                detail: r.get(1)?,
                tasks: serde_json::from_str(&tasks).unwrap_or_default(),
                is_rest: r.get::<_, i64>(3)? != 0,
            })
        })
        .map_err(e)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(e)?;
    if days.is_empty() {
        return Err("这个目标的计划是空的".into());
    }
    let title: String = title.map(str::trim).filter(|t| !t.is_empty()).unwrap_or(&gtitle).chars().take(40).collect();
    conn.execute(
        "INSERT INTO plan_templates (title, summary, days_json, created_at) VALUES (?1, ?2, ?3, ?4)",
        params![title, desc, serde_json::to_string(&days).map_err(|x| x.to_string())?, now],
    )
    .map_err(e)?;
    Ok(format!("u:{}", conn.last_insert_rowid()))
}

pub fn delete_template(conn: &Connection, id: &str) -> R<()> {
    let n: i64 = id.strip_prefix("u:").and_then(|x| x.parse().ok()).ok_or("内置模板不能删除")?;
    if conn.execute("DELETE FROM plan_templates WHERE id=?1", [n]).map_err(e)? == 0 {
        return Err("找不到这个模板".into());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::service::get_goal_detail;

    #[test]
    fn builtins_complete() {
        let b = builtins();
        assert_eq!(b.iter().map(|t| t.id.as_str()).collect::<Vec<_>>(), ["b:shape-fat-loss", "b:read-hour", "b:sleep-wake", "b:learn-ai"]);
        for t in &b {
            assert_eq!(t.days.len(), 30, "{} 天数", t.title);
            assert_eq!(t.days_count, t.days.len());
            for (i, d) in t.days.iter().enumerate() {
                assert!(!d.title.trim().is_empty() && !d.tasks.is_empty(), "{} 第{}天不完整", t.title, i + 1);
                assert!(d.tasks.iter().all(|k| !k.trim().is_empty()));
            }
            assert_eq!(t.days.iter().filter(|d| d.is_rest).count(), 4, "{} 每周一天复盘", t.title);
        }
        assert!(!b.iter().any(|t| t.title.contains("家务")));
        assert!(b[2].days[7].title.contains("15 分钟") && b[2].days[26].title.contains("60 分钟"));
    }

    #[test]
    fn apply_save_delete() {
        let mut c = Connection::open_in_memory().unwrap();
        crate::db::migrate(&c).unwrap();
        assert!(apply_template(&mut c, "b:sleep-wake", "2026-10-13", "2026-10-14", 1).is_err());
        let gid = apply_template(&mut c, "b:sleep-wake", "2026-10-15", "2026-10-14", 1).unwrap();
        let d = get_goal_detail(&c, gid, "2026-10-15", 3).unwrap();
        assert_eq!((d.total, d.start_date.as_deref(), d.end_date.as_deref()), (30, Some("2026-10-15"), Some("2026-11-13")));
        assert!(d.today.unwrap().title.contains("记录当前作息"));
        let gid2 = apply_template(&mut c, "b:shape-fat-loss", "2026-10-14", "2026-10-14", 2).unwrap();
        assert_eq!(get_goal_detail(&c, gid2, "2026-10-14", 0).unwrap().total, 30);
        assert!(apply_template(&mut c, "b:nope", "2026-10-14", "2026-10-14", 2).is_err());

        let tid = save_goal_as_template(&c, gid, Some("  我的早睡版  "), 5).unwrap();
        let t = get_template(&c, &tid).unwrap();
        assert_eq!((t.title.as_str(), t.days.len(), t.builtin), ("我的早睡版", 30, false));
        assert_eq!(list_templates(&c).unwrap()[0].id, tid, "自建排在前");
        assert!(!t.days[0].tasks.is_empty());
        // 自建模板也能生效
        let g3 = apply_template(&mut c, &tid, "2026-10-20", "2026-10-14", 6).unwrap();
        assert_eq!(get_goal_detail(&c, g3, "2026-10-20", 0).unwrap().total, 30);
        assert!(delete_template(&c, "b:learn-ai").is_err());
        delete_template(&c, &tid).unwrap();
        assert!(delete_template(&c, &tid).is_err());
        assert!(list_templates(&c).unwrap().iter().all(|t| t.builtin));
        crate::templates::save_goal_as_template(&c, gid, None, 7).unwrap();
        crate::service::factory_reset(&mut c).unwrap();
        assert!(list_templates(&c).unwrap().iter().all(|t| t.builtin), "恢复出厂清空自建模板");
    }
}
