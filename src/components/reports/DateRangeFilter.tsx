import React, { useState } from 'react';
import { Calendar, Filter, RotateCcw, ChevronDown } from 'lucide-react';
import { DateRangePreset, DateRangeFilter as IDateRangeFilter } from '../../types/index.js';

interface DateRangeFilterProps {
  currentFilter: IDateRangeFilter;
  onChange: (newFilter: IDateRangeFilter) => void;
  isLoading?: boolean;
}

const PRESET_OPTIONS: { id: DateRangePreset; labelEn: string; labelAr: string }[] = [
  { id: 'TODAY', labelEn: 'Today (20 Aug)', labelAr: 'اليوم (20 أغسطس)' },
  { id: 'YESTERDAY', labelEn: 'Yesterday', labelAr: 'أمس' },
  { id: 'LAST_7_DAYS', labelEn: 'Last 7 Days', labelAr: 'آخر 7 أيام' },
  { id: 'LAST_30_DAYS', labelEn: 'Last 30 Days', labelAr: 'آخر 30 يوماً' },
  { id: 'THIS_MONTH', labelEn: 'This Month (August)', labelAr: 'هذا الشهر (أغسطس)' },
  { id: 'LAST_MONTH', labelEn: 'Last Month (July)', labelAr: 'الشهر الماضي (يوليو)' },
  { id: 'CUSTOM', labelEn: 'Custom Date Range', labelAr: 'نطاق زمني مخصص' },
];

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  currentFilter,
  onChange,
  isLoading = false,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [tempStart, setTempStart] = useState(currentFilter.startDate || '2026-08-01');
  const [tempEnd, setTempEnd] = useState(currentFilter.endDate || '2026-08-20');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectPreset = (preset: DateRangePreset) => {
    setIsDropdownOpen(false);
    if (preset === 'CUSTOM') {
      setShowCustomModal(true);
    } else {
      onChange({
        preset,
      });
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempStart > tempEnd) {
      alert('Start date cannot be after end date.');
      return;
    }
    onChange({
      preset: 'CUSTOM',
      startDate: tempStart,
      endDate: tempEnd,
    });
    setShowCustomModal(false);
  };

  const handleReset = () => {
    onChange({
      preset: 'LAST_30_DAYS',
    });
  };

  const currentPresetLabel =
    PRESET_OPTIONS.find((p) => p.id === currentFilter.preset)?.labelEn || 'Last 30 Days';

  return (
    <div className="relative inline-flex items-center gap-2 flex-wrap">
      {/* Preset Dropdown Button */}
      <div className="relative">
        <button
          type="button"
          id="date-range-filter-btn"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
        >
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>{currentPresetLabel}</span>
          {currentFilter.preset === 'CUSTOM' && currentFilter.startDate && currentFilter.endDate && (
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
              {currentFilter.startDate} → {currentFilter.endDate}
            </span>
          )}
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 overflow-hidden">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                <span>Select Reporting Period</span>
                <Filter className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="py-1">
                {PRESET_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectPreset(opt.id)}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${
                      currentFilter.preset === opt.id
                        ? 'bg-emerald-50/70 text-emerald-700 font-semibold'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{opt.labelEn}</span>
                    {currentFilter.preset === opt.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Reset Filter Button */}
      {currentFilter.preset !== 'LAST_30_DAYS' && (
        <button
          type="button"
          onClick={handleReset}
          title="Reset to default 30 days"
          className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      )}

      {/* Custom Date Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Custom Date Range</h3>
                  <p className="text-xs text-slate-500">Specify period boundaries for management analytics</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyCustom} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  Apply Date Range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
