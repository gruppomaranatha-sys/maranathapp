// Calendario Ufficiale Coro Maranathà - Anno Pastorale 2026/2027
// Parrocchia dei Santi Pietro e Paolo - Noventa Padovana

export const CHOIR_INFO = {
  parish: "Parrocchia dei Santi Pietro e Paolo - Noventa Padovana",
  name: "Coro Maranathà",
  motto: "Chi canta prega due volte (Sant'Agostino)",
  nameMeaning: 'Maranathà - Maran Athà: due parole in lingua aramaica che significano "Vieni Signore".',
  history: "Questo nome, deciso quando è nato il Gruppo di Animazione Liturgica quasi 25 anni fa, evidenzia le intenzioni e la cifra stilistica: cantiamo per pregare, accompagnando la comunità.",
  rehearsals: "Ogni martedì salvo diversa indicazione",
  referent: {
    name: "Riccardo",
    phone: "347 78 77 385",
    phoneClean: "+393477877385",
    email: "iricky74@me.com"
  }
};

export const CHOIR_DODECALOGO = [
  {
    number: 1,
    title: "Pregare cantando...",
    rule: "...deve essere il nostro motto! Il nostro servizio è accompagnare la comunità nella preghiera.",
    icon: "Flame"
  },
  {
    number: 2,
    title: "Non ci sono celebrazioni di serie A e di serie B",
    rule: "Tutte le messe che siamo chiamati ad accompagnare hanno uguale importanza a livello di impegno e disponibilità.",
    icon: "Heart"
  },
  {
    number: 3,
    title: "Accogliere nuovi amici",
    rule: "Con animo sereno, aiutandoli ad inserirsi gradualmente e supportandoli nelle difficoltà.",
    icon: "Users"
  },
  {
    number: 4,
    title: "Spingersi vicendevolmente al miglioramento",
    rule: "Perché nessuno 'nasce imparato' e ognuno ha i suoi tempi di apprendimento. Aiutiamoci tutti a vicenda.",
    icon: "TrendingUp"
  },
  {
    number: 5,
    title: "Il gruppo è un impegno",
    rule: "E come tale va trattato, assumendosi le proprie responsabilità di presenza, concentrazione, partecipazione, puntualità e serietà.",
    icon: "ShieldCheck"
  },
  {
    number: 6,
    title: "Il gruppo è un divertimento",
    rule: "Uno svago che ricambia l'impegno con momenti di gioia, soddisfazione e comunità.",
    icon: "Smile"
  },
  {
    number: 7,
    title: "Non deve esserci un approccio scolastico",
    rule: "Ma più consapevole del cosa e del perché si canta.",
    icon: "BookOpen"
  },
  {
    number: 8,
    title: "Stimoli!!!!",
    rule: "Bisogna darseli continuamente per evitare noia e stanchezza. Gli stimoli possono arrivare da tutti, non solo da chi sta davanti...",
    icon: "Sparkles"
  },
  {
    number: 9,
    title: "Niente ansia da prestazione",
    rule: "Le cose affrontate con la dovuta calma sono qualitativamente migliori e richiedono meno fatica. Facendo bene una cosa alla volta si fanno tante cose buone.",
    icon: "Compass"
  },
  {
    number: 10,
    title: "Portare i canti...",
    rule: "...siano fotocopie, spartiti, testi o libretti, è dovere di ciascuno essere autosufficiente alle prove e alle celebrazioni.",
    icon: "FileMusic"
  },
  {
    number: 11,
    title: "Amare il canto anche come arte in sé",
    rule: "Portandole rispetto ma non essendone affatto impauriti. La storia dei Maranathà insegna che anche chi non si sentiva portato per il canto ce l'ha fatta!",
    icon: "Music"
  },
  {
    number: 12,
    title: "Compostezza durante le celebrazioni",
    rule: "Siamo davanti a tutti, visibili e udibili, a servizio della liturgia.",
    icon: "Church"
  }
];

export const CHOIR_CALENDAR_EVENTS = [
  {
    id: 'cal-2026-10-18',
    isoDate: '2026-10-18T15:30:00',
    dateDisplay: 'Ven. 18/10/2026',
    time: '15:30',
    title: 'Matrim. Martina & Tommaso',
    category: 'wedding',
    categoryLabel: 'Matrimonio',
    color: 'rose',
    note: ''
  },
  {
    id: 'cal-2026-10-19',
    isoDate: '2026-10-19T15:30:00',
    dateDisplay: 'Sab. 19/10/2026',
    time: '15:30',
    title: 'Matrim. Giorgia & Gianluca',
    category: 'wedding',
    categoryLabel: 'Matrimonio',
    color: 'rose',
    note: ''
  },
  {
    id: 'cal-2026-11-01',
    isoDate: '2026-11-01T11:00:00',
    dateDisplay: 'Dom. 01/11/2026',
    time: '11:00',
    title: 'Tutti i Santi',
    category: 'solemnity',
    categoryLabel: 'Solennità',
    color: 'amber',
    note: 'Messa solenne delle ore 11:00'
  },
  {
    id: 'cal-2026-11-28',
    isoDate: '2026-11-28T18:30:00',
    dateDisplay: 'Sab. 28/11/2026',
    time: '18:30',
    title: 'Prima di Avvento',
    category: 'advent',
    categoryLabel: 'Avvento',
    color: 'violet',
    note: 'Inizio del nuovo anno liturgico'
  },
  {
    id: 'cal-2026-12-08',
    isoDate: '2026-12-08T11:00:00',
    dateDisplay: 'Mar. 08/12/2026',
    time: '11:00',
    title: 'Messa Immacolata',
    category: 'marian',
    categoryLabel: 'Solennità Mariana',
    color: 'cyan',
    note: 'Immacolata Concezione della B.V. Maria'
  },
  {
    id: 'cal-2026-12-24',
    isoDate: '2026-12-24T22:00:00',
    dateDisplay: 'Gio. 24/12/2026',
    time: '22:00',
    title: 'Vigilia di Natale - Celebrazione Eucaristica',
    category: 'christmas',
    categoryLabel: 'Natale',
    color: 'emerald',
    note: 'Messa della Notte di Natale'
  },
  {
    id: 'cal-2026-12-25',
    isoDate: '2026-12-25T11:00:00',
    dateDisplay: 'Ven. 25/12/2026',
    time: '11:00',
    title: 'Natale – Celebrazione Eucaristica',
    category: 'christmas',
    categoryLabel: 'Natale',
    color: 'emerald',
    note: 'Messa del Giorno di Natale'
  },
  {
    id: 'cal-2027-01-04',
    isoDate: '2027-01-04T18:30:00',
    dateDisplay: 'Lun. 04/01/2027',
    time: '18:30',
    title: 'Messa Maranathà (Ricordo Paolo)',
    category: 'memorial',
    categoryLabel: 'Messa Comunitaria',
    color: 'blue',
    note: 'Data da confermare (???)'
  },
  {
    id: 'cal-2027-02-14',
    isoDate: '2027-02-14T11:00:00',
    dateDisplay: 'Dom. 14/02/2027',
    time: '11:00',
    title: '1ª Domenica di Quaresima',
    category: 'lent',
    categoryLabel: 'Quaresima',
    color: 'purple',
    note: 'Inizio del cammino quaresimale'
  },
  {
    id: 'cal-2027-03-21',
    isoDate: '2027-03-21T11:00:00',
    dateDisplay: 'Dom. 21/03/2027',
    time: '11:00',
    title: 'Domenica delle Palme',
    category: 'holy_week',
    categoryLabel: 'Settimana Santa',
    color: 'red',
    note: 'Benedizione degli ulivi e Passione del Signore'
  },
  {
    id: 'cal-2027-03-27',
    isoDate: '2027-03-27T21:00:00',
    dateDisplay: 'Sab. 27/03/2027',
    time: '21:00',
    title: 'Sabato Santo – Veglia Pasquale',
    category: 'easter',
    categoryLabel: 'Triduo Pasquale',
    color: 'amber',
    note: 'Solenne Veglia nella notte Santa della Risurrezione'
  },
  {
    id: 'cal-2027-03-28',
    isoDate: '2027-03-28T11:00:00',
    dateDisplay: 'Dom. 28/03/2027',
    time: '11:00',
    title: 'Santa Pasqua – Celebrazione Eucaristica',
    category: 'easter',
    categoryLabel: 'Pasqua',
    color: 'amber',
    note: 'Messa del Giorno di Pasqua di Risurrezione'
  },
  {
    id: 'cal-2027-05-15',
    isoDate: '2027-05-15T21:00:00',
    dateDisplay: 'Sab. 15/05/2027',
    time: '21:00',
    title: 'Veglia di Pentecoste (?)',
    category: 'pentecost',
    categoryLabel: 'Veglia',
    color: 'orange',
    note: 'Data da confermare (?)'
  },
  {
    id: 'cal-2027-05-16',
    isoDate: '2027-05-16T11:00:00',
    dateDisplay: 'Dom. 16/05/2027',
    time: '11:00',
    title: 'Pentecoste',
    category: 'pentecost',
    categoryLabel: 'Solennità',
    color: 'orange',
    note: 'Discesa dello Spirito Santo'
  },
  {
    id: 'cal-2027-05-29',
    isoDate: '2027-05-29T18:30:00',
    dateDisplay: 'Sab. 29/05/2027',
    time: '18:30',
    title: 'Ss. Corpo e Sangue di Cristo',
    category: 'solemnity',
    categoryLabel: 'Corpus Domini',
    color: 'yellow',
    note: 'Solennità del Corpus Domini'
  },
  {
    id: 'cal-2027-06-28',
    isoDate: '2027-06-28T09:30:00',
    dateDisplay: 'Dom. 28/06/2027',
    time: '09:30',
    title: 'Santi Pietro e Paolo',
    category: 'patronal',
    categoryLabel: 'Festa Patronale',
    color: 'indigo',
    note: 'Festa dei Santi Patroni di Noventa Padovana'
  }
];

/**
 * Calcola i prossimi impegni a partire da oggi
 */
export function getUpcomingEvents(now = new Date(), limit = 3) {
  const currentTimestamp = now.getTime();
  
  // Ordina per data cronologica
  const sorted = [...CHOIR_CALENDAR_EVENTS].sort((a, b) => {
    return new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime();
  });

  // Eventi futuri o odierni (entro la fine della giornata)
  const future = sorted.filter(event => {
    const eventTime = new Date(event.isoDate).getTime();
    // Considera evento valido fino a 4 ore dopo l'orario di inizio
    return eventTime + (4 * 60 * 60 * 1000) >= currentTimestamp;
  });

  if (future.length === 0) {
    // Se tutti gli eventi dell'anno sono passati, restituisci gli ultimi per consultazione
    return sorted.slice(-limit);
  }

  return future.slice(0, limit);
}

/**
 * Restituisce una descrizione testuale del conto alla rovescia (es: "Oggi!", "Domani", "Tra 4 giorni")
 */
export function formatEventCountdown(isoDate, now = new Date()) {
  const target = new Date(isoDate);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Concluso';
  }
  if (diffDays === 0) {
    return 'Oggi!';
  }
  if (diffDays === 1) {
    return 'Domani';
  }
  if (diffDays <= 7) {
    return `Tra ${diffDays} giorni`;
  }
  if (diffDays <= 30) {
    const weeks = Math.round(diffDays / 7);
    return `Tra ${weeks} ${weeks === 1 ? 'settimana' : 'settimane'}`;
  }
  const months = Math.round(diffDays / 30);
  return `Tra ${months} ${months === 1 ? 'mese' : 'mesi'}`;
}
