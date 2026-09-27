import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useCart } from "../lib/cart";

const money = (cents: number) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);

export function CartPage() {
  const { items, subtotalCents, setQuantity, remove, clear } = useCart();
  const navigate = useNavigate();
  const [imageMap,setImageMap]=useState<Record<string,string>>({});
  useEffect(()=>{(async()=>{const ids=items.map(x=>x.variantId);if(!ids.length)return;const {data}=await supabase.from("product_images").select("variant_id,external_url,sort_order,is_primary,approved").in("variant_id",ids).eq("approved",true).order("is_primary",{ascending:false}).order("sort_order");const map:Record<string,string>={};for(const x of data??[]){if(x.variant_id&&x.external_url&&!map[x.variant_id])map[x.variant_id]=x.external_url}setImageMap(map)})()},[items]);

  if (!items.length) return <main className="mx-auto max-w-4xl px-5 py-20 text-center lg:px-8">
    <p className="eyebrow">Your setup</p><h1 className="mt-3 text-5xl font-black">YOUR CART IS EMPTY.</h1>
    <p className="mx-auto mt-5 max-w-xl leading-7 text-zinc-500">Add products from the catalogue or build a complete setup.</p>
    <div className="mt-8 flex justify-center gap-3"><Link to="/shop" className="pill-dark">SHOP PRODUCTS</Link><Link to="/build-your-setup" className="pill-light">BUILD YOUR SETUP</Link></div>
  </main>;

  return <main className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
    <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Your setup</p><h1 className="mt-3 text-5xl font-black">CART.</h1></div><button onClick={clear} className="text-sm font-bold text-zinc-500 underline">Clear cart</button></div>
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">{items.map(item => <div key={item.variantId} className="card flex gap-5 p-5">
        <div className="hidden h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400 sm:flex">{imageMap[item.variantId]?<img src={imageMap[item.variantId]} alt="" className="h-full w-full object-contain"/>:<>PRINT<br/>KINGS</>}</div>
        <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-wider text-zinc-400">{item.categoryName}</p><h2 className="mt-1 font-black">{item.variantName}</h2><p className="mt-2 text-sm text-zinc-500">{item.priceCents === null ? "Quote required" : money(item.priceCents)}</p>
          <div className="mt-4 flex items-center gap-3"><button onClick={() => setQuantity(item.variantId, item.quantity - 1)} className="qty">−</button><span className="w-6 text-center font-bold">{item.quantity}</span><button onClick={() => setQuantity(item.variantId, item.quantity + 1)} className="qty">+</button><button onClick={() => remove(item.variantId)} className="ml-3 text-xs font-bold underline">Remove</button></div>
        </div>
        <strong className="text-right">{item.priceCents === null ? "Quote" : money(item.priceCents * item.quantity)}</strong>
      </div>)}</div>
      <aside className="card h-fit p-7"><p className="eyebrow">Summary</p><div className="mt-5 flex justify-between"><span>Subtotal</span><strong>{money(subtotalCents)}</strong></div><p className="mt-3 text-xs leading-5 text-zinc-400">Final tax, shipping and payment totals are recalculated by the server at checkout.</p>
        <button onClick={() => navigate("/checkout")} className="mt-7 w-full pill-dark">CHECKOUT</button>
        <Link to="/quote" className="mt-3 block w-full pill-light text-center">REQUEST A QUOTE</Link>
      </aside>
    </div>
  </main>;
}
