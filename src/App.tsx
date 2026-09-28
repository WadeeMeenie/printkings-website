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

const navItems = [
  ["Shop", "/shop"],
  ["Packages", "/packages"],
  ["Solutions", "/solutions"],
  ["Build your setup", "/build-your-setup"],
] as const;

function Header() {
  const { count } = useCart();
  const [signedIn, setSignedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session && !data.session.user.is_anonymous)).catch(() => setSignedIn(false));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session && !session.user.is_anonymous));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => setOpen(false), [location.pathname]);
  const accountPath = signedIn ? "/account" : `/account?next=${encodeURIComponent(location.pathname)}`;
  return (
    <header className="site-header">
      <div className="announcement"><span>OUTDOOR BRANDING • EVENTS • ACTIVATIONS</span><span className="announcement-note">Built for brands that show up.</span></div>
      <div className="nav-wrap">
        <Link to="/" className="wordmark" aria-label="Print Kings home"><img src="/printkings-website/images/brand/print-kings-logo.webp" alt="Print Kings — Royal Quality. Every Impression." /></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => <Link key={href} className={location.pathname === href ? "active" : ""} to={href}>{label}</Link>)}
        </nav>
        <div className="nav-actions">
          <Link to="/quote" className="quote-link">Get a quote</Link>
          <Link to="/cart" className="cart-link">Cart <span className={count ? "cart-count has-items" : "cart-count"}>{count}</span></Link>
          <button className="account-button" onClick={() => navigate(accountPath)}>{signedIn ? "Account" : "Sign in"}</button>
          <button className="menu-button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><span /> <span /> <span /><b className="sr-only">Menu</b></button>
        </div>
      </div>
      {open && <div id="mobile-menu" className="mobile-menu">
        <nav aria-label="Mobile navigation">
          {navItems.map(([label, href]) => <Link key={href} to={href}>{label}<span>↗</span></Link>)}
          <Link to="/quote">Request a quote<span>↗</span></Link>
          <Link to={accountPath}>{signedIn ? "Your account" : "Sign in"}<span>↗</span></Link>
        </nav>
        <Link to="/cart" className="mobile-cart">View cart <strong>{count} items</strong></Link>
      </div>}
    </header>
  );
}

function Footer() {
  return <footer className="site-footer"><div className="footer-grid"><div><Link to="/" className="wordmark footer-mark"><img src="/printkings-website/images/brand/print-kings-logo.webp" alt="Print Kings" /></Link><p className="footer-tagline">Make your brand<br />impossible to miss.</p></div><div><p className="footer-label">Explore</p><Link to="/shop">Shop products</Link><Link to="/packages">Packages</Link><Link to="/solutions">Solutions</Link></div><div><p className="footer-label">Build</p><Link to="/build-your-setup">Build your setup</Link><Link to="/quote">Request a quote</Link><Link to="/cart">Cart</Link></div><div><p className="footer-label">Print Kings</p><p className="footer-copy">Branded outdoor equipment and promotional setups for businesses, events and activations.</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Print Kings</span><span>South Africa</span></div></footer>;
}

function Storefront() {
  return <div className="storefront"><Header /><Routes>
    <Route path="/" element={<HomePage />} /><Route path="/shop" element={<ShopPage />} /><Route path="/shop/:categorySlug/:variantSlug" element={<ProductPage />} /><Route path="/build-your-setup" element={<SetupBuilderPage />} /><Route path="/quote" element={<QuotePage />} /><Route path="/cart" element={<CartPage />} /><Route path="/checkout" element={<CheckoutPage />} /><Route path="/checkout/success" element={<CheckoutResultPage kind="success" />} /><Route path="/checkout/cancelled" element={<CheckoutResultPage kind="cancelled" />} /><Route path="/checkout/failed" element={<CheckoutResultPage kind="failed" />} /><Route path="/account" element={<AuthPage />} /><Route path="/packages" element={<PackagesPage />} /><Route path="/solutions" element={<SolutionsPage />} />
  </Routes><Footer /></div>;
}

export default function App() { return <CartProvider><Storefront /></CartProvider>; }
