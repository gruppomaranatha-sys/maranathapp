import { DRIVE_FOLDERS } from '../data/driveFolders';

const STORAGE_KEYS = {
  CATALOG: 'coro_app_catalog',
  CUSTOM_TAGS: 'coro_app_custom_tags',
  SCALETTE: 'coro_app_scalette',
  FAVORITES: 'coro_app_favorites',
  SETTINGS: 'coro_app_settings',
  LAST_SYNC: 'coro_app_last_sync'
};

/**
 * Ottiene URL per lo streaming audio diretto da Google Drive
 */
export function getAudioStreamUrl(fileId) {
  // Google Drive direct download URL acts as direct audio stream
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Ottiene URL per l'anteprima del documento in iframe
 */
export function getDocumentPreviewUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Ottiene URL per il download forzato
 */
export function getDownloadUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Ottiene URL per aprire il file direttamente nella UI di Google Drive
 */
export function getDriveOpenUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
}

/**
 * Carica le impostazioni salvate (Apps Script URL, Drive API Key, ecc.)
 */
export function getAppSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      appsScriptUrl: '',
      apiKey: '',
      autoSync: false
    };
  } catch (e) {
    console.error('Error loading settings', e);
    return { appsScriptUrl: '', apiKey: '', autoSync: false };
  }
}

/**
 * Salva le impostazioni
 */
export function saveAppSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

/**
 * Sincronizza i file da Google Apps Script Web App
 */
export async function syncFromAppsScript(appsScriptUrl) {
  if (!appsScriptUrl) {
    throw new Error('URL di Google Apps Script non configurato');
  }

  const response = await fetch(appsScriptUrl);
  if (!response.ok) {
    throw new Error(`Errore durante il recupero da Apps Script: ${response.statusText}`);
  }

  const data = await response.json();
  if (Array.isArray(data)) {
    saveCatalogToStorage(data);
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    return data;
  } else if (data.files && Array.isArray(data.files)) {
    saveCatalogToStorage(data.files);
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    return data.files;
  }
  throw new Error('Formato dati non valido ricevuto da Google Apps Script');
}

/**
 * Sincronizza i file usando Google Drive API v3 (con API Key)
 */
export async function syncFromDriveApi(apiKey) {
  if (!apiKey) {
    throw new Error('API Key di Google Drive non configurata');
  }

  const allFiles = [];
  const folderEntries = Object.entries(DRIVE_FOLDERS);

  for (const [key, folderInfo] of folderEntries) {
    let pageToken = null;
    do {
      let url = `https://www.googleapis.com/drive/v3/files?q='${folderInfo.id}'+in+parents+and+trashed=false&fields=nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink)&pageSize=100&key=${apiKey}`;
      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Errore per la cartella ${folderInfo.name}`);
      }

      const json = await res.json();
      if (json.files) {
        json.files.forEach(f => {
          allFiles.push({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType,
            size: f.size ? parseInt(f.size, 10) : 0,
            dateModified: f.modifiedTime,
            folder_key: key,
            folder_name: folderInfo.name,
            category: folderInfo.type
          });
        });
      }
      pageToken = json.nextPageToken;
    } while (pageToken);
  }

  saveCatalogToStorage(allFiles);
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  return allFiles;
}

/**
 * Salva catalogo raw su LocalStorage
 */
export function saveCatalogToStorage(files) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(files));
  } catch (e) {
    console.error('Failed to cache catalog in LocalStorage', e);
  }
}

/**
 * Carica catalogo raw da LocalStorage
 */
export function loadCatalogFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATALOG);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load cached catalog', e);
    return null;
  }
}

/**
 * Gestione Preferiti
 */
export function getFavoriteSongIds() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function toggleFavoriteSongId(songId) {
  const favorites = getFavoriteSongIds();
  const index = favorites.indexOf(songId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(songId);
  }
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  return favorites;
}

/**
 * Gestione Scalette
 */
export function getSavedScalette() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCALETTE);
    return data ? JSON.parse(data) : [
      {
        id: 'default_messa',
        name: 'Messa Domenicale (Esempio)',
        date: new Date().toISOString().split('T')[0],
        items: [
          { moment: 'ingresso', label: 'Canto d\'Ingresso', songId: '', songTitle: '' },
          { moment: 'kyrie_gloria', label: 'Gloria', songId: '', songTitle: '' },
          { moment: 'salmo_alleluia', label: 'Alleluia', songId: '', songTitle: '' },
          { moment: 'offertorio', label: 'Offertorio', songId: '', songTitle: '' },
          { moment: 'santo', label: 'Santo', songId: '', songTitle: '' },
          { moment: 'pace', label: 'Pace / Agnello', songId: '', songTitle: '' },
          { moment: 'comunione', label: 'Comunione', songId: '', songTitle: '' },
          { moment: 'congedo', label: 'Canto Finale', songId: '', songTitle: '' }
        ]
      }
    ];
  } catch (e) {
    return [];
  }
}

export function saveScalette(scalette) {
  localStorage.setItem(STORAGE_KEYS.SCALETTE, JSON.stringify(scalette));
}

/**
 * Gestione Tag Personalizzati Canti
 */
export function getCustomTags() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_TAGS);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export function saveCustomTag(songId, category) {
  const tags = getCustomTags();
  tags[songId] = category;
  localStorage.setItem(STORAGE_KEYS.CUSTOM_TAGS, JSON.stringify(tags));
  return tags;
}
