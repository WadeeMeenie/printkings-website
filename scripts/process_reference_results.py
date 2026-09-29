#!/usr/bin/env python3
import csv
import json
import shutil
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path('/home/ubuntu/printkings-website')
AUDIT = ROOT / 'audit'
RAW_SOURCE = Path('/home/ubuntu/.manus-jobs/79bbd53f454e/output.txt')
INVENTORY_SOURCE = AUDIT / 'catalogue-inventory.json'

AUDIT.mkdir(exist_ok=True)
raw = json.loads(RAW_SOURCE.read_text())
items = raw.get('items', [])
failures = raw.get('failures', [])
inventory = json.loads(INVENTORY_SOURCE.read_text())
expected_by_variant = {row['variant_id']: row for row in inventory}

if len(inventory) != 85:
    raise SystemExit(f'Expected 85 catalogue variants; found {len(inventory)}.')
if len(items) != 85:
    raise SystemExit(f'Expected 85 research results; found {len(items)}.')

variant_counts = Counter(row.get('variant_id') for row in items)
if set(variant_counts) != set(expected_by_variant):
    missing = sorted(set(expected_by_variant) - set(variant_counts))
    unexpected = sorted(set(variant_counts) - set(expected_by_variant))
    raise SystemExit(f'Research result variant coverage mismatch. Missing: {missing}; unexpected: {unexpected}')
if any(count != 1 for count in variant_counts.values()):
    raise SystemExit('Research results contain duplicate variant IDs.')

def official_display_mania_url(value: str) -> bool:
    parsed = urlparse(value or '')
    return parsed.scheme == 'https' and parsed.netloc.lower().endswith('displaymania.co.za')

def first_direct_official_image(urls):
    for value in urls or []:
        if official_display_mania_url(value):
            return value
    return ''

normalized = []
for result in items:
    expected = expected_by_variant[result['variant_id']]
    expected_sku = (expected.get('supplier_sku') or expected.get('variant_sku') or '').strip()
    returned_sku = (result.get('sku') or '').strip()
    reported_confidence = result.get('match_confidence') or 'UNVERIFIED'
    official_sku = (result.get('display_mania_sku') or '').strip()
    official_url = result.get('official_url') or ''
    reference_image_url = first_direct_official_image(result.get('reference_image_urls', []))

    catalogue_identity_ok = (
        result.get('product_id') == expected['product_id'] and
        result.get('variant_id') == expected['variant_id'] and
        result.get('product_name') == expected['product_name']
    )
    sku_evidence_ok = bool(expected_sku) and official_sku.casefold() == expected_sku.casefold()
    official_page_ok = official_display_mania_url(official_url)
    strict_exact_identity = catalogue_identity_ok and sku_evidence_ok and official_page_ok

    if strict_exact_identity and reference_image_url:
        status = 'PENDING_VISUAL_QA'
        approval_reason = 'Exact catalogue ID, exact official SKU, official product page, and direct official reference image are present. Visual QA remains mandatory before asset approval.'
    elif strict_exact_identity:
        status = 'EXACT_NO_DIRECT_IMAGE'
        approval_reason = 'Exact catalogue and SKU identity is verified, but no direct official reference image URL was supplied. Do not attach an image automatically.'
    elif reported_confidence == 'EXACT':
        status = 'DOWNGRADED_NONEXACT'
        missing_reasons = []
        if not sku_evidence_ok:
            missing_reasons.append('official SKU is missing or differs from the catalogue SKU')
        if not official_page_ok:
            missing_reasons.append('official product-page URL is missing or not on displaymania.co.za')
        if not catalogue_identity_ok:
            missing_reasons.append('research record does not exactly match the catalogue row')
        approval_reason = 'Reported EXACT was downgraded because ' + '; '.join(missing_reasons) + '.'
    else:
        status = reported_confidence
        approval_reason = 'Not eligible for automatic approval under the exact-SKU gate.'

    normalized.append({
        'product_id': expected['product_id'],
        'variant_id': expected['variant_id'],
        'product_name': expected['product_name'],
        'variant_name': expected['variant_name'],
        'category_name': expected['category_name'],
        'product_slug': expected['product_slug'],
        'variant_slug': expected['variant_slug'],
        'catalogue_sku': expected_sku,
        'research_returned_sku': returned_sku,
        'display_mania_product_name': result.get('display_mania_product_name') or '',
        'display_mania_sku': official_sku,
        'display_mania_url': official_url,
        'reference_image_urls': result.get('reference_image_urls') or [],
        'selected_reference_image_url': reference_image_url,
        'reported_confidence': reported_confidence,
        'catalogue_identity_ok': catalogue_identity_ok,
        'sku_evidence_ok': sku_evidence_ok,
        'official_page_ok': official_page_ok,
        'strict_exact_identity': strict_exact_identity,
        'status_after_exact_gate': status,
        'approval_reason': approval_reason,
        'match_reason': result.get('match_reason') or '',
        'verified_attributes': result.get('verified_attributes') or [],
        'rejected_candidates': result.get('rejected_candidates') or [],
    })

# Preserve raw evidence unchanged and produce normalized outputs.
(AUDIT / 'display-mania-reference-results.json').write_text(json.dumps(raw, indent=2) + '\n')
(AUDIT / 'catalogue-image-mapping-normalized.json').write_text(json.dumps(normalized, indent=2) + '\n')

# Direct source images are allowed into the visual-QA queue only after strict identity proof.
candidates = [row for row in normalized if row['status_after_exact_gate'] == 'PENDING_VISUAL_QA']
(AUDIT / 'image-visual-qa-candidates.json').write_text(json.dumps(candidates, indent=2) + '\n')

fields = [
    'category_name', 'product_name', 'variant_name', 'catalogue_sku', 'product_id', 'variant_id',
    'display_mania_product_name', 'display_mania_sku', 'display_mania_url',
    'selected_reference_image_url', 'reported_confidence', 'strict_exact_identity',
    'status_after_exact_gate', 'approval_reason'
]
with (AUDIT / 'catalogue-image-mapping-normalized.csv').open('w', newline='') as handle:
    writer = csv.DictWriter(handle, fieldnames=fields, lineterminator='\n')
    writer.writeheader()
    writer.writerows([{field: row[field] for field in fields} for row in normalized])

status_counts = Counter(row['status_after_exact_gate'] for row in normalized)
reported_counts = Counter(row['reported_confidence'] for row in normalized)
source_counts = Counter(row['selected_reference_image_url'] for row in candidates)
reused_sources = {url: count for url, count in source_counts.items() if url and count > 1}
summary = {
    'catalogue_variants': len(inventory),
    'research_results': len(items),
    'research_failures': failures,
    'reported_confidence_counts': dict(sorted(reported_counts.items())),
    'strict_exact_identity_count': sum(row['strict_exact_identity'] for row in normalized),
    'visual_qa_candidate_count': len(candidates),
    'status_after_exact_gate_counts': dict(sorted(status_counts.items())),
    'shared_candidate_reference_sources': reused_sources,
}
(AUDIT / 'catalogue-image-mapping-summary.json').write_text(json.dumps(summary, indent=2) + '\n')

# The matrix deliberately reports all rows; no images are approved by this processor.
lines = [
    '# Print Kings catalogue image identity matrix',
    '',
    '> **Approval rule enforced in this document:** a result may enter visual QA only when its Print Kings product and variant IDs match the catalogue export, its Display Mania SKU is exactly equal to the catalogue supplier SKU, the source is an official `displaymania.co.za` product page, and a direct official reference image URL is present. Visual QA and asset licensing/usage review are still outstanding.',
    '',
    f'- Catalogue variants: **{len(inventory)}**',
    f'- Strict exact identities: **{summary["strict_exact_identity_count"]}**',
    f'- Direct-image visual-QA candidates: **{len(candidates)}**',
    f'- Research-reported confidence counts: `{json.dumps(dict(sorted(reported_counts.items())))}`',
    f'- Exact-gate status counts: `{json.dumps(dict(sorted(status_counts.items())))}`',
    '',
    '| Category | Product / variant | Catalogue SKU | Display Mania page | Official SKU | Reference image | Research confidence | Exact-gate status |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
]
for row in normalized:
    page = f'[{row["display_mania_product_name"] or "—"}]({row["display_mania_url"]})' if row['display_mania_url'] else '—'
    image = f'[reference]({row["selected_reference_image_url"]})' if row['selected_reference_image_url'] else '—'
    name = row['variant_name'] if row['variant_name'] == row['product_name'] else f'{row["product_name"]} — {row["variant_name"]}'
    lines.append(f'| {row["category_name"]} | {name} | {row["catalogue_sku"]} | {page} | {row["display_mania_sku"] or "—"} | {image} | {row["reported_confidence"]} | **{row["status_after_exact_gate"]}** |')
lines.extend(['', '## Exceptions and manual-review queue', ''])
for row in normalized:
    if row['status_after_exact_gate'] != 'PENDING_VISUAL_QA':
        lines.append(f'### {row["catalogue_sku"]} — {row["variant_name"]}')
        lines.append(f'- **Status:** {row["status_after_exact_gate"]}')
        lines.append(f'- **Reason:** {row["approval_reason"]}')
        lines.append(f'- **Research finding:** {row["match_reason"]}')
        if row['display_mania_url']:
            lines.append(f'- **Closest official page:** {row["display_mania_url"]}')
        if row['rejected_candidates']:
            lines.append(f'- **Rejected candidates:** {"; ".join(row["rejected_candidates"])}')
        lines.append('')
(AUDIT / 'catalogue-image-identity-matrix.md').write_text('\n'.join(lines) + '\n')

unresolved = [row for row in normalized if row['status_after_exact_gate'] != 'PENDING_VISUAL_QA']
unresolved_lines = [
    '# Print Kings image exceptions requiring manual resolution',
    '',
    '> **No item listed here is eligible for automatic image attachment.**',
    '',
]
for row in unresolved:
    unresolved_lines.extend([
        f'## {row["catalogue_sku"]} — {row["variant_name"]}',
        '',
        f'- **Product / variant ID:** `{row["product_id"]}` / `{row["variant_id"]}`',
        f'- **Status:** {row["status_after_exact_gate"]}',
        f'- **Reason:** {row["approval_reason"]}',
        f'- **Display Mania search outcome:** {row["match_reason"]}',
        f'- **Closest official page:** {row["display_mania_url"] or "None established"}',
        f'- **Rejected candidates:** {"; ".join(row["rejected_candidates"]) if row["rejected_candidates"] else "None recorded"}',
        '',
    ])
(AUDIT / 'manual-review-image-exceptions.md').write_text('\n'.join(unresolved_lines) + '\n')

print(json.dumps(summary, indent=2))
