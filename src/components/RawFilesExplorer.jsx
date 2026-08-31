import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileText, 
  Headphones, 
  Presentation, 
  FileCode, 
  ExternalLink, 
  Download, 
  Play, 
  Eye, 
  Search,
  FolderOpen,
  ChevronDown
} from 'lucide-react';
import { DRIVE_FOLDERS, getDriveViewUrl } from '../data/driveFolders';
import { getDownloadUrl, getDriveOpenUrl } from '../services/driveService';
import { getFileType } from '../services/songMatcher';

const ITEMS_PER_PAGE = 50;

export function RawFilesExplorer({
  files,
  onPlayAudio,
  onOpenDocument
}) {
  const [selectedFolderKey, setSelectedFolderKey] = useState('testi_A_L');
  const [folderSearch, setFolderSearch] = useState('');
  const [displayLimit, setDisplayLimit] = useState(ITEMS_PER_PAGE);

  const folderEntries = Object.entries(DRIVE_FOLDERS);
  const currentFolderInfo = DRIVE_FOLDERS[selectedFolderKey];

  // Filtra i file appartenenti alla cartella selezionata
  const folderFiles = files.filter(f => f.folder_key === selectedFolderKey);
  const filteredFiles = folderFiles.filter(f => 
    !folderSearch || f.name.toLowerCase().includes(folderSearch.toLowerCase())
  );

  useEffect(() => {
    setDisplayLimit(ITEMS_PER_PAGE);
  }, [selectedFolderKey, folderSearch]);

  const visibleFiles = filteredFiles.slice(0, displayLimit);
  const hasMore = displayLimit < filteredFiles.length;

  const getFileIcon = (fileName) => {
    const type = getFileType(fileName);
    if (type === 'audio') return <Headphones className="w-4 h-4 text-blue-500" />;
    if (type === 'pdf') return <FileText className="w-4 h-4 text-emerald-500" />;
    if (type === 'doc') return <FileCode className="w-4 h-4 text-indigo-500" />;
    if (type === 'slides') return <Presentation className="w-4 h-4 text-amber-500" />;
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4 pb-28">
      
      {/* Selettore Cartelle Drive in alto */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {folderEntries.map(([key, folder]) => {
          const isSelected = selectedFolderKey === key;
          const count = files.filter(f => f.folder_key === key).length;
          
          return (
            <button
              key={key}
              onClick={() => setSelectedFolderKey(key)}
              className={`p-3 sm:p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-brand-50/80 dark:bg-brand-950/40 border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FolderOpen className={`w-6 h-6 ${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {count} file
                </span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {folder.name}
                </h4>
                <a
                  href={folder.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  <span>Apri su Drive</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </button>
          );
        })}
      </div>

      {/* Barra di ricerca interna alla cartella */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={folderSearch}
            onChange={(e) => setFolderSearch(e.target.value)}
            placeholder={`Cerca tra i ${folderFiles.length} file di "${currentFolderInfo?.name}"...`}
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium px-2 whitespace-nowrap">
          {filteredFiles.length} trovati
        </span>
      </div>

      {/* Tabella / Elenco dei File della Cartella */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {visibleFiles.map((file) => {
            const fileType = getFileType(file.name);
            const isAudio = fileType === 'audio';
            const isPdf = fileType === 'pdf';

            return (
              <div 
                key={file.id}
                className="p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {file.name}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {formatFileSize(file.size)} {file.size ? '• ' : ''}ID: {file.id}
                    </span>
                  </div>
                </div>

                {/* Azioni Rapide per File */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isAudio && (
                    <button
                      onClick={() => onPlayAudio({ title: file.name, category: 'vari', audio: [file] }, file)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden xs:inline">Ascolta</span>
                    </button>
                  )}

                  {isPdf && (
                    <button
                      onClick={() => onOpenDocument(file, { title: file.name })}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Anteprima</span>
                    </button>
                  )}

                  <a
                    href={getDownloadUrl(file.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Scarica da Drive"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  <a
                    href={getDriveOpenUrl(file.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Apri su Google Drive"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {hasMore && (
          <div className="p-4 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
            <button
              onClick={() => setDisplayLimit(prev => prev + ITEMS_PER_PAGE)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs"
            >
              <span>Carica altri ({filteredFiles.length - displayLimit} rimanenti)</span>
              <ChevronDown className="w-3.5 h-3.5 text-brand-500" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
