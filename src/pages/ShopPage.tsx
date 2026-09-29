import { useEffect,useMemo,useState } from "react";
import { Link,useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";
import { productImageAlt,resolveMappedProductImage } from "../lib/productImages";
import { compareCatalogueVariants,groupCatalogueVariants,productFamilyName } from "../lib/productFamilies";

type CatalogueItem=Tables<"public_catalogue">;
const PAGE_SIZE=24;
const money=(c:number|null)=>c===null?"Quote":new Intl.NumberFormat("en-ZA",{style:"currency",currency:"ZAR"}).format(c/100);

export function ShopPage(){
  const [params,setParams]=useSearchParams();
  const category=params.get("category")??"all",query=params.get("q")??"",sort=params.get("sort")??"name";
  const [items,setItems]=useState<CatalogueItem[]>([]),[categories,setCategories]=useState<{name:string;slug:string}[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState<string|null>(null),[imageMap,setImageMap]=useState<Record<string,string>>({}),[showAll,setShowAll]=useState(false);

  useEffect(()=>{supabase.from("public_catalogue").select("category_name,category_slug").eq("category_active",true).order("category_name").then(({data})=>{const u=new Map<string,{name:string;slug:string}>();(data??[]).forEach(x=>{if(x.category_slug&&x.category_name)u.set(x.category_slug,{name:x.category_name,slug:x.category_slug})});setCategories([...u.values()])})},[]);

  useEffect(()=>{
    let active=true;setLoading(true);setError(null);setItems([]);setShowAll(false);
    let r=supabase.from("public_catalogue").select("*").eq("category_active",true);
    if(category!=="all")r=r.eq("category_slug",category);
    if(query.trim()){const t=query.trim().replace(/,/g," ");r=r.or(`product_name.ilike.%${t}%,variant_name.ilike.%${t}%,short_description.ilike.%${t}%`)}
    r.order("product_name").order("variant_name").then(({data,error:e})=>{if(!active)return;if(e)setError("The catalogue is taking a moment to respond.");else setItems(data??[]);setLoading(false)});
    return()=>{active=false}
  },[category,query]);

  useEffect(()=>{(async()=>{
    const ids=items.map(x=>x.variant_id).filter(Boolean);
    if(!ids.length){setImageMap({});return}
    const {data}=await supabase.from("product_images").select("variant_id,storage_path,external_url,sort_order,is_primary,approved").in("variant_id",ids).or("approved.eq.true,external_url.not.is.null").order("is_primary",{ascending:false}).order("sort_order");
    const counts=new Map<string,number>();for(const x of data??[]){if(x.storage_path)counts.set(x.storage_path,(counts.get(x.storage_path)??0)+1)}
    const m:Record<string,string>={};for(const x of data??[]){const id=x.variant_id;if(!id)continue;const image=resolveMappedProductImage(x.storage_path,x.external_url);if(image&&!m[id])m[id]=image}setImageMap(m);
  })()},[items]);

  const groups=useMemo(()=>{
    const grouped=groupCatalogueVariants(items).map(variants=>{
      const sorted=[...variants].sort(compareCatalogueVariants);
      return {variants,primary:sorted[0]};
    });
    if(sort==="price-low") return grouped.sort((a,b)=>(a.primary.price_cents??Number.MAX_SAFE_INTEGER)-(b.primary.price_cents??Number.MAX_SAFE_INTEGER));
    if(sort==="price-high") return grouped.sort((a,b)=>(b.primary.price_cents??-1)-(a.primary.price_cents??-1));
    return grouped.sort((a,b)=>productFamilyName(a.primary.product_name).localeCompare(productFamilyName(b.primary.product_name)));
  },[items,sort]);

  const visible=showAll?groups:groups.slice(0,PAGE_SIZE);
  const update=(key:string,value:string)=>{const next=new URLSearchParams(params);if(!value||value==="all"||(key==="q"&&!value.trim()))next.delete(key);else next.set(key,value);setParams(next)};

  return <main className="page shop-page">
    <div className="shop-hero"><div><p className="eyebrow">Shop / Product catalogue</p><h1>PRODUCTS BUILT<br/><span>TO GET YOU SEEN.</span></h1></div><p>Outdoor branding, event and activation products from Print Kings.</p></div>
    <section className="catalogue-controls">
      <label className="search-field"><span>⌕</span><input value={query} onChange={e=>update("q",e.target.value)} placeholder="Search gazebos, flags, counters…" aria-label="Search products"/></label>
      <div className="select-group"><select value={category} onChange={e=>update("category",e.target.value)} aria-label="Filter by category"><option value="all">All categories</option>{categories.map(x=><option key={x.slug} value={x.slug}>{x.name}</option>)}</select><select value={sort} onChange={e=>update("sort",e.target.value)} aria-label="Sort products"><option value="name">Sort: name</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div>
      <div className="filter-pills" aria-label="Quick category filters"><button onClick={()=>update("category","all")} className={category==="all"?"selected":""}>All</button>{categories.map(x=><button key={x.slug} onClick={()=>update("category",x.slug)} className={category===x.slug?"selected":""}>{x.name}</button>)}</div>
    </section>
    {loading&&<div className="loading-state"><span className="loader"/>Loading catalogue…</div>}
    {error&&<div className="error-state"><strong>Catalogue unavailable.</strong><span>{error}</span></div>}
    {!loading&&!error&&!visible.length&&<div className="empty-state"><h2>Nothing matched that search.</h2><p>Try another product, category or search term.</p><button onClick={()=>{update("q","");update("category","all")}} className="button button-dark">Reset filters <span>↗</span></button></div>}
    <div className="product-grid">
      {visible.map(group=>{
        const item=group.primary,options=group.variants,variantId=item.variant_id ?? "";
        return <article className="product-card" key={variantId}>
          <Link to={`/shop/${item.category_slug}/${item.variant_slug}`} className="product-image">{imageMap[variantId]?<img src={imageMap[variantId]} alt={productImageAlt({productName:productFamilyName(item.product_name),categoryName:item.category_name})} loading="lazy"/>:<span className="product-image-missing">{(item.variant_name??item.product_name??"Product").slice(0,1)}</span>}<span className="image-arrow">↗</span></Link>
          <p className="eyebrow">{item.category_name}</p>
          <Link to={`/shop/${item.category_slug}/${item.variant_slug}`}><h2>{productFamilyName(item.product_name)}</h2></Link>
          {options.length>1&&<p className="product-parent">{options.length} sizes/configurations available.</p>}
          <p className="product-description">{item.short_description}</p>
          <div className="product-meta"><div><small>{options.length>1?"From":"Price"}</small><strong>{money(item.price_cents)}</strong></div><Link to={`/shop/${item.category_slug}/${item.variant_slug}`} className="card-link">{options.length>1?"Choose options ↗":"View product ↗"}</Link></div>
        </article>
      })}
    </div>
    {groups.length>PAGE_SIZE&&<div className="load-more"><button onClick={()=>setShowAll(v=>!v)} className="button button-light">{showAll?"Show fewer products":"Load more products"}<span>↗</span></button></div>}
  </main>
}
