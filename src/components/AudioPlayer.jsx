import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  FileText, 
  X, 
  Gauge,
  ExternalLink,
  Download,
  AlertCircle,
  Radio,
  Tv
} from 'lucide-react';
import { 
  getAudioStreamUrl, 
  getAudioFallbackUrl, 
  getAudioPreviewUrl, 
  getDownloadUrl, 
  getDriveOpenUrl 
} from '../services/driveService';
import { getCategoryBadge } from '../services/liturgyDetector';

export function AudioPlayer({
  activeSong,
  activeAudioFile,
  isPlaying,
  setIsPlaying,
  onPrevSong,
  onNextSong,
  onOpenDocument,
  onClose
}) {
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [useDriveIframe, setUseDriveIframe] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  // Aggiorna sorgente audio quando cambia brano
  useEffect(() => {
    if (activeAudioFile && audioRef.current && !useDriveIframe) {
      setHasError(false);
      setTriedFallback(false);
      setIsLoading(true);
      
      const streamUrl = getAudioStreamUrl(activeAudioFile.id);
      audioRef.current.src = streamUrl;
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((err) => {
            console.warn('Direct stream failed, trying fallback...', err);
            // Prova fallback
            if (audioRef.current) {
              audioRef.current.src = getAudioFallbackUrl(activeAudioFile.id);
              audioRef.current.load();
              audioRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                  setIsLoading(false);
                })
                .catch(() => {
                  setHasError(true);
                  setIsLoading(false);
                });
            }
          });
      }
    }
  }, [activeAudioFile?.id, useDriveIframe]);

  // Gestione stato play / pause
  useEffect(() => {
    if (!audioRef.current || useDriveIframe) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, useDriveIframe]);

  // Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Velocità di riproduzione
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Loop
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const handleAudioError = () => {
    if (!triedFallback && audioRef.current && activeAudioFile) {
      setTriedFallback(true);
      audioRef.current.src = getAudioFallbackUrl(activeAudioFile.id);
      audioRef.current.load();
      audioRef.current.play().catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setIsLoading(false);
      setHasError(false);
    }
  };

  const handleSeek = (e) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const seekTime = clickPosition * (duration || 0);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const speedOptions = [0.75, 0.9, 1.0, 1.25, 1.5];
  const nextSpeed = () => {
    const currentIndex = speedOptions.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    setPlaybackRate(speedOptions[nextIndex]);
  };

  if (!activeAudioFile || !activeSong) return null;

  const categoryBadge = getCategoryBadge(activeSong.category);
  const mainScore = activeSong.scores?.[0];
  const previewUrl = getAudioPreviewUrl(activeAudioFile.id);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto glass-panel border border-slate-200/90 dark:border-slate-800/90 rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 pointer-events-auto transition-all">
        
        {/* Hidden Audio Element per streaming HTML5 */}
        {!useDriveIframe && (
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              if (!isLooping && onNextSong) onNextSong();
            }}
            onError={handleAudioError}
          />
        )}

        {/* Modalità 1: Player Iframe Ufficiale Google Drive (Sempre funzionante senza blocchi) */}
        {useDriveIframe ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                  {activeSong.initialLetter}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {activeSong.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {activeAudioFile.cleanName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUseDriveIframe(false)}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                >
                  <Radio className="w-3 h-3 text-brand-500" />
                  <span>Torna a Player Compatto</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Embedded Drive Audio Widget */}
            <div className="h-16 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
              <iframe
                src={previewUrl}
                title={activeSong.title}
                className="w-full h-full border-0"
                allow="autoplay"
              />
            </div>
          </div>
        ) : (
          /* Modalità 2: Player HTML5 personalizzato con scrubbing e velocità */
          <>
            {/* Barra di avanzamento superiore */}
            <div 
              ref={progressRef}
              onClick={handleSeek}
              className="relative w-full h-2 bg-slate-200 dark:bg-slate-700/80 rounded-full cursor-pointer group mb-3 overflow-hidden"
            >
              <div 
                className="h-full bg-gradient-to-r from-brand-600 to-amber-500 rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
              <div 
                className="absolute top-0 bottom-0 w-3 h-3 -mt-0.5 bg-white border-2 border-brand-600 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${((currentTime / (duration || 1)) * 100)}% - 6px)` }}
              />
            </div>

            {/* Controlli e Informazioni */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              {/* Info Brano Attivo */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="font-bold text-sm">{activeSong.initialLetter}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {activeSong.title}
                    </h4>
                    <span className={`hidden xs:inline-flex px-2 py-0.2 rounded-full text-[10px] font-semibold border ${categoryBadge.bg} ${categoryBadge.text} ${categoryBadge.border}`}>
                      {categoryBadge.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {activeAudioFile.cleanName}
                  </p>
                </div>
              </div>

              {/* Controlli Principali (Prev, Play/Pause, Next, Tempo) */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-shrink-0">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-10 text-right">
                  {formatTime(currentTime)}
                </span>

                <button
                  onClick={onPrevSong}
                  title="Brano precedente"
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isLoading}
                  title={isPlaying ? "Pausa" : "Riproduci"}
                  className="w-11 h-11 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={onNextSong}
                  title="Brano successivo"
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <span className="text-xs font-mono text-slate-400 w-10">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Azioni Secondarie: Velocità, Loop, Volume, Spartito e Chiudi */}
              <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-shrink-0">
                
                {/* Selettore Velocità Coro */}
                <button
                  onClick={nextSpeed}
                  title={`Velocità di riproduzione: ${playbackRate}x (Clicca per cambiare)`}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                >
                  <Gauge className="w-3 h-3 text-slate-400" />
                  <span>{playbackRate}x</span>
                </button>

                {/* Loop Canto */}
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  title={isLooping ? "Disattiva ripetizione" : "Ripeti questo brano in continuo"}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isLooping 
                      ? 'bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-300 font-bold' 
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Spartito Collegato Rapido */}
                {mainScore && (
                  <button
                    onClick={() => onOpenDocument(mainScore, activeSong)}
                    title="Apri spartito o testo collegato"
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors flex items-center gap-1 text-xs font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden md:inline">Spartito</span>
                  </button>
                )}

                {/* Volume */}
                <div className="hidden sm:flex items-center gap-1.5 pl-1">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                </div>

                {/* Chiudi Player */}
                <button
                  onClick={onClose}
                  title="Chiudi player"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Avviso con Switch Rapido a Player Google Drive o Download se il browser blocca l'audio */}
            {hasError && (
              <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-900/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Il browser richiede il lettore integrato di Google Drive.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUseDriveIframe(true)}
                    className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Attiva Player Google Drive</span>
                  </button>
                  <a
                    href={getDriveOpenUrl(activeAudioFile.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
                  >
                    <span>Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={getDownloadUrl(activeAudioFile.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
                  >
                    <span>Scarica MP3</span>
                    <Download className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
