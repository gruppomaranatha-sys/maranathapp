# -*- coding: utf-8 -*-
import urllib.request
import re
import html
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

file_pattern = re.compile(
    r'<a\s+href="https://drive\.google\.com/file/d/([a-zA-Z0-9_-]+)/view\?usp=drive_web"[^>]*>.*?'
    r'<div\s+class="flip-entry-title">([^<]+)</div>',
    re.DOTALL
)

folder_pattern = re.compile(
    r'<a\s+href="https://drive\.google\.com/drive/folders/([a-zA-Z0-9_-]+)"[^>]*>.*?'
    r'<div\s+class="flip-entry-title">([^<]+)</div>',
    re.DOTALL
)

def get_mime_type(filename):
    ext = filename.split('.')[-1].lower() if '.' in filename else ''
    if ext == 'mp3':
        return 'audio/mpeg'
    elif ext == 'pdf':
        return 'application/pdf'
    elif ext in ['doc', 'docx']:
        return 'application/msword'
    elif ext in ['ppt', 'pptx']:
        return 'application/vnd.ms-powerpoint'
    elif ext == 'key':
        return 'application/x-iwork-keynote-sffkey'
    elif ext in ['jpg', 'jpeg']:
        return 'image/jpeg'
    elif ext == 'png':
        return 'image/png'
    return 'application/octet-stream'

def fetch_folder_recursive(folder_id, folder_key, folder_name, folder_type, seen_ids, visited=None):
    if visited is None:
        visited = set()
    if folder_id in visited:
        return []
    visited.add(folder_id)

    url = f"https://drive.google.com/embeddedfolderview?id={folder_id}#list"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {folder_id} ({folder_name}): {e}")
        return []

    results = []
    for fid, name in file_pattern.findall(content):
        name = html.unescape(name.strip())
        if name.startswith('~$') or name == 'desktop.ini':
            continue
        if fid not in seen_ids:
            seen_ids.add(fid)
            results.append({
                'id': fid,
                'name': name,
                'mimeType': get_mime_type(name),
                'folder_key': folder_key,
                'folder_name': folder_name,
                'category': folder_type
            })

    # Recurse into subfolders for MP3, A-L, M-Z
    if folder_key in ['canti_mp3', 'testi_A_L', 'testi_M_Z']:
        for sub_id, sub_name in folder_pattern.findall(content):
            sub_name = html.unescape(sub_name.strip())
            print(f"  Recursing into: {sub_name}")
            results.extend(fetch_folder_recursive(sub_id, folder_key, folder_name, folder_type, seen_ids, visited))

    return results

def run_sync():
    catalog_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "data", "initialCatalog.json"))
    existing_catalog = []
    if os.path.exists(catalog_path):
        with open(catalog_path, 'r', encoding='utf-8') as f:
            existing_catalog = json.load(f)

    existing_by_id = {item['id']: item for item in existing_catalog}
    print(f"Current initialCatalog items: {len(existing_catalog)}")

    web_items = []
    seen_ids = set()

    for key in ['testi_A_L', 'testi_M_Z', 'canti_mp3']:
        finfo = folders[key]
        print(f"\nSincronizzazione cartella '{finfo['name']}' da Google Drive Web...")
        items = fetch_folder_recursive(finfo['id'], key, finfo['name'], finfo['type'], seen_ids)
        print(f"  Trovati {len(items)} file in {finfo['name']}")
        web_items.extend(items)

    # PPT items preservation
    ppt_items = [item for item in existing_catalog if item.get('folder_key') == 'proiezioni_ppt']
    print(f"\nConservati {len(ppt_items)} file PPT dal catalogo esistente")

    new_items_count = 0
    updated_items_count = 0
    merged_catalog = []

    for item in web_items:
        fid = item['id']
        if fid in existing_by_id:
            prev = existing_by_id[fid]
            item['size'] = prev.get('size', 0)
            if '.' not in item['name'] and '.' in prev['name']:
                item['name'] = prev['name']
                item['mimeType'] = prev['mimeType']
            if prev['name'] != item['name']:
                print(f"  ~ Nome aggiornato: '{prev['name']}' -> '{item['name']}'")
                updated_items_count += 1
        else:
            item['size'] = 0
            print(f"  + NUOVO FILE AGGIUNTO: {item['name']} ({item['id']})")
            new_items_count += 1
        merged_catalog.append(item)

    merged_catalog.extend(ppt_items)

    with open(catalog_path, 'w', encoding='utf-8') as f:
        json.dump(merged_catalog, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Catalogo aggiornato con successo in {catalog_path}!")
    print(f"  Totale file: {len(merged_catalog)} (Nuovi: {new_items_count}, Modificati: {updated_items_count})")

if __name__ == '__main__':
    run_sync()
