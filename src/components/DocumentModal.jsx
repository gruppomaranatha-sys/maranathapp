import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Play, 
  Pause, 
  ChevronUp, 
  ChevronDown,
  Music
} from 'lucide-react';
import { getDocumentPreviewUrl, getDownloadUrl, getDriveOpenUrl } from '../services/driveService';

export function DocumentModal({
  file,
  song,
  isOpen,
  onClose,
  onPlayAudio
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1-5
  const iframeContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Gestione tasto ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
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
  }, [isOpen, isFullscreen]);

  // Gestione auto-scroll
  useEffect(() => {
    if (isAutoScrolling && iframeContainerRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        if (iframeContainerRef.current) {
          iframeContainerRef.current.scrollTop += scrollSpeed;
        }
      }, 50);
    } else {
      clearInterval(scrollIntervalRef.current);
    }
    return () => clearInterval(scrollIntervalRef.current);
  }, [isAutoScrolling, scrollSpeed]);

  if (!isOpen || !file) return null;

  const previewUrl = getDocumentPreviewUrl(file.id);
  const downloadUrl = getDownloadUrl(file.id);
  const driveUrl = getDriveOpenUrl(file.id);
  const hasAudio = song?.audio && song.audio.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className={`bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'fixed inset-0 rounded-none w-full h-full z-50' 
            : 'w-full max-w-5xl h-[92vh]'
        }`}
      >
        
        {/* Header Modale */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {song?.title || file.cleanName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {file.cleanName} • Google Drive Preview
              </p>
            </div>
          </div>

          {/* Azioni Barra Superiore */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Ascolto Rapido Audio (se disponibile) */}
            {hasAudio && onPlayAudio && (
              <button
                onClick={() => onPlayAudio(song, song.audio[0])}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900 border border-brand-200 dark:border-brand-800 transition-colors"
              >
                <Music className="w-3.5 h-3.5 text-brand-500" />
                <span>Ascolta MP3</span>
              </button>
            )}

            {/* Scarica */}
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Scarica file originale"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Scarica</span>
            </a>

            {/* Apri in Drive */}
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Apri direttamente in Google Drive"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Drive</span>
            </a>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Riduci finestra" : "Schermo intero"}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Chiudi */}
            <button
              onClick={onClose}
              title="Chiudi visualizzatore (Esc)"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Corpo Iframe Preview */}
        <div 
          ref={iframeContainerRef}
          className="flex-1 w-full h-full bg-slate-100 dark:bg-slate-950 relative overflow-hidden"
        >
          <iframe
            src={previewUrl}
            title={file.cleanName}
            className="w-full h-full border-0"
            allow="autoplay"
          />
        </div>

        {/* Footer con suggerimento e fallback */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
          <span>
            💡 Se il documento non carica, clicca su <strong>Drive</strong> o <strong>Scarica</strong> per aprirlo.
          </span>
          <span className="hidden sm:inline">
            Premi <strong>Esc</strong> per chiudere
          </span>
        </div>

      </div>
    </div>
  );
}
