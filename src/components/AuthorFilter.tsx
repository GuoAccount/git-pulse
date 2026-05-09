import { User } from 'lucide-react';
import { Badge } from './ui/Badge';

interface AuthorFilterProps {
  authors: string[];
  selectedAuthors: string[];
  onToggleAuthor: (author: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function AuthorFilter({
  authors,
  selectedAuthors,
  onToggleAuthor,
  onSelectAll,
  onDeselectAll,
}: AuthorFilterProps) {
  if (authors.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">暂无提交者数据</p>
      </div>
    );
  }

  const allSelected = authors.length === selectedAuthors.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">
          {selectedAuthors.length} / {authors.length} 个提交者已选择
        </span>
        <button
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {allSelected ? '取消全选' : '全选'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {authors.map((author) => {
          const isSelected = selectedAuthors.includes(author);
          return (
            <button
              key={author}
              onClick={() => onToggleAuthor(author)}
              className="transition-all duration-200"
            >
              <Badge variant={isSelected ? 'info' : 'default'}>
                {author}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
