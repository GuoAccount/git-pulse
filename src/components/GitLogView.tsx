import { format } from 'date-fns';
import { GitCommit as GitCommitIcon, Copy, Check, GitBranch, Tag } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/Badge';
import type { GitCommit } from '../types';

interface GitLogViewProps {
  commits: GitCommit[];
}

export function GitLogView({ commits }: GitLogViewProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  if (commits.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <GitCommitIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">暂无提交记录</p>
        <p className="text-sm mt-2">请选择仓库和时间范围查看 Git 日志</p>
      </div>
    );
  }

  // Group commits by date
  const groupedCommits: Record<string, GitCommit[]> = {};
  commits.forEach((commit) => {
    const date = commit.date.split('T')[0];
    if (!groupedCommits[date]) {
      groupedCommits[date] = [];
    }
    groupedCommits[date].push(commit);
  });

  const copyToClipboard = (text: string, hash: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Parse refs string into branches and tags
  const parseRefs = (refs: string) => {
    if (!refs) return { branches: [], tags: [] };
    
    const branches: string[] = [];
    const tags: string[] = [];
    
    refs.split(',').forEach(ref => {
      const trimmed = ref.trim();
      if (trimmed.startsWith('tag: ')) {
        tags.push(trimmed.replace('tag: ', ''));
      } else if (trimmed && !trimmed.startsWith('HEAD')) {
        branches.push(trimmed);
      }
    });
    
    return { branches, tags };
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
        <span>共 {commits.length} 条提交</span>
        <span>•</span>
        <span>{Object.keys(groupedCommits).length} 天</span>
        <span>•</span>
        <span>{new Set(commits.map((c) => c.author)).size} 位提交者</span>
      </div>

      {/* Commits grouped by date */}
      {Object.entries(groupedCommits)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, dateCommits]) => (
          <div key={date} className="animate-fade-in">
            <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-sm py-2 mb-3">
              <h3 className="text-sm font-semibold text-slate-300">
                {format(new Date(date), 'yyyy年MM月dd日 EEEE', { locale: undefined })}
                <span className="ml-2 text-slate-500">({dateCommits.length} 条)</span>
              </h3>
            </div>

            <div className="space-y-2">
              {dateCommits.map((commit) => {
                const { branches, tags } = parseRefs(commit.refs);
                
                return (
                  <div
                    key={commit.hash}
                    className="group flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-200"
                  >
                    <div className="mt-1.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <Badge variant="default">{commit.repo_name}</Badge>
                        {branches.map((branch) => (
                          <Badge key={branch} variant="info" className="gap-1">
                            <GitBranch className="h-3 w-3" />
                            {branch}
                          </Badge>
                        ))}
                        {tags.map((tag) => (
                          <Badge key={tag} variant="warning" className="gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                        <span className="text-xs text-slate-500">{commit.author}</span>
                      </div>
                      <p className="text-sm text-slate-200 break-words">{commit.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <code className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded font-mono">
                          {commit.hash.substring(0, 7)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(commit.hash, commit.hash)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedHash === commit.hash ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3 text-slate-500 hover:text-slate-300" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
