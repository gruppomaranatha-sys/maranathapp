import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ListPlus, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  Music, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Share2, 
  Flame, 
  Heart, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Smile, 
  Compass, 
  Church, 
  FileText,
  CalendarCheck2
} from 'lucide-react';
import { 
  CHOIR_INFO, 
  CHOIR_DODECALOGO, 
  CHOIR_CALENDAR_EVENTS, 
  formatEventCountdown 
} from '../data/choirCalendar';

const DODECALOGO_ICONS = {
  Flame,
  Heart,
  Users,
  TrendingUp,
  ShieldCheck,
  Smile,
  BookOpen,
  Sparkles,
  Compass,
  FileMusic: Music,
  Music,
  Church
};

export function CalendarView({ onCreateScalettaFromEvent, onBackToSongs }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'upcoming' | 'wedding' | 'solemnity' | 'rules'
  const now = new Date();

  // Calcola status cronologico
  const eventsWithStatus = CHOIR_CALENDAR_EVENTS.map(ev => {
    const evDate = new Date(ev.isoDate);
    const diffMs = evDate.getTime() - now.getTime();
    const isPast = diffMs < -(4 * 60 * 60 * 1000); // 4 ore dopo l'inizio
    const countdown = formatEventCountdown(ev.isoDate, now);
    return {
      ...ev,
      isPast,
      countdown
    };
  });

  // Trova il primo prossimo evento futuro
  const nextEventId = eventsWithStatus.find(e => !e.isPast)?.id;

  // Filtra eventi
  const filteredEvents = eventsWithStatus.filter(ev => {
    if (filterType === 'all') return true;
    if (filterType === 'upcoming') return !ev.isPast;
    if (filterType === 'wedding') return ev.category === 'wedding';
    if (filterType === 'solemnity') return ev.category === 'solemnity' || ev.category === 'christmas' || ev.category === 'easter' || ev.category === 'pentecost' || ev.category === 'marian';
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 animate-in fade-in duration-200">
      
      {/* Header Sezione Calendario */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-brand-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-12 top-6 opacity-10 text-amber-300 pointer-events-none hidden md:block">
          <CalendarCheck2 className="w-40 h-40" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
              Anno Pastorale 2026 / 2027
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 backdrop-blur-sm border border-white/10">
              {CHOIR_INFO.parish}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
            Programma &amp; Calendario Liturgico
          </h2>

          <p className="text-amber-200 text-sm sm:text-base font-serif italic">
            «{CHOIR_INFO.motto}»
          </p>

          <div className="pt-2 flex items-center gap-4 flex-wrap text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span><strong>Prove:</strong> {CHOIR_INFO.rehearsals}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <CalendarIcon className="w-4 h-4 text-brand-400" />
              <span><strong>{CHOIR_CALENDAR_EVENTS.length}</strong> Celebrazioni programmate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigazione Filtri Calendario & Switch Dodecalogo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        
        {/* Pulsanti Filtro Eventi */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Tutti gli eventi ({CHOIR_CALENDAR_EVENTS.length})
          </button>

          <button
            onClick={() => setFilterType('upcoming')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filterType === 'upcoming'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Prossimi Impegni
          </button>

          <button
            onClick={() => setFilterType('solemnity')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filterType === 'solemnity'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Solennità &amp; Feste
          </button>

          <button
            onClick={() => setFilterType('wedding')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filterType === 'wedding'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Matrimoni
          </button>
        </div>

        {/* Link rapido al Dodecalogo */}
        <a
          href="#dodecalogo"
          className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5 hover:bg-amber-200 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Dodecalogo Maranathà (12 Regole)</span>
        </a>
      </div>

      {/* Griglia Eventi Cronologici */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredEvents.map(event => {
          const isNext = event.id === nextEventId;

          return (
            <div
              key={event.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isNext
                  ? 'bg-gradient-to-b from-amber-500/10 to-white dark:to-slate-900 border-amber-400 dark:border-amber-600 shadow-md ring-2 ring-amber-400/40'
                  : event.isPast
                  ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-70'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 shadow-xs'
              }`}
            >
              <div>
                {/* Badge Superiore: Categoria & Countdown */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    event.category === 'wedding'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                      : event.category === 'christmas'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : event.category === 'easter'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      : event.category === 'advent'
                      ? 'bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300'
                      : event.category === 'lent'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                  }`}>
                    {event.categoryLabel}
                  </span>

                  {isNext ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>Prossimo: {event.countdown}</span>
                    </span>
                  ) : event.isPast ? (
                    <span className="text-[11px] font-medium text-slate-400">
                      Concluso
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                      {event.countdown}
                    </span>
                  )}
                </div>

                {/* Titolo Evento */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {event.title}
                </h3>

                {/* Note aggiuntive se presenti */}
                {event.note && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 italic">
                    {event.note}
                  </p>
                )}

                {/* Data e Orario */}
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-brand-500" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {event.dateDisplay}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Orario inizio: <strong>{event.time}</strong></span>
                  </div>
                </div>
              </div>

              {/* Azione: Prepara Scaletta */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onCreateScalettaFromEvent(event)}
                  className="w-full py-2 px-3 text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl border border-slate-200/80 dark:border-slate-700/80 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <ListPlus className="w-4 h-4 text-brand-500" />
                  <span>Prepara Scaletta Canti</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sezione DODECALOGO DEI MARANATHA' */}
      <div id="dodecalogo" className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
        
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Carta dei Valori del Coro</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Il Dodecalogo dei Maranathà
          </h2>

          <div className="bg-slate-100 dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 space-y-2">
            <p className="font-semibold text-slate-900 dark:text-white">
              {CHOIR_INFO.nameMeaning}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {CHOIR_INFO.history}
            </p>
          </div>
        </div>

        {/* Griglia delle 12 Regole */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHOIR_DODECALOGO.map(item => {
            const IconComponent = DODECALOGO_ICONS[item.icon] || Sparkles;

            return (
              <div 
                key={item.number}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center justify-center border border-amber-300/80 dark:border-amber-700/80">
                      {item.number}°
                    </span>
                    <IconComponent className="w-4 h-4 text-slate-400" />
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5 uppercase tracking-wide">
                    {item.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.rule}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Box Contatti Referente */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-100 via-amber-50 to-brand-50 dark:from-slate-850 dark:via-slate-850 dark:to-slate-800 p-5 sm:p-6 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Referente del Coro
            </span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {CHOIR_INFO.referent.name}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Per informazioni sul programma, disponibilità canti e prove settimanali
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <a
              href={`tel:${CHOIR_INFO.referent.phoneClean}`}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{CHOIR_INFO.referent.phone}</span>
            </a>

            <a
              href={`mailto:${CHOIR_INFO.referent.email}`}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-600 text-white shadow-xs hover:bg-brand-700 flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{CHOIR_INFO.referent.email}</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
