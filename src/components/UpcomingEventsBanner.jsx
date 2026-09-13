import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  X, 
  ListPlus, 
  Sparkles,
  Music2,
  CalendarCheck
} from 'lucide-react';
import { getUpcomingEvents, formatEventCountdown, CHOIR_INFO } from '../data/choirCalendar';

export function UpcomingEventsBanner({ onOpenCalendar, onCreateScaletta }) {
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Calcola i prossimi eventi da oggi
  const upcomingEvents = getUpcomingEvents(new Date(), 2);
  const nextEvent = upcomingEvents[0];

  if (isDismissed || !nextEvent) {
    return null;
  }

  const countdown = formatEventCountdown(nextEvent.isoDate);
  const isImminent = countdown === 'Oggi!' || countdown === 'Domani' || countdown.startsWith('Tra 1 ') || countdown.startsWith('Tra 2 ') || countdown.startsWith('Tra 3 ');

  return (
    <div className="mb-4 sm:mb-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 dark:from-amber-950/40 dark:via-brand-950/40 dark:to-indigo-950/40 border border-amber-300/60 dark:border-amber-700/50 p-3.5 sm:p-4 shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Dettagli Prossimo Evento */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 to-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-amber-500/30">
            <CalendarCheck className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Prossimo Impegno Coro</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                isImminent 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
              }`}>
                {countdown}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {nextEvent.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 flex-wrap mt-0.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-500" />
                {nextEvent.dateDisplay}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Ore {nextEvent.time}
              </span>
              <span className="hidden sm:inline text-slate-400 dark:text-slate-500">•</span>
              <span className="hidden sm:flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                <Music2 className="w-3 h-3" />
                {CHOIR_INFO.rehearsals}
              </span>
            </div>
          </div>
        </div>

        {/* Azioni Rapide */}
        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
          {onCreateScaletta && (
            <button
              onClick={() => onCreateScaletta(nextEvent)}
              title="Prepara scaletta canti per questo evento"
              className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <ListPlus className="w-3.5 h-3.5 text-brand-500" />
              <span className="hidden xs:inline">Prepara Scaletta</span>
              <span className="xs:hidden">Scaletta</span>
            </button>
          )}

          <button
            onClick={onOpenCalendar}
            className="px-3 py-1.5 text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 rounded-xl shadow-xs shadow-brand-500/20 flex items-center gap-1 transition-all active:scale-95"
          >
            <span>Tutto il Calendario</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            title="Nascondi per ora"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
