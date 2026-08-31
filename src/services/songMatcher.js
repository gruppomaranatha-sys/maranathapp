import { detectLiturgicalCategory } from './liturgyDetector';

/**
 * Pulisce e decodifica entità HTML nei nomi dei file
 */
export function decodeHtmlEntities(str = '') {
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/**
 * Verifica se un file è valido ed esclude file di sistema, .icloud, file temporanei o che iniziano con punti/simboli
 */
export function isValidSongFile(rawFileName = '') {
  if (!rawFileName) return false;
  const name = rawFileName.trim();

  // Escludi file che iniziano con un punto, tilde, underscore, dollaro o altri simboli non alfabetici
  if (/^[._~$@!#\-+()\[\]\'"&%^*/\\?=;:,]/.test(name)) {
    return false;
  }

  // Escludi estensioni di sistema / cloud ghost
  if (name.endsWith('.icloud') || name.endsWith('.tmp') || name.toLowerCase() === 'desktop.ini' || name.endsWith('.db')) {
    return false;
  }

  // Deve contenere almeno una lettera valida
  if (!/[a-zA-ZàèéìòùÀÈÉÌÒÙ]/.test(name)) {
    return false;
  }

  return true;
}

/**
 * Normalizza il nome del file per estrarre il titolo pulito del canto
 */
export function cleanSongTitle(rawFileName = '') {
  let name = decodeHtmlEntities(rawFileName);

  // Rimuovi estensione file
  name = name.replace(/\.(pdf|docx?|pptx?|ppsx?|key|mp3|m4a|wav|wma|aif|mid|odt|pages|xls|jpe?g|png|webp|gif|bmp|jfif|gdoc)$/i, '');

  // Rimuovi prefissi di sistema o temporanei
  name = name.replace(/^[._~$@!#\-+()\[\]\'"&]+/, '');

  // Rimuovi numeri di traccia o prefissi numerici es: "01 - ", "3 - ", "11 ", "340_", "1_ ", "12."
  name = name.replace(/^\d+[\s\-_.:)]+/, '');

  // Rimuovi ulteriori simboli rimasti all'inizio
  name = name.replace(/^[._~$@!#\-+()\[\]\'"&]+/, '');

  // Rimuovi indicazioni di accordi o tonalità comuni alla fine: " Fa", " in MI", " accordi", " spartito", " testo"
  name = name.replace(/\s+(in\s+[A-Za-z#b]+|Fa|Sol|La|Si|Do|Re|Mi|accordi|spartito|testo|chords|latin|rit)$/i, '');

  // Rimuovi parentesi con autori o versioni secondarie per il titolo principale ma mantienile se utili
  name = name.replace(/\s*\((Fabio Baggio|Gen Rosso|Gen Verde|Dall'Amore di Dio|Gen|Marco Frisina|Frisina|RnS|Kiko|H\.J\. Botor|parisi|W\. Dalla vecchia|Machetta|Lècot-irlandese|Spol)[^)]*\)/gi, '');

  // Pulisci doppi spazi e trim
  name = name.replace(/\s+/g, ' ').trim();

  // Se il nome non inizia con una lettera (es. simboli residui), rimuovili
  name = name.replace(/^[^a-zA-ZàèéìòùÀÈÉÌÒÙ]+/, '');

  // Se il nome è rimasto vuoto, ritorna vuoto
  if (!name) {
    return '';
  }

  // Capitalizza prima lettera di ogni parola in modo gradevole
  return capitalizeTitle(name);
}

/**
 * Capitalizza in modo pulito il titolo
 */
function capitalizeTitle(str) {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => {
      if (!word) return '';
      // Parole minori in minuscolo se non all'inizio
      const lower = word.toLowerCase();
      const minorWords = ['di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una', 'del', 'della', 'dello', 'dei', 'degli', 'delle', 'al', 'alla', 'allo', 'ai', 'agli', 'alle', 'nel', 'nella', 'nello', 'nei', 'negli', 'nelle', 'sul', 'sulla', 'e', 'ed', 'o', 'od'];
      if (minorWords.includes(lower)) {
        return lower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace(/^[a-z]/, char => char.toUpperCase()); // la prima lettera sempre maiuscola
}

/**
 * Genera una chiave slug per il raggruppamento
 */
export function getGroupingKey(rawFileName = '') {
  const clean = cleanSongTitle(rawFileName).toLowerCase();
  if (!clean) return '';
  // Rimuovi punteggiatura e spazi per un confronto solido
  return clean
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Rimuove accenti per match uniforme (es. maranatha = maranathà)
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Determina il tipo di risorsa da estensione o mime
 */
export function getFileType(fileName = '') {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['mp3', 'm4a', 'wav', 'wma', 'aif', 'mid', 'ogg', 'aac'].includes(ext)) return 'audio';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'jfif'].includes(ext)) return 'image';
  if (['doc', 'docx', 'odt', 'pages', 'txt', 'rtf', 'gdoc'].includes(ext)) return 'doc';
  if (['ppt', 'pptx', 'pps', 'ppsx', 'key'].includes(ext)) return 'slides';
  return 'other';
}

/**
 * Raggruppa i file delle 4 cartelle in un elenco unificato di canti
 */
export function groupFilesIntoSongs(rawFiles = [], customTags = {}) {
  const songMap = new Map();

  rawFiles.forEach(file => {
    // Filtra file non validi o che iniziano con punti/simboli
    if (!isValidSongFile(file.name)) return;

    const cleanedTitle = cleanSongTitle(file.name);
    if (!cleanedTitle) return;

    const groupKey = getGroupingKey(file.name);
    if (!groupKey) return;

    const fileType = getFileType(file.name);

    if (!songMap.has(groupKey)) {
      const firstLetterNorm = cleanedTitle.charAt(0).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const letter = /^[A-Z]$/.test(firstLetterNorm) ? firstLetterNorm : 'A';
      const detectedCat = customTags[groupKey] || detectLiturgicalCategory(cleanedTitle);

      songMap.set(groupKey, {
        id: groupKey,
        title: cleanedTitle,
        initialLetter: letter,
        category: detectedCat,
        files: [],
        scores: [],
        images: [],
        audio: [],
        slides: [],
        hasPdf: false,
        hasDoc: false,
        hasImage: false,
        hasMp3: false,
        hasPpt: false,
        hasOther: false
      });
    }

    const song = songMap.get(groupKey);
    const enrichedFile = {
      ...file,
      fileType,
      cleanName: decodeHtmlEntities(file.name)
    };

    song.files.push(enrichedFile);

    if (fileType === 'pdf') {
      song.scores.push(enrichedFile);
      song.hasPdf = true;
    } else if (fileType === 'doc') {
      song.scores.push(enrichedFile);
      song.hasDoc = true;
    } else if (fileType === 'image') {
      song.images.push(enrichedFile);
      song.hasImage = true;
      // Tratta anche come spartito visivo
      song.scores.push(enrichedFile);
    } else if (fileType === 'audio') {
      song.audio.push(enrichedFile);
      song.hasMp3 = true;
    } else if (fileType === 'slides') {
      song.slides.push(enrichedFile);
      song.hasPpt = true;
    } else {
      song.hasOther = true;
    }
  });

  // Converti a array e ordina alfabeticamente per titolo
  const songs = Array.from(songMap.values()).sort((a, b) => 
    a.title.localeCompare(b.title, 'it', { sensitivity: 'base' })
  );

  return songs;
}
