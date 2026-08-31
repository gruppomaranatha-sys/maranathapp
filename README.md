# 🎵 Coro Canti & Spartiti Hub (Google Drive Integration)

Una Web App moderna, reattiva e completa progettata per cori parrocchiali, gruppi musicali e animatori liturgici. Indicizza e organizza tutti i file da Google Drive (Spartiti PDF, Testi DOC, Brani MP3 e Proiezioni PPT/Key) in un unico catalogo unificato.

---

## ✨ Funzionalità Principali

### 1. 📂 Unione Automatica e Catalogo Unificato A-Z
- Le cartelle separate su Drive (**Testi e spartiti A-L** e **M-Z**) appaiono unite in un unico elenco alfabetico A-Z.
- **Raggruppamento Intelligente per Canto**: file con lo stesso titolo (es. *Acqua siamo noi.doc*, *Acqua Siamo Noi.mp3*, *Acqua siamo noi.ppt*) vengono uniti automaticamente sotto la stessa Scheda Canto con badge per ogni risorsa disponibile.

### 2. 🔍 Ricerca e Filtri Avanzati
- **Ricerca istantanea** per titolo, testo o parole chiave.
- **Barra Alfabetica A-Z**: salto rapido alla lettera desiderata.
- **Filtro Momento Liturgico**: Ingresso, Kyrie/Gloria, Salmo/Alleluia, Offertorio, Santo, Pace, Comunione, Canto Finale, Mariani, Spirito Santo, Tempi Forti (Avvento, Natale, Quaresima, Pasqua).
- **Filtri Risorse Media**: Solo con Audio MP3 🎧, Solo con Spartito PDF 📄, Solo con Testo Word 📝, Solo con Slide PPT 📽️.
- **Personalizzazione Tag**: Possibilità di modificare la categoria liturgica di qualsiasi canto.

### 3. 🎧 Player Audio Integrato (Streaming da Drive)
- Mini-player fisso in basso con controlli Play/Pause, barra di scorrimento (scrubbing), loop continuo.
- **Regolazione Velocità (0.75x, 0.9x, 1x, 1.25x, 1.5x)**: utilissimo per il coro durante le prove per studiare le voci (soprani, contralti, tenori, bassi).
- Playlist continua attraverso i brani filtrati.

### 4. 📄 Visualizzatore Spartiti & Documenti a Schermo Intero
- Visualizzazione immediata di spartiti PDF e documenti Office tramite Google Drive Preview.
- Modalità a tutto schermo ideale per tablet sui leggii e smartphone.
- Download rapido con 1 click o apertura diretta nella cartella Drive.

### 5. 📋 Gestione Scaletta Messa & Modalità Live
- Componi e salva le scalette per le Messe domenicali o i concerti (Ingresso, Alleluia, Offertorio, Santo, Comunione, Finale).
- **Condivisione su WhatsApp**: invia l'elenco dei canti formattato alla chat del coro con un click.
- **Modalità Messa (Live Performance)**: vista sequenziale a schermo intero senza distrazioni per scorrere i canti e visualizzare gli spartiti durante la celebrazione.

### 6. 🔄 Sincronizzazione Google Drive (100% Gratuita e Illimitata)
- Il catalogo viene fornito con una pre-indicizzazione iniziale per funzionare subito anche offline.
- Per sincronizzare automaticamente nuovi canti caricati su Drive:
  1. Apri le **Impostazioni ⚙️** nell'app.
  2. Copia il codice presente nel file [`google_apps_script.js`](./google_apps_script.js).
  3. Incollalo su [script.google.com](https://script.google.com) e pubblicalo come *Applicazione Web*.
  4. Incolla l'URL generato nell'app e clicca **Sincronizza**!

---

## 🚀 Avvio dell'Applicazione

### Prerequisiti
- [Node.js](https://nodejs.org/) (già installato)

### Comandi
```bash
# Avvio server di sviluppo
npm run dev

# Compilazione per la produzione
npm run build
```

L'app si aprirà all'indirizzo: **`http://localhost:3000`**

---

## 📁 Struttura Cartelle Google Drive Collegate
1. **Testi e spartiti A-L**: `1YCCjs5Ee2xDbrjjLwTLl9Z4r1Z_3bGDB`
2. **Testi e spartiti M-Z**: `1gmM9nIrfM0YlUm3ZmNhjkJvGJNMmiBrU`
3. **Canti MP3**: `1SfSnnlvIhTXVvV8OjETiuqVTUP1synYX`
4. **Presentazioni PPT**: `1gADAsBT7J3oVo56bRdjvn4sKclrU4gc_`
