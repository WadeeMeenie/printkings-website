#!/usr/bin/env python3
import csv
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urlparse

import numpy as np
from PIL import Image

ROOT = Path('/home/ubuntu/printkings-website')
AUDIT = ROOT / 'audit'
PUBLIC = ROOT / 'public' / 'images' / 'products'
CACHE = AUDIT / 'reference-images'
PUBLIC.mkdir(parents=True, exist_ok=True)

candidates = json.loads((AUDIT / 'image-visual-qa-candidates.json').read_text())
manifest = json.loads((AUDIT / 'reference-image-collection-manifest.json').read_text())
cache_for_source = {entry['source_url']: Path(entry['cache_path']) for entry in manifest if entry.get('download_ok')}

# A direct alternative is used only when the original official source URL no longer serves an image.
alternatives = {
    'OD291': {
        'source_url': 'https://displaymania.co.za/wp-content/uploads/2021/04/Value-Steel-Gazebo-2x2-1.jpg',
        'cache_path': CACHE / '26-value-steel-gazebo-2x2.jpg',
        'note': 'Current official 2x2 variation image; replaces a stale 2021 URL that returned an error.',
    },
    'OD292': {
        'source_url': 'https://displaymania.co.za/wp-content/uploads/2021/02/Value-Steel-Gazebo-Powder-Coated-White-560x560.jpg',
        'cache_path': CACHE / '27-value-steel-gazebo-master.jpg',
        'note': 'Current official family master; the only verified difference is documented 3x3 scale.',
    },
}

# The exact FF097 identity is proven, but the supplied source shows a landscape frame and is not sufficiently specific for the 2000h x 1000w portrait variant.
manual_rejections = {
    'FF097': 'Rejected after visual QA: the direct reference appears landscape-oriented and does not confidently represent the portrait 2000h x 1000w frame variant.',
}

# These names record why a shared or family master remains appropriate: identical construction/silhouette with documented size-only variation.
master_notes = {
    'OD181': 'Approved family master for 2m double-sided Sharkfin; construction and sidedness match.',
    'OD182': 'Approved family master for 3m double-sided Sharkfin; only the documented height differs from the shared 2m reference.',
    'OD179': 'Approved family master for 3m single-sided Sharkfin; construction and sidedness match.',
    'OD180': 'Approved family master for 4m single-sided Sharkfin; only the documented height differs from the shared 3m reference.',
    'ID232': 'Approved official straight-banner-wall master; SKU evidence establishes the 2.25 x 4.5m variation while the image represents the exact construction and single-sided configuration.',
    'OD292': 'Approved official value-steel-gazebo family master; SKU evidence establishes the 3 x 3m variation while the image represents the exact steel gazebo construction.',
}

approved = []
rejected = []
for row in candidates:
    sku = row['catalogue_sku']
    if sku in manual_rejections:
        rejected.append({
            'catalogue_sku': sku,
            'variant_id': row['variant_id'],
            'variant_name': row['variant_name'],
            'status': 'REJECTED_VISUAL_QA',
            'reason': manual_rejections[sku],
            'reference_url': row['selected_reference_image_url'],
        })
        continue

    alternate = alternatives.get(sku)
    source_url = alternate['source_url'] if alternate else row['selected_reference_image_url']
    source_path = alternate['cache_path'] if alternate else cache_for_source.get(source_url)
    if not source_path or not source_path.exists():
        rejected.append({
            'catalogue_sku': sku,
            'variant_id': row['variant_id'],
            'variant_name': row['variant_name'],
            'status': 'REJECTED_SOURCE_UNAVAILABLE',
            'reason': 'The direct official source image was unavailable locally after collection; no replacement was approved.',
            'reference_url': source_url,
        })
        continue

    category_segment = re.sub(r'[^a-z0-9]+', '-', row['category_name'].lower()).strip('-')
    asset_name = f'{category_segment}-{row["variant_slug"]}.webp'
    asset_rel = f'images/products/{asset_name}'
    destination = PUBLIC / asset_name

    with Image.open(source_path) as source:
        source_rgb = source.convert('RGB')
        source_size = source_rgb.size
        source_arr = np.asarray(source_rgb, dtype=np.int16)
        source_rgb.save(destination, 'WEBP', quality=90, method=6)

    with Image.open(destination) as converted:
        converted_rgb = converted.convert('RGB')
        converted_arr = np.asarray(converted_rgb, dtype=np.int16)
        if converted_rgb.size != source_size:
            raise SystemExit(f'Unexpected output dimensions for {sku}: {converted_rgb.size} vs {source_size}')
        mean_abs_error = float(np.abs(source_arr - converted_arr).mean())
        if mean_abs_error > 8.0:
            raise SystemExit(f'Image quality threshold failed for {sku}: mean absolute error {mean_abs_error:.3f}')
        sha256 = hashlib.sha256(destination.read_bytes()).hexdigest()
        output_size = destination.stat().st_size

    approved.append({
        'catalogue_sku': sku,
        'product_id': row['product_id'],
        'variant_id': row['variant_id'],
        'product_name': row['product_name'],
        'variant_name': row['variant_name'],
        'category_name': row['category_name'],
        'storage_path': asset_rel,
        'local_asset_path': str(destination),
        'source_product_page': row['display_mania_url'],
        'source_image_url': source_url,
        'original_reference_url': row['selected_reference_image_url'],
        'official_sku': row['display_mania_sku'],
        'alt_text': f'{row["variant_name"]} product image',
        'approved': True,
        'visual_qa': 'PASS',
        'visual_qa_note': (alternate['note'] if alternate else master_notes.get(sku, 'Official reference visually represents the exact verified product family and configuration.')),
        'source_dimensions': list(source_size),
        'output_dimensions': list(source_size),
        'output_bytes': output_size,
        'output_sha256': sha256,
        'mean_abs_pixel_delta_after_webp': round(mean_abs_error, 4),
    })

if len(approved) != 27 or len(rejected) != 1:
    raise SystemExit(f'Expected 27 approved and 1 rejected visual-QA candidates; got {len(approved)} approved and {len(rejected)} rejected.')

(AUDIT / 'approved-product-image-assets.json').write_text(json.dumps(approved, indent=2) + '\n')
(AUDIT / 'rejected-product-image-assets.json').write_text(json.dumps(rejected, indent=2) + '\n')
with (AUDIT / 'approved-product-image-assets.csv').open('w', newline='') as handle:
    fields = ['catalogue_sku','category_name','product_name','variant_name','product_id','variant_id','storage_path','source_product_page','source_image_url','official_sku','alt_text','visual_qa','output_bytes','output_sha256','mean_abs_pixel_delta_after_webp']
    writer = csv.DictWriter(handle, fieldnames=fields, lineterminator='\n')
    writer.writeheader()
    writer.writerows([{field: row[field] for field in fields} for row in approved])

lines = [
    '# Approved Print Kings product image assets',
    '',
    '> **Gate:** These 27 files passed exact catalogue-ID, exact official-SKU, official product-page, direct-source, and visual QA gates. The files are local WebP assets—no production view renders a raw Display Mania URL. One exact-SKU candidate (FF097) remains unassigned because its source image did not confidently show the portrait variant.',
    '',
    '| SKU | Variant | Local storage path | Source product page | Visual QA note |',
    '| --- | --- | --- | --- | --- |',
]
for row in approved:
    lines.append(f'| {row["catalogue_sku"]} | {row["variant_name"]} | `{row["storage_path"]}` | [official page]({row["source_product_page"]}) | {row["visual_qa_note"]} |')
lines.extend(['', '## Rejected after visual QA', ''])
for row in rejected:
    lines.append(f'- **{row["catalogue_sku"]} — {row["variant_name"]}:** {row["reason"]}')
(AUDIT / 'approved-product-image-assets.md').write_text('\n'.join(lines) + '\n')

print(json.dumps({'approved_assets': len(approved), 'rejected_after_visual_qa': len(rejected), 'output_directory': str(PUBLIC)}, indent=2))
