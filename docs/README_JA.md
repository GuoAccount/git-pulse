# GitPulse - AI 週報生成ツール

<div align="center">

![Tauri](https://img.shields.io/badge/Tauri-2.0-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Rust](https://img.shields.io/badge/Rust-1.77+-orange)
![License](https://img.shields.io/badge/License-MIT-green)

[English](../README.md) | [中文](./README_CN.md) | 日本語 | [한국어](./README_KO.md)

</div>

Tauri + React で構築されたデスクトップアプリケーション。Gitリポジトリを自動スキャンし、コミット履歴を取得、AI を使用して構造化された週報を生成します。

## ✨ 機能

- 📂 **ワークスペーススキャン**: 指定フォルダ内のすべてのGitリポジトリを自動スキャン
- 📅 **日付範囲選択**: カスタマイズ可能な時間範囲、デフォルトは過去7日間
- 👥 **著者フィルター**: 著者別にコミットをフィルタリング
- 📊 **Gitログ表示**: 日付別にグループ化されたコミット表示、ブランチ/タグ情報付き
- 🤖 **AI週報生成**: OpenAI互換LLMに接続して自動週報生成
- 📝 **Markdownエクスポート**: クリップボードへのコピーまたはMarkdownファイルとしてダウンロード
- ⚙️ **カスタム設定**: AI APIエンドポイント、モデル、システムプロンプトの設定可能

## 🚀 クイックスタート

### 前提条件

- [Node.js](https://nodejs.org/) >= 18
- [Rust](https://www.rust-lang.org/) >= 1.77
- [Git](https://git-scm.com/)

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/GuoAccount/git-pulse.git
cd git-pulse

# 依存関係をインストール
npm install
```

### 開発モード

```bash
# 開発サーバーを起動
npm run tauri dev
```

### ビルド

```bash
# プロダクション用にビルド
npm run tauri build
```

ビルド完了後、実行ファイルは `src-tauri/target/release/` に生成されます。

## 📖 使い方ガイド

### 1. ワークスペースの選択

「ワークスペースフォルダを選択」ボタンをクリックし、Gitリポジトリを含むルートディレクトリを選択します。アプリはそのディレクトリ内のすべてのGitリポジトリを自動スキャンします。

### 2. 日付範囲の設定

日付範囲ピッカーを使用して期間を設定します。クイックオプション：
- 過去7日間（デフォルト）
- 過去14日間
- 過去30日間
- 今週

### 3. リポジトリの選択

スキャンされたリポジトリのリストから表示するものを選択します。全選択/全解除に対応。

### 4. Gitログの取得

「Gitログを取得」ボタンをクリックすると、指定した日付範囲内の選択されたリポジトリのすべてのコミットを取得します。

### 5. 著者でフィルター

ログ取得後、著者フィルターを使用して特定の貢献者のコミットを表示できます。

### 6. AI週報の生成

「AI週報」タブに切り替え、「週報を生成」ボタンをクリックします。AIがコミットを分析し、構造化された週報を生成します。

### 7. レポートのエクスポート

生成されたレポートは以下をサポート：
- クリップボードにコピー
- Markdownファイルとしてダウンロード

## ⚙️ AI設定

右上の設定ボタンをクリックして、AIパラメータを設定できます：

| パラメータ | 説明 | デフォルト |
|-----------|------|-----------|
| API URL | OpenAI互換APIエンドポイント | https://api.openai.com/v1 |
| Model ID | モデル識別子 | gpt-3.5-turbo |
| API Key | APIキー | - |
| システムプロンプト | カスタム週報生成プロンプト | 事前設定済みデフォルト |

### サポートされるAIサービス

OpenAI API形式に互換性のあるサービス：
- OpenAI
- Azure OpenAI
- Claude（プロキシ経由）
- ローカルLLM（Ollamaなど）
- その他の互換サービス

## 🎨 技術スタック

- **フロントエンド**: React 19 + TypeScript + Tailwind CSS
- **バックエンド**: Rust + Tauri 2
- **ビルドツール**: Vite
- **アイコン**: Lucide React

## 📁 プロジェクト構造

```
git-pulse/
├── src/                    # Reactフロントエンド
│   ├── components/         # UIコンポーネント
│   │   ├── ui/            # ベースUIコンポーネント
│   │   ├── Header.tsx     # ヘッダーコンポーネント
│   │   ├── WorkspaceSelector.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── RepoList.tsx
│   │   ├── AuthorFilter.tsx
│   │   ├── GitLogView.tsx
│   │   ├── AIReportView.tsx
│   │   └── SettingsModal.tsx
│   ├── api.ts             # Tauri APIラッパー
│   ├── types.ts           # TypeScript型定義
│   ├── App.tsx            # メインアプリコンポーネント
│   └── main.tsx           # エントリーポイント
├── src-tauri/              # Rustバックエンド
│   ├── src/
│   │   ├── git.rs         # Git操作
│   │   ├── ai.rs          # AI統合
│   │   ├── lib.rs         # Tauri設定
│   │   └── main.rs        # エントリーポイント
│   ├── Cargo.toml         # Rust依存関係
│   └── tauri.conf.json    # Tauri設定ファイル
└── package.json            # Node.js依存関係
```

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

IssueとPull Requestを歓迎します！
