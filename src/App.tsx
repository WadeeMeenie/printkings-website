import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductPage } from "./pages/ProductPage";
import { SetupBuilderPage } from "./pages/SetupBuilderPage";
import { QuotePage } from "./pages/QuotePage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { AuthPage } from "./pages/AuthPage";
import { PackagesPage } from "./pages/PackagesPage";
import { SolutionsPage } from "./pages/SolutionsPage";
import { CheckoutResultPage } from "./pages/CheckoutResultPage";
import { CartProvider, useCart } from "./lib/cart";
import { supabase } from "./lib/supabase";

function Header() {
  const { count } = useCart();
  const [signedIn,setSignedIn]=useState(false);
  const location=useLocation(); const navigate=useNavigate();
  useEffect(()=>{supabase.auth.getSession().then(({data})=>setSignedIn(!!data.session)).catch(()=>setSignedIn(false));const {data}=supabase.auth.onAuthStateChange((_e,s)=>setSignedIn(!!s));return()=>data.subscription.unsubscribe()},[]);
  return <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
    <Link to="/" className="text-xl font-black tracking-[-.04em]">PRINT KINGS<span className="text-zinc-300">.</span></Link>
    <nav className="hidden items-center gap-7 text-sm font-bold md:flex"><Link to="/build-your-setup">Build Your Setup</Link><Link to="/shop">Shop</Link><Link to="/solutions">Solutions</Link><Link to="/packages">Packages</Link><Link to="/quote">Get a Quote</Link></nav>
    <div className="flex items-center gap-2"><Link to="/cart" className="rounded-full border border-black/10 px-4 py-2 text-sm font-bold">Cart {count>0&&<span className="ml-1">({count})</span>}</Link><button onClick={()=>navigate(signedIn?"/account":"/account?next="+encodeURIComponent(location.pathname))} className="hidden rounded-full bg-black px-4 py-2 text-sm font-bold text-white sm:block">{signedIn?"ACCOUNT":"SIGN IN"}</button></div>
  </div></header>;
}
function Storefront(){return <div className="min-h-screen bg-white text-zinc-950"><Header/><Routes>
<Route path="/" element={<HomePage/>}/><Route path="/shop" element={<ShopPage/>}/><Route path="/shop/:categorySlug/:variantSlug" element={<ProductPage/>}/><Route path="/build-your-setup" element={<SetupBuilderPage/>}/><Route path="/quote" element={<QuotePage/>}/><Route path="/cart" element={<CartPage/>}/><Route path="/checkout" element={<CheckoutPage/>}/><Route path="/checkout/success" element={<CheckoutResultPage kind="success"/>}/><Route path="/checkout/cancelled" element={<CheckoutResultPage kind="cancelled"/>}/><Route path="/checkout/failed" element={<CheckoutResultPage kind="failed"/>}/><Route path="/account" element={<AuthPage/>}/><Route path="/packages" element={<PackagesPage/>}/><Route path="/solutions" element={<SolutionsPage/>}/>
</Routes><footer className="mt-20 border-t border-black/10 px-5 py-12 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black">PRINT KINGS.</p><p className="mt-1 text-sm text-zinc-500">Make your brand impossible to miss.</p></div><div className="flex gap-5 text-sm font-bold"><Link to="/shop">Shop</Link><Link to="/build-your-setup">Build</Link><Link to="/quote">Quote</Link></div></div></footer></div>}
export default function App(){return <CartProvider><Storefront/></CartProvider>}
