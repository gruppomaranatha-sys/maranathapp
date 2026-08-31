import React from 'react';
import { 
  Music, 
  Search, 
  X, 
  SlidersHorizontal, 
  ListMusic, 
  FolderTree, 
  Star, 
  Moon, 
  Sun, 
  Settings, 
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export function Header({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  stats,
  showFavoritesOnly,
  setShowFavoritesOnly,
  onOpenScaletta,
  onOpenSettings,
  isDarkMode,
  setIsDarkMode,
  isSyncing,
  activeScalettaCount = 0
}) {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Riga superiore: Logo, Ricerca e Azioni Rapide */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo e Titolo */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 sm:h-12 rounded-xl overflow-hidden shadow-md shadow-amber-500/20 border border-amber-300 dark:border-amber-600 flex-shrink-0 bg-amber-400">
              <img 
                src="/logo.jpg" 
                alt="Logo Coro Maranathà" 
                className="h-full w-auto object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                  <span>MaranathApp</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Coro Maranathà
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden xs:block">
                Repertorio canti, spartiti, tracce audio &amp; slide
              </p>
            </div>
          </div>

          {/* Barra di ricerca centrale */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cerca per titolo, categoria o testo..."
                className="w-full pl-10 pr-10 py-2 text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Azioni di destra */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Pulsante Preferiti */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              title={showFavoritesOnly ? "Mostra tutti i canti" : "Filtra preferiti"}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
                showFavoritesOnly 
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 ring-1 ring-amber-400' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Preferiti</span>
              {stats.favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
                  {stats.favoritesCount}
                </span>
              )}
            </button>

            {/* Pulsante Scaletta Messa */}
            <button
              onClick={onOpenScaletta}
              title="Gestisci scaletta della Messa / Eventi"
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/20 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <ListMusic className="w-4 h-4" />
              <span className="hidden sm:inline">Scaletta Messa</span>
              {activeScalettaCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-white text-brand-700 font-bold">
                  {activeScalettaCount}
                </span>
              )}
            </button>

            {/* Impostazioni & Sincronizzazione */}
            <button
              onClick={onOpenSettings}
              title="Impostazioni di sincronizzazione Google Drive"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings className={`w-5 h-5 ${isSyncing ? 'animate-spin text-brand-500' : ''}`} />
            </button>

            {/* Toggle Tema Dark/Light */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Passa a tema chiaro" : "Passa a tema scuro"}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Ricerca per mobile (visibile solo sotto md) */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca canto, spartito, audio..."
              className="w-full pl-9 pr-9 py-2 text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Barra di navigazione delle visualizzazioni (Canti Riuniti vs Cartelle Drive) */}
        <div className="flex items-center justify-between pb-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/50 text-xs sm:text-sm">
          
          {/* Switch Canti Riuniti / Esplora Cartelle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('songs')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'songs'
                  ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Catalogo Canti Riuniti</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                {stats.totalSongs}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('folders')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'folders'
                  ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">File per Cartella Drive</span>
              <span className="xs:hidden">Cartelle</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                {stats.totalFiles}
              </span>
            </button>
          </div>

          {/* Contatori rapidi media */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span><strong>{stats.scoresCount}</strong> Spartiti/Testi</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span><strong>{stats.audioCount}</strong> MP3</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span><strong>{stats.slidesCount}</strong> Proiezioni</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
