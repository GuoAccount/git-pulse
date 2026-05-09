// Git related types
export interface GitRepo {
  name: string;
  path: string;
}

export interface GitCommit {
  hash: string;
  author: string;
  date: string;
  message: string;
  repo_name: string;
  refs: string;
}

export interface GitLogParams {
  repo_paths: string[];
  since: string;
  until: string;
  authors: string[];
}

// AI related types
export interface AIConfig {
  api_url: string;
  model_id: string;
  api_key: string;
  system_prompt: string;
}

// App state types
export interface AppState {
  workspacePath: string | null;
  repos: GitRepo[];
  selectedRepos: string[];
  dateRange: {
    from: Date;
    to: Date;
  };
  authors: string[];
  selectedAuthors: string[];
  commits: GitCommit[];
  aiReport: string | null;
  aiConfig: AIConfig;
  isLoading: boolean;
  activeTab: 'log' | 'report';
}

// Default AI config
export const DEFAULT_AI_CONFIG: AIConfig = {
  api_url: 'https://api.openai.com/v1',
  model_id: 'gpt-3.5-turbo',
  api_key: '',
  system_prompt: `你是一个专业的周报生成助手。请根据提供的 Git 提交记录，生成一份结构清晰、内容详实的周报。

## 周报格式要求

1. **时间范围**：标注周报覆盖的日期范围
2. **按日期分组**：将工作内容按天整理，每天一个章节
3. **工作分类**：将每天的工作分为以下类别：
   - 🚀 新功能开发
   - 🐛 问题修复
   - 🔧 优化改进
   - 📝 文档更新
   - 🧪 测试相关
   - 🔨 其他工作
4. **简洁描述**：每个提交用一句话概括主要工作内容
5. **总结**：在最后添加一周工作总结，包括主要成果和下周计划建议

## 注意事项

- 使用中文输出
- 保持专业但易读的风格
- 如果某个提交信息不清晰，根据上下文合理推测
- 合并相似的提交，避免重复
- 突出重要功能和关键修复`,
};

// Helper to format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper to get date N days ago
export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

// Helper to format git log for AI
export function formatGitLogForAI(commits: GitCommit[]): string {
  const groupedByDate: Record<string, GitCommit[]> = {};

  commits.forEach((commit) => {
    const date = commit.date.split('T')[0];
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(commit);
  });

  let result = '';

  Object.keys(groupedByDate)
    .sort()
    .forEach((date) => {
      result += `\n## ${date}\n\n`;
      groupedByDate[date].forEach((commit) => {
        result += `- [${commit.repo_name}] ${commit.message} (${commit.author})\n`;
      });
    });

  return result;
}
