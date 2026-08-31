/**
 * Riconosce automaticamente il momento liturgico o la categoria del canto
 * in base al titolo o a parole chiave comuni nei canti di chiesa.
 */
export function detectLiturgicalCategory(title = '') {
  const t = title.toLowerCase();

  // Kyrie & Gloria
  if (t.includes('kyrie') || t.includes('signore pieta') || t.includes('signore pietà') || t.includes('gloria')) {
    return 'kyrie_gloria';
  }

  // Salmo & Alleluia
  if (t.includes('alleluia') || t.includes('aleluia') || t.includes('canto al vangelo') || t.includes('salmo') || t.includes('lode a te o cristo')) {
    return 'salmo_alleluia';
  }

  // Santo & Acclamazioni
  if (t.includes('santo') || t.includes('sanctus') || t.includes('hosanna') || t.includes('osanna')) {
    return 'santo';
  }

  // Pace & Agnello di Dio
  if (t.includes('agnello di dio') || t.includes('agnus dei') || t.includes('pace') || t.includes('shalo') || t.includes('segno di pace') || t.includes('pace a te')) {
    return 'pace';
  }

  // Offertorio
  if (t.includes('offertorio') || t.includes('accetta questo pane') || t.includes('ecco quel che abbiamo') || 
      t.includes('benedetto tu signore') || t.includes('guarda questa offerta') || t.includes('i frutti della terra') ||
      t.includes('nostro pane') || t.includes('sull\'altare') || t.includes('sull altare') || t.includes('ti offriamo')) {
    return 'offertorio';
  }

  // Comunione & Adorazione
  if (t.includes('pane del cielo') || t.includes('pane di vita') || t.includes('pane vivo') || t.includes('adoro te') ||
      t.includes('anima christi') || t.includes('anima di cristo') || t.includes('mistero della fede') ||
      t.includes('resti con noi') || t.includes('sei tu signore il pane') || t.includes('tu sei la mia vita') ||
      t.includes('come la cerva') || t.includes('comunione') || t.includes('mio pastore') || t.includes('il signore è il mio pastore') ||
      t.includes('gustate e vedete') || t.includes('tu fonte viva')) {
    return 'comunione';
  }

  // Canti Mariani
  if (t.includes('maria') || t.includes('madonna') || t.includes('madre') || t.includes('ave') || 
      t.includes('magnificat') || t.includes('salve regina') || t.includes('vergine') || t.includes('immacolata') ||
      t.includes('donna dell\'attesa') || t.includes('sub tuum praesidium') || t.includes('mistero mariano')) {
    return 'mariani';
  }

  // Spirito Santo
  if (t.includes('spirito') || t.includes('ruah') || t.includes('effondi') || t.includes('vieni spirito') ||
      t.includes('soffio') || t.includes('fuoco') || t.includes('paraclito') || t.includes('pentecoste')) {
    return 'spirito';
  }

  // Tempi Forti (Avvento, Natale, Quaresima, Pasqua)
  if (t.includes('maranatha') || t.includes('maranathà') || t.includes('avvento') || t.includes('natale') ||
      t.includes('notte di luce') || t.includes('tu scendi dalle stelle') || t.includes('astro del ciel') ||
      t.includes('quaresima') || t.includes('croce') || t.includes('pasqua') || t.includes('risorto') || 
      t.includes('resurrezione') || t.includes('vittoria') || t.includes('luce del mondo') || t.includes('cantico dei redenti')) {
    return 'tempi_forti';
  }

  // Ingresso
  if (t.includes('ingresso') || t.includes('popolo') || t.includes('chiesa') || t.includes('andate per le strade') ||
      t.includes('acqua siamo noi') || t.includes('cantate al signore') || t.includes('venite applaudiamo') ||
      t.includes('radunati nel tuo nome') || t.includes('casa del signore') || t.includes('camminiamo')) {
    return 'ingresso';
  }

  // Congedo / Finale
  if (t.includes('congedo') || t.includes('fine') || t.includes('finale') || t.includes('ringraziamento') ||
      t.includes('servire') || t.includes('testimoni') || t.includes('annunceremo') || t.includes('giorno di festa') ||
      t.includes('benedici il signore') || t.includes('inno di lode')) {
    return 'congedo';
  }

  return 'vari';
}

export function getCategoryBadge(categoryId) {
  const map = {
    ingresso: { label: 'Ingresso', bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
    kyrie_gloria: { label: 'Kyrie & Gloria', bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
    salmo_alleluia: { label: 'Salmo & Alleluia', bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
    offertorio: { label: 'Offertorio', bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
    santo: { label: 'Santo', bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-800 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800' },
    pace: { label: 'Pace', bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
    comunione: { label: 'Comunione', bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
    congedo: { label: 'Finale', bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
    mariani: { label: 'Mariano', bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
    spirito: { label: 'Spirito Santo', bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
    tempi_forti: { label: 'Tempo Forte', bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800' },
    vari: { label: 'Canto', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' }
  };
  return map[categoryId] || map.vari;
}
