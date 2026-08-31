import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  FileText, 
  Headphones, 
  ExternalLink, 
  Download, 
  ListMusic, 
  Sparkles
} from 'lucide-react';
import { getDocumentPreviewUrl, getDownloadUrl, getDriveOpenUrl } from '../services/driveService';
import { getCategoryBadge } from '../services/liturgyDetector';

export function LivePerformanceMode({
  scaletta,
  songs,
  isOpen,
  onClose,
  onPlayAudio,
  activeAudioFile,
  isPlaying
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtra solo gli slot che hanno un canto assegnato
  const activeItems = scaletta?.items?.filter(item => item.songId) || [];

  useEffect(() => {
    setCurrentIndex(0);
  }, [scaletta?.id]);

  // Gestione tasti freccia destra/sinistra e ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentIndex(prev => Math.min(prev + 1, activeItems.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, activeItems.length]);

  if (!isOpen || activeItems.length === 0) return null;

  const currentItem = activeItems[currentIndex];
  const currentSong = songs.find(s => s.id === currentItem.songId);
  const currentScore = currentSong?.scores?.[0];
  const currentAudio = currentSong?.audio?.[0];
  const categoryBadge = currentSong ? getCategoryBadge(currentSong.category) : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden animate-in fade-in duration-200 select-none">
      
      {/* Barra Superiore Live */}
      <div className="h-16 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
        
        {/* Info Canto Corrente & Step */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-2.5 py-1 rounded-xl bg-brand-600 font-bold text-xs">
            {currentIndex + 1} / {activeItems.length}
          </span>
          <div className="min-w-0">
            <span className="text-xs text-brand-400 font-bold uppercase tracking-wider block">
              {currentItem.label}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white truncate">
              {currentSong?.title || currentItem.songTitle}
            </h2>
          </div>
        </div>

        {/* Controlli di Navigazione Rapida & Azioni */}
        <div className="flex items-center gap-2">
          
          {/* Audio rapido per tono */}
          {currentAudio && onPlayAudio && (
            <button
              onClick={() => onPlayAudio(currentSong, currentAudio)}
              title="Ascolta audio per intonazione"
              className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Headphones className="w-4 h-4" />
              <span className="hidden sm:inline">Intonazione MP3</span>
            </button>
          )}

          {/* Freccia Indietro */}
          <button
            onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors"
            title="Canto precedente (&larr;)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Freccia Avanti */}
          <button
            onClick={() => setCurrentIndex(prev => Math.min(prev + 1, activeItems.length - 1))}
            disabled={currentIndex === activeItems.length - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors"
            title="Canto successivo (&rarr;)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Chiudi Modalità Live */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-white transition-colors ml-2"
            title="Esci da modalità esecuzione (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Corpo Principale: Spartito a Schermo Intero */}
      <div className="flex-1 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
        {currentScore ? (
          <iframe
            key={currentScore.id}
            src={getDocumentPreviewUrl(currentScore.id)}
            title={currentSong?.title}
            className="w-full h-full border-0"
            allow="autoplay"
          />
        ) : (
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">{currentSong?.title}</h3>
            <p className="text-sm text-slate-400 mb-6">
              Nessun file PDF o DOC caricato su Drive per questo canto.
            </p>
            {currentAudio && onPlayAudio && (
              <button
                onClick={() => onPlayAudio(currentSong, currentAudio)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Ascolta traccia MP3</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Barra Inferiore: Elenco rapido dei canti per saltare con 1 click */}
      <div className="h-14 px-4 bg-slate-900/95 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
        {activeItems.map((item, idx) => (
          <button
            key={item.moment + idx}
            onClick={() => setCurrentIndex(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
              idx === currentIndex
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>{idx + 1}.</span>
            <span className="truncate max-w-[120px]">{item.songTitle}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
