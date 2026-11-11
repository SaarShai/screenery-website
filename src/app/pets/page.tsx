import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BespokeLink, Designs, EnquiryForm, StickyBar } from "./pets-client";
import PetsHero from "./pets-hero";
import logos from "@/data/hotel-logos.json";

const LOGOS = ["JW Marriott", "The Ritz-Carlton", "Mandarin Oriental", "St. Regis", "Fairmont", "Four Seasons", "Park Hyatt", "Kempinski", "Shangri-La", "Rocco Forte Hotels", "Belmond", "The Peninsula Hotels"].map((n) => logos.find((l) => l.alt === n)!);

// Not in the sitemap and not indexed until the owner releases it.
export const metadata: Metadata = {
  title: "Screenery for Pets — Pet surrounds for hotel rooms",
  description:
    "Printed felt surrounds for the pet bed in hotel guest rooms. Five designs, Alcove or Suite, £395 per set ex VAT. Bespoke from £895.",
  alternates: { canonical: "/pets" },
  robots: { index: false, follow: false },
};

export default function PetsPage() {
  return (
    <div className="bg-[#f5f0e7] text-[#1b1915] font-sans font-light">
<header className="sticky top-0 z-40 bg-[#f5f0e7]/90 backdrop-blur border-b border-[#d8d0c1]/70">
  <div className="mx-auto max-w-7xl px-4 md:px-12 h-16 flex items-center justify-between gap-4">
    <Link href="/" className="shrink-0 py-2.5" aria-label="Screenery home">
      <Image src="/images/screenery-logo-dark.svg" alt="Screenery" width={200} height={41} className="h-6 md:h-7 w-auto" />
    </Link>
    <nav className="hidden lg:flex items-center gap-9 text-[12px] tracking-[0.18em] uppercase text-[#47423a]">
      <a href="#collection" className="hover:text-[#1b1915]">Designs</a>
      <a href="#models" className="hover:text-[#1b1915]">Models</a>
      <a href="#object" className="hover:text-[#1b1915]">Making</a>
      <a href="#bespoke" className="hover:text-[#1b1915]">Bespoke</a>
      <a href="#questions" className="hover:text-[#1b1915]">Questions</a>
    </nav>
    <a href="#enquire" className="inline-flex items-center min-h-[44px] text-[11px] md:text-[12px] tracking-[0.18em] uppercase border border-[#1b1915] px-4 md:px-5 py-2.5 hover:bg-[#1b1915] hover:text-[#f5f0e7] transition-colors whitespace-nowrap">Enquire</a>
  </div>
</header>

<main>
<PetsHero />

<section className="mx-auto max-w-7xl px-4 md:px-12 pt-8 md:pt-12 pb-6 md:pb-10">
  <div className="flex items-center justify-between text-[11px] tracking-[0.28em] uppercase text-[#716a5e] border-b border-[#d8d0c1] pb-3">
    <span>Screenery for Pets</span>
    <span>For hotels</span>
  </div>
  <div className="grid md:grid-cols-12 gap-8 md:gap-12 mt-8 md:mt-10 items-end">
    <h1 className="md:col-span-7 font-display font-light text-[44px] leading-[1.02] md:text-[76px] md:leading-[0.98] tracking-[-0.02em]">
      A room of their own, <em className="italic text-[#2f4170]">in the style of the house.</em>
    </h1>
    <div className="md:col-span-5">
      <p className="text-[16px] leading-[1.65] text-[#47423a]">
        A printed felt surround for the pet bed in your guest rooms.
      </p>
      <div className="mt-6 border-t border-[#d8d0c1] pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <p className="font-display text-[34px] leading-none whitespace-nowrap">£395 <span className="font-sans text-[13px] text-[#716a5e]">per set, ex VAT</span></p>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#716a5e] text-right">Alcove or Suite · 5 designs</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <a id="hero-enquire" href="#enquire" className="text-center bg-[#1b1915] text-[#f5f0e7] text-[11px] md:text-[12px] tracking-[0.16em] uppercase px-3 py-4 hover:bg-[#2f4170] transition-colors whitespace-nowrap">Enquire</a>
          <a href="#collection" className="text-center text-[11px] md:text-[12px] tracking-[0.16em] uppercase px-3 py-4 border border-[#1b1915]/40 hover:border-[#1b1915] transition-colors whitespace-nowrap">Designs</a>
        </div>
      </div>
    </div>
  </div>
</section>


<section className="mx-auto max-w-6xl px-4 md:px-12 pt-14 md:pt-20 pb-6 md:pb-10">
  <p className="text-center text-[11px] tracking-[0.28em] uppercase text-[#716a5e]">Trusted by</p>
  <div className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-x-6 md:gap-x-10 gap-y-6 md:gap-y-8 items-center justify-items-center">
    {LOGOS.map((l) => (
      <Image key={l.src} src={l.src} alt={l.alt} width={520} height={180} className={`w-auto max-w-full object-contain ${l.alt === "Mandarin Oriental" ? "h-14 md:h-[68px] -my-2 opacity-80" : "h-9 md:h-11 opacity-75"}`} />
    ))}
  </div>
</section>


<section id="collection" className="mx-auto max-w-7xl px-4 md:px-12 pt-16 md:pt-24 pb-20 md:pb-28">
  <p className="text-[11px] tracking-[0.28em] uppercase text-[#2f4170]">I · The designs</p>
  <h2 className="font-display font-light text-[34px] md:text-[56px] leading-[1.02] mt-5 tracking-[-0.01em]">Five designs.</h2>

  <Designs />

</section>


<section id="welcome" className="bg-[#ece5d8]">
  <div className="mx-auto max-w-7xl px-4 md:px-12 pt-20 md:pt-28">
    <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
      <div className="md:col-span-7">
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#2f4170]">II · The Welcome</p>
        <h2 className="font-display font-light text-[34px] md:text-[52px] leading-[1.05] mt-5 tracking-[-0.01em]">A room that was expecting them both.</h2>
      </div>
      <p className="md:col-span-4 md:col-start-9 text-[16px] md:text-[17px] leading-[1.8] text-[#47423a]">It goes around the bed and bowls you already provide.</p>
    </div>
  </div>
  <figure className="mx-auto max-w-7xl md:px-12 pt-12 md:pt-16">
    <Image src="/pets/hotel/room-chinoiserie-suite.jpg" alt="A small dog in a Chinoiserie Suite, sage green with blossom, bowls inside, in a city hotel room" width={1672} height={941} sizes="100vw" className="w-full aspect-[4/3] md:aspect-[21/9] object-cover object-[55%_60%]" />
    <figcaption className="px-4 md:px-0 mt-3 text-[11px] tracking-[0.12em] uppercase text-[#716a5e] flex justify-between gap-4"><span id="cap-p2">Chinoiserie · Suite</span></figcaption>
  </figure>
  <div className="mx-auto max-w-7xl px-4 md:px-12 pt-12 md:pt-16 pb-20 md:pb-28 grid md:grid-cols-12 gap-8 md:gap-12 items-start">
    <figure className="md:col-span-5">
      <div className="overflow-hidden"><Image src="/pets/hotel/room-botanical-alcove.jpg" alt="A tabby cat in a Botanical Alcove, in a garden-view hotel room" width={1672} height={941} sizes="(min-width: 768px) 50vw, 100vw" className="w-full aspect-square object-cover object-[58%_50%]" /></div>
      <figcaption className="mt-3 text-[11px] tracking-[0.12em] uppercase text-[#716a5e] flex justify-between gap-4"><span id="cap-p3">Botanical · Alcove</span></figcaption>
    </figure>
    <div className="md:col-span-6 md:col-start-7 md:pt-16">
      <figure>
        <div className="overflow-hidden"><Image src="/pets/hotel/room-woodblock-suite.jpg" alt="A shiba inu in a Woodblock Suite, with two bowls inside, in a hotel room with pale timber" width={1672} height={941} sizes="(min-width: 768px) 50vw, 100vw" className="w-full aspect-[4/3] object-cover object-[35%_50%]" /></div>
        <figcaption className="mt-3 text-[11px] tracking-[0.12em] uppercase text-[#716a5e] flex justify-between gap-4"><span id="cap-p4">Woodblock · Suite</span></figcaption>
      </figure>
    </div>
  </div>
</section>


<section id="object" className="mx-auto max-w-7xl px-4 md:px-12 py-20 md:py-28">
  <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
    <div className="md:col-span-7">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#2f4170]">III · The Object</p>
      <h2 className="font-display font-light text-[34px] md:text-[52px] leading-[1.05] mt-5 tracking-[-0.01em]">Two layers of printed felt, hinged at two corners.</h2>
    </div>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mt-12 md:mt-16">
    <figure className="col-span-2 md:col-span-1">
      <Image src="/pets/hotel/detail-edge-toile.jpg" alt="Close-up of the top edge: two felt plies bonded together, with a bevel on each" width={1448} height={1086} sizes="(min-width: 768px) 50vw, 100vw" className="w-full aspect-[4/3] md:aspect-[4/5] object-cover" />
      <figcaption className="mt-3 text-[11px] tracking-[0.12em] uppercase text-[#716a5e] flex justify-between gap-3"><span>The 24 mm wall</span></figcaption>
    </figure>
    <figure>
      <Image src="/pets/hotel/detail-corner-toile.jpg" alt="Close-up of a grooved, rounded corner at the hinged corner" width={1448} height={1086} sizes="(min-width: 768px) 50vw, 100vw" className="w-full aspect-square md:aspect-[4/5] object-cover" />
      <figcaption className="mt-3 text-[11px] tracking-[0.12em] uppercase text-[#716a5e]">The hinged corner</figcaption>
    </figure>
    <figure>
      <Image src="/pets/hotel/detail-toppers-toile.jpg" alt="Close-up of the toppers: one set on its slot on the top edge, two beside it" width={1448} height={1086} sizes="(min-width: 768px) 50vw, 100vw" className="w-full aspect-square md:aspect-[4/5] object-cover" />
      <figcaption className="mt-3 text-[11px] tracking-[0.12em] uppercase text-[#716a5e]">The toppers</figcaption>
    </figure>
  </div>

  <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10 mt-14 md:mt-20">
    <li className="border-t border-[#1b1915] pt-5">
      <p className="font-display text-[15px] text-[#716a5e]">01</p>
      <h3 className="font-display text-[23px] leading-tight mt-2">Two plies</h3>
      <p className="text-[14px] leading-[1.75] text-[#47423a] mt-3">24 mm of PET felt, printed on both faces.</p>
    </li>
    <li className="border-t border-[#1b1915] pt-5">
      <p className="font-display text-[15px] text-[#716a5e]">02</p>
      <h3 className="font-display text-[23px] leading-tight mt-2">One hinged piece</h3>
      <p className="text-[14px] leading-[1.75] text-[#47423a] mt-3">Hinged at two corners. No tools.</p>
    </li>
    <li className="border-t border-[#1b1915] pt-5">
      <p className="font-display text-[15px] text-[#716a5e]">03</p>
      <h3 className="font-display text-[23px] leading-tight mt-2">Toppers you place</h3>
      <p className="text-[14px] leading-[1.75] text-[#47423a] mt-3">Three, slotted onto the top edge.</p>
    </li>
    <li className="border-t border-[#1b1915] pt-5">
      <p className="font-display text-[15px] text-[#716a5e]">04</p>
      <h3 className="font-display text-[23px] leading-tight mt-2">A bevelled edge</h3>
      <p className="text-[14px] leading-[1.75] text-[#47423a] mt-3">6 mm, on each layer.</p>
    </li>
  </ol>
</section>


<section id="models" className="bg-[#faf7f1] border-y border-[#d8d0c1]">
  <div className="mx-auto max-w-7xl px-4 md:px-12 py-20 md:py-28">
    <div className="grid md:grid-cols-12 gap-8 items-end">
      <div className="md:col-span-6">
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#2f4170]">Two models</p>
        <h2 className="font-display font-light text-[34px] md:text-[52px] leading-[1.05] mt-5">Alcove, or Suite.</h2>
      </div>
      <p className="md:col-span-5 md:col-start-8 text-[16px] leading-[1.8] text-[#47423a]">Every design comes in both.</p>
    </div>

    <div className="grid md:grid-cols-2 gap-12 md:gap-16 mt-12 md:mt-16">
      <article>
        <Image src="/pets/hotel/bespoke-woodblock-alcove.jpg" alt="The Woodblock design as an Alcove around a pet bed" width={1536} height={1024} sizes="(min-width: 768px) 50vw, 100vw" className="w-full aspect-[3/2] object-cover bg-[#ece5d8]" />
        <div className="flex items-baseline justify-between gap-4 mt-6 border-b border-[#d8d0c1] pb-4">
          <h3 className="font-display text-[32px] md:text-[38px]">The Alcove</h3>
        </div>
        <p className="text-[15px] leading-[1.75] text-[#47423a] mt-5">For the bed alone.</p>
        <dl className="grid grid-cols-2 gap-y-3 gap-x-6 mt-6 text-[13px]">
          <dt className="text-[#716a5e] uppercase tracking-[0.14em] text-[11px]">Width</dt><dd>approx. 115 cm</dd>
          <dt className="text-[#716a5e] uppercase tracking-[0.14em] text-[11px]">Depth</dt><dd>approx. 64 cm</dd>
          <dt className="text-[#716a5e] uppercase tracking-[0.14em] text-[11px]">Height</dt><dd>up to 75 cm</dd>
          <dt className="text-[#716a5e] uppercase tracking-[0.14em] text-[11px]">Fits a bed</dt><dd>up to 105 × 75 cm</dd>
        </dl>
      </article>
      <article>
        <Image src="/pets/hotel/bespoke-woodblock-suite.jpg" alt="The Woodblock design as a Suite around a pet bed, with two bowls on a tray and a rope toy" width={1536} height={1024} sizes="(min-width: 768px) 50vw, 100vw" className="w-full aspect-[3/2] object-cover bg-[#ece5d8]" />
        <div className="flex items-baseline justify-between gap-4 mt-6 border-b border-[#d8d0c1] pb-4">
          <h3 className="font-display text-[32px] md:text-[38px]">The Suite</h3>
        </div>
        <p className="text-[15px] leading-[1.75] text-[#47423a] mt-5">For the bed, the bowls and a toy.</p>
        <dl className="grid grid-cols-2 gap-y-3 gap-x-6 mt-6 text-[13px]">
          <dt className="text-[#716a5e] uppercase tracking-[0.14em] text-[11px]">Width</dt><dd>approx. 163 cm</dd>
          <dt className="text-[#716a5e] uppercase tracking-[0.14em] text-[11px]">Depth</dt><dd>approx. 51 cm</dd>
          <dt className="text-[#716a5e] uppercase tracking-[0.14em] text-[11px]">Height</dt><dd>up to 75 cm</dd>
        </dl>
      </article>
    </div>
    <p className="mt-10 text-[11px] tracking-[0.12em] uppercase text-[#716a5e]">Shown: Woodblock</p>
  </div>
</section>


<section id="bespoke" className="bg-[#ece5d8]">
  <div className="mx-auto max-w-7xl px-4 md:px-12 py-20 md:py-28">
    <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-center">
      <figure className="md:col-span-6 order-2 md:order-1">
        <div className="overflow-hidden aspect-[4/3]"><Image src="/pets/hotel/bespoke-travelposter-alcove.jpg" alt="Detail of the Grand Tour design: a grand hotel on a lake, with a terrier and a cat on the terrace" width={1536} height={1024} sizes="(min-width: 768px) 50vw, 100vw" className="w-full h-full object-cover scale-[1.75] origin-[52%_26%]" /></div>
        <figcaption className="mt-3 text-[11px] tracking-[0.12em] uppercase text-[#716a5e] flex justify-between gap-4"><span>Grand Tour · detail</span></figcaption>
      </figure>
      <div className="md:col-span-5 md:col-start-8 order-1 md:order-2">
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#2f4170]">IV · Made for your house</p>
        <h2 className="font-display font-light text-[34px] md:text-[48px] leading-[1.05] mt-5">Your building,<br />drawn into the art.</h2>
        <ul className="mt-6 border-t border-[#d8d0c1] text-[15px] text-[#47423a]">
          <li className="flex gap-4 py-3 border-b border-[#d8d0c1]"><span className="font-display text-[#2f4170] w-6 shrink-0">i</span>Your façade, garden, street or view</li>
          <li className="flex gap-4 py-3 border-b border-[#d8d0c1]"><span className="font-display text-[#2f4170] w-6 shrink-0">ii</span>Your colours</li>
          <li className="flex gap-4 py-3 border-b border-[#d8d0c1]"><span className="font-display text-[#2f4170] w-6 shrink-0">iii</span>Your hotel&apos;s name</li>
        </ul>
        <p className="text-[14px] leading-[1.7] text-[#47423a] mt-5">Bespoke from £895 for the first set, then £395 per set. Ex VAT.</p>
        <BespokeLink />
      </div>
    </div>
  </div>
</section>


<section id="practical">
  <div className="mx-auto max-w-7xl px-4 md:px-12 py-20 md:py-28 grid md:grid-cols-12 gap-12">
    <div className="md:col-span-4">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#2f4170]">For housekeeping</p>
      <h2 className="font-display font-light text-[30px] md:text-[44px] leading-[1.08] mt-4">Simple to live with.</h2>
      <ul className="mt-8 space-y-5 text-[15px] leading-[1.7] text-[#47423a]">
        <li className="flex gap-4"><span className="font-display text-[#2f4170]">—</span>Stand it in place. No tools.</li>
        <li className="flex gap-4"><span className="font-display text-[#2f4170]">—</span>Lift it away to clean beneath.</li>
      </ul>
    </div>

    <div className="md:col-span-7 md:col-start-6">
      <h3 className="text-[11px] tracking-[0.28em] uppercase text-[#716a5e]">Specification</h3>
      <dl className="mt-4 divide-y divide-[#d8d0c1] border-y border-[#d8d0c1] text-[14px]">
        <div className="grid grid-cols-5 gap-4 py-4"><dt className="col-span-2 text-[#716a5e]">Designs</dt><dd className="col-span-3">Five, or bespoke</dd></div>
        <div className="grid grid-cols-5 gap-4 py-4"><dt className="col-span-2 text-[#716a5e]">Material</dt><dd className="col-span-3">Printed PET felt</dd></div>
        <div className="grid grid-cols-5 gap-4 py-4"><dt className="col-span-2 text-[#716a5e]">Wall</dt><dd className="col-span-3">24 mm, printed both faces</dd></div>
        <div className="grid grid-cols-5 gap-4 py-4"><dt className="col-span-2 text-[#716a5e]">Edge</dt><dd className="col-span-3">6 mm bevel</dd></div>
        <div className="grid grid-cols-5 gap-4 py-4"><dt className="col-span-2 text-[#716a5e]">Height</dt><dd className="col-span-3">Up to 75 cm</dd></div>
        <div className="grid grid-cols-5 gap-4 py-4"><dt className="col-span-2 text-[#716a5e]">Alcove</dt><dd className="col-span-3">approx. 115 × 64 cm; bed up to 105 × 75 cm</dd></div>
        <div className="grid grid-cols-5 gap-4 py-4"><dt className="col-span-2 text-[#716a5e]">Suite</dt><dd className="col-span-3">approx. 163 × 51 cm; bed, bowls and a toy</dd></div>
        <div className="grid grid-cols-5 gap-4 py-4"><dt className="col-span-2 text-[#716a5e]">Toppers</dt><dd className="col-span-3">3 per set</dd></div>
        <div className="grid grid-cols-5 gap-4 py-4"><dt className="col-span-2 text-[#716a5e]">Assembly</dt><dd className="col-span-3">No tools</dd></div>
        <div className="grid grid-cols-5 gap-4 py-4"><dt className="col-span-2 text-[#716a5e]">Delivery</dt><dd className="col-span-3">From early December 2026</dd></div>
        <div className="grid grid-cols-5 gap-4 py-4"><dt className="col-span-2 text-[#716a5e]">Price</dt><dd className="col-span-3">£395 per set, ex VAT. Bespoke from £895. Bed, bowls and toys not included.</dd></div>
      </dl>
    </div>
  </div>
</section>


<section id="questions" className="bg-[#ece5d8]">
  <div className="mx-auto max-w-4xl px-4 md:px-12 py-20 md:py-28">
    <h2 className="font-display font-light text-[30px] md:text-[44px] leading-[1.08] text-center">Questions</h2>
    <div className="mt-12 border-t border-[#1b1915]/80">
      <details className="group border-b border-[#d8d0c1]" open>
        <summary className="list-none [&::-webkit-details-marker]:hidden flex justify-between items-center gap-6 py-6 cursor-pointer"><span className="font-display text-[19px] md:text-[22px]">When can we have it?</span><span className="group-open:rotate-45 text-[22px] transition-transform">+</span></summary>
        <p className="pb-6 text-[15px] leading-[1.8] text-[#47423a] max-w-2xl">From early December 2026.</p>
      </details>
      <details className="group border-b border-[#d8d0c1]">
        <summary className="list-none [&::-webkit-details-marker]:hidden flex justify-between items-center gap-6 py-6 cursor-pointer"><span className="font-display text-[19px] md:text-[22px]">Will it fit our beds?</span><span className="group-open:rotate-45 text-[22px] transition-transform">+</span></summary>
        <p className="pb-6 text-[15px] leading-[1.8] text-[#47423a] max-w-2xl">The Alcove fits a bed up to 105 × 75 cm. Send us your bed size and we confirm the fit.</p>
      </details>
      <details className="group border-b border-[#d8d0c1]">
        <summary className="list-none [&::-webkit-details-marker]:hidden flex justify-between items-center gap-6 py-6 cursor-pointer"><span className="font-display text-[19px] md:text-[22px]">Can we mix designs?</span><span className="group-open:rotate-45 text-[22px] transition-transform">+</span></summary>
        <p className="pb-6 text-[15px] leading-[1.8] text-[#47423a] max-w-2xl">Yes. Any designs, either model, in one order.</p>
      </details>
      <details className="group border-b border-[#d8d0c1]">
        <summary className="list-none [&::-webkit-details-marker]:hidden flex justify-between items-center gap-6 py-6 cursor-pointer"><span className="font-display text-[19px] md:text-[22px]">Is it for cats too?</span><span className="group-open:rotate-45 text-[22px] transition-transform">+</span></summary>
        <p className="pb-6 text-[15px] leading-[1.8] text-[#47423a] max-w-2xl">Yes. It goes around a dog bed or a cat bed.</p>
      </details>
      <details className="group border-b border-[#d8d0c1]">
        <summary className="list-none [&::-webkit-details-marker]:hidden flex justify-between items-center gap-6 py-6 cursor-pointer"><span className="font-display text-[19px] md:text-[22px]">Can it show our hotel?</span><span className="group-open:rotate-45 text-[22px] transition-transform">+</span></summary>
        <p className="pb-6 text-[15px] leading-[1.8] text-[#47423a] max-w-2xl">Yes. Tell us when you enquire.</p>
      </details>
    </div>
  </div>
</section>


<section aria-labelledby="how" className="mx-auto max-w-7xl px-4 md:px-12 py-16 md:py-20">
  <h2 id="how" className="text-[11px] tracking-[0.28em] uppercase text-[#2f4170]">How ordering works</h2>
  <ol className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 mt-8">
    <li className="border-t border-[#1b1915] pt-4"><p className="font-display text-[34px] leading-none text-[#8b7355]">1</p><p className="mt-3 text-[15px] leading-[1.6]">Choose designs and models.</p></li>
    <li className="border-t border-[#1b1915] pt-4"><p className="font-display text-[34px] leading-none text-[#8b7355]">2</p><p className="mt-3 text-[15px] leading-[1.6]">We confirm price and delivery date.</p></li>
    <li className="border-t border-[#1b1915] pt-4"><p className="font-display text-[34px] leading-none text-[#8b7355]">3</p><p className="mt-3 text-[15px] leading-[1.6]">You confirm the order.</p></li>
    <li className="border-t border-[#1b1915] pt-4"><p className="font-display text-[34px] leading-none text-[#8b7355]">4</p><p className="mt-3 text-[15px] leading-[1.6]">Your sets arrive.</p></li>
  </ol>
</section>

<section id="enquire" className="bg-[#1a1714] text-[#f5f0e7]">
  <div className="mx-auto max-w-7xl px-4 md:px-12 py-20 md:py-28 grid md:grid-cols-12 gap-12">
    <div className="md:col-span-5">
      <h2 className="font-display font-light text-[34px] md:text-[52px] leading-[1.05]">Enquire</h2>
      <p className="text-[16px] leading-[1.8] text-[#f5f0e7]/75 mt-6">We reply with price and delivery date.</p>
      <div className="mt-10 border-t border-[#f5f0e7]/15 pt-6 text-[13px] text-[#f5f0e7]/65 space-y-2">
        <p>£395 per set, ex VAT · Alcove or Suite · Bespoke from £895</p>
      </div>
    </div>
    <EnquiryForm />
  </div>
</section>

</main>

<footer className="bg-[#120f0c] text-[#f5f0e7]/60 pb-24 md:pb-0">
  <div className="mx-auto max-w-7xl px-4 md:px-12 py-14 grid md:grid-cols-12 gap-10 text-[13px]">
    <div className="md:col-span-4">
      <Image src="/images/screenery logo.svg" alt="Screenery" width={200} height={41} className="h-6 w-auto" />
      <p className="mt-5 leading-[1.7] max-w-xs">Illustrated felt screens for hotels and family venues, made to order.</p>
    </div>
    <div className="md:col-span-2">
      <p className="text-[11px] tracking-[0.2em] uppercase text-[#f5f0e7]/45 mb-4">Screenery</p>
      <ul className="md:space-y-2"><li><Link href="/" className="inline-block py-3 md:py-0 hover:text-[#f5f0e7]">Screens for hotels</Link></li><li><Link href="/#standard" className="inline-block py-3 md:py-0 hover:text-[#f5f0e7]">Play screens</Link></li><li><Link href="/pets" className="inline-block py-3 md:py-0 hover:text-[#f5f0e7]">For pets</Link></li></ul>
    </div>
    <div className="md:col-span-2">
      <p className="text-[11px] tracking-[0.2em] uppercase text-[#f5f0e7]/45 mb-4">This page</p>
      <ul className="md:space-y-2"><li><a href="#collection" className="inline-block py-3 md:py-0 hover:text-[#f5f0e7]">Designs</a></li><li><a href="#models" className="inline-block py-3 md:py-0 hover:text-[#f5f0e7]">Models</a></li><li><a href="#enquire" className="inline-block py-3 md:py-0 hover:text-[#f5f0e7]">Enquire</a></li></ul>
    </div>
    <div className="md:col-span-4">
      <p className="leading-[1.7]">Images are renders; colours can differ slightly. Prices exclude VAT.</p>
    </div>
  </div>
  <div className="mx-auto max-w-7xl px-4 md:px-12"><div className="py-6 border-t border-[#f5f0e7]/10 text-[12px] flex flex-col sm:flex-row justify-between gap-2">
    <span>© 2026 Screenery</span>
    <span>www.screenery.design</span>
  </div></div>
</footer>

<StickyBar />
    </div>
  );
}
