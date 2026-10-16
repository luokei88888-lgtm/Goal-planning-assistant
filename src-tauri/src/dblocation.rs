//! 数据库存放位置：默认在应用数据目录；用户可改到任意文件夹。
//! 位置记在应用数据目录下固定的 config.json（不能放进数据库：启动时还没打开库就得知道去哪儿找）。
//! 迁移流程：checkpoint WAL → 复制到临时文件 → 校验（integrity_check + 各表行数一致）→ 改名为正式文件
//! → 写 config.json（运行中下一次访问即切换到新库）→ 原文件改名为 .bak 留作备份。

use rusqlite::{Connection, OpenFlags};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

use crate::db::DB_FILE_NAME;

type R<T> = Result<T, String>;

pub const CONFIG_FILE: &str = "config.json";
/// 目标目录已有数据库时返回的错误前缀，前端据此弹窗询问
pub const EXISTS_PREFIX: &str = "DB_EXISTS:";
/// 配置的位置找不到数据库
pub const MISSING_PREFIX: &str = "DB_MISSING:";

#[derive(Debug, Default, Serialize, Deserialize, Clone, PartialEq)]
pub struct Config {
    /// 自定义的数据库所在目录；None 表示默认位置
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub db_dir: Option<String>,
}

#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct Location {
    /// 数据库文件完整路径
    pub path: String,
    pub dir: String,
    pub default_dir: String,
    pub custom: bool,
    /// 配置的位置找不到数据库（如 U 盘拔了），此时不会新建空库
    pub missing: bool,
}

#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct MoveResult {
    pub path: String,
    /// 原数据库改名后的备份路径；改名失败时为 None（原文件原样保留）
    pub backup: Option<String>,
    /// 目标目录里被覆盖掉的旧文件的备份路径
    pub replaced_backup: Option<String>,
    /// 使用了目标目录里已有的数据库
    pub used_existing: bool,
    pub note: String,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Conflict {
    /// 目标已有同名库时报错，交给用户选
    Ask,
    /// 直接使用目标目录里已有的那份数据
    UseExisting,
    /// 用当前数据覆盖（目标里的旧文件先改名备份，不直接删除）
    Overwrite,
}

impl Conflict {
    pub fn parse(s: Option<&str>) -> R<Self> {
        match s {
            None | Some("") | Some("ask") => Ok(Conflict::Ask),
            Some("use_existing") => Ok(Conflict::UseExisting),
            Some("overwrite") => Ok(Conflict::Overwrite),
            Some(_) => Err("未知的处理方式".into()),
        }
    }
}

pub fn config_path(app_dir: &Path) -> PathBuf {
    app_dir.join(CONFIG_FILE)
}

pub fn read_config(app_dir: &Path) -> Config {
    fs::read_to_string(config_path(app_dir)).ok().and_then(|s| serde_json::from_str(&s).ok()).unwrap_or_default()
}

/// 先写临时文件再改名，避免写一半
pub fn write_config(app_dir: &Path, c: &Config) -> R<()> {
    fs::create_dir_all(app_dir).map_err(|e| format!("无法创建应用数据目录：{e}"))?;
    let tmp = app_dir.join("config.json.tmp");
    fs::write(&tmp, serde_json::to_string_pretty(c).map_err(|e| e.to_string())?).map_err(|e| format!("写配置文件失败：{e}"))?;
    fs::rename(&tmp, config_path(app_dir)).map_err(|e| format!("写配置文件失败：{e}"))
}

fn same_dir(a: &Path, b: &Path) -> bool {
    match (fs::canonicalize(a), fs::canonicalize(b)) {
        (Ok(x), Ok(y)) => x == y,
        _ => a == b,
    }
}

pub fn resolve(app_dir: &Path) -> Location {
    let cfg = read_config(app_dir);
    let default_dir = app_dir.display().to_string();
    match cfg.db_dir.filter(|d| !d.trim().is_empty()) {
        Some(d) if !same_dir(Path::new(&d), app_dir) => {
            let p = Path::new(&d).join(DB_FILE_NAME);
            Location { missing: !p.is_file(), path: p.display().to_string(), dir: d, default_dir, custom: true }
        }
        _ => Location {
            path: app_dir.join(DB_FILE_NAME).display().to_string(),
            dir: default_dir.clone(),
            default_dir,
            custom: false,
            missing: false,
        },
    }
}

/// 打开当前配置的数据库并迁移结构。默认位置不存在时新建（首次安装）；
/// 自定义位置找不到文件时报 DB_MISSING，绝不新建空库。
pub fn open_current(app_dir: &Path) -> R<Connection> {
    let loc = resolve(app_dir);
    if loc.missing {
        return Err(format!("{MISSING_PREFIX}找不到数据库：{}（所在磁盘可能未连接）", loc.path));
    }
    let conn = if loc.custom {
        Connection::open_with_flags(&loc.path, OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_NO_MUTEX | OpenFlags::SQLITE_OPEN_URI)
            .map_err(|e| format!("打开数据库失败：{e}"))?
    } else {
        fs::create_dir_all(app_dir).map_err(|e| format!("创建数据目录失败：{e}"))?;
        Connection::open(&loc.path).map_err(|e| format!("打开数据库失败：{e}"))?
    };
    conn.execute_batch("PRAGMA journal_mode = WAL;").map_err(|e| e.to_string())?;
    crate::db::migrate(&conn).map_err(|e| e.to_string())?;
    Ok(conn)
}

pub fn check_writable(dir: &Path) -> R<()> {
    if !dir.is_dir() {
        return Err(format!("目录不存在或不是文件夹：{}", dir.display()));
    }
    let probe = dir.join(".gpa-write-test");
    fs::write(&probe, b"ok").map_err(|e| format!("该目录不可写：{}（{e}）", dir.display()))?;
    let _ = fs::remove_file(&probe);
    Ok(())
}

/// 已存在则在末尾加序号：goal_plan.db.bak、goal_plan.db.bak2…
fn free_name(base: PathBuf) -> PathBuf {
    if !base.exists() {
        return base;
    }
    for i in 2.. {
        let p = PathBuf::from(format!("{}{i}", base.display()));
        if !p.exists() {
            return p;
        }
    }
    unreachable!()
}

fn table_counts(conn: &Connection) -> R<Vec<(String, i64)>> {
    let mut st = conn
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
        .map_err(|e| e.to_string())?;
    let names: Vec<String> = st.query_map([], |r| r.get(0)).map_err(|e| e.to_string())?.collect::<Result<_, _>>().map_err(|e| e.to_string())?;
    names
        .into_iter()
        .map(|n| {
            let c: i64 = conn.query_row(&format!("SELECT COUNT(*) FROM \"{n}\""), [], |r| r.get(0)).map_err(|e| e.to_string())?;
            Ok((n, c))
        })
        .collect()
}

/// 校验文件能打开、完整、是本程序的库
fn validate(path: &Path) -> R<Vec<(String, i64)>> {
    let c = Connection::open_with_flags(path, OpenFlags::SQLITE_OPEN_READ_ONLY).map_err(|e| format!("新位置的数据库无法打开：{e}"))?;
    let ok: String = c.query_row("PRAGMA integrity_check", [], |r| r.get(0)).map_err(|e| format!("新位置的数据库校验失败：{e}"))?;
    if ok != "ok" {
        return Err(format!("数据库完整性校验未通过：{ok}"));
    }
    let has: i64 = c
        .query_row("SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='goals'", [], |r| r.get(0))
        .map_err(|e| e.to_string())?;
    if has == 0 {
        return Err("该文件不是目标计划助手的数据库".into());
    }
    table_counts(&c)
}

fn remove_sidecars(db: &Path) {
    for s in ["-wal", "-shm"] {
        let _ = fs::remove_file(format!("{}{s}", db.display()));
    }
}

/// 把当前数据库搬到 new_dir（new_dir == 默认目录即「恢复默认位置」）
pub fn move_to(app_dir: &Path, new_dir: &Path, conflict: Conflict) -> R<MoveResult> {
    let cur = resolve(app_dir);
    if cur.missing {
        return Err(format!("{MISSING_PREFIX}当前数据库不存在：{}", cur.path));
    }
    if same_dir(Path::new(&cur.dir), new_dir) {
        return Err("新位置和当前位置相同".into());
    }
    check_writable(new_dir)?;
    let src = PathBuf::from(&cur.path);
    let target = new_dir.join(DB_FILE_NAME);
    let to_default = same_dir(new_dir, app_dir);
    let mut replaced_backup = None;
    let mut used_existing = false;

    if target.exists() {
        match conflict {
            Conflict::Ask => return Err(format!("{EXISTS_PREFIX}{}", target.display())),
            Conflict::UseExisting => {
                validate(&target)?;
                // 升级到当前结构版本
                let c = Connection::open(&target).map_err(|e| e.to_string())?;
                crate::db::migrate(&c).map_err(|e| e.to_string())?;
                used_existing = true;
            }
            Conflict::Overwrite => {}
        }
    }

    if !used_existing {
        // 1. checkpoint WAL，把日志并回主文件
        {
            let c = Connection::open(&src).map_err(|e| format!("打开当前数据库失败：{e}"))?;
            c.query_row("PRAGMA wal_checkpoint(TRUNCATE)", [], |_| Ok(())).map_err(|e| format!("WAL checkpoint 失败：{e}"))?;
        }
        let src_counts = validate(&src)?;
        // 2. 复制到临时文件并校验
        let tmp = new_dir.join(format!("{DB_FILE_NAME}.moving"));
        let _ = fs::remove_file(&tmp);
        fs::copy(&src, &tmp).map_err(|e| format!("复制数据库失败：{e}"))?;
        match validate(&tmp) {
            Ok(c) if c == src_counts => {}
            Ok(_) => {
                let _ = fs::remove_file(&tmp);
                return Err("复制后的数据和原数据不一致，已取消迁移".into());
            }
            Err(e) => {
                let _ = fs::remove_file(&tmp);
                return Err(e);
            }
        }
        // 3. 目标原有文件（选了覆盖）先改名备份，不直接删除
        if target.exists() {
            let b = free_name(PathBuf::from(format!("{}.replaced.bak", target.display())));
            fs::rename(&target, &b).map_err(|e| {
                let _ = fs::remove_file(&tmp);
                format!("目标目录里的旧数据库无法备份（可能正被占用）：{e}")
            })?;
            remove_sidecars(&target);
            replaced_backup = Some(b.display().to_string());
        }
        fs::rename(&tmp, &target).map_err(|e| format!("放置新数据库失败：{e}"))?;
    }

    // 4. 写配置：之后每次访问都打开新库（运行中即时切换）
    write_config(app_dir, &Config { db_dir: if to_default { None } else { Some(new_dir.display().to_string()) } })?;

    // 5. 原文件改名为 .bak
    let bak = free_name(PathBuf::from(format!("{}.bak", src.display())));
    let (backup, note) = match fs::rename(&src, &bak) {
        Ok(()) => {
            remove_sidecars(&src);
            (Some(bak.display().to_string()), format!("原数据库已改名备份为：{}", bak.display()))
        }
        Err(e) => (None, format!("原数据库暂时无法改名（{e}），已原样保留在：{}", src.display())),
    };
    Ok(MoveResult { path: target.display().to_string(), backup, replaced_backup, used_existing, note })
}

/// 启动时找不到数据库：改为指向用户另选的、里面已有数据库的目录（不复制）
pub fn relink(app_dir: &Path, dir: &Path) -> R<Location> {
    let p = dir.join(DB_FILE_NAME);
    if !p.is_file() {
        return Err(format!("这个文件夹里没有 {DB_FILE_NAME}。如果想把数据放到新位置，请先回到默认位置，再用「更改位置」迁移。"));
    }
    validate(&p)?;
    let to_default = same_dir(dir, app_dir);
    write_config(app_dir, &Config { db_dir: if to_default { None } else { Some(dir.display().to_string()) } })?;
    Ok(resolve(app_dir))
}

/// 启动时找不到数据库：回到默认位置（用户明确选择后才会用默认库，不存在时会新建）
pub fn use_default(app_dir: &Path) -> R<Location> {
    write_config(app_dir, &Config::default())?;
    Ok(resolve(app_dir))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::atomic::{AtomicU32, Ordering};

    static N: AtomicU32 = AtomicU32::new(0);

    fn tmp() -> PathBuf {
        let p = std::env::temp_dir().join(format!("gpa-loc-{}-{}", std::process::id(), N.fetch_add(1, Ordering::SeqCst)));
        let _ = fs::remove_dir_all(&p);
        fs::create_dir_all(&p).unwrap();
        p
    }

    /// 默认位置建库并写一条目标
    fn seed(app: &Path, title: &str) {
        let c = open_current(app).unwrap();
        c.execute("INSERT INTO goals (title, created_at, updated_at) VALUES (?1, 1, 1)", [title]).unwrap();
        crate::chat::set_setting(&c, "ui_theme", "ink").unwrap();
    }

    fn titles(app: &Path) -> Vec<String> {
        let c = open_current(app).unwrap();
        let mut st = c.prepare("SELECT title FROM goals ORDER BY id").unwrap();
        st.query_map([], |r| r.get(0)).unwrap().map(|x| x.unwrap()).collect()
    }

    #[test]
    fn normal_move_and_back_to_default() {
        let (app, dst) = (tmp(), tmp());
        seed(&app, "减脂");
        assert!(!resolve(&app).custom);
        let r = move_to(&app, &dst, Conflict::Ask).unwrap();
        assert_eq!(r.path, dst.join(DB_FILE_NAME).display().to_string());
        assert!(!r.used_existing && r.replaced_backup.is_none());
        // 原文件改名为 .bak，不删除
        let bak = app.join("goal_plan.db.bak");
        assert_eq!(r.backup.as_deref(), Some(bak.display().to_string().as_str()));
        assert!(bak.is_file() && !app.join(DB_FILE_NAME).exists());
        // 配置指向新目录，运行中立即切换
        let loc = resolve(&app);
        assert!(loc.custom && !loc.missing);
        assert_eq!(read_config(&app).db_dir.as_deref(), Some(dst.display().to_string().as_str()));
        assert_eq!(titles(&app), ["减脂"]);
        open_current(&app).unwrap().execute("INSERT INTO goals (title, created_at, updated_at) VALUES ('新库写入', 1, 1)", []).unwrap();
        // 同一位置再迁移报错
        assert!(move_to(&app, &dst, Conflict::Ask).is_err());
        // 恢复默认位置：默认目录里只有 .bak，没有冲突
        let r2 = move_to(&app, &app, Conflict::Ask).unwrap();
        assert!(!resolve(&app).custom && read_config(&app).db_dir.is_none());
        assert_eq!(titles(&app), ["减脂", "新库写入"]);
        assert!(dst.join("goal_plan.db.bak").is_file() && r2.backup.is_some());
        // 再迁移一次，.bak 不覆盖旧备份
        let dst2 = tmp();
        let r3 = move_to(&app, &dst2, Conflict::Ask).unwrap();
        assert_eq!(r3.backup.unwrap(), app.join("goal_plan.db.bak2").display().to_string());
        // 恢复出厂只清数据，位置保留
        crate::service::factory_reset(&mut open_current(&app).unwrap()).unwrap();
        assert!(resolve(&app).custom && titles(&app).is_empty());
    }

    #[test]
    fn target_has_existing_db() {
        let (app, other_app, dst) = (tmp(), tmp(), tmp());
        seed(&app, "当前数据");
        // 在 dst 里放一份别的库
        seed(&other_app, "U盘里的旧数据");
        fs::copy(other_app.join(DB_FILE_NAME), dst.join(DB_FILE_NAME)).unwrap();
        let e = move_to(&app, &dst, Conflict::Ask).unwrap_err();
        assert!(e.starts_with(EXISTS_PREFIX), "{e}");
        assert!(!resolve(&app).custom, "询问阶段不改任何东西");
        assert!(app.join(DB_FILE_NAME).is_file());

        // 选「使用已有数据」
        let r = move_to(&app, &dst, Conflict::UseExisting).unwrap();
        assert!(r.used_existing);
        assert_eq!(titles(&app), ["U盘里的旧数据"]);
        assert!(app.join("goal_plan.db.bak").is_file());

        // 选「覆盖」：回到默认后再覆盖 dst，dst 旧文件改名备份
        use_default(&app).unwrap();
        fs::rename(app.join("goal_plan.db.bak"), app.join(DB_FILE_NAME)).unwrap();
        let r = move_to(&app, &dst, Conflict::Overwrite).unwrap();
        assert_eq!(titles(&app), ["当前数据"]);
        let rb = r.replaced_backup.unwrap();
        assert!(Path::new(&rb).is_file() && rb.ends_with(".replaced.bak"));
        // 目标里不是本程序的库：使用已有失败
        let (app2, dst2) = (tmp(), tmp());
        seed(&app2, "x");
        fs::write(dst2.join(DB_FILE_NAME), b"not sqlite").unwrap();
        assert!(move_to(&app2, &dst2, Conflict::UseExisting).is_err());
        assert!(!resolve(&app2).custom);
    }

    #[test]
    fn target_not_writable() {
        let app = tmp();
        seed(&app, "a");
        // 不存在的目录
        assert!(move_to(&app, &app.join("no-such-dir"), Conflict::Ask).unwrap_err().contains("不存在"));
        // 路径是文件而不是文件夹
        let f = app.join("plain.txt");
        fs::write(&f, b"x").unwrap();
        assert!(move_to(&app, &f, Conflict::Ask).is_err());
        assert!(check_writable(&f.join("sub")).is_err());
        // 什么都没改
        assert!(!resolve(&app).custom);
        assert_eq!(titles(&app), ["a"]);
        assert!(!app.join("goal_plan.db.bak").exists());
    }

    #[test]
    fn configured_path_missing() {
        let (app, dst) = (tmp(), tmp());
        seed(&app, "数据");
        move_to(&app, &dst, Conflict::Ask).unwrap();
        // 模拟 U 盘拔掉
        fs::remove_dir_all(&dst).unwrap();
        let loc = resolve(&app);
        assert!(loc.custom && loc.missing);
        let e = open_current(&app).err().unwrap();
        assert!(e.starts_with(MISSING_PREFIX));
        assert!(!dst.exists(), "不能静默新建空库");
        assert!(move_to(&app, &tmp(), Conflict::Ask).unwrap_err().starts_with(MISSING_PREFIX));
        // 重新选位置：没有库的文件夹不接受
        let empty = tmp();
        assert!(relink(&app, &empty).is_err());
        // 选一个有库的文件夹（把 .bak 还原过去）
        fs::copy(app.join("goal_plan.db.bak"), empty.join(DB_FILE_NAME)).unwrap();
        let loc = relink(&app, &empty).unwrap();
        assert!(loc.custom && !loc.missing);
        assert_eq!(titles(&app), ["数据"]);
        // 回到默认位置
        let loc = use_default(&app).unwrap();
        assert!(!loc.custom && !loc.missing);
        assert!(open_current(&app).is_ok());
        // 配置文件损坏时按默认位置处理
        fs::write(config_path(&app), b"{bad").unwrap();
        assert!(!resolve(&app).custom);
    }
}
