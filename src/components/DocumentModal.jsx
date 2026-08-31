import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Music,
  Presentation,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sun,
  Moon,
  RefreshCw
} from 'lucide-react';
import { 
  getDocumentPreviewUrl, 
  getDownloadUrl, 
  getDriveOpenUrl 
} from '../services/driveService';
import { getFileType } from '../services/songMatcher';

export function DocumentModal({
  file,
  song,
  isOpen,
  onClose,
  onPlayAudio
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isInverted, setIsInverted] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Reset zoom and rotation on new file
    setZoomLevel(1);
    setRotation(0);
    setIsInverted(false);
    setImgError(false);
  }, [file?.id]);

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

  if (!isOpen || !file) return null;

  const fileType = file.fileType || getFileType(file.name || '');
  const isImage = fileType === 'image';
  const isSlides = fileType === 'slides';
  const isPdf = fileType === 'pdf';

  const previewUrl = getDocumentPreviewUrl(file.id);
  const downloadUrl = getDownloadUrl(file.id);
  const driveUrl = getDriveOpenUrl(file.id);
  const directImgUrl = `https://drive.usercontent.google.com/download?id=${file.id}`;
  const thumbnailImgUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w2500`;

  const hasAudio = song?.audio && song.audio.length > 0;

  const getHeaderIcon = () => {
    if (isImage) return <ImageIcon className="w-5 h-5 text-purple-500" />;
    if (isSlides) return <Presentation className="w-5 h-5 text-amber-500" />;
    return <FileText className="w-5 h-5 text-emerald-500" />;
  };

  const getBadgeLabel = () => {
    if (isImage) return 'Immagine / Spartito Foto';
    if (isSlides) return 'Presentazione Slide Chiesa (PPT)';
    if (isPdf) return 'Spartito PDF';
    return 'Documento di Testo';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
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
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              {getHeaderIcon()}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {song?.title || file.cleanName || file.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                <span className="font-semibold text-brand-600 dark:text-brand-400">{getBadgeLabel()}</span>
                <span>•</span>
                <span className="truncate">{file.cleanName || file.name}</span>
              </p>
            </div>
          </div>

          {/* Azioni Barra Superiore */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Controlli specifici per Immagini (Zoom, Ruota, Contrasto) */}
            {isImage && !imgError && (
              <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                  title="Riduci zoom (-)"
                  className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono px-1 font-bold">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                  title="Aumenta zoom (+)"
                  className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  title="Ruota immagine di 90°"
                  className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsInverted(!isInverted)}
                  title={isInverted ? "Colori normali" : "Inverti colori (alto contrasto per leggio al buio)"}
                  className={`p-1.5 rounded-lg transition-colors ${isInverted ? 'bg-amber-400 text-slate-900 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700'}`}
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

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

        {/* Corpo Visualizzatore */}
        <div className="flex-1 w-full h-full bg-slate-950 relative overflow-hidden flex items-center justify-center">
          
          {/* Se è un'immagine (JPG / PNG) */}
          {isImage ? (
            <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
              {!imgError ? (
                <img
                  src={directImgUrl}
                  alt={file.cleanName || file.name}
                  onError={() => {
                    // Fallback a thumbnail o preview iframe se il direct stream è bloccato
                    setImgError(true);
                  }}
                  className="max-w-none transition-transform duration-200 select-none shadow-2xl rounded-lg"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    filter: isInverted ? 'invert(1) hue-rotate(180deg) contrast(1.1)' : 'none',
                    maxHeight: zoomLevel === 1 ? '100%' : 'none',
                    maxWidth: zoomLevel === 1 ? '100%' : 'none',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                /* Fallback a Iframe Google Drive se l'immagine richiede auth/cors */
                <iframe
                  src={previewUrl}
                  title={file.cleanName}
                  className="w-full h-full border-0"
                  allow="autoplay"
                />
              )}
            </div>
          ) : (
            /* Visualizzatore Iframe Google Drive per PDF, PowerPoint e Word */
            <iframe
              src={previewUrl}
              title={file.cleanName || file.name}
              className="w-full h-full border-0"
              allow="autoplay"
            />
          )}

        </div>

        {/* Footer con suggerimento e fallback */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
          <span>
            {isSlides && "📽️ Modalità presentazione slide: puoi scorrere le slide o cliccare su Schermo Intero."}
            {isImage && "📷 Usa i pulsanti di zoom e rotazione in alto per ingrandire o ruotare lo spartito."}
            {isPdf && "📄 Visualizzazione spartito PDF."}
          </span>
          <span className="hidden sm:inline">
            Premi <strong>Esc</strong> per chiudere
          </span>
        </div>

      </div>
    </div>
  );
}
