import { useState } from 'react';
import { Sparkles, Copy, Check, Download } from 'lucide-react';
import { Button } from './ui/Button';

interface AIReportViewProps {
  report: string | null;
  isLoading: boolean;
  onGenerate: () => void;
  hasCommits: boolean;
}

export function AIReportView({
  report,
  isLoading,
  onGenerate,
  hasCommits,
}: AIReportViewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (report) {
      navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadMarkdown = () => {
    if (report) {
      const blob = new Blob([report], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weekly-report-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!hasCommits) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">请先获取 Git 日志</p>
        <p className="text-sm mt-2">获取提交记录后即可生成 AI 周报</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Generate button */}
      {!report && (
        <div className="text-center py-8">
          <Button
            onClick={onGenerate}
            isLoading={isLoading}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Sparkles className="h-5 w-5" />
            生成 AI 周报
          </Button>
          <p className="text-sm text-slate-500 mt-3">
            使用 AI 分析提交记录，自动生成结构化周报
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-slate-800/50 rounded-xl">
            <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
            <span className="text-slate-300">AI 正在生成周报...</span>
          </div>
        </div>
      )}

      {/* Report content */}
      {report && !isLoading && (
        <div className="space-y-4 animate-fade-in">
          {/* Action buttons */}
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  复制
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadMarkdown}
            >
              <Download className="h-4 w-4" />
              下载 Markdown
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onGenerate}
            >
              <Sparkles className="h-4 w-4" />
              重新生成
            </Button>
          </div>

          {/* Markdown content */}
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              {report}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
