import { useState } from 'react';
import { X, TestTube, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import type { AIConfig } from '../types';
import { DEFAULT_AI_CONFIG } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  onSave: (config: AIConfig) => void;
  onTest: (config: AIConfig) => Promise<boolean>;
}

export function SettingsModal({
  isOpen,
  onClose,
  config,
  onSave,
  onTest,
}: SettingsModalProps) {
  const [localConfig, setLocalConfig] = useState<AIConfig>(config);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testError, setTestError] = useState<string>('');

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    setTestError('');

    try {
      const success = await onTest(localConfig);
      setTestResult(success ? 'success' : 'error');
      if (!success) {
        setTestError('连接测试失败');
      }
    } catch (error) {
      setTestResult('error');
      setTestError(String(error));
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  const handleReset = () => {
    setLocalConfig(DEFAULT_AI_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-slate-200">AI 配置</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* API URL */}
          <Input
            label="API URL"
            placeholder="https://api.openai.com/v1"
            value={localConfig.api_url}
            onChange={(e) =>
              setLocalConfig({ ...localConfig, api_url: e.target.value })
            }
          />

          {/* Model ID */}
          <Input
            label="Model ID"
            placeholder="gpt-3.5-turbo"
            value={localConfig.model_id}
            onChange={(e) =>
              setLocalConfig({ ...localConfig, model_id: e.target.value })
            }
          />

          {/* API Key */}
          <Input
            label="API Key"
            type="password"
            placeholder="sk-..."
            value={localConfig.api_key}
            onChange={(e) =>
              setLocalConfig({ ...localConfig, api_key: e.target.value })
            }
          />

          {/* System Prompt */}
          <Textarea
            label="系统提示词（自定义周报格式）"
            rows={12}
            value={localConfig.system_prompt}
            onChange={(e) =>
              setLocalConfig({ ...localConfig, system_prompt: e.target.value })
            }
          />

          {/* Test result */}
          {testResult && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                testResult === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {testResult === 'success' ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">
                {testResult === 'success' ? '连接成功！' : testError || '连接失败'}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              恢复默认
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTest}
              isLoading={isTesting}
            >
              <TestTube className="h-4 w-4" />
              测试连接
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
