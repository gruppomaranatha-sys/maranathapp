import React, { useState, useEffect } from 'react';
import { SongCard } from './SongCard';
import { SearchX, RotateCcw, ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 48;

export function SongList({
  songs,
  playingSongId,
  onPlayAudio,
  onOpenDocument,
  favoriteSongIds,
  onToggleFavorite,
  onAddToScaletta,
  onEditCategory,
  onResetFilters
}) {
  const [displayLimit, setDisplayLimit] = useState(ITEMS_PER_PAGE);

  // Reset display limit when filter or songs list changes
  useEffect(() => {
    setDisplayLimit(ITEMS_PER_PAGE);
  }, [songs.length]);

  if (songs.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 my-6 shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
          Nessun canto trovato
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          Nessun canto corrisponde ai criteri di ricerca o ai filtri selezionati. Prova a modificare la ricerca o ripristinare i filtri.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Mostra tutti i canti</span>
        </button>
      </div>
    );
  }

  const visibleSongs = songs.slice(0, displayLimit);
  const hasMore = displayLimit < songs.length;

  return (
    <div className="space-y-6 pb-28">
      
      {/* Griglia Canti */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleSongs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            isPlayingThisSong={playingSongId === song.id}
            onPlayAudio={onPlayAudio}
            onOpenDocument={onOpenDocument}
            isFavorite={favoriteSongIds.includes(song.id)}
            onToggleFavorite={onToggleFavorite}
            onAddToScaletta={onAddToScaletta}
            onEditCategory={onEditCategory}
          />
        ))}
      </div>

      {/* Pulsante Carica Altri se ce ne sono di più */}
      {hasMore && (
        <div className="text-center pt-4 pb-6">
          <button
            onClick={() => setDisplayLimit(prev => prev + ITEMS_PER_PAGE)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-all active:scale-95"
          >
            <span>Mostra altri canti ({songs.length - displayLimit} rimanenti)</span>
            <ChevronDown className="w-4 h-4 text-brand-500" />
          </button>
        </div>
      )}

    </div>
  );
}
