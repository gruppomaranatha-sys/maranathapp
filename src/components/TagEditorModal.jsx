import React, { useState } from 'react';
import { X, Tag, Check, Sparkles } from 'lucide-react';
import { LITURGICAL_CATEGORIES } from '../data/driveFolders';

export function TagEditorModal({
  song,
  isOpen,
  onClose,
  onSaveCategory
}) {
  const [selectedCat, setSelectedCat] = useState(song?.category || 'vari');

  if (!isOpen || !song) return null;

  const handleSave = () => {
    onSaveCategory(song.id, selectedCat);
    onClose();
  };

  const categories = LITURGICAL_CATEGORIES.filter(c => c.id !== 'all');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden">
        
        <div className="p-5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Modifica Momento Liturgico
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">
                {song.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-2 max-h-[60vh] overflow-y-auto">
          {categories.map((cat) => {
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
          >
            Salva Categoria
          </button>
        </div>

      </div>
    </div>
  );
}
