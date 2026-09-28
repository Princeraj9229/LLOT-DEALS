import React, { useRef, useEffect } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectSuggestion?: (term: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onSelectSuggestion,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickPicks = [
    'Brass Diya',
    'Lal Paar Saree',
    'Bamboo Soop',
    'Pooja Thali',
    'LED Fairy Lights',
    'Anarkali Kurta',
    'Thekua Mould',
    'Surya Kalash',
    'Flipkart',
    'Myntra',
    'Meesho',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 shadow-2xl border border-amber-200 animate-in slide-in-from-top-4 duration-150">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search Festival Mega Sale</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Type product name, saree, diya, thali, kurti..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onClose();
                const el = document.getElementById('deals-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        </div>

        {/* Quick Suggestions */}
        <div className="mt-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Trending Searches:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPicks.map((pick) => (
              <button
                key={pick}
                onClick={() => {
                  onSearchChange(pick);
                  onClose();
                  const el = document.getElementById('deals-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 text-xs rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100 transition-colors"
              >
                {pick}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Press Enter to search catalog</span>
          <button
            onClick={() => {
              onClose();
              const el = document.getElementById('deals-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-amber-700 font-bold flex items-center gap-1 hover:underline"
          >
            <span>View Results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
