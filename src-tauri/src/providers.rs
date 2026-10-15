//! 模型服务商预设（2026-10 按各家官方文档核对）。全部走 OpenAI 兼容的 /chat/completions。

use serde::Serialize;

#[derive(Debug, Serialize, Clone)]
pub struct Provider {
    pub id: &'static str,
    pub name: &'static str,
    pub base_url: &'static str,
    /// 第一个是默认
    pub models: &'static [&'static str],
    pub max_tokens: u32,
    pub key_url: &'static str,
}

pub const PROVIDERS: &[Provider] = &[
    Provider {
        id: "deepseek",
        name: "DeepSeek",
        base_url: "https://api.deepseek.com",
        models: &["deepseek-flash", "deepseek-v4-pro"],
        max_tokens: 32768,
        key_url: "https://platform.deepseek.com/api_keys",
    },
    Provider {
        id: "dashscope",
        name: "通义千问（阿里云百炼 · 兼容模式）",
        base_url: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        models: &["qwen3.7-plus", "qwen3.8-max", "qwen3.8-flash"],
        max_tokens: 16384,
        key_url: "https://bailian.console.aliyun.com/",
    },
    Provider {
        id: "moonshot",
        name: "Kimi（月之暗面 Moonshot）",
        base_url: "https://api.moonshot.cn/v1",
        models: &["kimi-k3", "kimi-k2.6"],
        max_tokens: 16384,
        key_url: "https://platform.moonshot.cn/console/api-keys",
    },
    Provider {
        id: "zhipu",
        name: "智谱 GLM",
        base_url: "https://open.bigmodel.cn/api/paas/v4",
        models: &["glm-5.3", "glm-5.3-flash", "glm-4.7-flash"],
        max_tokens: 16384,
        key_url: "https://open.bigmodel.cn/usercenter/apikeys",
    },
    Provider {
        id: "custom",
        name: "自定义（OpenAI 兼容）",
        base_url: "",
        models: &[],
        max_tokens: 8192,
        key_url: "",
    },
];

pub fn get(id: &str) -> &'static Provider {
    PROVIDERS.iter().find(|p| p.id == id).unwrap_or(&PROVIDERS[0])
}

pub fn valid(id: &str) -> bool {
    PROVIDERS.iter().any(|p| p.id == id)
}

/// 输出长度上限：用预设值；用户把模型名改成已知的小模型时不超过其上限
pub fn max_tokens(id: &str) -> u32 {
    get(id).max_tokens
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn presets_sane() {
        for p in PROVIDERS {
            assert!(p.id == "custom" || (p.base_url.starts_with("https://") && !p.base_url.ends_with('/') && !p.models.is_empty()));
        }
        assert_eq!(get("nope").id, "deepseek");
        assert!(valid("zhipu") && !valid("x"));
    }
}
