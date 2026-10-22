//! 数据统计：连续打卡 / 完成率 / 趋势 / 热力图 / 排行。休息日不计入、也不算中断。

use std::collections::BTreeMap;

use chrono::{Datelike, Duration, NaiveDate};
use rusqlite::Connection;
use serde::Serialize;

use crate::service::{days_of, e, parse_date, version_for};

type R<T> = Result<T, String>;

#[derive(Debug, Serialize)]
pub struct WeekPoint {
    pub week_start: String,
    pub done: i64,
    pub due: i64,
    /// due=0 时为 None（这周没有要做的）
    pub rate: Option<f64>,
}

#[derive(Debug, Serialize, Clone)]
pub struct HeatCell {
    pub date: String,
    pub done: i64,
    pub due: i64,
    /// -1 无计划 / 0 未完成或休息 / 1~4 完成度
    pub level: i64,
    pub rest: bool,
    pub future: bool,
}

#[derive(Debug, Serialize)]
pub struct GoalRank {
    pub id: i64,
    pub title: String,
    pub icon: String,
    pub status: String,
    pub done: i64,
    pub due: i64,
    pub rate: Option<f64>,
    pub streak: i64,
}

#[derive(Debug, Serialize)]
pub struct GoalOption {
    pub id: i64,
    pub title: String,
    pub status: String,
}

#[derive(Debug, Serialize)]
pub struct Stats {
    pub today: String,
    pub current_streak: i64,
    pub longest_streak: i64,
    pub total_checkins: i64,
    pub week: WeekPoint,
    /// 全程：从计划开始到今天（休息日不计；今天未打卡不算未完成）
    pub overall_done: i64,
    pub overall_due: i64,
    pub overall_rate: Option<f64>,
    pub trend: Vec<WeekPoint>,
    pub heatmap: Vec<HeatCell>,
    pub ranking: Vec<GoalRank>,
    pub goals: Vec<GoalOption>,
}

#[derive(Default, Clone, Copy)]
struct DayAgg {
    due: i64,
    done: i64,
    rest: i64,
}

fn rate(done: i64, due: i64) -> Option<f64> {
    if due == 0 { None } else { Some(done as f64 / due as f64) }
}

fn fmt(d: NaiveDate) -> String {
    d.format("%Y-%m-%d").to_string()
}

/// 某天的结果：Some(true) 完成 / Some(false) 中断 / None 不计（休息、无计划、今天还没做完）
fn outcome(a: Option<&DayAgg>, is_today: bool) -> Option<bool> {
    let a = a?;
    if a.due == 0 {
        return None;
    }
    if a.done >= a.due {
        Some(true)
    } else if is_today {
        None
    } else {
        Some(false)
    }
}

/// (当前连续, 最长连续)，以「天」为单位
fn streaks(agg: &BTreeMap<NaiveDate, DayAgg>, today: NaiveDate) -> (i64, i64) {
    let mut longest = 0;
    let mut run = 0;
    for (d, a) in agg.range(..=today) {
        match outcome(Some(a), *d == today) {
            Some(true) => {
                run += 1;
                longest = longest.max(run);
            }
            Some(false) => run = 0,
            None => {}
        }
    }
    // run 就是截至今天的当前连续（中间的休息/无计划日被跳过不打断）
    (run, longest)
}

fn sum(agg: &BTreeMap<NaiveDate, DayAgg>, from: NaiveDate, to: NaiveDate) -> (i64, i64) {
    agg.range(from..=to).fold((0, 0), |(d, u), (_, a)| (d + a.done, u + a.due))
}

pub fn get_stats(conn: &Connection, goal_filter: Option<i64>, today: &str) -> R<Stats> {
    // 只统计进行中的目标：已完成、已归档的计划和打卡默认不计（回到进行中后重新计入）
    let t = parse_date(today)?;
    // 例外：单独查询某个已完成/已归档目标（详情完成卡、结项最终总结）时计入该目标；列表仍只列进行中
    let mut st = conn
        .prepare("SELECT id, title, icon, status FROM goals WHERE status = 'active' OR (status IN ('completed','archived') AND id = ?1) ORDER BY id")
        .map_err(e)?;
    let goals = st
        .query_map([goal_filter.unwrap_or(-1)], |r| Ok((r.get::<_, i64>(0)?, r.get::<_, String>(1)?, r.get::<_, String>(2)?, r.get::<_, String>(3)?)))
        .map_err(e)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(e)?;

    let mut all: BTreeMap<NaiveDate, DayAgg> = BTreeMap::new();
    let mut ranking = Vec::new();
    let mut total_checkins = 0;
    for (id, title, icon, status) in &goals {
        if goal_filter.is_some_and(|g| g != *id) {
            continue;
        }
        let Some(v) = version_for(conn, *id, false)? else { continue };
        let mut mine: BTreeMap<NaiveDate, DayAgg> = BTreeMap::new();
        for d in days_of(conn, v.id)? {
            let Ok(date) = parse_date(&d.date) else { continue };
            if d.checked {
                total_checkins += 1;
            }
            let a = mine.entry(date).or_default();
            if d.is_rest {
                a.rest += 1;
            } else if date <= t {
                a.due += 1;
                a.done += d.checked as i64;
            }
        }
        for (d, a) in &mine {
            let x = all.entry(*d).or_default();
            x.due += a.due;
            x.done += a.done;
            x.rest += a.rest;
        }
        let (done, due) = mine.values().fold((0, 0), |(d, u), a| (d + a.done, u + a.due));
        ranking.push(GoalRank {
            id: *id,
            title: title.clone(),
            icon: icon.clone(),
            status: status.clone(),
            done,
            due,
            rate: rate(done, due),
            streak: streaks(&mine, t).0,
        });
    }
    ranking.sort_by(|a, b| {
        b.rate.unwrap_or(-1.0).partial_cmp(&a.rate.unwrap_or(-1.0)).unwrap().then(b.done.cmp(&a.done)).then(a.id.cmp(&b.id))
    });

    let (current_streak, longest_streak) = streaks(&all, t);
    let monday = t - Duration::days(t.weekday().num_days_from_monday() as i64);
    let week_of = |ws: NaiveDate| {
        let (done, due) = sum(&all, ws, ws + Duration::days(6));
        WeekPoint { week_start: fmt(ws), done, due, rate: rate(done, due) }
    };
    let week = week_of(monday);
    let trend = (0..8).rev().map(|i| week_of(monday - Duration::weeks(i))).collect();
    let (overall_done, overall_due) = all.range(..=t).fold((0, 0), |(d, u), (day, a)| {
        if *day == t { (d + a.done, u + a.done) } else { (d + a.done, u + a.due) }
    });

    // 热力图：26 周，周一对齐，到本周日
    let start = monday - Duration::weeks(25);
    let heatmap = (0..26 * 7)
        .map(|i| {
            let d = start + Duration::days(i);
            let a = all.get(&d).copied();
            let future = d > t;
            let (due, done, rest) = a.map(|a| (a.due, a.done, a.rest > 0 && a.due == 0)).unwrap_or((0, 0, false));
            let level = match a {
                None => -1,
                Some(_) if future || due == 0 => if rest || future { 0 } else { -1 },
                Some(_) => {
                    let r = done as f64 / due as f64;
                    if done == 0 { 0 } else if r < 0.34 { 1 } else if r < 0.67 { 2 } else if r < 1.0 { 3 } else { 4 }
                }
            };
            HeatCell { date: fmt(d), done, due, level, rest, future }
        })
        .collect();

    Ok(Stats {
        today: today.into(),
        current_streak,
        longest_streak,
        total_checkins,
        week,
        overall_done,
        overall_due,
        overall_rate: rate(overall_done, overall_due),
        trend,
        heatmap,
        ranking,
        goals: goals.iter().filter(|g| g.3 == "active").map(|(id, title, _, status)| GoalOption { id: *id, title: title.clone(), status: status.clone() }).collect(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::service::{check_in, create_goal_with_plan, make_up_check_in, NewDay, NewGoal};

    fn db() -> Connection {
        let c = Connection::open_in_memory().unwrap();
        crate::db::migrate(&c).unwrap();
        c
    }

    fn goal(conn: &mut Connection, title: &str, start: &str, rest: &[usize], n: usize) -> i64 {
        let days = (0..n)
            .map(|i| NewDay { title: format!("第{}天", i + 1), detail: String::new(), tasks: vec![], is_rest: rest.contains(&i) })
            .collect();
        create_goal_with_plan(
            conn,
            &NewGoal { title: title.into(), description: String::new(), icon: None, source: None, summary: String::new(), start_date: start.into(), days },
            1,
        )
        .unwrap()
    }

    fn day_id(conn: &Connection, gid: i64, date: &str) -> i64 {
        conn.query_row(
            "SELECT d.id FROM plan_days d JOIN plan_versions v ON v.id=d.plan_version_id WHERE v.goal_id=?1 AND v.status='active' AND d.date=?2",
            rusqlite::params![gid, date],
            |r| r.get(0),
        )
        .unwrap()
    }

    #[test]
    fn streak_and_rates() {
        let mut c = db();
        // 2026-10-05(周一) 起 14 天，索引 3 (10-08) 是休息日
        let g = goal(&mut c, "哑铃", "2026-10-05", &[3], 14);
        let today = "2026-10-14";
        // 10-05..10-07 打卡，10-08 休息，10-09 漏，10-10..10-13 打卡（10-12 补卡），今天还没打
        for d in ["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-10", "2026-10-11", "2026-10-13"] {
            check_in(&c, day_id(&c, g, d), d, 2).unwrap();
        }
        make_up_check_in(&c, day_id(&c, g, "2026-10-12"), today, 3).unwrap();
        let s = get_stats(&c, None, today).unwrap();
        assert_eq!(s.current_streak, 4, "今天没打卡不算中断");
        assert_eq!(s.longest_streak, 4);
        assert_eq!(s.total_checkins, 7);
        // 本周 10-12..10-14：due 3，done 2
        assert_eq!((s.week.done, s.week.due), (2, 3));
        // 全程：10-05..10-13 去掉休息日 8 天，完成 7；今天未打卡不计入
        assert_eq!((s.overall_done, s.overall_due), (7, 8));
        assert_eq!(s.trend.len(), 8);
        assert_eq!(s.trend[6].week_start, "2026-10-05");
        assert_eq!((s.trend[6].done, s.trend[6].due), (5, 6));
        assert!(s.trend[0].rate.is_none());
        assert_eq!(s.heatmap.len(), 182);
        let cell = |d: &str| s.heatmap.iter().find(|h| h.date == d).unwrap();
        assert!(cell("2026-10-08").rest && cell("2026-10-08").level == 0);
        assert_eq!(cell("2026-10-09").level, 0);
        assert_eq!(cell("2026-10-10").level, 4);
        assert!(cell("2026-10-18").future);
        assert_eq!(cell("2026-09-01").level, -1);

        // 今天打卡后 +1；休息日跨过去不断：10-07→10-10 之间只有 10-09 断了
        check_in(&c, day_id(&c, g, today), today, 4).unwrap();
        assert_eq!(get_stats(&c, None, today).unwrap().current_streak, 5);
        // 补上 10-09：最长 = 10-05..10-14 共 9 个非休息日
        make_up_check_in(&c, day_id(&c, g, "2026-10-09"), today, 5).unwrap();
        let s = get_stats(&c, None, today).unwrap();
        assert_eq!((s.current_streak, s.longest_streak), (9, 9), "休息日不算中断");

        // 第二个目标：今天没做，多目标时当天要全部完成才算
        let g2 = goal(&mut c, "阅读", "2026-10-13", &[], 5);
        let s = get_stats(&c, None, today).unwrap();
        assert_eq!(s.longest_streak, 7, "10-13 阅读漏了 → 那天中断");
        assert_eq!(s.current_streak, 0);
        assert_eq!(s.ranking[0].id, g);
        assert_eq!((s.ranking[1].done, s.ranking[1].due), (0, 2));
        // 筛选单个目标
        let s = get_stats(&c, Some(g), today).unwrap();
        assert_eq!((s.current_streak, s.ranking.len(), s.goals.len()), (9, 1, 2));
        let s = get_stats(&c, Some(g2), today).unwrap();
        assert_eq!((s.current_streak, s.overall_done, s.overall_due), (0, 0, 1), "单目标只算该目标");

        // 归档 g2：所有统计都不再计入，下拉也不列出
        crate::service::archive_goal(&mut c, g2, 10).unwrap();
        let s = get_stats(&c, None, today).unwrap();
        assert_eq!((s.current_streak, s.longest_streak), (9, 9), "归档目标不打断连续");
        assert_eq!(s.total_checkins, 9);
        assert_eq!((s.ranking.len(), s.goals.len()), (1, 1));
        assert!(s.goals.iter().all(|x| x.id != g2) && s.ranking.iter().all(|x| x.id != g2));
        assert_eq!((s.week.done, s.week.due), (3, 3));
        assert_eq!((s.overall_done, s.overall_due, s.overall_rate), (9, 9, Some(1.0)), "今天已打卡计入");
        assert_eq!(s.heatmap.iter().find(|h| h.date == "2026-10-13").unwrap().level, 4);
        let s2 = get_stats(&c, Some(g2), today).unwrap();
        assert_eq!(s2.ranking.len(), 1, "archived goal filter returns that goal for final review KPI");
        assert_eq!(s2.ranking[0].id, g2);
        assert!(s2.ranking[0].due > 0, "archived filter still has due days");
        assert!(s2.goals.iter().all(|x| x.id != g2), "dropdown still excludes archived");

        // 全部归档 → 空
        crate::service::archive_goal(&mut c, g, 11).unwrap();
        let s = get_stats(&c, None, today).unwrap();
        assert!(s.goals.is_empty() && s.ranking.is_empty());
        assert_eq!((s.total_checkins, s.current_streak, s.overall_rate), (0, 0, None));

        // 取消归档后重新计入
        crate::service::restore_goal(&mut c, g, 12).unwrap();
        crate::service::restore_goal(&mut c, g2, 12).unwrap();
        let s = get_stats(&c, None, today).unwrap();
        assert_eq!((s.goals.len(), s.ranking.len(), s.longest_streak), (2, 2, 7));
    }

    #[test]
    fn completed_lifecycle() {
        use crate::service::{archive_goal, get_goal_detail, list_goals, list_goals_by, refresh_statuses, restore_goal};
        let mut c = db();
        // 10-10..10-12 三天
        let g = goal(&mut c, "三天", "2026-10-10", &[], 3);
        let st = |c: &Connection| -> String { c.query_row("SELECT status FROM goals WHERE id=?1", [g], |r| r.get(0)).unwrap() };
        for d in ["2026-10-10", "2026-10-11"] {
            check_in(&c, day_id(&c, g, d), d, 2).unwrap();
        }
        // 最后一天当天仍是进行中
        refresh_statuses(&c, "2026-10-12").unwrap();
        assert_eq!(st(&c), "active");
        // 过了最后一天 → 已完成；列表照样列出、排在进行中之后
        let g2 = goal(&mut c, "长期", "2026-10-10", &[], 30);
        let l = list_goals(&c, "2026-10-13").unwrap();
        assert_eq!(st(&c), "completed");
        assert_eq!(l.iter().map(|x| (x.id, x.status.as_str())).collect::<Vec<_>>(), vec![(g2, "active"), (g, "completed")]);
        let d = get_goal_detail(&c, g, "2026-10-13", 0).unwrap();
        assert!(!d.readonly && d.today.is_none() && (d.done, d.total) == (2, 3));
        // 已完成仍可补打
        make_up_check_in(&c, day_id(&c, g, "2026-10-12"), "2026-10-13", 3).unwrap();
        // 统计不计入已完成
        let s = get_stats(&c, None, "2026-10-13").unwrap();
        assert!(s.goals.iter().all(|x| x.id != g) && s.ranking.iter().all(|r| r.id != g));
        assert_eq!(s.goals.len(), 1);
        // 单独查已完成目标（详情页完成总结）仍有数据，但下拉不列它
        let s1 = get_stats(&c, Some(g), "2026-10-13").unwrap();
        assert_eq!(s1.ranking.iter().find(|r| r.id == g).map(|r| (r.done, r.due)), Some((3, 3)));
        assert!(s1.goals.iter().all(|x| x.id != g));
        // 已完成可归档；取消归档后按日期重新判断
        archive_goal(&mut c, g, 4).unwrap();
        assert_eq!(st(&c), "archived");
        assert!(get_stats(&c, None, "2026-10-13").unwrap().goals.iter().all(|x| x.id != g));
        assert_eq!(list_goals_by(&c, "2026-10-13", true).unwrap().len(), 1);
        restore_goal(&mut c, g, 5).unwrap();
        refresh_statuses(&c, "2026-10-13").unwrap();
        assert_eq!(st(&c), "completed");
        restore_goal(&mut c, g, 5).unwrap_err();
        // 改方案延长到今天及以后 → 回到进行中
        let days: Vec<NewDay> = (0..5).map(|i| NewDay { title: format!("延长{i}"), detail: String::new(), tasks: vec![], is_rest: false }).collect();
        crate::revise::revise_plan(&mut c, g, &days, "延长", "chat", "2026-10-13", 6).unwrap();
        assert_eq!(st(&c), "active");
        // 回到进行中后重新计入统计
        let s = get_stats(&c, None, "2026-10-13").unwrap();
        assert_eq!(s.ranking.iter().find(|r| r.id == g).map(|r| r.done), Some(3));
        // 恢复一个已归档但日期仍在计划内的 → 进行中
        archive_goal(&mut c, g2, 7).unwrap();
        restore_goal(&mut c, g2, 8).unwrap();
        refresh_statuses(&c, "2026-10-13").unwrap();
        let s2: String = c.query_row("SELECT status FROM goals WHERE id=?1", [g2], |r| r.get(0)).unwrap();
        assert_eq!(s2, "active");
    }
}
