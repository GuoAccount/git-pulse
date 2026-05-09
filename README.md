# GitPulse - AI Weekly Report Generator

<div align="center">

![Tauri](https://img.shields.io/badge/Tauri-2.0-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Rust](https://img.shields.io/badge/Rust-1.77+-orange)
![License](https://img.shields.io/badge/License-MIT-green)

English | [中文](./docs/README_CN.md) | [日本語](./docs/README_JA.md) | [한국어](./docs/README_KO.md)

</div>

A desktop application built with Tauri + React that automatically scans Git repositories, retrieves commit history, and generates structured weekly reports using AI.

## ✨ Features

- 📂 **Workspace Scanning**: Automatically scan all Git repositories in a specified folder
- 📅 **Date Range Selection**: Customizable time range, default to last 7 days
- 👥 **Author Filtering**: Filter commits by author
- 📊 **Git Log Display**: View commits grouped by date with branch/tag badges
- 🤖 **AI Report Generation**: Connect to OpenAI-compatible LLM for automated weekly reports
- 📝 **Markdown Export**: Copy to clipboard or download as Markdown file
- ⚙️ **Custom Configuration**: Configure AI API endpoint, model, and system prompt

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Rust](https://www.rust-lang.org/) >= 1.77
- [Git](https://git-scm.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/GuoAccount/git-pulse.git
cd git-pulse

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run tauri dev
```

### Build

```bash
# Build for production
npm run tauri build
```

The executable will be generated in `src-tauri/target/release/`.

## 📖 Usage Guide

### 1. Select Workspace

Click the "Select Workspace Folder" button to choose the root directory containing Git repositories. The app will automatically scan all Git repos in that directory.

### 2. Set Date Range

Use the date range picker to set the time period. Quick options available:
- Last 7 days (default)
- Last 14 days
- Last 30 days
- This week

### 3. Select Repositories

Choose which repositories to include from the scanned list. Select All / Deselect All supported.

### 4. Fetch Git Log

Click the "Fetch Git Log" button to retrieve all commits from selected repositories within the specified date range.

### 5. Filter by Author

After fetching logs, use the author filter to view commits from specific contributors.

### 6. Generate AI Report

Switch to the "AI Report" tab and click "Generate Report". AI will analyze commits and produce a structured weekly report.

### 7. Export Report

Generated reports support:
- Copy to clipboard
- Download as Markdown file

## ⚙️ AI Configuration

Click the settings button in the top-right corner to configure AI parameters:

| Parameter | Description | Default |
|-----------|-------------|---------|
| API URL | OpenAI-compatible API endpoint | https://api.openai.com/v1 |
| Model ID | Model identifier | gpt-3.5-turbo |
| API Key | API key | - |
| System Prompt | Custom report generation prompt | Pre-configured default |

### Supported AI Services

Any service compatible with OpenAI API format:
- OpenAI
- Azure OpenAI
- Claude (via proxy)
- Local LLMs (e.g., Ollama)
- Other compatible services

## 🎨 Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Rust + Tauri 2
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📁 Project Structure

```
git-pulse/
├── src/                    # React frontend
│   ├── components/         # UI components
│   │   ├── ui/            # Base UI components
│   │   ├── Header.tsx     # Header component
│   │   ├── WorkspaceSelector.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── RepoList.tsx
│   │   ├── AuthorFilter.tsx
│   │   ├── GitLogView.tsx
│   │   ├── AIReportView.tsx
│   │   └── SettingsModal.tsx
│   ├── api.ts             # Tauri API wrappers
│   ├── types.ts           # TypeScript types
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── git.rs         # Git operations
│   │   ├── ai.rs          # AI integration
│   │   ├── lib.rs         # Tauri config
│   │   └── main.rs        # Entry point
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
└── package.json            # Node.js dependencies
```

## 📄 License

MIT License

## 🤝 Contributing

Issues and Pull Requests are welcome!
