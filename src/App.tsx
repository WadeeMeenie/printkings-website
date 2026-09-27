import { Link, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductPage } from "./pages/ProductPage";
import { SetupBuilderPage } from "./pages/SetupBuilderPage";
import { QuotePage } from "./pages/QuotePage";

function Header() {
  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link to="/" className="text-xl font-black tracking-tight">PRINT KINGS</Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <Link to="/build-your-setup" className="hover:opacity-60">Build Your Setup</Link>
          <Link to="/shop" className="hover:opacity-60">Shop</Link>
          <Link to="/quote" className="hover:opacity-60">Get a Quote</Link>
        </nav>
        <Link to="/shop" className="rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white">SHOP</Link>
      </div>
    </header>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:categorySlug/:variantSlug" element={<ProductPage />} />
        <Route path="/build-your-setup" element={<SetupBuilderPage />} />
        <Route path="/quote" element={<QuotePage />} />
      </Routes>
      <footer className="border-t border-black/10 px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl text-sm text-zinc-500">© {new Date().getFullYear()} Print Kings. Professional branded displays and event setups.</div>
      </footer>
    </div>
  );
}

export default App;
