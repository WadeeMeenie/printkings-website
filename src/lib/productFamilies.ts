import type { Tables } from "./database.types";

export type CatalogueVariant = Tables<"public_catalogue">;

export function productFamilyKey(name: string | null | undefined): string {
  let value = (name ?? "").toLowerCase().trim();
  value = value.replace(/\b\d+(?:\.\d+)?\s*[x×]\s*\d+(?:\.\d+)?(?:\s*[x×]\s*\d+(?:\.\d+)?)?\s*(?:m|mm)?\b/g, " ");
  value = value.replace(/\b\d+(?:\.\d+)?\s*m\b/g, " ");
  value = value.replace(/\b\d+(?:\.\d+)?\s*mm\b/g, " ");
  value = value.replace(/\b(single|double)\b/g, " ");
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
    .replace(/\b(single|double)\b/gi, "")
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
  return [...groups.values()].map(group => group.sort((a,b) => (a.variant_name ?? "").localeCompare(b.variant_name ?? "")));
}
