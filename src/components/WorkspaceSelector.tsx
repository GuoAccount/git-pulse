import { FolderOpen, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';

interface WorkspaceSelectorProps {
  workspacePath: string | null;
  onSelectWorkspace: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function WorkspaceSelector({
  workspacePath,
  onSelectWorkspace,
  onRefresh,
  isLoading,
}: WorkspaceSelectorProps) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <Button
        variant="secondary"
        onClick={onSelectWorkspace}
        className="flex-1 min-w-0 justify-start overflow-hidden"
      >
        <FolderOpen className="h-4 w-4 flex-shrink-0" />
        {workspacePath ? (
          <span className="truncate">{workspacePath}</span>
        ) : (
          <span className="text-slate-500">选择工作区文件夹...</span>
        )}
      </Button>
      {workspacePath && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex-shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      )}
    </div>
  );
}
