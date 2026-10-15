# 目标计划助手

本地 Windows 桌面应用：聊天定制方案 → 确认 → 目标 + 按天计划 + 打卡。  
技术栈：**Tauri 2 + React 19 + TypeScript + Vite**，数据在 Rust 侧 SQLite（rusqlite bundled）。

产品说明见 `docs/目标计划助手-需求计划书-v1.1.md`。  
UI 主题：深色 **赛博霓虹**（青 `#22D3EE` + 粉 `#F472B6`）。

## 环境要求

- Node.js 18+（建议 20/24）与 npm
- Rust（rustup）+ Visual Studio C++ 生成工具（Windows）
- WebView2 Runtime（一般已随 Win10/11 安装）

## 启动

```bash
cd D:\work\vibecoding\goal-plan-assistant
npm install
npm run tauri dev
```

仅前端（无 Rust invoke）：

```bash
npm run dev
```

打包：

```bash
npm run tauri build
```

## 目录说明

```
goal-plan-assistant/
  src/                  前端 React
    layout/             侧栏壳（目标 / 聊天 / 设置）
    pages/              目标列表、详情、聊天、设置
    styles/cyber-neon.css
    lib/tauri.ts        invoke 封装
  src-tauri/            Rust
    src/db.rs           SQLite 初始化 + migrations 表
    src/commands.rs     ping / get_app_info
    src/lib.rs
  docs/                 产品说明书
```

## 当前骨架范围

- 四个页面壳 + 假数据（今天大卡、草案卡）
- Rust：`ping`、`get_app_info`；启动时建库（app data 目录）
- **未实现**：完整业务表、大模型对话、打卡持久化、凭据管理器、单实例锁（代码内 TODO）

## 下一步建议

1. 按说明书落地 goal / plan_day / check_in 等表与 command
2. 设置页持久化（Key → Credential Manager）
3. 接入 DeepSeek chat + 草案 JSON 校验
4. `tauri-plugin-single-instance`
