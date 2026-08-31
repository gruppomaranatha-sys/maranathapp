# -*- coding: utf-8 -*-
import urllib.request
import re
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

folders = {
    'testi_A_L': {'id': '1YCCjs5Ee2xDbrjjLwTLl9Z4r1Z_3bGDB', 'name': 'Testi e spartiti A-L', 'type': 'score_lyrics'},
    'testi_M_Z': {'id': '1gmM9nIrfM0YlUm3ZmNhjkJvGJNMmiBrU', 'name': 'Testi e spartiti M-Z', 'type': 'score_lyrics'},
    'canti_mp3': {'id': '1SfSnnlvIhTXVvV8OjETiuqVTUP1synYX', 'name': 'Canti MP3', 'type': 'audio'},
    'proiezioni_ppt': {'id': '1gADAsBT7J3oVo56bRdjvn4sKclrU4gc_', 'name': 'Presentazioni PPT', 'type': 'slides'}
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

all_files = []
seen_ids = set()

for key, f_info in folders.items():
    fid = f_info['id']
    url = f'https://drive.google.com/drive/folders/{fid}'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            
            # Pattern 1: data-id="..." ... <strong class="DNoYtb">...</strong>
            matches1 = re.finditer(r'data-id="(?P<id>[a-zA-Z0-9_-]{20,50})"[^>]*>.*?<strong[^>]*>(?P<name>[^<]+)</strong>', html, re.DOTALL)
            count = 0
            for m in matches1:
                file_id = m.group('id')
                file_name = m.group('name').strip()
                if file_id not in seen_ids and file_name:
                    seen_ids.add(file_id)
                    all_files.append({
                        'id': file_id,
                        'name': file_name,
                        'folder_key': key,
                        'folder_name': f_info['name'],
                        'category': f_info['type'],
                        'mimeType': 'audio/mpeg' if file_name.endswith('.mp3') else ('application/pdf' if file_name.endswith('.pdf') else 'application/octet-stream')
                    })
                    count += 1

            # Pattern 2: aria-label="([^"]+)" ... data-id="([a-zA-Z0-9_-]+)"
            matches2 = re.finditer(r'aria-label="(?P<name>[^"]+?)\s+(?:Microsoft Word|PDF|Audio|Keynote|Presentation|Document|Shared)[^"]*"\s+data-handled-by-drag-and-drop="true"[^>]*>.*?data-id="(?P<id>[a-zA-Z0-9_-]{20,50})"', html, re.DOTALL)
            for m in matches2:
                file_id = m.group('id')
                file_name = m.group('name').strip()
                if file_id not in seen_ids and file_name:
                    seen_ids.add(file_id)
                    all_files.append({
                        'id': file_id,
                        'name': file_name,
                        'folder_key': key,
                        'folder_name': f_info['name'],
                        'category': f_info['type'],
                        'mimeType': 'audio/mpeg' if file_name.endswith('.mp3') else ('application/pdf' if file_name.endswith('.pdf') else 'application/octet-stream')
                    })
                    count += 1

            print(f"Extracted {count} files for {f_info['name']}")
    except Exception as e:
        print(f"Error fetching {key}: {e}")

output_dir = r"c:\Users\Utente10\Desktop\App Inoxtubi\Canti\src\data"
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "initialCatalog.json")

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(all_files, f, ensure_ascii=False, indent=2)

print(f"Total files saved to {output_path}: {len(all_files)}")
