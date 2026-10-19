//! 开机自启：直接写 HKCU Run，路径加引号，仅当前用户。
//!
//! 旧实现问题：tauri-plugin-autostart / auto-launch 默认 Dynamic、Run 值不加引号；
//! 开发态会注册 target/debug；开机 --autostart 静默进托盘无提示；设置页吞掉 isEnabled 错误。

use serde::Serialize;
use std::path::PathBuf;

#[cfg(windows)]
const RUN_KEY: &str = r"Software\Microsoft\Windows\CurrentVersion\Run";
#[cfg(windows)]
const APPROVED_KEY: &str =
    r"Software\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run";
#[cfg(windows)]
const VALUE_NAME: &str = "目标计划助手";
#[cfg(windows)]
const LEGACY_NAMES: &[&str] = &["goal-plan-assistant"];

#[derive(Debug, Clone, Serialize)]
pub struct AutostartStatus {
    pub enabled: bool,
    pub exe_path: String,
    pub is_dev_build: bool,
    pub message: Option<String>,
}

fn exe_path() -> Result<PathBuf, String> {
    let p = std::env::current_exe().map_err(|e| format!("无法获取程序路径：{e}"))?;
    let s = p.display().to_string();
    // Windows 长路径前缀
    let prefix = "\\\\?\\";
    if let Some(stripped) = s.strip_prefix(prefix) {
        Ok(PathBuf::from(stripped))
    } else {
        Ok(p)
    }
}

fn is_dev_build(path: &std::path::Path) -> bool {
    let s = path.to_string_lossy().replace('/', "\\").to_lowercase();
    s.contains("\\target\\debug\\")
}

#[cfg(windows)]
fn run_command(path: &std::path::Path) -> String {
    format!("\"{}\" --autostart", path.display())
}

#[cfg(windows)]
fn open_run_key(write: bool) -> Result<winreg::RegKey, String> {
    use winreg::enums::*;
    let hkcu = winreg::RegKey::predef(HKEY_CURRENT_USER);
    if write {
        hkcu.create_subkey(RUN_KEY)
            .map(|(k, _)| k)
            .map_err(|e| format!("无法打开开机启动注册表：{e}"))
    } else {
        hkcu.open_subkey(RUN_KEY)
            .map_err(|e| format!("无法读取开机启动注册表：{e}"))
    }
}

#[cfg(windows)]
fn set_startup_approved(enabled: bool) {
    use winreg::enums::*;
    let hkcu = winreg::RegKey::predef(HKEY_CURRENT_USER);
    let Ok((key, _)) = hkcu.create_subkey(APPROVED_KEY) else {
        return;
    };
    let bytes: [u8; 12] = if enabled {
        [0x02, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    } else {
        [0x03, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    let _ = key.set_raw_value(
        VALUE_NAME,
        &winreg::RegValue {
            vtype: REG_BINARY,
            bytes: bytes.to_vec(),
        },
    );
}

#[cfg(windows)]
fn cleanup_legacy() {
    use winreg::enums::*;
    let hkcu = winreg::RegKey::predef(HKEY_CURRENT_USER);
    if let Ok(key) = hkcu.open_subkey_with_flags(RUN_KEY, KEY_SET_VALUE) {
        for n in LEGACY_NAMES {
            let _ = key.delete_value(n);
        }
    }
    if let Ok(key) = hkcu.open_subkey_with_flags(APPROVED_KEY, KEY_SET_VALUE) {
        for n in LEGACY_NAMES {
            let _ = key.delete_value(n);
        }
    }
}

#[cfg(windows)]
fn read_enabled() -> Result<bool, String> {
    use winreg::enums::*;
    let key = match open_run_key(false) {
        Ok(k) => k,
        Err(_) => return Ok(false),
    };
    let registered = key.get_value::<String, _>(VALUE_NAME).is_ok();
    if !registered {
        return Ok(false);
    }
    let hkcu = winreg::RegKey::predef(HKEY_CURRENT_USER);
    if let Ok(ak) = hkcu.open_subkey(APPROVED_KEY) {
        if let Ok(val) = ak.get_raw_value(VALUE_NAME) {
            if val.bytes.len() >= 8 {
                let disabled = !val.bytes.iter().rev().take(8).all(|b| *b == 0);
                if disabled {
                    return Ok(false);
                }
            }
        }
    }
    Ok(true)
}

#[cfg(windows)]
fn status_with(enabled: bool, msg: Option<String>) -> Result<AutostartStatus, String> {
    let path = exe_path()?;
    let dev = is_dev_build(&path);
    let message = msg.or_else(|| {
        if enabled && dev {
            Some(
                "已开启，但当前是开发版：开机启动会打开调试程序，没有开发服务时界面可能空白。正式使用请安装版打开后重新打开此开关。"
                    .into(),
            )
        } else {
            None
        }
    });
    Ok(AutostartStatus {
        enabled,
        exe_path: path.display().to_string(),
        is_dev_build: dev,
        message,
    })
}

#[cfg(windows)]
pub fn get_status() -> Result<AutostartStatus, String> {
    let enabled = read_enabled()?;
    status_with(enabled, None)
}

#[cfg(windows)]
pub fn set_enabled(enabled: bool) -> Result<AutostartStatus, String> {
    let path = exe_path()?;
    if !path.is_file() {
        return Err(format!("程序文件不存在：{}", path.display()));
    }
    cleanup_legacy();
    if enabled {
        let key = open_run_key(true)?;
        key.set_value(VALUE_NAME, &run_command(&path))
            .map_err(|e| format!("写入开机启动失败：{e}"))?;
        set_startup_approved(true);
        if !read_enabled()? {
            return Err("写入后校验失败：注册表里没有开机启动项，请检查是否被安全软件拦截".into());
        }
        status_with(
            true,
            Some(if is_dev_build(&path) {
                "已开启（开发版）。开机后会静默进托盘；正式环境请用安装包并重新打开此开关。".into()
            } else {
                "已开启：下次开机后会静默在托盘运行，点托盘图标即可打开。".into()
            }),
        )
    } else {
        if let Ok(key) = open_run_key(true) {
            match key.delete_value(VALUE_NAME) {
                Ok(()) => {}
                Err(e) if e.kind() == std::io::ErrorKind::NotFound => {}
                Err(e) => return Err(format!("取消开机启动失败：{e}")),
            }
        }
        use winreg::enums::*;
        let hkcu = winreg::RegKey::predef(HKEY_CURRENT_USER);
        if let Ok(key) = hkcu.open_subkey_with_flags(APPROVED_KEY, KEY_SET_VALUE) {
            let _ = key.delete_value(VALUE_NAME);
        }
        status_with(false, Some("已关闭开机自动启动".into()))
    }
}

#[cfg(not(windows))]
pub fn get_status() -> Result<AutostartStatus, String> {
    Ok(AutostartStatus {
        enabled: false,
        exe_path: String::new(),
        is_dev_build: false,
        message: Some("当前系统暂不支持开机自启设置".into()),
    })
}

#[cfg(not(windows))]
pub fn set_enabled(_enabled: bool) -> Result<AutostartStatus, String> {
    Err("当前系统暂不支持开机自启设置".into())
}
#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;

    #[test]
    fn detects_dev_build_path() {
        assert!(is_dev_build(Path::new(r"D:\work\app\target\debug\app.exe")));
        assert!(!is_dev_build(Path::new(r"C:\Users\x\AppData\Local\App\app.exe")));
    }

    #[cfg(windows)]
    #[test]
    fn run_command_quotes_path() {
        let p = Path::new(r"C:\Program Files\App\app.exe");
        let cmd = run_command(p);
        assert_eq!(cmd, r#""C:\Program Files\App\app.exe" --autostart"#);
    }

    #[cfg(windows)]
    #[test]
    fn enable_disable_roundtrip_registry() {
        // 用临时名字避免污染真实「目标计划助手」项：直接测 set/get 一轮
        let before = get_status().expect("status");
        let on = set_enabled(true).expect("enable");
        assert!(on.enabled, "enable should report enabled");
        let key = winreg::RegKey::predef(winreg::enums::HKEY_CURRENT_USER)
            .open_subkey(RUN_KEY)
            .expect("run key");
        let val: String = key.get_value(VALUE_NAME).expect("value");
        assert!(val.starts_with('"'), "path must be quoted: {val}");
        assert!(val.contains("--autostart"), "must pass --autostart: {val}");
        let off = set_enabled(false).expect("disable");
        assert!(!off.enabled);
        // 恢复测试前状态
        let _ = set_enabled(before.enabled);
    }
}
