import { GitBranch } from 'lucide-react';
import { Checkbox } from './ui/Checkbox';
import type { GitRepo } from '../types';

interface RepoListProps {
  repos: GitRepo[];
  selectedRepos: string[];
  onToggleRepo: (path: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function RepoList({
  repos,
  selectedRepos,
  onToggleRepo,
  onSelectAll,
  onDeselectAll,
}: RepoListProps) {
  if (repos.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <GitBranch className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>未找到 Git 仓库</p>
        <p className="text-sm mt-1">请选择包含 Git 仓库的工作区文件夹</p>
      </div>
    );
  }

  const allSelected = repos.length === selectedRepos.length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0 pb-2">
        <span className="text-sm text-slate-400">
          {selectedRepos.length} / {repos.length} 个仓库已选择
        </span>
        <button
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {allSelected ? '取消全选' : '全选'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {repos.map((repo) => (
          <div
            key={repo.path}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/50 transition-colors group"
          >
            <Checkbox
              checked={selectedRepos.includes(repo.path)}
              onChange={() => onToggleRepo(repo.path)}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                {repo.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{repo.path}</p>
            </div>
            <GitBranch className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
