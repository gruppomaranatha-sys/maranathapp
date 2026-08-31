import React, { useState, useEffect, useMemo } from 'react';
import initialCatalog from './data/initialCatalog.json';
import { 
  groupFilesIntoSongs, 
  cleanSongTitle 
} from './services/songMatcher';
import { 
  loadCatalogFromStorage, 
  saveCatalogToStorage,
  getFavoriteSongIds, 
  toggleFavoriteSongId,
  getSavedScalette,
  saveScalette,
  getCustomTags,
  saveCustomTag,
  getAppSettings,
  saveAppSettings,
  syncFromAppsScript,
  syncFromDriveApi
} from './services/driveService';

import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { SongList } from './components/SongList';
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentModal } from './components/DocumentModal';
import { ScalettaBuilder } from './components/ScalettaBuilder';
import { LivePerformanceMode } from './components/LivePerformanceMode';
import { SyncSettingsModal } from './components/SyncSettingsModal';
import { RawFilesExplorer } from './components/RawFilesExplorer';
import { TagEditorModal } from './components/TagEditorModal';

export default function App() {
  // Stato File & Catalogo
  const [files, setFiles] = useState(() => {
    const cached = loadCatalogFromStorage();
    if (cached && cached.length > 500) {
      return cached;
    }
    // Se la cache precedente era la versione ridotta da 200, aggiorna al catalogo completo
    saveCatalogToStorage(initialCatalog);
    return initialCatalog;
  });

  const [customTags, setCustomTags] = useState(() => getCustomTags());
  const [favoriteSongIds, setFavoriteSongIds] = useState(() => getFavoriteSongIds());
  const [scalette, setScaletteList] = useState(() => getSavedScalette());
  const [activeScalettaId, setActiveScalettaId] = useState(() => scalette[0]?.id || 'default_messa');
  const [settings, setSettings] = useState(() => getAppSettings());

  // Stato Filtri & Ricerca
  const [activeTab, setActiveTab] = useState('songs'); // 'songs' | 'folders'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mediaFilters, setMediaFilters] = useState({
    audio: false,
    pdf: false,
    doc: false,
    ppt: false,
    image: false
  });
  const [sortBy, setSortBy] = useState('title_asc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Stato Tema Dark / Light
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Stato Riproduzione Audio
  const [activeSong, setActiveSong] = useState(null);
  const [activeAudioFile, setActiveAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Stato Modali
  const [docModal, setDocModal] = useState({ isOpen: false, file: null, song: null });
  const [isScalettaOpen, setIsScalettaOpen] = useState(false);
  const [isLiveModeOpen, setIsLiveModeOpen] = useState(false);
  const [liveScaletta, setLiveScaletta] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tagModal, setTagModal] = useState({ isOpen: false, song: null });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState(() => localStorage.getItem('coro_app_last_sync'));

  // Gestione Dark Mode Class su <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Raggruppamento dei file in canti unificati
  const allSongs = useMemo(() => {
    return groupFilesIntoSongs(files, customTags);
  }, [files, customTags]);

  // Statistiche generali
  const stats = useMemo(() => {
    let scoresCount = 0;
    let audioCount = 0;
    let slidesCount = 0;

    files.forEach(f => {
      if (f.category === 'score_lyrics') scoresCount++;
      else if (f.category === 'audio') audioCount++;
      else if (f.category === 'slides') slidesCount++;
    });

    return {
      totalSongs: allSongs.length,
      totalFiles: files.length,
      scoresCount,
      audioCount,
      slidesCount,
      favoritesCount: favoriteSongIds.length
    };
  }, [allSongs, files, favoriteSongIds]);

  // Filtraggio e Ordinamento dei canti
  const filteredSongs = useMemo(() => {
    return allSongs.filter(song => {
      // 1. Ricerca testuale
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchTitle = song.title.toLowerCase().includes(query);
        const matchFiles = song.files.some(f => f.name.toLowerCase().includes(query));
        if (!matchTitle && !matchFiles) return false;
      }

      // 2. Filtro lettera A-Z
      if (selectedLetter !== 'ALL') {
        if (selectedLetter === '#') {
          if (/^[A-Z]$/i.test(song.initialLetter)) return false;
        } else {
          if (song.initialLetter !== selectedLetter) return false;
        }
      }

      // 3. Filtro Categoria Liturgica
      if (selectedCategory !== 'all') {
        if (song.category !== selectedCategory) return false;
      }

      // 4. Filtri Risorse Media
      if (mediaFilters.audio && !song.hasMp3) return false;
      if (mediaFilters.pdf && !song.hasPdf) return false;
      if (mediaFilters.doc && !song.hasDoc) return false;
      if (mediaFilters.ppt && !song.hasPpt) return false;
      if (mediaFilters.image && !song.hasImage) return false;

      // 5. Filtro Preferiti
      if (showFavoritesOnly && !favoriteSongIds.includes(song.id)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title, 'it', { sensitivity: 'base' });
      }
      if (sortBy === 'title_desc') {
        return b.title.localeCompare(a.title, 'it', { sensitivity: 'base' });
      }
      if (sortBy === 'has_audio') {
        if (a.hasMp3 && !b.hasMp3) return -1;
        if (!a.hasMp3 && b.hasMp3) return 1;
        return a.title.localeCompare(b.title, 'it');
      }
      if (sortBy === 'has_score') {
        if (a.hasPdf && !b.hasPdf) return -1;
        if (!a.hasPdf && b.hasPdf) return 1;
        return a.title.localeCompare(b.title, 'it');
      }
      return 0;
    });
  }, [allSongs, searchTerm, selectedLetter, selectedCategory, mediaFilters, showFavoritesOnly, favoriteSongIds, sortBy]);

  // Lista di tutti i canti con audio per la playlist
  const playableSongs = useMemo(() => {
    return filteredSongs.filter(s => s.hasMp3);
  }, [filteredSongs]);

  // Gestione Riproduzione Audio
  const handlePlayAudio = (song, audioFile) => {
    if (activeSong?.id === song.id && activeAudioFile?.id === audioFile?.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSong(song);
      setActiveAudioFile(audioFile || song.audio[0]);
      setIsPlaying(true);
    }
  };

  const handleNextSong = () => {
    if (playableSongs.length === 0 || !activeSong) return;
    const currentIndex = playableSongs.findIndex(s => s.id === activeSong.id);
    const nextIndex = (currentIndex + 1) % playableSongs.length;
    const nextSong = playableSongs[nextIndex];
    if (nextSong && nextSong.audio[0]) {
      setActiveSong(nextSong);
      setActiveAudioFile(nextSong.audio[0]);
      setIsPlaying(true);
    }
  };

  const handlePrevSong = () => {
    if (playableSongs.length === 0 || !activeSong) return;
    const currentIndex = playableSongs.findIndex(s => s.id === activeSong.id);
    const prevIndex = (currentIndex - 1 + playableSongs.length) % playableSongs.length;
    const prevSong = playableSongs[prevIndex];
    if (prevSong && prevSong.audio[0]) {
      setActiveSong(prevSong);
      setActiveAudioFile(prevSong.audio[0]);
      setIsPlaying(true);
    }
  };

  // Gestione Preferiti
  const handleToggleFavorite = (songId) => {
    const updated = toggleFavoriteSongId(songId);
    setFavoriteSongIds([...updated]);
  };

  // Gestione Salvataggio Tag Categoria
  const handleSaveCategory = (songId, category) => {
    const updated = saveCustomTag(songId, category);
    setCustomTags({ ...updated });
  };

  // Gestione Salvataggio Scalette
  const handleSaveScalette = (newScalette) => {
    saveScalette(newScalette);
    setScaletteList([...newScalette]);
  };

  const handleAddToScalettaQuick = (song) => {
    const current = scalette.find(s => s.id === activeScalettaId) || scalette[0];
    if (!current) return;

    // Trova il primo slot vuoto
    const emptySlotIndex = current.items.findIndex(i => !i.songId);
    if (emptySlotIndex !== -1) {
      const updatedItems = [...current.items];
      updatedItems[emptySlotIndex] = {
        ...updatedItems[emptySlotIndex],
        songId: song.id,
        songTitle: song.title
      };
      const updated = scalette.map(s => s.id === current.id ? { ...s, items: updatedItems } : s);
      handleSaveScalette(updated);
      setIsScalettaOpen(true);
    } else {
      setIsScalettaOpen(true);
    }
  };

  // Sincronizzazione Apps Script
  const handleSyncAppsScript = async (url) => {
    setIsSyncing(true);
    try {
      const newFiles = await syncFromAppsScript(url);
      setFiles(newFiles);
      setLastSyncDate(new Date().toISOString());
    } finally {
      setIsSyncing(false);
    }
  };

  // Sincronizzazione Drive API
  const handleSyncDriveApi = async (key) => {
    setIsSyncing(true);
    try {
      const newFiles = await syncFromDriveApi(key);
      setFiles(newFiles);
      setLastSyncDate(new Date().toISOString());
    } finally {
      setIsSyncing(false);
    }
  };

  // Ripristino catalogo predefinito
  const handleResetToDefaultCatalog = () => {
    if (window.confirm('Sei sicuro di voler ripristinare il catalogo iniziale?')) {
      saveCatalogToStorage(initialCatalog);
      setFiles(initialCatalog);
      setLastSyncDate(null);
    }
  };

  const toggleMediaFilter = (key) => {
    setMediaFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLetter('ALL');
    setSelectedCategory('all');
    setMediaFilters({ audio: false, pdf: false, doc: false, ppt: false, image: false });
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters = Boolean(
    searchTerm || 
    selectedLetter !== 'ALL' || 
    selectedCategory !== 'all' || 
    mediaFilters.audio || 
    mediaFilters.pdf || 
    mediaFilters.doc || 
    mediaFilters.ppt ||
    mediaFilters.image ||
    showFavoritesOnly
  );

  const activeScaletta = scalette.find(s => s.id === activeScalettaId) || scalette[0];
  const activeScalettaAssignedCount = activeScaletta?.items?.filter(i => i.songId).length || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      
      {/* Header Applicazione */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        onOpenScaletta={() => setIsScalettaOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isSyncing={isSyncing}
        activeScalettaCount={activeScalettaAssignedCount}
      />

      {/* Contenuto Principale */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {activeTab === 'songs' ? (
          <>
            {/* Barra dei Filtri */}
            <FilterBar
              selectedLetter={selectedLetter}
              setSelectedLetter={setSelectedLetter}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              mediaFilters={mediaFilters}
              toggleMediaFilter={toggleMediaFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
              totalResultsCount={filteredSongs.length}
            />

            {/* Griglia Canti */}
            <SongList
              songs={filteredSongs}
              playingSongId={activeSong?.id}
              onPlayAudio={handlePlayAudio}
              onOpenDocument={(file, song) => setDocModal({ isOpen: true, file, song })}
              favoriteSongIds={favoriteSongIds}
              onToggleFavorite={handleToggleFavorite}
              onAddToScaletta={handleAddToScalettaQuick}
              onEditCategory={(song) => setTagModal({ isOpen: true, song })}
              onResetFilters={handleResetFilters}
            />
          </>
        ) : (
          /* Vista File per Cartella Drive */
          <RawFilesExplorer
            files={files}
            onPlayAudio={handlePlayAudio}
            onOpenDocument={(file, song) => setDocModal({ isOpen: true, file, song })}
          />
        )}

      </main>

      {/* Player Audio Fisso in Basso */}
      <AudioPlayer
        activeSong={activeSong}
        activeAudioFile={activeAudioFile}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onPrevSong={handlePrevSong}
        onNextSong={handleNextSong}
        onOpenDocument={(file, song) => setDocModal({ isOpen: true, file, song })}
        onClose={() => {
          setActiveSong(null);
          setActiveAudioFile(null);
          setIsPlaying(false);
        }}
      />

      {/* Modale Visualizzatore Documenti (PDF / Spartiti / DOC) */}
      <DocumentModal
        file={docModal.file}
        song={docModal.song}
        isOpen={docModal.isOpen}
        onClose={() => setDocModal({ isOpen: false, file: null, song: null })}
        onPlayAudio={handlePlayAudio}
      />

      {/* Modale Gestione Scaletta Messa */}
      <ScalettaBuilder
        isOpen={isScalettaOpen}
        onClose={() => setIsScalettaOpen(false)}
        scalette={scalette}
        activeScalettaId={activeScalettaId}
        setActiveScalettaId={setActiveScalettaId}
        onSaveScalette={handleSaveScalette}
        songs={allSongs}
        onStartLiveMode={(sc) => {
          setLiveScaletta(sc);
          setIsLiveModeOpen(true);
        }}
        onPlaySong={handlePlayAudio}
      />

      {/* Modalità Esecuzione dal Vivo a Schermo Intero (Messa / Prove) */}
      <LivePerformanceMode
        isOpen={isLiveModeOpen}
        onClose={() => setIsLiveModeOpen(false)}
        scaletta={liveScaletta || activeScaletta}
        songs={allSongs}
        onPlayAudio={handlePlayAudio}
        activeAudioFile={activeAudioFile}
        isPlaying={isPlaying}
      />

      {/* Modale Impostazioni & Sincronizzazione Drive */}
      <SyncSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(st) => {
          saveAppSettings(st);
          setSettings(st);
        }}
        onSyncAppsScript={handleSyncAppsScript}
        onSyncDriveApi={handleSyncDriveApi}
        isSyncing={isSyncing}
        lastSyncDate={lastSyncDate}
        totalFilesCount={files.length}
        onResetToDefaultCatalog={handleResetToDefaultCatalog}
      />

      {/* Modale Modifica Categoria Liturgica */}
      <TagEditorModal
        isOpen={tagModal.isOpen}
        song={tagModal.song}
        onClose={() => setTagModal({ isOpen: false, song: null })}
        onSaveCategory={handleSaveCategory}
      />

    </div>
  );
}
