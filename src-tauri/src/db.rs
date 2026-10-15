//! SQLite 本地库：打开 + 迁移。
//! 所有 DB 访问只通过 service 模块 / Tauri command，前端不直连。

use rusqlite::Connection;
use std::fs;
use std::path::PathBuf;

pub const DB_FILE_NAME: &str = "goal_plan.db";

#[derive(Debug, thiserror::Error)]
pub enum DbError {
    #[error("创建数据目录失败: {0}")]
    CreateDir(#[source] std::io::Error),
    #[error("SQLite: {0}")]
    Sqlite(#[from] rusqlite::Error),
}

pub fn db_path(app_data_dir: PathBuf) -> PathBuf {
    app_data_dir.join(DB_FILE_NAME)
}

pub fn open_and_migrate(app_data_dir: PathBuf) -> Result<Connection, DbError> {
    fs::create_dir_all(&app_data_dir).map_err(DbError::CreateDir)?;
    let conn = Connection::open(db_path(app_data_dir))?;
    conn.execute_batch("PRAGMA journal_mode = WAL;")?;
    migrate(&conn)?;
    Ok(conn)
}

const V1: &str = r#"
CREATE TABLE goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    icon TEXT NOT NULL DEFAULT 'target',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
CREATE TABLE plan_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id INTEGER NOT NULL REFERENCES goals(id),
    version_no INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft','active','archived')),
    source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('chat','manual')),
    summary TEXT NOT NULL DEFAULT '',
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    activated_at INTEGER,
    UNIQUE (goal_id, version_no)
);
CREATE UNIQUE INDEX one_active_version ON plan_versions(goal_id) WHERE status = 'active';
CREATE TABLE plan_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_version_id INTEGER NOT NULL REFERENCES plan_versions(id),
    day_index INTEGER NOT NULL,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    detail TEXT NOT NULL DEFAULT '',
    tasks TEXT NOT NULL DEFAULT '[]',
    is_rest INTEGER NOT NULL DEFAULT 0,
    UNIQUE (plan_version_id, day_index),
    UNIQUE (plan_version_id, date)
);
CREATE TABLE checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_day_id INTEGER NOT NULL UNIQUE REFERENCES plan_days(id),
    date TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('on_time','make_up')),
    done_at INTEGER NOT NULL,
    note TEXT NOT NULL DEFAULT ''
);
"#;

const V2: &str = r#"
CREATE TABLE settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
);
CREATE TABLE chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
CREATE TABLE chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL REFERENCES chat_sessions(id),
    role TEXT NOT NULL CHECK (role IN ('user','assistant')),
    content TEXT NOT NULL,
    draft_json TEXT,
    draft_error TEXT,
    confirmed_goal_id INTEGER REFERENCES goals(id),
    created_at INTEGER NOT NULL
);
CREATE INDEX chat_messages_session ON chat_messages(session_id, id);
"#;

const V3: &str = r#"
ALTER TABLE chat_sessions ADD COLUMN goal_id INTEGER REFERENCES goals(id);
ALTER TABLE chat_messages ADD COLUMN confirmed_version INTEGER;
CREATE TABLE weekly_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id INTEGER NOT NULL REFERENCES goals(id),
    week_start TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    due INTEGER NOT NULL DEFAULT 0,
    missed INTEGER NOT NULL DEFAULT 0,
    went_well TEXT NOT NULL DEFAULT '',
    hard TEXT NOT NULL DEFAULT '',
    next_plan TEXT NOT NULL DEFAULT '',
    ai_comment TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    UNIQUE (goal_id, week_start)
);
"#;

const V4: &str = r#"
CREATE TABLE goal_reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id INTEGER NOT NULL REFERENCES goals(id),
    time TEXT NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    UNIQUE (goal_id, time)
);
CREATE TABLE reminder_log (
    key TEXT NOT NULL,
    date TEXT NOT NULL,
    sent_at INTEGER NOT NULL,
    PRIMARY KEY (key, date)
);
"#;

const V5: &str = r#"
ALTER TABLE chat_sessions ADD COLUMN deleted_at INTEGER;
CREATE TABLE plan_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    days_json TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
"#;

const V6: &str = r#"
CREATE TABLE weather_cache (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    city_key TEXT NOT NULL,
    fetched_at INTEGER NOT NULL,
    data TEXT NOT NULL
);
"#;

/// 迁移：按 schema_migrations 里的最大版本号依次补齐。
pub fn migrate(conn: &Connection) -> Result<(), rusqlite::Error> {
    conn.execute_batch(
        "PRAGMA foreign_keys = ON;
         CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY NOT NULL,
            applied_at TEXT NOT NULL DEFAULT (datetime('now'))
         );",
    )?;
    let current: i64 = conn.query_row(
        "SELECT COALESCE(MAX(version), -1) FROM schema_migrations",
        [],
        |r| r.get(0),
    )?;
    if current < 0 {
        conn.execute("INSERT INTO schema_migrations (version) VALUES (0)", [])?;
    }
    if current < 1 {
        conn.execute_batch(&format!("BEGIN; {V1} INSERT INTO schema_migrations (version) VALUES (1); COMMIT;"))?;
    }
    if current < 2 {
        conn.execute_batch(&format!("BEGIN; {V2} INSERT INTO schema_migrations (version) VALUES (2); COMMIT;"))?;
    }
    if current < 3 {
        conn.execute_batch(&format!("BEGIN; {V3} INSERT INTO schema_migrations (version) VALUES (3); COMMIT;"))?;
    }
    if current < 4 {
        conn.execute_batch(&format!("BEGIN; {V4} INSERT INTO schema_migrations (version) VALUES (4); COMMIT;"))?;
    }
    if current < 5 {
        conn.execute_batch(&format!("BEGIN; {V5} INSERT INTO schema_migrations (version) VALUES (5); COMMIT;"))?;
    }
    if current < 6 {
        conn.execute_batch(&format!("BEGIN; {V6} INSERT INTO schema_migrations (version) VALUES (6); COMMIT;"))?;
    }
    if current < 7 {
        migrate_v7(conn)?;
    }
    Ok(())
}

/// V7：goals.status 增加 'completed'。SQLite 改 CHECK 需重建表：
/// 关外键 → 按原建表语句（只替换 CHECK）建新表 → 拷数据 → 删旧表改名 → 重建 goals 上的索引/触发器 → 外键自检 → 开外键。
fn migrate_v7(conn: &Connection) -> Result<(), rusqlite::Error> {
    let old_sql: String = conn.query_row("SELECT sql FROM sqlite_master WHERE type='table' AND name='goals'", [], |r| r.get(0))?;
    let extras: Vec<String> = {
        let mut st = conn.prepare("SELECT sql FROM sqlite_master WHERE tbl_name='goals' AND type IN ('index','trigger') AND sql IS NOT NULL")?;
        let rows = st.query_map([], |r| r.get::<_, String>(0))?;
        rows.collect::<Result<_, _>>()?
    };
    let new_sql = old_sql
        .replacen("CHECK (status IN ('active','archived'))", "CHECK (status IN ('active','completed','archived'))", 1)
        .replacen("CREATE TABLE goals", "CREATE TABLE goals_v7", 1)
        .replacen("CREATE TABLE \"goals\"", "CREATE TABLE goals_v7", 1);
    if !new_sql.contains("'completed'") {
        return Err(rusqlite::Error::InvalidQuery);
    }
    conn.execute_batch("PRAGMA foreign_keys = OFF;")?;
    let r = (|| -> Result<(), rusqlite::Error> {
        conn.execute_batch("BEGIN;")?;
        conn.execute_batch(&new_sql)?;
        conn.execute_batch("INSERT INTO goals_v7 SELECT * FROM goals; DROP TABLE goals; ALTER TABLE goals_v7 RENAME TO goals;")?;
        for x in &extras {
            conn.execute_batch(x)?;
        }
        let bad: i64 = conn.query_row("SELECT COUNT(*) FROM pragma_foreign_key_check", [], |r| r.get(0))?;
        if bad > 0 {
            return Err(rusqlite::Error::InvalidQuery);
        }
        conn.execute_batch("INSERT INTO schema_migrations (version) VALUES (7); COMMIT;")
    })();
    if r.is_err() {
        let _ = conn.execute_batch("ROLLBACK;");
    }
    conn.execute_batch("PRAGMA foreign_keys = ON;")?;
    r
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn v7_migration_keeps_data_and_fks() {
        let c = Connection::open_in_memory().unwrap();
        // 模拟老库：只迁到 V6
        c.execute_batch("PRAGMA foreign_keys = ON; CREATE TABLE schema_migrations (version INTEGER PRIMARY KEY NOT NULL, applied_at TEXT NOT NULL DEFAULT (datetime('now'))); INSERT INTO schema_migrations (version) VALUES (0);").unwrap();
        for (i, v) in [V1, V2, V3, V4, V5, V6].iter().enumerate() {
            c.execute_batch(&format!("BEGIN; {v} INSERT INTO schema_migrations (version) VALUES ({}); COMMIT;", i + 1)).unwrap();
        }
        c.execute("INSERT INTO goals (title, icon, status, created_at, updated_at) VALUES ('老目标', 'flame', 'archived', 1, 2)", []).unwrap();
        c.execute("INSERT INTO goals (title, created_at, updated_at) VALUES ('进行中', 3, 3)", []).unwrap();
        c.execute("INSERT INTO plan_versions (goal_id, version_no, status, start_date, end_date, created_at) VALUES (2, 1, 'active', '2026-10-01', '2026-10-05', 3)", []).unwrap();
        assert!(c.execute("UPDATE goals SET status='completed' WHERE id=2", []).is_err(), "老库不认 completed");

        migrate(&c).unwrap();
        let rows: Vec<(i64, String, String, String, i64)> = c.prepare("SELECT id, title, icon, status, updated_at FROM goals ORDER BY id").unwrap()
            .query_map([], |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?, r.get(3)?, r.get(4)?))).unwrap().map(|x| x.unwrap()).collect();
        assert_eq!(rows, vec![(1, "老目标".into(), "flame".into(), "archived".into(), 2), (2, "进行中".into(), "target".into(), "active".into(), 3)]);
        c.execute("UPDATE goals SET status='completed' WHERE id=2", []).unwrap();
        assert!(c.execute("UPDATE goals SET status='bogus' WHERE id=2", []).is_err());
        // 外键仍然生效、自增继续
        assert!(c.execute("INSERT INTO plan_versions (goal_id, version_no, status, start_date, end_date, created_at) VALUES (99, 1, 'active', '2026-10-01', '2026-10-05', 3)", []).is_err());
        c.execute("INSERT INTO goals (title, created_at, updated_at) VALUES ('新', 4, 4)", []).unwrap();
        assert_eq!(c.last_insert_rowid(), 3);
        let fk: i64 = c.query_row("SELECT COUNT(*) FROM pragma_foreign_key_check", [], |r| r.get(0)).unwrap();
        assert_eq!(fk, 0);
        let mv: i64 = c.query_row("SELECT MAX(version) FROM schema_migrations", [], |r| r.get(0)).unwrap();
        assert_eq!(mv, 7);
        migrate(&c).unwrap();
    }
}
