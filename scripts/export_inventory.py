#!/usr/bin/env python3
import csv
import json
import re
from pathlib import Path

SOURCE = Path('/home/ubuntu/.mcp/tool-results/2026-09-28_21-50-34.676924748_supabase_execute_sql_8b4878cd.json')
OUTDIR = Path('/home/ubuntu/printkings-website/audit')
OUTDIR.mkdir(exist_ok=True)

payload = json.loads(SOURCE.read_text())
text = payload.get('result', '') if isinstance(payload, dict) else str(payload)
match = re.search(r'<untrusted-data[^>]*>\n(\[.*?\])\s*</untrusted-data[^>]*>', text, re.S)
if not match:
    raise SystemExit('Could not locate the selected inventory rows in the Supabase tool result.')
rows = json.loads(match.group(1))

fields = [
    'product_id', 'product_name', 'product_slug', 'product_status', 'category_name',
    'variant_id', 'variant_name', 'variant_slug', 'variant_sku', 'supplier_sku',
    'specifications', 'variant_status', 'source_description'
]
safe_rows = [{field: row.get(field) for field in fields} for row in rows]
(OUTDIR / 'catalogue-inventory.json').write_text(json.dumps(safe_rows, indent=2) + '\n')
with (OUTDIR / 'catalogue-inventory.csv').open('w', newline='') as handle:
    writer = csv.DictWriter(handle, fieldnames=[f for f in fields if f != 'specifications'])
    writer.writeheader()
    for row in safe_rows:
        flattened = {f: row.get(f) for f in fields if f != 'specifications'}
        writer.writerow(flattened)
print(f'Exported {len(safe_rows)} catalogue product/variant rows.')
for category in sorted({row.get("category_name") or "Uncategorised" for row in safe_rows}):
    count = sum(1 for row in safe_rows if (row.get("category_name") or "Uncategorised") == category)
    print(f'{category}: {count}')
