import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  Settings, 
  Check, 
  Copy, 
  ExternalLink, 
  HardDrive, 
  Key, 
  Upload, 
  Download, 
  Trash2,
  FolderOpen,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { DRIVE_FOLDERS } from '../data/driveFolders';

export function SyncSettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onSyncAppsScript,
  onSyncDriveApi,
  isSyncing,
  lastSyncDate,
  totalFilesCount,
  onResetToDefaultCatalog,
  onImportJson
}) {
  const [activeTab, setActiveTab] = useState('apps_script');
  const [appsScriptUrl, setAppsScriptUrl] = useState(settings.appsScriptUrl || '');
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  if (!isOpen) return null;

  const handleSaveAndSyncAppsScript = async (e) => {
    e.preventDefault();
    onSaveSettings({ ...settings, appsScriptUrl, apiKey });
    setSyncStatus({ type: 'loading', message: 'Sincronizzazione in corso...' });
    try {
      await onSyncAppsScript(appsScriptUrl);
      setSyncStatus({ type: 'success', message: 'Sincronizzazione completata con successo!' });
    } catch (err) {
      setSyncStatus({ type: 'error', message: err.message || 'Errore durante la sincronizzazione.' });
    }
  };

  const handleSaveAndSyncApiKey = async (e) => {
    e.preventDefault();
    onSaveSettings({ ...settings, appsScriptUrl, apiKey });
    setSyncStatus({ type: 'loading', message: 'Sincronizzazione Google Drive API in corso...' });
    try {
      await onSyncDriveApi(apiKey);
      setSyncStatus({ type: 'success', message: 'Sincronizzazione completata con successo!' });
    } catch (err) {
      setSyncStatus({ type: 'error', message: err.message || 'Errore durante la sincronizzazione.' });
    }
  };

  const appsScriptCode = `function doGet(e) {
  try {
    var FOLDERS = {
      testi_A_L: { id: '1YCCjs5Ee2xDbrjjLwTLl9Z4r1Z_3bGDB', name: 'Testi e spartiti A-L', type: 'score_lyrics' },
      testi_M_Z: { id: '1gmM9nIrfM0YlUm3ZmNhjkJvGJNMmiBrU', name: 'Testi e spartiti M-Z', type: 'score_lyrics' },
      canti_mp3: { id: '1SfSnnlvIhTXVvV8OjETiuqVTUP1synYX', name: 'Canti MP3', type: 'audio' },
      proiezioni_ppt: { id: '1gADAsBT7J3oVo56bRdjvn4sKclrU4gc_', name: 'Presentazioni PPT', type: 'slides' }
    };
    var allFiles = [];
    for (var key in FOLDERS) {
      var folderInfo = FOLDERS[key];
      try {
        var folder = DriveApp.getFolderById(folderInfo.id);
        scanFolderRecursively(folder, folderInfo, key, allFiles);
      } catch (err) {
        Logger.log('Errore: ' + err.toString());
      }
    }
    return ContentService.createTextOutput(JSON.stringify(allFiles))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function scanFolderRecursively(folder, folderInfo, folderKey, results) {
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    if (file.getName().indexOf('~$') === 0) continue;
    results.push({
      id: file.getId(),
      name: file.getName(),
      mimeType: file.getMimeType(),
      size: file.getSize(),
      folder_key: folderKey,
      folder_name: folderInfo.name,
      category: folderInfo.type
    });
  }
  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    scanFolderRecursively(subfolders.next(), folderInfo, folderKey, results);
  }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header Modale */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Sincronizzazione Google Drive
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mantieni aggiornato il catalogo dei canti con le tue cartelle di Drive
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab di navigazione impostazioni */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('apps_script')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'apps_script'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Google Apps Script (Consigliato)
          </button>
          <button
            onClick={() => setActiveTab('drive_api')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'drive_api'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Google Drive API Key
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'backup'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Stato &amp; Backup
          </button>
        </div>

        {/* Corpo Modale */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: Google Apps Script */}
          {activeTab === 'apps_script' && (
            <div className="space-y-5">
              <div className="p-4 bg-brand-50/70 dark:bg-brand-950/30 rounded-2xl border border-brand-200/80 dark:border-brand-900/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-300">
                  <Sparkles className="w-4 h-4" />
                  <span>Sincronizzazione Automatica Gratuita e Illimitata</span>
                </div>
                <p>
                  Google Apps Script ti permette di leggere tutti i file delle 4 cartelle di Drive in tempo reale senza limiti di quota e senza chiavi API a pagamento.
                </p>
              </div>

              {/* Form URL */}
              <form onSubmit={handleSaveAndSyncAppsScript} className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  URL Applicazione Web Google Apps Script:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={appsScriptUrl}
                    onChange={(e) => setAppsScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={isSyncing || !appsScriptUrl}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Sincronizza</span>
                  </button>
                </div>
              </form>

              {/* Guida Installazione Rapida */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-brand-500" />
                    <span>Come creare il tuo script in 1 minuto:</span>
                  </h4>
                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Codice Copiato!' : 'Copia Codice Script'}</span>
                  </button>
                </div>

                <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside bg-slate-50 dark:bg-slate-850 p-4 rounded-xl">
                  <li>Apri <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline font-semibold">script.google.com</a> e clicca su <strong>Nuovo progetto</strong>.</li>
                  <li>Incolla il codice (cliccando il pulsante "Copia Codice Script" qui sopra).</li>
                  <li>Clicca su <strong>Distribuisci</strong> (in alto a destra) &rarr; <strong>Nuova distribuzione</strong>.</li>
                  <li>Seleziona <strong>Applicazione web</strong>, imposta <em>"Chi può accedere: Chiunque"</em> e clicca <strong>Distribuisci</strong>.</li>
                  <li>Copia l'URL fornito e incollalo nel campo sopra!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: Drive API Key */}
          {activeTab === 'drive_api' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Se hai già un progetto su Google Cloud Console con le Google Drive API abilitate, puoi inserire la tua API Key qui sotto:
              </p>

              <form onSubmit={handleSaveAndSyncApiKey} className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  Google Cloud API Key:
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={isSyncing || !apiKey}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Sincronizza</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Backup & Info */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-xs">File Totali Indicizzati:</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{totalFilesCount}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-xs">Ultima Sincronizzazione:</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {lastSyncDate ? new Date(lastSyncDate).toLocaleString('it-IT') : 'Iniziale'}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                <button
                  onClick={onResetToDefaultCatalog}
                  className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 rounded-xl border border-red-200 dark:border-red-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Ripristina Catalogo Predefinito</span>
                </button>
              </div>
            </div>
          )}

          {/* Messaggio Stato */}
          {syncStatus && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              syncStatus.type === 'success' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
              syncStatus.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300' :
              'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
            }`}>
              <span>{syncStatus.message}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 hover:bg-slate-700 transition-colors"
          >
            Chiudi
          </button>
        </div>

      </div>
    </div>
  );
}
