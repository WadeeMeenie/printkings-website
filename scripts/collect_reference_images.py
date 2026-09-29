#!/usr/bin/env python3
import hashlib
import json
import mimetypes
import shutil
import subprocess
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path('/home/ubuntu/printkings-website')
AUDIT = ROOT / 'audit'
CACHE = AUDIT / 'reference-images'
CANDIDATES = json.loads((AUDIT / 'image-visual-qa-candidates.json').read_text())
CACHE.mkdir(parents=True, exist_ok=True)

unique_urls = sorted({row['selected_reference_image_url'] for row in CANDIDATES if row['selected_reference_image_url']})
manifest = []
for index, url in enumerate(unique_urls, start=1):
    parsed = urlparse(url)
    source_name = Path(parsed.path).name
    suffix = Path(source_name).suffix.lower() or '.bin'
    digest = hashlib.sha256(url.encode()).hexdigest()[:12]
    target = CACHE / f'{index:02d}-{digest}{suffix}'
    result = subprocess.run([
        'curl', '--fail', '--location', '--silent', '--show-error', '--max-time', '60',
        '--user-agent', 'PrintKingsCatalogueAudit/1.0 (+https://github.com/WadeeMeenie/printkings-website)',
        '--output', str(target), url
    ], text=True, capture_output=True)
    if result.returncode:
        target.unlink(missing_ok=True)
        manifest.append({'source_url': url, 'cache_path': '', 'download_ok': False, 'error': result.stderr.strip()})
        continue
    detected = subprocess.run(['file', '--brief', '--mime-type', str(target)], text=True, capture_output=True).stdout.strip()
    manifest.append({'source_url': url, 'cache_path': str(target), 'download_ok': True, 'mime_type': detected, 'source_name': source_name})

(AUDIT / 'reference-image-collection-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps({'unique_source_urls': len(unique_urls), 'downloaded': sum(x['download_ok'] for x in manifest), 'failed': sum(not x['download_ok'] for x in manifest)}, indent=2))
for entry in manifest:
    print(('OK ' if entry['download_ok'] else 'FAIL ') + entry['source_url'] + ' -> ' + entry.get('cache_path', entry.get('error', '')))
