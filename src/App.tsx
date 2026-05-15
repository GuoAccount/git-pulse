import { useState, useEffect, useCallback, useRef } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { Header } from './components/Header';
import { WorkspaceSelector } from './components/WorkspaceSelector';
import { DateRangePicker } from './components/DateRangePicker';
import { RepoList } from './components/RepoList';
import { AuthorFilter } from './components/AuthorFilter';
import { GitLogView } from './components/GitLogView';
import { AIReportView } from './components/AIReportView';
import { SettingsModal } from './components/SettingsModal';
import { Card, CardHeader, CardContent } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { GitCommit, Sparkles, FileText } from 'lucide-react';
import type { GitRepo, AIConfig, GitCommit as GitCommitType } from './types';
import {
  DEFAULT_AI_CONFIG,
  formatDate,
  getDaysAgo,
  formatGitLogForAI,
} from './types';
import {
  scanGitRepos,
  getGitLog,
  getRepoAuthors,
  generateReport,
  testAIConnection,
} from './api';

function App() {
  // State
  const [workspacePath, setWorkspacePath] = useState<string | null>(() => {
    const saved = localStorage.getItem('workspacePath');
    return saved || null;
  });
  const [repos, setRepos] = useState<GitRepo[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    from: getDaysAgo(7),
    to: new Date(),
  });
  const [authors, setAuthors] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedAuthors');
    return saved ? JSON.parse(saved) : [];
  });
  const [commits, setCommits] = useState<GitCommitType[]>([]);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiConfig, setAiConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem('aiConfig');
    return saved ? JSON.parse(saved) : DEFAULT_AI_CONFIG;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'log' | 'report'>('log');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Save workspacePath to localStorage
  useEffect(() => {
    if (workspacePath) {
      localStorage.setItem('workspacePath', workspacePath);
    } else {
      localStorage.removeItem('workspacePath');
    }
  }, [workspacePath]);

  // Save selectedAuthors to localStorage
  useEffect(() => {
    if (selectedAuthors.length > 0) {
      localStorage.setItem('selectedAuthors', JSON.stringify(selectedAuthors));
    } else {
      localStorage.removeItem('selectedAuthors');
    }
  }, [selectedAuthors]);

  // Save AI config to localStorage
  useEffect(() => {
    localStorage.setItem('aiConfig', JSON.stringify(aiConfig));
  }, [aiConfig]);

  // Select workspace folder
  const handleSelectWorkspace = async () => {
    try {
      const selected = await open({
        directory: true,
        title: '选择工作区文件夹',
      });

      if (selected) {
        setWorkspacePath(selected);
        setRepos([]);
        setSelectedRepos([]);
        setAuthors([]);
        setSelectedAuthors([]);
        setCommits([]);
        setAiReport(null);

        // Scan for git repos
        setIsLoading(true);
        try {
          const foundRepos = await scanGitRepos(selected);
          setRepos(foundRepos);
          setSelectedRepos(foundRepos.map((r) => r.path));
        } catch (error) {
          console.error('Failed to scan repos:', error);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Failed to open dialog:', error);
    }
  };

  // Refresh repos
  const handleRefresh = async () => {
    if (!workspacePath) return;

    setIsLoading(true);
    try {
      const foundRepos = await scanGitRepos(workspacePath);
      setRepos(foundRepos);
      setSelectedRepos(foundRepos.map((r) => r.path));
    } catch (error) {
      console.error('Failed to scan repos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load workspace on mount if saved
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (workspacePath && !hasInitialized.current) {
      hasInitialized.current = true;
      handleRefresh();
    }
  }, [workspacePath]); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle repo selection
  const handleToggleRepo = (path: string) => {
    setSelectedRepos((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  // Select/deselect all repos
  const handleSelectAllRepos = () => {
    setSelectedRepos(repos.map((r) => r.path));
  };

  const handleDeselectAllRepos = () => {
    setSelectedRepos([]);
  };

  // Toggle author selection
  const handleToggleAuthor = (author: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author]
    );
  };

  // Select/deselect all authors
  const handleSelectAllAuthors = () => {
    setSelectedAuthors([...authors]);
  };

  const handleDeselectAllAuthors = () => {
    setSelectedAuthors([]);
  };

  // Fetch git log
  const handleFetchLog = useCallback(async () => {
    if (selectedRepos.length === 0) return;

    setIsLoading(true);
    setAiReport(null);

    try {
      const since = formatDate(dateRange.from);
      const until = formatDate(dateRange.to);

      // Get authors first
      const repoAuthors = await getRepoAuthors(selectedRepos, since, until);
      setAuthors(repoAuthors);
      
      // Preserve selected authors if they exist in new authors list
      setSelectedAuthors((prev) => {
        if (prev.length === 0) return repoAuthors;
        const validAuthors = prev.filter((author) => repoAuthors.includes(author));
        return validAuthors.length > 0 ? validAuthors : repoAuthors;
      });

      // Get commits
      const logCommits = await getGitLog({
        repo_paths: selectedRepos,
        since,
        until,
        authors: [], // Fetch all authors first
      });

      setCommits(logCommits);
    } catch (error) {
      console.error('Failed to fetch git log:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRepos, dateRange]);

  // Filter commits by selected authors
  const filteredCommits =
    selectedAuthors.length === authors.length
      ? commits
      : commits.filter((c) => selectedAuthors.includes(c.author));

  // Generate AI report
  const handleGenerateReport = async () => {
    if (filteredCommits.length === 0) return;

    setIsGenerating(true);
    setActiveTab('report');

    try {
      const logText = formatGitLogForAI(filteredCommits);
      const report = await generateReport(aiConfig, logText);
      setAiReport(report);
    } catch (error) {
      console.error('Failed to generate report:', error);
      setAiReport(`生成失败：${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Test AI connection
  const handleTestConnection = async (config: AIConfig) => {
    try {
      await testAIConnection(config);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />

      <main className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 py-4">
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left sidebar - fixed height, no scroll */}
          <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
            {/* Workspace selector */}
            <Card className="flex-shrink-0">
              <CardHeader className="py-3">
                <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  工作区
                </h2>
              </CardHeader>
              <CardContent className="py-3">
                <WorkspaceSelector
                  workspacePath={workspacePath}
                  onSelectWorkspace={handleSelectWorkspace}
                  onRefresh={handleRefresh}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>

            {/* Date range */}
            <Card className="flex-shrink-0">
              <CardHeader className="py-3">
                <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  时间范围
                </h2>
              </CardHeader>
              <CardContent className="py-3">
                <DateRangePicker
                  from={dateRange.from}
                  to={dateRange.to}
                  onChange={setDateRange}
                />
              </CardContent>
            </Card>

            {/* Repo list - takes remaining space */}
            <Card className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <CardHeader className="py-3 flex-shrink-0">
                <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Git 仓库
                  {repos.length > 0 && (
                    <Badge variant="info">{repos.length}</Badge>
                  )}
                </h2>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 overflow-hidden py-3">
                <RepoList
                  repos={repos}
                  selectedRepos={selectedRepos}
                  onToggleRepo={handleToggleRepo}
                  onSelectAll={handleSelectAllRepos}
                  onDeselectAll={handleDeselectAllRepos}
                />
              </CardContent>
            </Card>

            {/* Fetch button */}
            <Button
              className="w-full flex-shrink-0"
              size="lg"
              onClick={handleFetchLog}
              disabled={selectedRepos.length === 0}
              isLoading={isLoading}
            >
              <GitCommit className="h-5 w-5" />
              获取 Git 日志
            </Button>

            {/* Author filter - only show when authors exist */}
            {authors.length > 0 && (
              <Card className="flex-shrink-0">
                <CardHeader className="py-3">
                  <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    提交者筛选
                  </h2>
                </CardHeader>
                <CardContent className="py-3">
                  <AuthorFilter
                    authors={authors}
                    selectedAuthors={selectedAuthors}
                    onToggleAuthor={handleToggleAuthor}
                    onSelectAll={handleSelectAllAuthors}
                    onDeselectAll={handleDeselectAllAuthors}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main content - scrollable */}
          <div className="lg:col-span-8 min-h-0">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('log')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'log'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        Git 日志
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('report')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'report'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" />
                        AI 周报
                      </span>
                    </button>
                  </div>

                  {activeTab === 'report' && commits.length > 0 && !aiReport && (
                    <Button
                      size="sm"
                      onClick={handleGenerateReport}
                      isLoading={isGenerating}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <Sparkles className="h-4 w-4" />
                      生成周报
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto min-h-0">
                {activeTab === 'log' ? (
                  <GitLogView commits={filteredCommits} />
                ) : (
                  <AIReportView
                    report={aiReport}
                    isLoading={isGenerating}
                    onGenerate={handleGenerateReport}
                    hasCommits={filteredCommits.length > 0}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Settings modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={aiConfig}
        onSave={setAiConfig}
        onTest={handleTestConnection}
      />
    </div>
  );
}

export default App;
