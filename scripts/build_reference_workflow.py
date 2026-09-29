#!/usr/bin/env python3
import json
from pathlib import Path

root = Path('/home/ubuntu/printkings-website')
rows = json.loads((root / 'audit/catalogue-inventory.json').read_text())
items = [
    {
        'product_id': row['product_id'],
        'variant_id': row['variant_id'],
        'sku': row['supplier_sku'] or row['variant_sku'],
        'product_name': row['product_name'],
        'variant_name': row['variant_name'],
        'category': row['category_name'],
    }
    for row in rows
]

schema = {
    'type': 'object',
    'properties': {
        'product_id': {'type': 'string'},
        'variant_id': {'type': 'string'},
        'sku': {'type': 'string'},
        'product_name': {'type': 'string'},
        'official_url': {'type': 'string'},
        'display_mania_product_name': {'type': 'string'},
        'display_mania_sku': {'type': 'string'},
        'reference_image_urls': {'type': 'array', 'items': {'type': 'string'}},
        'verified_attributes': {'type': 'array', 'items': {'type': 'string'}},
        'match_confidence': {'type': 'string', 'enum': ['EXACT', 'HIGH_CONFIDENCE', 'AMBIGUOUS', 'UNVERIFIED', 'WRONG']},
        'match_reason': {'type': 'string'},
        'rejected_candidates': {'type': 'array', 'items': {'type': 'string'}},
        'image_status': {'type': 'string', 'enum': ['OFFICIAL_REFERENCE_FOUND', 'NO_SUITABLE_REFERENCE', 'REJECTED']}
    },
    'required': ['product_id', 'variant_id', 'sku', 'product_name', 'official_url', 'display_mania_product_name', 'display_mania_sku', 'reference_image_urls', 'verified_attributes', 'match_confidence', 'match_reason', 'rejected_candidates', 'image_status']
}

instructions = '''Research exactly one Print Kings catalogue record against the official Display Mania website. This is an identity-verification task only: do not alter any repository files, databases, or images.\n\nUse the official Display Mania website as the primary source. Search by the exact supplier SKU first, then the exact product name. Open and read official product pages, not search snippets. Confirm multiple identifiers: product family, Display Mania SKU/code, dimensions where relevant, material/construction, silhouette/configuration, and colour or single/double-sided state when relevant. Collect official product-page URLs and direct official reference-image URLs only when clearly visible.\n\nReturn EXACT only when the official Display Mania evidence establishes the same physical product and SKU or an equally conclusive manufacturer identifier. Never infer an exact match from visual similarity, category, or a near-name. For all other cases use HIGH_CONFIDENCE, AMBIGUOUS, UNVERIFIED, or WRONG accurately; do not make unsupported claims. If no official page is located, use empty strings/arrays and explain the failed lookup in match_reason. Do not generate, download, reuse, or approve images. Return concise traceable evidence and list rejected near-matches.\n\nCatalogue record: '''

script = f'''const items = {json.dumps(items, separators=(',', ':'))};
const itemSchema = {json.dumps(schema, separators=(',', ':'))};
const instructions = {json.dumps(instructions)};
log('Launching official Display Mania SKU verification for ' + String(items.length) + ' catalogue records.');
const results = await parallel(
  'Verify every Print Kings SKU against Display Mania',
  () => items.map((item) => agent(
    instructions + JSON.stringify(item),
    {{brief: 'Verify Display Mania ' + item.sku + ' — ' + item.variant_name, sandbox: 'isolated', effort_level: 'lite'}}
  )),
  {{schema: itemSchema}}
);
const successful = results.filter((entry) => entry.ok).map((entry) => entry.value);
const failures = results.map((entry, index) => entry.ok ? null : {{sku: items[index].sku, product_name: items[index].variant_name, code: entry.error.code, message: entry.error.message}}).filter(Boolean);
return {{items: successful, failures: failures}};
'''
(root / 'audit/display-mania-reference-workflow.js').write_text(script)
print(f'Built workflow for {len(items)} catalogue records.')
