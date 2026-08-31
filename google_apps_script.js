/**
 * =========================================================================
 * GOOGLE APPS SCRIPT PER "CORO CANTI & SPARTITI HUB"
 * =========================================================================
 * 
 * ISTRUZIONI DI INSTALLAZIONE RAPIDA (1 minuto):
 * 
 * 1. Vai su https://script.google.com e clicca su "Nuovo progetto".
 * 2. Cancella tutto il codice presente nell'editor e incolla QUESTO intero file.
 * 3. Clicca su "Salva" (icona del dischetto) in alto.
 * 4. Clicca sul pulsante blu in alto a destra "Esegui distribuzione" (Deploy) -> "Nuova distribuzione".
 * 5. Seleziona tipo: "Applicazione web" (Web App).
 * 6. Imposta:
 *    - Descrizione: "API Canti Coro"
 *    - Esegui come: "Utente corrente" (Me)
 *    - Chi può accedere: "Chiunque" (Anyone) -> *importante affinché la web app possa leggere la lista*
 * 7. Clicca su "Distribuisci" (Deploy), autorizza l'accesso al tuo Google Drive se richiesto.
 * 8. Copia l'URL dell'applicazione web fornito (es: https://script.google.com/macros/s/.../exec).
 * 9. Incolla questo URL nella tua Web App del Coro in: Impostazioni ⚙️ -> "URL Google Apps Script".
 * 
 * FATTO! Ora ogni volta che aggiungi un nuovo file nel Drive, basta cliccare "Sincronizza" nell'app!
 */

function doGet(e) {
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
        Logger.log('Errore nella lettura della cartella ' + folderInfo.name + ': ' + err.toString());
      }
    }

    var response = {
      status: 'success',
      totalFiles: allFiles.length,
      updatedAt: new Date().toISOString(),
      files: allFiles
    };

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function scanFolderRecursively(folder, folderInfo, folderKey, results) {
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    // Ignora file di sistema o temporanei
    if (file.getName().indexOf('~$') === 0) continue;

    results.push({
      id: file.getId(),
      name: file.getName(),
      mimeType: file.getMimeType(),
      size: file.getSize(),
      dateModified: file.getLastUpdated().toISOString(),
      folder_key: folderKey,
      folder_name: folderInfo.name,
      category: folderInfo.type,
      webViewLink: file.getUrl(),
      webContentLink: 'https://drive.google.com/uc?export=download&id=' + file.getId()
    });
  }

  // Scansiona anche eventuali sottocartelle (es. "Messa di Natale", "Canti Matrimonio", ecc.)
  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    var subfolder = subfolders.next();
    scanFolderRecursively(subfolder, folderInfo, folderKey, results);
  }
}
