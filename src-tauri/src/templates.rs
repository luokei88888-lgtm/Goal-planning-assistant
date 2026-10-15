//! 计划模板库：内置模板（代码里生成完整按天内容）+ 用户自建模板（plan_templates 表）。

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

fn fat_loss() -> Vec<DraftDay> {
    // 4 周渐进：组数 × 次数
    let vol = ["3组×10次", "3组×12次", "4组×12次", "4组×15次"];
    let diet = [
        "饮食：每餐先吃蔬菜和蛋白质，主食减到平时的 2/3",
        "饮食：今天不喝含糖饮料，用水、茶代替",
        "饮食：晚饭在睡前 3 小时前吃完",
        "饮食：每餐一掌心蛋白质（鸡蛋/鸡胸/鱼/豆腐）",
        "饮食：零食换成水果或无糖酸奶",
        "饮食：外卖选少油少酱的，米饭半份",
        "饮食：记录今天吃了什么，找出最高热量的一项",
    ];
    let mut out = Vec::new();
    for i in 0..30 {
        let w = (i / 7).min(3);
        let v = vol[w];
        let tip = diet[i % 7];
        let d = match i % 7 {
            0 => day(
                "下肢力量：哑铃深蹲 + 箱式弓步",
                &format!("热身 5 分钟后做下肢，每组间休息 60 秒。{tip}"),
                &[&format!("哑铃高脚杯深蹲 {v}"), &format!("哑铃弓步蹲（每侧）{v}"), &format!("哑铃罗马尼亚硬拉 {v}"), "拉伸大腿前后侧 5 分钟"],
            ),
            1 => day(
                "上肢推：卧推 + 肩推",
                &format!("没有卧推凳可以平躺在地板上做地板卧推。{tip}"),
                &[&format!("哑铃地板卧推 {v}"), &format!("坐姿哑铃肩推 {v}"), &format!("哑铃侧平举 {v}"), "跪姿俯卧撑 2组×力竭"],
            ),
            2 => day(
                "低冲击有氧 + 核心（不跑步）",
                &format!("有氧选快走、爬楼梯或原地踏步，心率保持在能说话但不能唱歌。{tip}"),
                &["快走/爬楼 30 分钟", "平板支撑 3组×30-45秒", "死虫 3组×12次", "哑铃俄罗斯转体 3组×20次"],
            ),
            3 => day(
                "上肢拉：划船 + 弯举",
                &format!("划船时背挺直，用背发力而不是手臂。{tip}"),
                &[&format!("单臂哑铃划船（每侧）{v}"), &format!("哑铃俯身飞鸟 {v}"), &format!("哑铃弯举 {v}"), &format!("哑铃颈后臂屈伸 {v}")],
            ),
            4 => day(
                "全身哑铃循环",
                &format!("5 个动作连做为 1 轮，轮间休息 90 秒，共 3-4 轮。{tip}"),
                &["哑铃深蹲推举 12次", "哑铃划船 12次", "哑铃硬拉 12次", "登山跑 30秒", "开合步（不跳）30秒"],
            ),
            5 => day(
                "低冲击间歇 + 拉伸",
                &format!("20 分钟间歇：40 秒动作 + 20 秒休息，膝盖不适就降低幅度。{tip}"),
                &["哑铃摆动/深蹲 40秒", "高抬腿走 40秒", "哑铃推举 40秒", "侧向弓步 40秒", "全身拉伸 10 分钟"],
            ),
            _ => rest("休息日：散步 + 拉伸", &format!("肌肉在休息时恢复，今天只做轻松活动。称体重、量腰围记录一次。{tip}"), &["散步 20-30 分钟", "全身拉伸 10 分钟", "记录体重和腰围"]),
        };
        out.push(d);
    }
    out[29] = day("第 30 天：总结与复测", "对比第 1 天的体重、腰围和动作重量，决定下一阶段。", &["全身哑铃循环 3 轮", "称体重、量腰围并拍照对比", "写下下个月的目标"]);
    out
}

fn sleep_early() -> Vec<DraftDay> {
    let bed = ["23:45", "23:40", "23:35", "23:30", "23:25", "23:20", "23:15", "23:10", "23:05", "23:00"];
    let focus = [
        ("记录现状", "今晚照常作息，记下实际上床、入睡时间和睡前在做什么。", "写下影响你早睡的 3 件事"),
        ("定闹钟提醒", "设一个睡前 45 分钟的「准备睡觉」闹钟。", "闹钟响后不再开新的视频/游戏"),
        ("手机离床", "手机放到伸手够不到的地方充电。", "买/找一个普通闹钟替代手机闹钟"),
        ("调暗灯光", "睡前 1 小时把灯调暗，屏幕开护眼/夜间模式。", "关掉顶灯，只留台灯"),
        ("下午不喝咖啡", "14:00 以后不喝咖啡、浓茶和奶茶。", "用温水或花草茶代替"),
        ("睡前洗个热水澡", "睡前 60-90 分钟洗热水澡，有助于入睡。", "洗完不再看工作消息"),
        ("一周回顾", "看看这周哪几天做到了，最大的阻碍是什么。", "针对最大阻碍想一个办法"),
        ("固定起床时间", "不管几点睡，明天起每天同一时间起床（含周末）。", "定好固定起床闹钟"),
        ("睡前不处理工作", "21:30 以后不回工作消息，紧急的设特别提醒。", "把明天要做的事写在纸上清空大脑"),
        ("晚饭提前", "晚饭在睡前 3 小时前吃完，睡前不吃夜宵。", "饿了只喝一杯温牛奶"),
        ("睡前放松", "睡前做 10 分钟拉伸或 4-7-8 呼吸。", "拉伸/呼吸 10 分钟"),
        ("白天晒太阳", "上午出门晒 15 分钟太阳，帮助调整生物钟。", "上午户外 15 分钟"),
        ("控制午睡", "午睡不超过 30 分钟，下午 3 点后不睡。", "午睡定 25 分钟闹钟"),
        ("两周回顾", "统计这两周按时上床的天数，奖励自己一下。", "写下早睡后的变化"),
    ];
    (0..21)
        .map(|i| {
            let b = bed[i.min(bed.len() - 1)];
            if i == 20 {
                return day("第 21 天：巩固习惯", "回顾 21 天的记录，把有效的做法固定成每天的睡前流程。", &["23:00 前上床", "写下自己的睡前流程清单", "决定接下来是否继续提前到 22:30"]);
            }
            let (t, d, task) = focus[i % focus.len()];
            day(&format!("{b} 前上床 · {t}"), d, &[&format!("{b} 前放下手机上床"), task, "明早记录入睡时间和精神状态"])
        })
        .collect()
}

fn topics(list: &[(&str, &str, &[&str])]) -> Vec<DraftDay> {
    list.iter()
        .map(|(t, d, tasks)| if t.starts_with("休息") { rest(t, d, tasks) } else { day(t, d, tasks) })
        .collect()
}

fn java_review() -> Vec<DraftDay> {
    topics(&[
        ("Java 基础：数据类型与面向对象", "复习基本类型、包装类、自动装箱，封装/继承/多态。", &["整理 == 与 equals、hashCode 的区别", "写一个多态小例子", "做 10 道基础面试题"]),
        ("String、异常与泛型", "String 不可变、常量池，异常体系，泛型擦除。", &["对比 String/StringBuilder/StringBuffer", "画出异常类继承图", "解释泛型擦除并写示例"]),
        ("集合：List 与 Set", "ArrayList 扩容、LinkedList、HashSet 原理。", &["读 ArrayList.add 源码", "总结 fail-fast 机制", "练 5 道集合题"]),
        ("集合：HashMap 深入", "数组+链表+红黑树、扩容、hash 扰动、线程不安全原因。", &["手画 HashMap put 流程", "对比 JDK7/8 差异", "写一份 HashMap 面试答案"]),
        ("ConcurrentHashMap 与其他 Map", "CAS + synchronized 分段、TreeMap、LinkedHashMap 实现 LRU。", &["用 LinkedHashMap 写 LRU", "总结 CHM 的 put 流程"]),
        ("多线程基础", "线程创建方式、生命周期、wait/notify、线程中断。", &["画线程状态图", "写生产者-消费者", "整理 sleep 与 wait 区别"]),
        ("休息 · 本周回顾", "把本周笔记整理成一页思维导图。", &["整理思维导图", "标记不熟的点"]),
        ("锁：synchronized 与 volatile", "锁升级、对象头、volatile 可见性与禁止重排。", &["整理锁升级过程", "解释 DCL 单例为什么要 volatile"]),
        ("JUC：AQS 与 ReentrantLock", "AQS 队列、独占/共享、公平锁与非公平锁。", &["画 AQS 加锁流程", "用 CountDownLatch/Semaphore 各写一例"]),
        ("线程池", "核心参数、拒绝策略、执行流程、如何合理配置。", &["画线程池执行流程", "说明为什么不建议用 Executors 创建"]),
        ("JVM：内存区域与对象创建", "运行时数据区、对象内存布局、OOM 场景。", &["画运行时数据区", "复现一次堆 OOM 并看日志"]),
        ("JVM：垃圾回收", "可达性分析、回收算法、G1/ZGC 简介。", &["整理各收集器对比表", "看懂一段 GC 日志"]),
        ("JVM：类加载与调优", "双亲委派、类加载过程、常用排查命令 jstack/jmap/arthas。", &["用 jstack 找一次死锁", "整理调优思路"]),
        ("休息 · 本周回顾", "复习 JUC 和 JVM 的薄弱点。", &["重做本周标记的问题"]),
        ("Spring IoC", "Bean 生命周期、依赖注入、循环依赖与三级缓存。", &["画 Bean 生命周期", "解释三级缓存怎么解决循环依赖"]),
        ("Spring AOP 与事务", "动态代理、事务传播行为、事务失效场景。", &["写一个自定义注解 + 切面", "列出 6 种事务失效场景"]),
        ("Spring Boot", "自动配置原理、starter、配置加载顺序。", &["读 @EnableAutoConfiguration 流程", "自己写一个 starter"]),
        ("Spring MVC 与 Web", "DispatcherServlet 流程、拦截器与过滤器。", &["画请求处理流程", "写一个登录拦截器"]),
        ("MyBatis", "#{} 与 ${}、一二级缓存、插件与分页。", &["写一个动态 SQL", "说明 Mapper 接口如何被代理"]),
        ("MySQL：索引", "B+ 树、聚簇/二级索引、最左前缀、索引失效。", &["用 EXPLAIN 分析 3 条 SQL", "总结索引失效场景"]),
        ("休息 · 本周回顾", "整理 Spring 全家桶笔记。", &["用自己的话讲一遍 Spring 启动流程"]),
        ("MySQL：事务与锁", "ACID、隔离级别、MVCC、间隙锁、死锁排查。", &["画 MVCC 读视图原理", "复现一次死锁"]),
        ("Redis：数据结构与持久化", "五种结构使用场景、RDB/AOF。", &["每种结构写一个业务场景", "对比 RDB 和 AOF"]),
        ("Redis：缓存问题与分布式锁", "穿透/击穿/雪崩、双写一致性、Redisson 锁。", &["写出三种缓存问题的方案", "用 Redisson 实现分布式锁"]),
        ("消息队列：RocketMQ/Kafka", "削峰解耦、消息可靠性、顺序消息、重复消费。", &["画消息从生产到消费的链路", "说明如何保证不丢消息"]),
        ("微服务：注册中心与网关", "Nacos、OpenFeign、Gateway、负载均衡。", &["搭一个 Nacos + 两个服务的小 demo"]),
        ("微服务：熔断限流与分布式事务", "Sentinel、Seata AT 模式、最终一致性方案。", &["整理分布式事务方案对比"]),
        ("休息 · 本周回顾", "复习中间件笔记。", &["把中间件题目过一遍"]),
        ("项目串讲", "选一个自己的项目，把技术栈和难点串起来讲。", &["写项目介绍 2 分钟版", "准备 3 个难点 + 解决方案"]),
        ("第 30 天：模拟面试", "找人或用录音模拟一次 1 小时面试，查漏补缺。", &["模拟面试 1 小时", "整理没答好的题", "制定下阶段复习计划"]),
    ])
}

fn a_share() -> Vec<DraftDay> {
    topics(&[
        ("A 股基础规则", "交易时间、T+1、涨跌停（主板 10%、创业板/科创板 20%）、集合竞价。仅学习，不构成投资建议。", &["整理交易规则笔记", "开通模拟盘账户"]),
        ("交易费用与下单", "佣金、印花税、过户费；限价单、市价单。", &["算一笔 1 万元买卖的成本", "模拟盘下一笔限价单"]),
        ("K 线基础", "阳线阴线、实体与影线、常见单根 K 线含义。", &["认识 10 种单根 K 线", "复盘 3 只股票的日 K"]),
        ("K 线组合", "吞没、启明星、黄昏星、十字星。", &["在历史行情中找 5 个组合案例"]),
        ("成交量", "量价关系：放量上涨、缩量回调、天量见顶。", &["记录 3 个量价配合案例"]),
        ("均线系统", "5/10/20/60 日均线、多头排列、金叉死叉。", &["设置均线指标", "找 3 个均线支撑案例"]),
        ("休息 · 本周回顾", "整理本周笔记，不看盘。", &["写一页本周所学"]),
        ("分时图", "均价线、分时量、早盘与尾盘特征。", &["观察 3 只股票的一天分时走势"]),
        ("MACD 与 KDJ", "指标原理、背离、钝化，指标只是辅助。", &["标出 3 次 MACD 背离"]),
        ("支撑与压力", "前高前低、整数关口、缺口。", &["画出 3 只股票的支撑压力位"]),
        ("趋势与形态", "上升/下降趋势线、W 底、头肩顶、平台突破。", &["找 2 个突破形态并跟踪后续"]),
        ("板块与题材", "行业板块、概念板块、龙头股与跟风股。", &["记录今天涨幅前 5 的板块及原因"]),
        ("情绪周期", "涨停家数、连板高度、赚钱效应、冰点与高潮。", &["每天收盘记录市场情绪数据"]),
        ("休息 · 本周回顾", "回顾模拟盘记录。", &["复盘模拟盘每笔交易"]),
        ("龙虎榜与资金", "龙虎榜解读、北向资金、主力资金的局限。", &["看今天龙虎榜，写 3 条观察"]),
        ("消息与公告", "业绩预告、重大事项、利好利空的「预期」差。", &["跟踪 2 条公告对股价的影响"]),
        ("短线买点", "回踩均线、突破买入、低吸与追高的区别。", &["写下自己的 2 种买点规则"]),
        ("短线卖点", "止盈规则、跌破关键位、冲高卖出。", &["写下止盈规则"]),
        ("止损与仓位", "单笔止损 3-5%、仓位分配、不加仓摊薄亏损。", &["制定仓位和止损规则", "计算最大回撤承受度"]),
        ("交易计划", "盘前计划：买什么、为什么、买点、止损、仓位。", &["写一份明日交易计划（模拟）"]),
        ("休息 · 本周回顾", "检查是否按规则执行。", &["统计违规交易次数"]),
        ("交易心理", "贪婪与恐惧、报复性交易、错失恐惧。", &["写下自己最容易犯的 3 个错误"]),
        ("交易日志", "记录每笔交易的理由、结果、情绪。", &["建一个交易日志表格"]),
        ("模拟实战 1", "严格按交易计划在模拟盘操作。", &["盘前计划", "盘后复盘"]),
        ("模拟实战 2", "继续执行，记录偏差。", &["盘前计划", "盘后复盘"]),
        ("模拟实战 3", "继续执行，重点看止损是否到位。", &["盘前计划", "盘后复盘"]),
        ("风险认识", "短线高风险，多数人长期亏损；了解退市、ST、停牌风险。", &["列出自己绝不碰的股票类型"]),
        ("休息 · 本周回顾", "统计模拟盘胜率和盈亏比。", &["计算胜率和盈亏比"]),
        ("完善交易系统", "把规则整理成一页纸：选股、买点、卖点、止损、仓位。", &["写出一页交易系统"]),
        ("第 30 天：总结", "复盘 30 天，决定是继续模拟还是放弃短线。投资有风险，入市需谨慎。", &["写 30 天学习总结", "决定下一步"]),
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
        mk("fat-loss", "30天哑铃减脂（不跑步）", "只需一对哑铃，每周 6 练 1 休，力量 + 低冲击有氧，4 周渐进加量，配合每日饮食小目标。", "flame", "健身", fat_loss()),
        mk("sleep-early", "21天早睡（23点前上床）", "从 23:45 起每天提前 5 分钟，第 10 天起稳定 23:00 前上床，每天一个助眠小习惯。", "target", "作息", sleep_early()),
        mk("java-review", "Java 基础 + 框架 + 中间件复习 30 天", "Java 基础、集合、并发、JVM、Spring 全家桶、MySQL、Redis、MQ、微服务，最后项目串讲和模拟面试。", "book", "学习", java_review()),
        mk("a-share", "A 股短线学习 30 天", "规则、K 线、量价、均线、情绪周期、买卖点、止损与仓位，配合模拟盘实践。仅学习，不构成投资建议。", "book", "学习", a_share()),
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
        assert_eq!(b.iter().map(|t| t.id.as_str()).collect::<Vec<_>>(), ["b:fat-loss", "b:sleep-early", "b:java-review", "b:a-share"]);
        for t in &b {
            assert!(t.days.len() >= 21, "{} 天数", t.title);
            assert_eq!(t.days_count, t.days.len());
            for (i, d) in t.days.iter().enumerate() {
                assert!(!d.title.trim().is_empty() && !d.tasks.is_empty(), "{} 第{}天不完整", t.title, i + 1);
            }
        }
        assert!(!b.iter().any(|t| t.title.contains("家务")));
        assert_eq!(b[0].days.iter().filter(|d| d.is_rest).count(), 4);
    }

    #[test]
    fn apply_save_delete() {
        let mut c = Connection::open_in_memory().unwrap();
        crate::db::migrate(&c).unwrap();
        assert!(apply_template(&mut c, "b:sleep-early", "2026-10-13", "2026-10-14", 1).is_err());
        let gid = apply_template(&mut c, "b:sleep-early", "2026-10-15", "2026-10-14", 1).unwrap();
        let d = get_goal_detail(&c, gid, "2026-10-15", 3).unwrap();
        assert_eq!((d.total, d.start_date.as_deref(), d.end_date.as_deref()), (21, Some("2026-10-15"), Some("2026-11-04")));
        assert!(d.today.unwrap().title.contains("23:45"));
        let gid2 = apply_template(&mut c, "b:fat-loss", "2026-10-14", "2026-10-14", 2).unwrap();
        assert_eq!(get_goal_detail(&c, gid2, "2026-10-14", 0).unwrap().total, 30);
        assert!(apply_template(&mut c, "b:nope", "2026-10-14", "2026-10-14", 2).is_err());

        let tid = save_goal_as_template(&c, gid, Some("  我的早睡版  "), 5).unwrap();
        let t = get_template(&c, &tid).unwrap();
        assert_eq!((t.title.as_str(), t.days.len(), t.builtin), ("我的早睡版", 21, false));
        assert_eq!(list_templates(&c).unwrap()[0].id, tid, "自建排在前");
        assert!(!t.days[0].tasks.is_empty());
        // 自建模板也能生效
        let g3 = apply_template(&mut c, &tid, "2026-10-20", "2026-10-14", 6).unwrap();
        assert_eq!(get_goal_detail(&c, g3, "2026-10-20", 0).unwrap().total, 21);
        assert!(delete_template(&c, "b:a-share").is_err());
        delete_template(&c, &tid).unwrap();
        assert!(delete_template(&c, &tid).is_err());
        assert!(list_templates(&c).unwrap().iter().all(|t| t.builtin));
        crate::templates::save_goal_as_template(&c, gid, None, 7).unwrap();
        crate::service::factory_reset(&mut c).unwrap();
        assert!(list_templates(&c).unwrap().iter().all(|t| t.builtin), "恢复出厂清空自建模板");
    }
}
