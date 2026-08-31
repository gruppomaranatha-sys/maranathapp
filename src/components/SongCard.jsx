import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  FileText, 
  FileCode, 
  Presentation, 
  Headphones, 
  Star, 
  Plus, 
  ExternalLink, 
  Download, 
  Tag, 
  MoreVertical,
  ChevronRight,
  Eye
} from 'lucide-react';
import { getCategoryBadge } from '../services/liturgyDetector';
import { getDownloadUrl, getDriveOpenUrl } from '../services/driveService';

export function SongCard({
  song,
  isPlayingThisSong,
  onPlayAudio,
  onOpenDocument,
  isFavorite,
  onToggleFavorite,
  onAddToScaletta,
  onEditCategory
}) {
  const [showMenu, setShowMenu] = useState(false);
  const categoryBadge = getCategoryBadge(song.category);

  const mainAudio = song.audio[0];
  const mainScore = song.scores.find(s => s.fileType === 'pdf') || song.scores[0];
  const mainSlide = song.slides[0];

  return (
    <div className={`relative group bg-white dark:bg-slate-900/90 rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between ${
      isPlayingThisSong 
        ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/30 dark:bg-brand-950/20 shadow-md' 
        : 'border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
    }`}>
      
      {/* Header Card: Titolo, Badge e Azione Preferito */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          
          {/* Badge Categoria Liturgica */}
          <button
            onClick={() => onEditCategory(song)}
            title="Clicca per modificare la categoria liturgica"
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-transform hover:scale-105 ${categoryBadge.bg} ${categoryBadge.text} ${categoryBadge.border}`}
          >
            <span>{categoryBadge.label}</span>
            <Tag className="w-2.5 h-2.5 opacity-60" />
          </button>

          {/* Preferito & Menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(song.id)}
              title={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
              className="p-1 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => onAddToScaletta(song)}
              title="Aggiungi alla Scaletta Messa"
              className="p-1 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Titolo del Canto */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {song.title}
        </h3>

        {/* Risorse Disponibili - Badge Indicatori */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {song.hasMp3 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
              <Headphones className="w-3 h-3 text-blue-500" />
              <span>MP3 ({song.audio.length})</span>
            </span>
          )}

          {song.hasPdf && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              <FileText className="w-3 h-3 text-emerald-500" />
              <span>PDF ({song.scores.filter(s => s.fileType === 'pdf').length})</span>
            </span>
          )}

          {song.hasDoc && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
              <FileCode className="w-3 h-3 text-indigo-500" />
              <span>Word DOC</span>
            </span>
          )}

          {song.hasPpt && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
              <Presentation className="w-3 h-3 text-amber-500" />
              <span>Slide PPT</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer Card: Pulsanti di Azione Rapida */}
      <div className="p-3 sm:px-5 sm:py-3 bg-slate-50/80 dark:bg-slate-850/50 rounded-b-2xl border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
        
        {/* Pulsante Play Audio (se disponibile) */}
        {mainAudio ? (
          <button
            onClick={() => onPlayAudio(song, mainAudio)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 ${
              isPlayingThisSong
                ? 'bg-brand-600 text-white shadow-brand-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-brand-300'
            }`}
          >
            {isPlayingThisSong ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>In Riproduzione</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-brand-500" />
                <span>Ascolta</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex-1 text-[11px] text-slate-400 italic">
            Nessun audio
          </div>
        )}

        {/* Pulsante Spartito/Testo (se disponibile) */}
        {mainScore && (
          <button
            onClick={() => onOpenDocument(mainScore, song)}
            title={`Visualizza ${mainScore.cleanName}`}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-500" />
            <span>Spartito</span>
          </button>
        )}

        {/* Pulsante Presentazione PPT (se disponibile) */}
        {mainSlide && (
          <a
            href={getDriveOpenUrl(mainSlide.id)}
            target="_blank"
            rel="noopener noreferrer"
            title={`Apri slide ${mainSlide.cleanName}`}
            className="p-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-all flex items-center justify-center"
          >
            <Presentation className="w-4 h-4" />
          </a>
        )}

        {/* Menu Dropdown con tutti i file collegati */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            title="Tutti i file e opzioni"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 bottom-full mb-1 w-64 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-30 space-y-1 text-xs">
                <div className="px-2 py-1 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                  File collegati ({song.files.length}):
                </div>
                
                {song.files.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 group/file">
                    <span className="truncate flex-1 mr-2 text-slate-700 dark:text-slate-300 text-[11px]" title={file.cleanName}>
                      {file.cleanName}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {file.fileType === 'pdf' && (
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            onOpenDocument(file, song);
                          }}
                          title="Visualizza PDF"
                          className="p-1 rounded text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <a
                        href={getDownloadUrl(file.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Scarica file da Drive"
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={getDriveOpenUrl(file.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Apri su Google Drive"
                        className="p-1 rounded text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/50"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
