#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path('/home/ubuntu/printkings-website')
rows = json.loads((ROOT / 'audit' / 'approved-product-image-assets.json').read_text())

values = []
for row in rows:
    def sql_string(value: str) -> str:
        return "'" + value.replace("'", "''") + "'"
    values.append('    (' + ', '.join([
        sql_string(row['product_id']),
        sql_string(row['variant_id']),
        sql_string(row['storage_path']),
        sql_string(row['alt_text']),
    ]) + ')')

sql = '''-- Only exact-SKU verified and visually approved, locally hosted assets are inserted.
-- The statement is idempotent and never writes a raw supplier image URL to production.
with approved_assets(product_id, variant_id, storage_path, alt_text) as (
  values
''' + ',\n'.join(values) + '''
)
insert into public.product_images (
  product_id,
  variant_id,
  storage_path,
  external_url,
  alt_text,
  sort_order,
  is_primary,
  approved
)
select
  product_id::uuid,
  variant_id::uuid,
  storage_path,
  null,
  alt_text,
  0,
  true,
  true
from approved_assets source
where not exists (
  select 1
  from public.product_images existing
  where existing.variant_id = source.variant_id::uuid
    and existing.storage_path = source.storage_path
)
returning product_id, variant_id, storage_path, approved;
'''
(ROOT / 'audit' / 'insert_approved_product_images.sql').write_text(sql)
print(f'Prepared {len(rows)} idempotent product-image mappings.')
