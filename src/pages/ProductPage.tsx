import { useEffect,useMemo,useState } from "react";
import { Link,useNavigate,useParams } from "react-router-dom";
import { resolveMappedProductImage } from "../lib/productImages";
import { compareCatalogueVariants,productFamilyKey,productFamilyName,variantChoiceLabel } from "../lib/productFamilies";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";
import { catalogueToCart,useCart } from "../lib/cart";

type Item=Tables<"public_catalogue">;
type Image={id:string;storage_path:string|null;external_url:string|null;alt_text:string|null;is_primary:boolean;sort_order:number};
const money=(c:number|null)=>c===null?"Quote":new Intl.NumberFormat("en-ZA",{style:"currency",currency:"ZAR"}).format(c/100);

export function ProductPage(){
  const {categorySlug,variantSlug}=useParams(),navigate=useNavigate(),{add}=useCart();
  const [item,setItem]=useState<Item|null>(null),[familyItems,setFamilyItems]=useState<Item[]>([]),[images,setImages]=useState<Image[]>([]),[related,setRelated]=useState<Item[]>([]),[qty,setQty]=useState(1),[added,setAdded]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState("");

  useEffect(()=>{
    let alive=true;
    (async()=>{
      if(!variantSlug||!categorySlug)return;
      const {data,error:e}=await supabase.from("public_catalogue").select("*").eq("category_active",true).eq("variant_slug",variantSlug).maybeSingle();
      if(!alive)return;
      if(e){setError("We couldn't load this product right now.");setLoading(false);return}
      if(!data){setError("Product not found.");setLoading(false);return}
      setItem(data);
      const {data:all}=await supabase.from("public_catalogue").select("*").eq("category_active",true).eq("category_slug",data.category_slug??categorySlug);
      const siblings=(all??[]).filter(x=>productFamilyKey(x.product_name??x.variant_name)===productFamilyKey(data.product_name??data.variant_name));
      const [{data:imgs},{data:rel}]=await Promise.all([
        supabase.from("product_images").select("id,storage_path,external_url,alt_text,is_primary,sort_order").eq("variant_id",data.variant_id as string).eq("approved",true).order("is_primary",{ascending:false}).order("sort_order"),
        supabase.from("public_catalogue").select("*").eq("category_active",true).eq("category_slug",data.category_slug??categorySlug).neq("variant_id",data.variant_id as string).limit(4),
        supabase.from("product_images").select("variant_id,storage_path,external_url").or("approved.eq.true,external_url.not.is.null")
      ]);
      const uniqueImgs=(imgs??[]).filter(x=>(x.storage_path||x.external_url)&&resolveMappedProductImage(x.storage_path,x.external_url));
      if(alive){const seenFamilies=new Set<string>();const uniqueRelated=(rel??[]).filter(candidate=>{const key=productFamilyKey(candidate.product_name??candidate.variant_name);if(key===productFamilyKey(data.product_name??data.variant_name)||seenFamilies.has(key))return false;seenFamilies.add(key);return true}).slice(0,4);setFamilyItems(siblings.sort(compareCatalogueVariants));setImages(uniqueImgs);setRelated(uniqueRelated);setLoading(false)}
    })();
    return()=>{alive=false}
  },[categorySlug,variantSlug]);

  const familyName=useMemo(()=>productFamilyName(item?.product_name),[item]);
  const hasOptions=familyItems.length>1;

  if(loading)return <main className="page"><div className="loading-state"><span className="loader"/>Loading product…</div></main>;
  if(error||!item)return <main className="page"><div className="error-state"><strong>{error||"Product not found."}</strong><Link to="/shop" className="text-link">Back to shop <span>↗</span></Link></div></main>;

  return <main className="page product-page">
    <Link to={"/shop?category="+(item.category_slug??categorySlug??"")} className="back-link">← {item.category_name}</Link>
    <div className="product-detail">
      <section className="gallery-panel">{images.length?<div className="gallery-grid">{images.slice(0,4).map(x=><img key={x.id} src={resolveMappedProductImage(x.storage_path,x.external_url)!} alt={x.alt_text??familyName??"Print Kings product"}/>)}</div>:<div className="gallery-placeholder"><span className="product-image-missing">{(familyName??"Product").slice(0,1)}</span><small>Product image coming soon</small></div>}</section>
      <section className="product-info">
        <p className="eyebrow">{item.category_name}</p>
        <h1>{familyName}</h1>
        {hasOptions&&<p className="product-parent">{familyItems.length} sizes/configurations available.</p>}
        <p className="detail-price">{money(item.price_cents)}</p>
        <p className="detail-intro">{item.short_description}</p>
        {hasOptions&&<div className="purchase-box" style={{marginBottom:"1rem"}}>
          <p className="eyebrow">Choose size / configuration</p>
          <div role="list" aria-label={"Options for "+familyName} style={{display:"grid",gap:"0.6rem"}}>
            {familyItems.map(option=>{
              const selected=option.variant_id===item.variant_id;
              return <button key={option.variant_id} type="button" onClick={()=>{if(!selected)navigate("/shop/"+option.category_slug+"/"+option.variant_slug)}} aria-current={selected?"true":undefined} className={selected?"button button-dark":"button button-light"} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",textAlign:"left"}}>
                <span>{variantChoiceLabel(option)}</span><strong>{money(option.price_cents)}</strong>
              </button>
            })}
          </div>
        </div>}
        <div className="purchase-box">
          <p className="eyebrow">Configure your product</p><h2>WHAT YOU GET</h2><p>{item.description??"Professional Print Kings equipment configured for branded use."}</p>
          <div className="purchase-row"><div className="quantity-control"><button aria-label="Decrease quantity" onClick={()=>setQty(Math.max(1,qty-1))} disabled={item.price_cents===null}>−</button><span>{qty}</span><button aria-label="Increase quantity" onClick={()=>setQty(qty+1)} disabled={item.price_cents===null}>+</button></div><strong>{item.price_cents===null?"Quote required":money((item.price_cents??0)*qty)}</strong></div>
          {item.price_cents===null?<Link to="/quote" className="button button-dark full-button">Request a quote <span>↗</span></Link>:<button onClick={()=>{add(catalogueToCart(item),qty);setAdded(true);window.setTimeout(()=>setAdded(false),2500)}} className="button button-dark full-button" aria-live="polite">{added?"Added to cart ✓":"Add to cart"} <span>↗</span></button>}
          <Link to="/build-your-setup" className="button button-light full-button">Build a complete setup <span>↗</span></Link>
        </div>
        <div className="detail-notes"><div><strong>Branding</strong><span>Availability is configuration-dependent; final artwork requirements are confirmed during the order process.</span></div><div><strong>Need a custom setup?</strong><Link to="/build-your-setup">Use the setup builder ↗</Link></div></div>
      </section>
    </div>
    {related.length>0&&<section className="related-section"><div className="section-heading"><div><p className="eyebrow">Keep exploring</p><h2>MORE FROM <span>{item.category_name}.</span></h2></div></div><div className="related-grid">{related.map(x=><Link key={x.variant_id} to={"/shop/"+x.category_slug+"/"+x.variant_slug} className="related-card"><span>{x.category_name}</span><h3>{productFamilyName(x.product_name)}</h3><strong>{money(x.price_cents)}</strong></Link>)}</div></section>}
  </main>
}
