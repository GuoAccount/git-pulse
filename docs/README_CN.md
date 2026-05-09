# GitPulse - AI 周报生成器

<div align="center">

![Tauri](https://img.shields.io/badge/Tauri-2.0-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Rust](https://img.shields.io/badge/Rust-1.77+-orange)
![License](https://img.shields.io/badge/License-MIT-green)

[English](../README.md) | 中文 | [日本語](./README_JA.md) | [한국어](./README_KO.md)

</div>

一个基于 Tauri + React 的桌面应用，用于自动扫描 Git 仓库、获取提交记录，并通过 AI 生成结构化周报。

## ✨ 功能特性

- 📂 **工作区扫描**：自动扫描指定文件夹下的所有 Git 仓库
- 📅 **时间范围选择**：支持自定义时间范围，默认最近 7 天
- 👥 **作者筛选**：按提交者过滤提交记录
- 📊 **Git 日志展示**：按日期分组展示提交记录，显示分支/标签信息
- 🤖 **AI 周报生成**：接入 OpenAI 兼容的 LLM，自动生成结构化周报
- 📝 **Markdown 导出**：支持复制和下载 Markdown 格式的周报
- ⚙️ **自定义配置**：可自定义 AI API 地址、模型、系统提示词

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) >= 18
- [Rust](https://www.rust-lang.org/) >= 1.77
- [Git](https://git-scm.com/)

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/GuoAccount/git-pulse.git
cd git-pulse

# 安装依赖
npm install
```

### 开发模式

```bash
# 启动开发服务器
npm run tauri dev
```

### 构建应用

```bash
# 构建生产版本
npm run tauri build
```

构建完成后，可执行文件会生成在 `src-tauri/target/release/` 目录下。

## 📖 使用指南

### 1. 选择工作区

点击「选择工作区文件夹」按钮，选择包含 Git 仓库的根目录。应用会自动扫描该目录下的所有 Git 仓库。

### 2. 设置时间范围

使用时间范围选择器设置要查看的时间段。支持以下快捷选项：
- 最近 7 天（默认）
- 最近 14 天
- 最近 30 天
- 本周

### 3. 选择仓库

从扫描到的仓库列表中选择要查看的仓库。支持全选/取消全选。

### 4. 获取 Git 日志

点击「获取 Git 日志」按钮，应用会获取所选仓库在指定时间范围内的所有提交记录。

### 5. 筛选提交者

获取日志后，可以通过提交者筛选器过滤特定作者的提交。

### 6. 生成 AI 周报

切换到「AI 周报」标签页，点击「生成周报」按钮。AI 会分析提交记录并生成结构化周报。

### 7. 导出周报

生成的周报支持：
- 复制到剪贴板
- 下载为 Markdown 文件

## ⚙️ AI 配置

点击右上角的设置按钮，可以配置 AI 相关参数：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| API URL | OpenAI 兼容的 API 地址 | https://api.openai.com/v1 |
| Model ID | 模型标识符 | gpt-3.5-turbo |
| API Key | API 密钥 | - |
| 系统提示词 | 自定义周报生成提示词 | 预设默认值 |

### 支持的 AI 服务

任何兼容 OpenAI API 格式的服务都可以使用，例如：
- OpenAI
- Azure OpenAI
- Claude (通过代理)
- 本地 LLM (如 Ollama)
- 其他兼容服务

## 🎨 技术栈

- **前端**：React 19 + TypeScript + Tailwind CSS
- **后端**：Rust + Tauri 2
- **构建工具**：Vite
- **图标**：Lucide React

## 📁 项目结构

```
git-pulse/
├── src/                    # React 前端代码
│   ├── components/         # UI 组件
│   │   ├── ui/            # 基础 UI 组件
│   │   ├── Header.tsx     # 头部组件
│   │   ├── WorkspaceSelector.tsx  # 工作区选择器
│   │   ├── DateRangePicker.tsx    # 时间范围选择器
│   │   ├── RepoList.tsx   # 仓库列表
│   │   ├── AuthorFilter.tsx       # 作者筛选器
│   │   ├── GitLogView.tsx # Git 日志视图
│   │   ├── AIReportView.tsx       # AI 周报视图
│   │   └── SettingsModal.tsx      # 设置弹窗
│   ├── api.ts             # Tauri API 调用封装
│   ├── types.ts           # TypeScript 类型定义
│   ├── App.tsx            # 主应用组件
│   └── main.tsx           # 应用入口
├── src-tauri/              # Rust 后端代码
│   ├── src/
│   │   ├── git.rs         # Git 相关功能
│   │   ├── ai.rs          # AI 相关功能
│   │   ├── lib.rs         # Tauri 应用配置
│   │   └── main.rs        # 程序入口
│   ├── Cargo.toml         # Rust 依赖配置
│   └── tauri.conf.json    # Tauri 配置文件
└── package.json            # Node.js 依赖配置
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
