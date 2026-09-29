#!/usr/bin/env python3
from pathlib import Path

ROOT = Path('/home/ubuntu/printkings-website')
changes = {
    'src/pages/ShopPage.tsx': [
        ('import { productImageAlt, resolveProductImage } from "../lib/productImages";', 'import { productImageAlt } from "../lib/productImages";'),
        (':resolveProductImage({productName:item.product_name,variantName:item.variant_name,categoryName:item.category_name,categorySlug:item.category_slug})?<img src={resolveProductImage({productName:item.product_name,variantName:item.variant_name,categoryName:item.category_name,categorySlug:item.category_slug})!} alt={productImageAlt({productName:item.product_name,variantName:item.variant_name,categoryName:item.category_name,categorySlug:item.category_slug})} loading="lazy"/>:<span className="product-image-missing">', ':<span className="product-image-missing">'),
    ],
    'src/pages/ProductPage.tsx': [
        ('import { productImageAlt, resolveProductImage } from "../lib/productImages";', ''),
        ('{resolveProductImage({productName:item.product_name,variantName:item.variant_name,categoryName:item.category_name,categorySlug:item.category_slug})?<img src={resolveProductImage({productName:item.product_name,variantName:item.variant_name,categoryName:item.category_name,categorySlug:item.category_slug})!} alt={productImageAlt({productName:item.product_name,variantName:item.variant_name,categoryName:item.category_name,categorySlug:item.category_slug})} />:<span className="product-image-missing">', '{<span className="product-image-missing">'),
    ],
    'src/pages/CartPage.tsx': [
        ('import { resolveProductImage } from "../lib/productImages";', ''),
        (':resolveProductImage(item)?<img src={resolveProductImage(item)!} alt="" />:<span className="product-image-missing">', ':<span className="product-image-missing">'),
    ],
    'src/pages/SetupBuilderPage.tsx': [
        ('import { resolveProductImage } from "../lib/productImages";', ''),
        ('<div className="option-image">{p&&resolveProductImage({productName:p.product_name,variantName:p.variant_name,categoryName:p.category_name,categorySlug:p.category_slug})&&<img src={resolveProductImage({productName:p.product_name,variantName:p.variant_name,categoryName:p.category_name,categorySlug:p.category_slug})!} alt="" loading="lazy" />}</div>', '<div className="option-image"><span className="product-image-missing">{(p?.variant_name??o.name).slice(0,1)}</span></div>'),
    ],
}

for relative_path, replacements in changes.items():
    path = ROOT / relative_path
    text = path.read_text()
    for old, new in replacements:
        if old not in text:
            raise SystemExit(f'Expected generic fallback snippet was not found in {relative_path}.')
        text = text.replace(old, new, 1)
    path.write_text(text)
    print(f'Updated {relative_path}')
