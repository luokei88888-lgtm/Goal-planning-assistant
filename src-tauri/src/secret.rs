//! API Key 只存在 Windows 凭据管理器里；任何地方都不打印、不回传明文。

const SERVICE: &str = "goal-plan-assistant";
const USER: &str = "llm-api-key";

/// 每个服务商单独一条凭据；DeepSeek 沿用旧的条目名，升级后 Key 不丢
fn user_for(provider: &str) -> String {
    if provider == "deepseek" { USER.to_string() } else { format!("{USER}-{provider}") }
}

fn entry(provider: &str) -> Result<keyring::Entry, String> {
    keyring::Entry::new(SERVICE, &user_for(provider)).map_err(|_| "无法访问 Windows 凭据管理器".to_string())
}

pub fn get_key(provider: &str) -> Result<Option<String>, String> {
    match entry(provider)?.get_password() {
        Ok(k) if !k.is_empty() => Ok(Some(k)),
        Ok(_) | Err(keyring::Error::NoEntry) => Ok(None),
        Err(_) => Err("读取凭据管理器失败".into()),
    }
}

pub fn set_key(provider: &str, key: &str) -> Result<(), String> {
    entry(provider)?.set_password(key).map_err(|_| "写入凭据管理器失败".to_string())
}

pub fn delete_key(provider: &str) -> Result<(), String> {
    match entry(provider)?.delete_credential() {
        Ok(_) | Err(keyring::Error::NoEntry) => Ok(()),
        Err(_) => Err("删除凭据失败".into()),
    }
}

/// sk-****abcd
pub fn mask(key: &str) -> String {
    let chars: Vec<char> = key.chars().collect();
    let tail: String = chars[chars.len().saturating_sub(4)..].iter().collect();
    let head = if key.starts_with("sk-") { "sk-" } else { "" };
    format!("{head}****{tail}")
}

#[cfg(test)]
mod tests {
    #[test]
    fn mask_hides_key() {
        let m = super::mask("sk-1234567890abcdef");
        assert_eq!(m, "sk-****cdef");
        assert_eq!(super::user_for("deepseek"), "llm-api-key");
        assert_eq!(super::user_for("zhipu"), "llm-api-key-zhipu");
    }
}
