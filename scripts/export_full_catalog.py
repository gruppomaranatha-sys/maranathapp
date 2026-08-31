# -*- coding: utf-8 -*-
import sqlite3
import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

db_path = r'C:\Users\Utente10\AppData\Local\Google\DriveFS\103863352028437929737\metadata_sqlite_db'
conn = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
cursor = conn.cursor()

folder_cloud_ids = {
    '1YCCjs5Ee2xDbrjjLwTLl9Z4r1Z_3bGDB': {'key': 'testi_A_L', 'name': 'Testi e spartiti A-L', 'type': 'score_lyrics'},
    '1gmM9nIrfM0YlUm3ZmNhjkJvGJNMmiBrU': {'key': 'testi_M_Z', 'name': 'Testi e spartiti M-Z', 'type': 'score_lyrics'},
    '1SfSnnlvIhTXVvV8OjETiuqVTUP1synYX': {'key': 'canti_mp3', 'name': 'Canti MP3', 'type': 'audio'},
    '1gADAsBT7J3oVo56bRdjvn4sKclrU4gc_': {'key': 'proiezioni_ppt', 'name': 'Presentazioni PPT', 'type': 'slides'}
}

folder_map = {}
for cloud_id, info in folder_cloud_ids.items():
    cursor.execute("SELECT stable_id, id, local_title FROM items WHERE id = ?", (cloud_id,))
    row = cursor.fetchone()
    if row:
        folder_map[row[0]] = {**info, 'cloud_id': cloud_id}

all_files = []
seen_ids = set()

def get_children(parent_stable_id, folder_key, folder_name, folder_type):
    cursor.execute("""
        SELECT i.stable_id, i.id, i.local_title, i.mime_type, i.file_size, i.is_folder, i.modified_date
        FROM items i
        JOIN stable_parents p ON i.stable_id = p.item_stable_id
        WHERE p.parent_stable_id = ? AND i.trashed = 0 AND i.is_tombstone = 0
    """, (parent_stable_id,))
    children = cursor.fetchall()
    
    for c in children:
        stable_id, cloud_id, name, mime, size, is_folder, mod_date = c
        if not name or name.startswith('~$') or name == 'desktop.ini':
            continue
            
        if is_folder:
            get_children(stable_id, folder_key, folder_name, folder_type)
        else:
            if cloud_id and cloud_id not in seen_ids:
                seen_ids.add(cloud_id)
                # Normalize MIME type if needed
                ext = name.split('.')[-1].lower() if '.' in name else ''
                final_mime = mime
                if ext == 'mp3':
                    final_mime = 'audio/mpeg'
                elif ext == 'pdf':
                    final_mime = 'application/pdf'
                elif ext in ['doc', 'docx']:
                    final_mime = 'application/msword'
                elif ext in ['ppt', 'pptx']:
                    final_mime = 'application/vnd.ms-powerpoint'
                elif ext == 'key':
                    final_mime = 'application/x-iwork-keynote-sffkey'

                all_files.append({
                    'id': cloud_id,
                    'name': name,
                    'mimeType': final_mime or 'application/octet-stream',
                    'size': size or 0,
                    'folder_key': folder_key,
                    'folder_name': folder_name,
                    'category': folder_type
                })

for s_id, f_info in folder_map.items():
    get_children(s_id, f_info['key'], f_info['name'], f_info['type'])

conn.close()

output_path = r"c:\Users\Utente10\Desktop\App Inoxtubi\Canti\src\data\initialCatalog.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(all_files, f, ensure_ascii=False, indent=2)

print(f"Successfully exported {len(all_files)} total files to {output_path}!")

# Print stats
cat_counts = {}
for f in all_files:
    cat_counts[f['folder_name']] = cat_counts.get(f['folder_name'], 0) + 1

for cat, count in cat_counts.items():
    print(f"  - {cat}: {count} files")
