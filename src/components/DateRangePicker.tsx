import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { Button } from './ui/Button';

interface DateRangePickerProps {
  from: Date;
  to: Date;
  onChange: (range: { from: Date; to: Date }) => void;
}

const presets = [
  { label: '最近7天', getRange: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: '最近14天', getRange: () => ({ from: subDays(new Date(), 14), to: new Date() }) },
  { label: '最近30天', getRange: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: '本周', getRange: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: endOfWeek(new Date(), { weekStartsOn: 1 }) }) },
];

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <CalendarIcon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {format(from, 'yyyy-MM-dd')} ~ {format(to, 'yyyy-MM-dd')}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 animate-fade-in">
          <div className="p-2 space-y-1">
            {presets.map((preset) => (
              <button
                key={preset.label}
                className="w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md transition-colors text-left"
                onClick={() => {
                  onChange(preset.getRange());
                  setIsOpen(false);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-slate-700 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={format(from, 'yyyy-MM-dd')}
                onChange={(e) => onChange({ from: new Date(e.target.value), to })}
                className="flex-1 min-w-0 px-2 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-slate-200"
              />
              <span className="text-slate-500 flex-shrink-0">~</span>
              <input
                type="date"
                value={format(to, 'yyyy-MM-dd')}
                onChange={(e) => onChange({ from, to: new Date(e.target.value) })}
                className="flex-1 min-w-0 px-2 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-slate-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
