import type { Tables } from "./database.types";

export type CatalogueVariant = Tables<"public_catalogue">;

function variantSizeScore(item: CatalogueVariant): [number, number, number, string] {
  const text = (item.variant_name ?? item.product_name ?? "").toLowerCase();
  const dims = [...text.matchAll(/(\d+(?:\.\d+)?)\s*(?:x|×)\s*(\d+(?:\.\d+)?)/g)]
    .flatMap(m => [Number(m[1]), Number(m[2])])
    .filter(Number.isFinite);
  const area = dims.length >= 2 ? dims[0] * dims[1] : Number.MAX_SAFE_INTEGER;
  const sum = dims.length ? dims.reduce((a,b)=>a+b,0) : Number.MAX_SAFE_INTEGER;
  const max = dims.length ? Math.max(...dims) : Number.MAX_SAFE_INTEGER;
  return [area, sum, max, text];
}

export function compareCatalogueVariants(a: CatalogueVariant, b: CatalogueVariant): number {
  const priceA = a.price_cents ?? Number.MAX_SAFE_INTEGER;
  const priceB = b.price_cents ?? Number.MAX_SAFE_INTEGER;
  if (priceA !== priceB) return priceA - priceB;
  const sa = variantSizeScore(a), sb = variantSizeScore(b);
  if (sa[0] !== sb[0]) return sa[0] - sb[0];
  if (sa[1] !== sb[1]) return sa[1] - sb[1];
  if (sa[2] !== sb[2]) return sa[2] - sb[2];
  return sa[3].localeCompare(sb[3]);
}

export function productFamilyKey(name: string | null | undefined): string {
  let value = (name ?? "").toLowerCase().trim();
  value = value.replace(/\b\d+(?:\.\d+)?\s*[x×]\s*\d+(?:\.\d+)?(?:\s*[x×]\s*\d+(?:\.\d+)?)?\s*(?:m|mm)?\b/g, " ");
  value = value.replace(/\b\d+(?:\.\d+)?\s*m\b/g, " ");
  value = value.replace(/\b\d+(?:\.\d+)?\s*mm\b/g, " ");
  value = value.replace(/\b(single|double)\b(?!-?\s*sided)/g, " ");
  if (/^lollipop\b/.test(value)) value = value.replace(/\bA[1-4]\b/gi, " ");
  if (/^directors chair\b/.test(value)) value = value.replace(/\b(black|standard)\b/g, " ");
  return value.replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, "-");
}

export function productFamilyName(name: string | null | undefined): string {
  const original = (name ?? "").trim();
  let value = original
    .replace(/\b\d+(?:\.\d+)?\s*[x×]\s*\d+(?:\.\d+)?(?:\s*[x×]\s*\d+(?:\.\d+)?)?\s*(?:m|mm)?\b/gi, "")
    .replace(/\b\d+(?:\.\d+)?\s*m\b/gi, "")
    .replace(/\b\d+(?:\.\d+)?\s*mm\b/gi, "")
    .replace(/\b(single|double)\b(?!-?\s*sided)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (/^lollipop\b/i.test(value)) value = value.replace(/\bA[1-4]\b/gi, "").replace(/\s+/g, " ").trim();
  if (/^directors chair\b/i.test(value)) value = value.replace(/\b(black|standard)\b/gi, "").replace(/\s+/g, " ").trim();
  return value || original;
}

export function variantChoiceLabel(item: CatalogueVariant): string {
  const family = productFamilyName(item.product_name);
  let label = (item.variant_name ?? item.product_name ?? "").trim();
  if (family) {
    const escaped = family.replace(/[.*+?^()|[\]\\]/g, "\\$&");
    label = label.replace(new RegExp("^" + escaped + "\\s*", "i"), "");
  }
  label = label.replace(/^[-–—:]\s*/, "").trim();
  return label || item.variant_name || item.product_name || "Option";
}

export function groupCatalogueVariants(items: CatalogueVariant[]): CatalogueVariant[][] {
  const groups = new Map<string, CatalogueVariant[]>();
  for (const item of items) {
    const key = productFamilyKey(item.product_name || item.variant_name);
    const bucket = groups.get(key) ?? [];
    bucket.push(item);
    groups.set(key, bucket);
  }
  return [...groups.values()].map(group => group.sort(compareCatalogueVariants));
}
