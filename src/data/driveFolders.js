// Configurazioni cartelle Google Drive del Coro
export const DRIVE_FOLDERS = {
  testi_A_L: {
    id: '1YCCjs5Ee2xDbrjjLwTLl9Z4r1Z_3bGDB',
    name: 'Testi e spartiti A-L',
    type: 'score_lyrics',
    icon: 'FileText',
    color: 'emerald',
    url: 'https://drive.google.com/drive/folders/1YCCjs5Ee2xDbrjjLwTLl9Z4r1Z_3bGDB'
  },
  testi_M_Z: {
    id: '1gmM9nIrfM0YlUm3ZmNhjkJvGJNMmiBrU',
    name: 'Testi e spartiti M-Z',
    type: 'score_lyrics',
    icon: 'FileText',
    color: 'emerald',
    url: 'https://drive.google.com/drive/folders/1gmM9nIrfM0YlUm3ZmNhjkJvGJNMmiBrU'
  },
  canti_mp3: {
    id: '1SfSnnlvIhTXVvV8OjETiuqVTUP1synYX',
    name: 'Canti MP3',
    type: 'audio',
    icon: 'Headphones',
    color: 'blue',
    url: 'https://drive.google.com/drive/folders/1SfSnnlvIhTXVvV8OjETiuqVTUP1synYX'
  },
  proiezioni_ppt: {
    id: '1gADAsBT7J3oVo56bRdjvn4sKclrU4gc_',
    name: 'Presentazioni PPT',
    type: 'slides',
    icon: 'Presentation',
    color: 'amber',
    url: 'https://drive.google.com/drive/folders/1gADAsBT7J3oVo56bRdjvn4sKclrU4gc_'
  }
};

// Categorie e Momenti Liturgici con colori e icone
export const LITURGICAL_CATEGORIES = [
  { id: 'all', label: 'Tutti i canti', icon: 'Sparkles', color: 'slate' },
  { id: 'ingresso', label: 'Ingresso', icon: 'DoorOpen', color: 'blue' },
  { id: 'kyrie_gloria', label: 'Kyrie & Gloria', icon: 'Flame', color: 'amber' },
  { id: 'salmo_alleluia', label: 'Salmo & Alleluia', icon: 'BookOpen', color: 'indigo' },
  { id: 'offertorio', label: 'Offertorio', icon: 'Gift', color: 'emerald' },
  { id: 'santo', label: 'Santo & Acclamazioni', icon: 'Crown', color: 'yellow' },
  { id: 'pace', label: 'Pace & Agnello di Dio', icon: 'HeartHandshake', color: 'teal' },
  { id: 'comunione', label: 'Comunione & Adorazione', icon: 'Wine', color: 'rose' },
  { id: 'congedo', label: 'Finale & Ringraziamento', icon: 'Send', color: 'purple' },
  { id: 'mariani', label: 'Canti Mariani', icon: 'Star', color: 'cyan' },
  { id: 'spirito', label: 'Spirito Santo', icon: 'Wind', color: 'orange' },
  { id: 'tempi_forti', label: 'Avvento, Natale, Quaresima, Pasqua', icon: 'Calendar', color: 'violet' },
  { id: 'vari', label: 'Altri Canti', icon: 'Music', color: 'slate' }
];

// Helper per generare URL di Google Drive
export function getDrivePreviewUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function getDriveViewUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
}

export function getDriveDownloadUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

export function getDriveDirectAudioUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}
