import React from 'react';
import { 
  Sparkles, 
  DoorOpen, 
  Flame, 
  BookOpen, 
  Gift, 
  Crown, 
  HeartHandshake, 
  Wine, 
  Send, 
  Star, 
  Wind, 
  Calendar, 
  Music,
  Headphones,
  FileText,
  FileCode,
  Presentation,
  Filter,
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import { LITURGICAL_CATEGORIES } from '../data/driveFolders';

const CATEGORY_ICONS = {
  all: Sparkles,
  ingresso: DoorOpen,
  kyrie_gloria: Flame,
  salmo_alleluia: BookOpen,
  offertorio: Gift,
  santo: Crown,
  pace: HeartHandshake,
  comunione: Wine,
  congedo: Send,
  mariani: Star,
  spirito: Wind,
  tempi_forti: Calendar,
  vari: Music
};

const ALPHABET = ['TUTTI', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export function FilterBar({
  selectedLetter,
  setSelectedLetter,
  selectedCategory,
  setSelectedCategory,
  mediaFilters,
  toggleMediaFilter,
  sortBy,
  setSortBy,
  onResetFilters,
  hasActiveFilters,
  totalResultsCount
}) {
  return (
    <div className="space-y-3 mb-6">
      
      {/* 1. Barra Alfabetica Rapida A-Z */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 dark:text-slate-500 font-semibold px-1 text-[11px] uppercase tracking-wider hidden sm:inline flex-shrink-0">
          Indice A-Z:
        </span>
        <div className="flex items-center gap-1 min-w-max">
          {ALPHABET.map((letter) => {
            const isSelected = selectedLetter === (letter === 'TUTTI' ? 'ALL' : letter);
            return (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter === 'TUTTI' ? 'ALL' : letter)}
                className={`min-w-[28px] h-7 px-1.5 rounded-lg font-bold text-center transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Momenti Liturgici / Categorie (Pillole orizzontali) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {LITURGICAL_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || Music;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-400 dark:text-brand-600' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Filtri Media (MP3, PDF, DOC, PPT) e Ordinamento */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
        
        {/* Filtri Formati Risorse */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium text-[11px] mr-1 hidden xs:inline">
            Filtra risorsa:
          </span>

          <button
            onClick={() => toggleMediaFilter('audio')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              mediaFilters.audio
                ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-semibold'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-blue-500" />
            <span>Audio MP3</span>
          </button>

          <button
            onClick={() => toggleMediaFilter('pdf')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              mediaFilters.pdf
                ? 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>Spartito PDF</span>
          </button>

          <button
            onClick={() => toggleMediaFilter('doc')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              mediaFilters.doc
                ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-500" />
            <span>Testo Word</span>
          </button>

          <button
            onClick={() => toggleMediaFilter('ppt')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              mediaFilters.ppt
                ? 'bg-amber-50 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 font-semibold'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-amber-500" />
            <span>Slide PPT</span>
          </button>
        </div>

        {/* Ordinamento e Reset */}
        <div className="flex items-center gap-2 text-xs ml-auto">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Azzera filtri</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="title_asc">Titolo A &rarr; Z</option>
              <option value="title_desc">Titolo Z &rarr; A</option>
              <option value="has_audio">Con Audio prima</option>
              <option value="has_score">Con Spartito prima</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium px-1">
            {totalResultsCount} canti
          </span>
        </div>

      </div>
    </div>
  );
}
