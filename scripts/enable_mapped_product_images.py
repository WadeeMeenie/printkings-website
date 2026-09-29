#!/usr/bin/env python3
from pathlib import Path

ROOT = Path('/home/ubuntu/printkings-website')

# Shop uses only approved local storage paths and rejects duplicated mapped paths.
path = ROOT / 'src/pages/ShopPage.tsx'
text = path.read_text()
text = text.replace(
    'import { productImageAlt } from "../lib/productImages";',
    'import { productImageAlt,resolveMappedProductImage } from "../lib/productImages";'
)
old = 'const {data}=await supabase.from("product_images").select("variant_id,external_url,sort_order,is_primary,approved").in("variant_id",ids).eq("approved",true).order("is_primary",{ascending:false}).order("sort_order");const counts=new Map<string,number>();for(const x of data??[]){if(x.external_url)counts.set(x.external_url,(counts.get(x.external_url)??0)+1)}const m:Record<string,string>={};for(const x of data??[]){if(x.variant_id&&x.external_url&&counts.get(x.external_url)===1&&!m[x.variant_id])m[x.variant_id]=x.external_url}setImageMap(m)'
new = 'const {data}=await supabase.from("product_images").select("variant_id,storage_path,sort_order,is_primary,approved").in("variant_id",ids).eq("approved",true).order("is_primary",{ascending:false}).order("sort_order");const counts=new Map<string,number>();for(const x of data??[]){if(x.storage_path)counts.set(x.storage_path,(counts.get(x.storage_path)??0)+1)}const m:Record<string,string>={};for(const x of data??[]){const image=resolveMappedProductImage(x.storage_path);if(x.variant_id&&image&&x.storage_path&&counts.get(x.storage_path)===1&&!m[x.variant_id])m[x.variant_id]=image}setImageMap(m)'
if old not in text:
    raise SystemExit('Expected Shop product image query not found.')
path.write_text(text.replace(old, new, 1))

# Cart follows the same local mapped-image rule.
path = ROOT / 'src/pages/CartPage.tsx'
text = path.read_text()
text = text.replace(
    'import { useCart } from "../lib/cart";',
    'import { resolveMappedProductImage } from "../lib/productImages";import { useCart } from "../lib/cart";'
)
old = 'const {data}=await supabase.from("product_images").select("variant_id,external_url,sort_order,is_primary,approved").in("variant_id",ids).eq("approved",true).order("is_primary",{ascending:false}).order("sort_order");const counts=new Map<string,number>();for(const x of data??[]){if(x.external_url)counts.set(x.external_url,(counts.get(x.external_url)??0)+1)}const map:Record<string,string>={};for(const x of data??[]){if(x.variant_id&&x.external_url&&counts.get(x.external_url)===1&&!map[x.variant_id])map[x.variant_id]=x.external_url}setImageMap(map)'
new = 'const {data}=await supabase.from("product_images").select("variant_id,storage_path,sort_order,is_primary,approved").in("variant_id",ids).eq("approved",true).order("is_primary",{ascending:false}).order("sort_order");const counts=new Map<string,number>();for(const x of data??[]){if(x.storage_path)counts.set(x.storage_path,(counts.get(x.storage_path)??0)+1)}const map:Record<string,string>={};for(const x of data??[]){const image=resolveMappedProductImage(x.storage_path);if(x.variant_id&&image&&x.storage_path&&counts.get(x.storage_path)===1&&!map[x.variant_id])map[x.variant_id]=image}setImageMap(map)'
if old not in text:
    raise SystemExit('Expected Cart product image query not found.')
path.write_text(text.replace(old, new, 1))

# Product detail renders only local mapped image paths, never external reference URLs.
path = ROOT / 'src/pages/ProductPage.tsx'
text = path.read_text()
text = text.replace(
    'import { Link,useParams } from "react-router-dom";',
    'import { Link,useParams } from "react-router-dom";import { resolveMappedProductImage } from "../lib/productImages";'
)
old = 'const counts=new Map<string,number>();for(const x of allImgs??[]){if(x.external_url)counts.set(x.external_url,(counts.get(x.external_url)??0)+1)}const uniqueImgs=(imgs??[]).filter(x=>!x.external_url||counts.get(x.external_url)===1);if(alive){setImages(uniqueImgs);setRelated(rel??[]);setLoading(false)}'
new = 'const counts=new Map<string,number>();for(const x of allImgs??[]){if(x.storage_path)counts.set(x.storage_path,(counts.get(x.storage_path)??0)+1)}const uniqueImgs=(imgs??[]).filter(x=>x.storage_path&&counts.get(x.storage_path)===1&&resolveMappedProductImage(x.storage_path));if(alive){setImages(uniqueImgs);setRelated(rel??[]);setLoading(false)}'
if old not in text:
    raise SystemExit('Expected Product unique image filter not found.')
text = text.replace(old, new, 1)
text = text.replace(
    'supabase.from("product_images").select("variant_id,external_url").eq("approved",true)',
    'supabase.from("product_images").select("variant_id,storage_path").eq("approved",true)',
    1
)
text = text.replace(
    '<img key={x.id} src={x.external_url??""} alt={x.alt_text??item.variant_name??item.product_name??"Print Kings product"} />',
    '<img key={x.id} src={resolveMappedProductImage(x.storage_path)!} alt={x.alt_text??item.variant_name??item.product_name??"Print Kings product"} />',
    1
)
path.write_text(text)

# Setup Builder fetches the exact same approved local mappings for selected catalogue options.
path = ROOT / 'src/pages/SetupBuilderPage.tsx'
text = path.read_text()
text = text.replace(
    'import { supabase } from "../lib/supabase";',
    'import { supabase } from "../lib/supabase";import { resolveMappedProductImage } from "../lib/productImages";'
)
text = text.replace(
    'const [catalogue,setCatalogue]=useState<Record<string,any>>({}),[rules,setRules]',
    'const [catalogue,setCatalogue]=useState<Record<string,any>>({}),[imageMap,setImageMap]=useState<Record<string,string>>({}),[rules,setRules]',
    1
)
old = 'if(ids.length){const {data:p}=await supabase.from("public_catalogue").select("*").in("variant_id",ids);setCatalogue(Object.fromEntries((p??[]).map(x=>[x.variant_id,x])))}const {data:r}'
new = 'if(ids.length){const [{data:p},{data:i}]=await Promise.all([supabase.from("public_catalogue").select("*").in("variant_id",ids),supabase.from("product_images").select("variant_id,storage_path,sort_order,is_primary").in("variant_id",ids).eq("approved",true).order("is_primary",{ascending:false}).order("sort_order")]);setCatalogue(Object.fromEntries((p??[]).map(x=>[x.variant_id,x])));const counts=new Map<string,number>();for(const image of i??[]){if(image.storage_path)counts.set(image.storage_path,(counts.get(image.storage_path)??0)+1)}const mapped:Record<string,string>={};for(const image of i??[]){const imageUrl=resolveMappedProductImage(image.storage_path);if(image.variant_id&&image.storage_path&&imageUrl&&counts.get(image.storage_path)===1&&!mapped[image.variant_id])mapped[image.variant_id]=imageUrl}setImageMap(mapped)}else{setCatalogue({});setImageMap({})}const {data:r}'
if old not in text:
    raise SystemExit('Expected Setup Builder catalogue query not found.')
text = text.replace(old, new, 1)
old = '<div className="option-image"><span className="product-image-missing">{(p?.variant_name??o.name).slice(0,1)}</span></div>'
new = '<div className="option-image">{p&&imageMap[p.variant_id]?<img src={imageMap[p.variant_id]} alt="" loading="lazy"/>:<span className="product-image-missing">{(p?.variant_name??o.name).slice(0,1)}</span>}</div>'
if old not in text:
    raise SystemExit('Expected Setup Builder image placeholder not found.')
path.write_text(text.replace(old, new, 1))

print('Updated mapped image resolution in Shop, Product, Cart, and Setup Builder.')
