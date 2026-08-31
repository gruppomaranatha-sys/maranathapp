import React, { useState } from 'react';
import { 
  X, 
  ListMusic, 
  Plus, 
  Trash2, 
  Play, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Calendar, 
  FileText, 
  ArrowRight,
  Printer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getDriveOpenUrl } from '../services/driveService';

const DEFAULT_SLOTS = [
  { moment: 'ingresso', label: '1. Canto d\'Ingresso', icon: '🚪' },
  { moment: 'kyrie_gloria', label: '2. Kyrie / Gloria', icon: '🔥' },
  { moment: 'salmo_alleluia', label: '3. Salmo / Alleluia', icon: '📖' },
  { moment: 'offertorio', label: '4. Offertorio', icon: '🍞' },
  { moment: 'santo', label: '5. Santo', icon: '👑' },
  { moment: 'pace', label: '6. Segno di Pace / Agnello', icon: '🤝' },
  { moment: 'comunione', label: '7. Comunione & Ringraziamento', icon: '🍷' },
  { moment: 'congedo', label: '8. Canto Finale', icon: '✨' }
];

export function ScalettaBuilder({
  isOpen,
  onClose,
  scalette,
  activeScalettaId,
  setActiveScalettaId,
  onSaveScalette,
  songs,
  onStartLiveMode,
  onPlaySong
}) {
  const [copied, setCopied] = useState(false);
  const [newScalettaName, setNewScalettaName] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  if (!isOpen) return null;

  const currentScaletta = scalette.find(s => s.id === activeScalettaId) || scalette[0] || {
    id: 'default',
    name: 'Scaletta Messa',
    date: new Date().toISOString().split('T')[0],
    items: DEFAULT_SLOTS.map(s => ({ moment: s.moment, label: s.label, songId: '', songTitle: '' }))
  };

  const handleUpdateSlot = (momentIndex, songId) => {
    const song = songs.find(s => s.id === songId);
    const updatedItems = [...currentScaletta.items];
    updatedItems[momentIndex] = {
      ...updatedItems[momentIndex],
      songId: songId,
      songTitle: song ? song.title : ''
    };

    const updatedScalette = scalette.map(s => 
      s.id === currentScaletta.id ? { ...s, items: updatedItems } : s
    );
    onSaveScalette(updatedScalette);
  };

  const handleClearSlot = (momentIndex) => {
    const updatedItems = [...currentScaletta.items];
    updatedItems[momentIndex] = {
      ...updatedItems[momentIndex],
      songId: '',
      songTitle: ''
    };

    const updatedScalette = scalette.map(s => 
      s.id === currentScaletta.id ? { ...s, items: updatedItems } : s
    );
    onSaveScalette(updatedScalette);
  };

  const handleCreateNewScaletta = (e) => {
    e.preventDefault();
    if (!newScalettaName.trim()) return;

    const newId = 'scaletta_' + Date.now();
    const newSc = {
      id: newId,
      name: newScalettaName.trim(),
      date: new Date().toISOString().split('T')[0],
      items: DEFAULT_SLOTS.map(s => ({ moment: s.moment, label: s.label, songId: '', songTitle: '' }))
    };

    const updated = [...scalette, newSc];
    onSaveScalette(updated);
    setActiveScalettaId(newId);
    setNewScalettaName('');
    setShowNewForm(false);
  };

  const handleDeleteCurrentScaletta = () => {
    if (scalette.length <= 1) {
      alert('Non puoi eliminare l\'unica scaletta.');
      return;
    }
    if (window.confirm(`Sei sicuro di voler eliminare "${currentScaletta.name}"?`)) {
      const updated = scalette.filter(s => s.id !== currentScaletta.id);
      onSaveScalette(updated);
      setActiveScalettaId(updated[0].id);
    }
  };

  // Genera messaggio formattato per WhatsApp
  const generateShareText = () => {
    let text = `🎶 *SCALETTA CORO MARANATHÀ: ${currentScaletta.name}* 🎶\n📅 Data: ${currentScaletta.date}\n\n`;
    currentScaletta.items.forEach(item => {
      if (item.songTitle) {
        text += `🔹 *${item.label}*: ${item.songTitle}\n`;
      }
    });
    text += `\n🔗 Repertorio & Spartiti: MaranathApp`;
    return text;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Conta canti assegnati
  const assignedCount = currentScaletta.items.filter(i => i.songId).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header Modale */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <ListMusic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Scaletta della Messa / Eventi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Organizza i canti per la celebrazione e condividili con il coro
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

        {/* Barra di gestione scalette e selettore */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          
          {/* Selettore Scaletta */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <select
              value={currentScaletta.id}
              onChange={(e) => setActiveScalettaId(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              {scalette.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.items.filter(i => i.songId).length} canti)
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="p-2 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-300 hover:bg-brand-100 border border-brand-200 dark:border-brand-800 flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuova</span>
            </button>
          </div>

          {/* Azioni Condivisione e Modalità Live */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Modalità Live / Concerto */}
            <button
              onClick={() => {
                onClose();
                onStartLiveMode(currentScaletta);
              }}
              disabled={assignedCount === 0}
              title="Avvia modalità esecuzione a schermo intero per la messa"
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Modalità Messa (Live)</span>
            </button>

            {/* Condividi WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              title="Invia la scaletta su WhatsApp"
              className="p-2 rounded-xl text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 transition-colors"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Copia Testo */}
            <button
              onClick={handleCopyText}
              title="Copia elenco canti"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copiato!' : 'Copia'}</span>
            </button>

            {/* Elimina Scaletta */}
            <button
              onClick={handleDeleteCurrentScaletta}
              title="Elimina questa scaletta"
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Form Creazione Nuova Scaletta (a comparsa) */}
        {showNewForm && (
          <form onSubmit={handleCreateNewScaletta} className="p-3 bg-brand-50 dark:bg-slate-800/80 border-b border-brand-200 dark:border-slate-700 flex items-center gap-2 animate-in slide-in-from-top-2">
            <input
              type="text"
              value={newScalettaName}
              onChange={(e) => setNewScalettaName(e.target.value)}
              placeholder="Nome nuova scaletta (es: Domenica 24 Novembre, Matrimonio Luca e Anna...)"
              className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700"
            >
              Crea
            </button>
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800"
            >
              Annulla
            </button>
          </form>
        )}

        {/* Lista Momenti della Messa e Assegnazione Canti */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {currentScaletta.items.map((slot, index) => {
            const assignedSong = songs.find(s => s.id === slot.songId);
            return (
              <div 
                key={slot.moment + index}
                className={`p-3 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  slot.songId
                    ? 'bg-brand-50/40 dark:bg-brand-950/20 border-brand-200 dark:border-brand-800/60'
                    : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                
                {/* Etichetta Momento */}
                <div className="flex items-center gap-2 sm:w-60 flex-shrink-0">
                  <span className="text-base">{DEFAULT_SLOTS[index]?.icon || '🎵'}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {slot.label}
                  </span>
                </div>

                {/* Selettore Canto */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <select
                    value={slot.songId || ''}
                    onChange={(e) => handleUpdateSlot(index, e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer truncate"
                  >
                    <option value="">-- Seleziona canto --</option>
                    {songs.map(song => (
                      <option key={song.id} value={song.id}>
                        {song.title} {song.hasMp3 ? '🎧' : ''} {song.hasPdf ? '📄' : ''}
                      </option>
                    ))}
                  </select>

                  {/* Azioni rapide se il canto è selezionato */}
                  {assignedSong && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {assignedSong.audio?.[0] && (
                        <button
                          onClick={() => onPlaySong(assignedSong, assignedSong.audio[0])}
                          title="Ascolta audio"
                          className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      )}

                      <button
                        onClick={() => handleClearSlot(index)}
                        title="Rimuovi da questo momento"
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
          <span>
            {assignedCount} di {currentScaletta.items.length} canti assegnati
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Chiudi
          </button>
        </div>

      </div>
    </div>
  );
}
