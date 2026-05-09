# GitPulse - AI 주간 보고서 생성기

<div align="center">

![Tauri](https://img.shields.io/badge/Tauri-2.0-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Rust](https://img.shields.io/badge/Rust-1.77+-orange)
![License](https://img.shields.io/badge/License-MIT-green)

[English](../README.md) | [中文](./README_CN.md) | [日本語](./README_JA.md) | 한국어

</div>

Tauri + React로 구축된 데스크톱 애플리케이션. Git 저장소를 자동으로 스캔하고, 커밋 기록을 가져오며, AI를 사용하여 구조화된 주간 보고서를 생성합니다.

## ✨ 주요 기능

- 📂 **워크스페이스 스캔**: 지정된 폴더의 모든 Git 저장소 자동 스캔
- 📅 **날짜 범위 선택**: 사용자 정의 가능한 시간 범위, 기본값은 최근 7일
- 👥 **작성자 필터**: 작성자별로 커밋 필터링
- 📊 **Git 로그 표시**: 날짜별로 그룹화된 커밋 표시, 브랜치/태그 정보 포함
- 🤖 **AI 보고서 생성**: OpenAI 호환 LLM에 연결하여 자동 주간 보고서 생성
- 📝 **Markdown 내보내기**: 클립보드에 복사 또는 Markdown 파일로 다운로드
- ⚙️ **사용자 정의 설정**: AI API 엔드포인트, 모델, 시스템 프롬프트 설정 가능

## 🚀 빠른 시작

### 사전 요구사항

- [Node.js](https://nodejs.org/) >= 18
- [Rust](https://www.rust-lang.org/) >= 1.77
- [Git](https://git-scm.com/)

### 설치

```bash
# 저장소 클론
git clone https://github.com/GuoAccount/git-pulse.git
cd git-pulse

# 의존성 설치
npm install
```

### 개발 모드

```bash
# 개발 서버 시작
npm run tauri dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run tauri build
```

빌드 완료 후 실행 파일은 `src-tauri/target/release/`에 생성됩니다.

## 📖 사용 가이드

### 1. 워크스페이스 선택

"워크스페이스 폴더 선택" 버튼을 클릭하여 Git 저장소가 포함된 루트 디렉토리를 선택합니다. 앱은 해당 디렉토리의 모든 Git 저장소를 자동으로 스캔합니다.

### 2. 날짜 범위 설정

날짜 범위 선택기를 사용하여 기간을 설정합니다. 빠른 옵션:
- 최근 7일 (기본값)
- 최근 14일
- 최근 30일
- 이번 주

### 3. 저장소 선택

스캔된 저장소 목록에서 볼 저장소를 선택합니다. 전체 선택/전체 해제 지원.

### 4. Git 로그 가져오기

"Git 로그 가져오기" 버튼을 클릭하면 지정된 날짜 범위 내 선택된 저장소의 모든 커밋을 가져옵니다.

### 5. 작성자로 필터링

로그를 가져온 후 작성자 필터를 사용하여 특정 기여자의 커밋을 볼 수 있습니다.

### 6. AI 보고서 생성

"AI 보고서" 탭으로 전환하고 "보고서 생성" 버튼을 클릭합니다. AI가 커밋을 분석하고 구조화된 주간 보고서를 생성합니다.

### 7. 보고서 내보내기

생성된 보고서는 다음을 지원합니다:
- 클립보드에 복사
- Markdown 파일로 다운로드

## ⚙️ AI 설정

오른쪽 상단의 설정 버튼을 클릭하여 AI 매개변수를 구성할 수 있습니다:

| 매개변수 | 설명 | 기본값 |
|---------|------|--------|
| API URL | OpenAI 호환 API 엔드포인트 | https://api.openai.com/v1 |
| Model ID | 모델 식별자 | gpt-3.5-turbo |
| API Key | API 키 | - |
| 시스템 프롬프트 | 사용자 정의 보고서 생성 프롬프트 | 사전 구성된 기본값 |

### 지원되는 AI 서비스

OpenAI API 형식과 호환되는 모든 서비스:
- OpenAI
- Azure OpenAI
- Claude (프록시 통해)
- 로컬 LLM (Ollama 등)
- 기타 호환 서비스

## 🎨 기술 스택

- **프론트엔드**: React 19 + TypeScript + Tailwind CSS
- **백엔드**: Rust + Tauri 2
- **빌드 도구**: Vite
- **아이콘**: Lucide React

## 📁 프로젝트 구조

```
git-pulse/
├── src/                    # React 프론트엔드
│   ├── components/         # UI 컴포넌트
│   │   ├── ui/            # 기본 UI 컴포넌트
│   │   ├── Header.tsx     # 헤더 컴포넌트
│   │   ├── WorkspaceSelector.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── RepoList.tsx
│   │   ├── AuthorFilter.tsx
│   │   ├── GitLogView.tsx
│   │   ├── AIReportView.tsx
│   │   └── SettingsModal.tsx
│   ├── api.ts             # Tauri API 래퍼
│   ├── types.ts           # TypeScript 타입 정의
│   ├── App.tsx            # 메인 앱 컴포넌트
│   └── main.tsx           # 진입점
├── src-tauri/              # Rust 백엔드
│   ├── src/
│   │   ├── git.rs         # Git 작업
│   │   ├── ai.rs          # AI 통합
│   │   ├── lib.rs         # Tauri 설정
│   │   └── main.rs        # 진입점
│   ├── Cargo.toml         # Rust 의존성
│   └── tauri.conf.json    # Tauri 설정 파일
└── package.json            # Node.js 의존성
```

## 📄 라이선스

MIT License

## 🤝 기여

Issue와 Pull Request를 환영합니다!
