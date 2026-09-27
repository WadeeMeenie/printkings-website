import { Link } from "react-router-dom";

const useCases = [["Markets","market"],["Events","events"],["Sports","sports"],["Corporate","corporate"],["Roadshows","roadshows"],["Retail","retail"],["Hospitality","hospitality"],["Product Launches","product-launch"]];

export function HomePage() {
  return (
    <main>
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-32">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-white/50">Branded outdoor & event solutions</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[.95] tracking-[-.045em] sm:text-7xl lg:text-8xl">
              MAKE YOUR BRAND IMPOSSIBLE TO MISS.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70">
              Professional branded setups for events, markets, activations and businesses — from the structure to the finishing touches.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/build-your-setup" className="rounded-full bg-white px-7 py-4 text-sm font-black text-black">BUILD YOUR SETUP</Link>
              <Link to="/shop" className="rounded-full border border-white/30 px-7 py-4 text-sm font-black">SHOP PRODUCTS</Link>
            </div>
          </div>
          <div className="flex items-end">
            <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <p className="text-xs font-black uppercase tracking-[.2em] text-white/40">The Print Kings system</p>
              <div className="mt-8 grid gap-4">
                {["Structure","Visibility","Space","Branding"].map((item, index) => (
                  <div key={item} className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-lg font-bold">{item}</span>
                    <span className="text-sm text-white/40">0{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[.2em] text-zinc-400">Choose your use case</p>
        <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">WHAT ARE YOU BUILDING?</h2>
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/10 sm:grid-cols-4">
          {useCases.map(([item,slug]) => (
            <Link key={item} to={"/build-your-setup?type="+slug} className="bg-white p-6 transition hover:bg-zinc-100">
              <span className="text-lg font-bold">{item}</span>
              <span className="mt-8 block text-xs font-bold uppercase tracking-wider text-zinc-400">Build setup →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-zinc-100">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 lg:grid-cols-3 lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-zinc-400">Start here</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">BUILD THE COMPLETE SETUP.</h2>
          </div>
          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-3">
            {["Starter","Professional","Signature"].map((item) => (
              <Link key={item} to="/build-your-setup" className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1">
                <p className="text-xs font-black uppercase tracking-wider text-zinc-400">Setup</p>
                <h3 className="mt-2 text-2xl font-black">{item}</h3>
                <p className="mt-8 text-sm font-semibold text-zinc-500">Configure the right combination for your space.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}