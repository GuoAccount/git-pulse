import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer group',
        className
      )}
    >
      <div
        className={cn(
          'h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center',
          checked
            ? 'bg-blue-600 border-blue-600'
            : 'border-slate-500 group-hover:border-slate-400'
        )}
        onClick={() => onChange(!checked)}
      >
        {checked && <Check className="h-3.5 w-3.5 text-white" />}
      </div>
      {label && (
        <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}
