import { Link } from "react-router-dom";

export function SetupBuilderPage() {
  const steps = [
    ["01","What are you building?","Market, event, sports, corporate, roadshow, retail or another activation."],
    ["02","How big is the setup?","Start small, build a professional footprint, go large or request something custom."],
    ["03","Choose your core structure","Gazebo, kiosk, parasol, banner wall, promo counter or another core structure."],
    ["04","Add visibility","Flags, banners, pop-up displays and banner walls put your brand in view."],
    ["05","Complete the space","Tables, chairs, tablecloths and counters finish the setup."],
    ["06","Review your setup","See the configuration and move to cart or request a quote."],
  ];
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[.2em] text-zinc-400">Guided configuration</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight">BUILD YOUR SETUP.</h1>
        <p className="mt-5 text-lg leading-8 text-zinc-500">Tell us what you are trying to achieve and the catalogue will guide the configuration.</p>
      </div>
      <div className="mt-12 grid gap-3">
        {steps.map(([number,title,description]) => (
          <div key={number} className="grid gap-5 rounded-3xl border border-black/10 p-7 sm:grid-cols-[80px_1fr]">
            <span className="text-sm font-black text-zinc-300">{number}</span>
            <div>
              <h2 className="text-2xl font-black">{title}</h2>
              <p className="mt-2 max-w-2xl leading-7 text-zinc-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/shop" className="rounded-full bg-black px-7 py-4 text-sm font-black text-white">BROWSE PRODUCTS</Link>
        <Link to="/quote" className="rounded-full border border-black px-7 py-4 text-sm font-black">GET A QUOTE</Link>
      </div>
    </main>
  );
}