import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bitter, Poppins } from "next/font/google";
import Footer from "@/components/footer";
import logos from "@/data/hotel-logos.json";

const bitter = Bitter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-bitter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "Festive Collection 2026 — Screenery™",
  description:
    "A festive wonderland, set up within minutes. Gingerbread play houses, a biscuit bed wrapper and a family of festive friends in printed recycled felt, for hotel rooms, lobbies and restaurants.",
};

type Item = {
  n: string;
  kicker: string;
  title: string;
  img: string;
  w: number;
  h: number;
  copy: string;
  dims: React.ReactNode;
  price: React.ReactNode;
};

const Sep = () => <span className="mx-2 text-[#b9b3a6]">|</span>;
const P = ({ gbp, usd, eur }: { gbp: string; usd: string; eur: string }) => (
  <>
    {gbp}
    <Sep />
    {usd}
    <Sep />
    {eur}
  </>
);

const items: Item[] = [
  {
    n: "01",
    kicker: "Modular play house",
    title: "Gingerbread House",
    img: "/festive/gingerbread-house.jpg",
    w: 1385,
    h: 961,
    copy:
      "The most delicious way to celebrate the festive season, with no sticky fingers or biscuit crumbs. Candy canes, gingerbread characters, pine trees and snowflakes. A cosy, magical cabin with a double door, two narrow panels and fir-tree connectors.",
    dims: (
      <>
        <b>Width</b> 223 cm · <b>Height</b> 160 cm
        <br />
        Available with your branding and bespoke design
      </>
    ),
    price: (
      <>
        <p>
          <b>Price</b> <P gbp="£1,150" usd="$1,450" eur="€1,325" />
        </p>
        <p className="text-[#7a7468] text-[0.92em]">
          Additional panel: <P gbp="£350" usd="$450" eur="€395" /> (each)
        </p>
        <p className="mt-3">
          <b>Full Gingerbread Bundle</b>{" "}
          <span className="text-[#7a7468] text-[0.92em]">
            (Gingerbread House + Sleigh &amp; Reindeer + Christmas Tree, Polar Bear and Snowman)
          </span>{" "}
          <P gbp="£1,895" usd="$2,375" eur="€2,175" />
        </p>
      </>
    ),
  },
  {
    n: "02",
    kicker: "Around the bed",
    title: "Biscuit Bed Wrapper",
    img: "/festive/bed-wrapper.jpg",
    w: 1385,
    h: 923,
    copy:
      "Beautiful iced petit-beurre biscuits standing on edge around a double or single bed. Scalloped edges, piped icing tops, star cut-outs and printed candies, on our Screenery Bed Wrapper.",
    dims: (
      <>
        <b>Single bed</b> 95 × 200 cm · height 75 cm
        <br />
        <b>Double bed</b> 151 × 208 cm · height 75 cm
      </>
    ),
    price: (
      <>
        <p>
          <b>Single</b> <P gbp="£1,250" usd="$1,550" eur="€1,450" />
        </p>
        <p>
          <b>Double</b> <P gbp="£1,550" usd="$1,950" eur="€1,795" />
        </p>
      </>
    ),
  },
  {
    n: "03",
    kicker: "Accessories",
    title: "Sleigh & Reindeer",
    img: "/festive/sleigh.jpg",
    w: 1385,
    h: 923,
    copy:
      "A gift-laden sleigh with three pairs of leaping reindeer. Freestanding felt figures on slotted feet — a photo moment in any lobby and a runway for presents.",
    dims: <>Sold as a set of sleigh + 3 pairs</>,
    price: (
      <p>
        <b>Price</b> <P gbp="£495" usd="$595" eur="€575" />
      </p>
    ),
  },
  {
    n: "04",
    kicker: "Accessories",
    title: "Tree, Snowman & Polar Bear",
    img: "/festive/tree-snowman-bear.jpg",
    w: 1385,
    h: 923,
    copy:
      "A christmas tree, a snowman and a polar bear, each a self-standing felt figure. A lovely addition to the Gingerbread House or a special decoration placed around the hotel.",
    dims: <>Sold as a set of 3</>,
    price: (
      <p>
        <b>Price</b> <P gbp="£495" usd="$595" eur="€575" />
      </p>
    ),
  },
  {
    n: "05",
    kicker: "Walk-in play house",
    title: "Gingerbread Cottage",
    img: "/festive/cottage.jpg",
    w: 2000,
    h: 1333,
    copy:
      "A magical, immersive gingerbread cottage children can play inside. Iced biscuit roof, a wreath over the door, and a door that really opens. Candy canes, stockings, gingerbread people and baubles printed on soft felt, finished with snowy white icing all round. A cosy corner to play, hide and imagine.",
    dims: (
      <>
        <b>Width</b> 158 cm · <b>Depth</b> 166 cm · <b>Height</b> 147 cm
      </>
    ),
    price: (
      <p>
        <b>Price</b> <P gbp="£1,950" usd="$2,450" eur="€2,250" />
      </p>
    ),
  },
  {
    n: "06",
    kicker: "Walk-in play house",
    title: "Gingerbread Cottage XL",
    img: "/festive/cottage-xl.jpg",
    w: 1255,
    h: 880,
    copy:
      "An impressively large gingerbread cottage, made for lobbies, kids clubs, parties and events. A magical cabin with an opening door and peephole windows, with room inside for a group of little guests. A festive centrepiece children can step into, play in and remember.",
    dims: (
      <>
        <b>Width</b> 218 cm · <b>Depth</b> 235 cm · <b>Height</b> 147 cm
      </>
    ),
    price: (
      <p>
        <b>Price</b> <P gbp="£2,450" usd="$3,050" eur="€2,795" />
      </p>
    ),
  },
];

const info: { h: string; p: string[] }[] = [
  { h: "Installation", p: ["5 to 15 minutes to set up or take apart. No tools necessary. Designed to be modular for easy storage."] },
  {
    h: "Product properties",
    p: ["Lightweight – below tipping risk thresholds. No risk of injury with suitable use. Soft-touch and safe for children."],
  },
  {
    h: "Material properties",
    p: [
      "Extremely robust and shockproof. Material used in nurseries, hospitals and swimming pool environments. Very high colour fastness of the all-round textile surface.",
      "Flame proof B-s1,d0 (certified to EN 13501). Extremely low volatile organic compounds (certified to ASTM D5116).",
    ],
  },
  {
    h: "Environment",
    p: ["100% recyclable PET with a content of over 80% recycled material. eco-1 rating within eco-bau & Minergie-Eco requirements. Cradle to Cradle Bronze certified."],
  },
  {
    h: "Cleaning & care",
    p: [
      "Screenery can be cleaned with a damp cloth, spray disinfectants and a vacuum cleaner as required. For heavier cleaning, marks and stains can be removed with isopropyl alcohol spray, which is commonly available; this will not affect the colour of the material or printing. Any dents in the panels can easily be ironed out with a standard iron heated to approx 160 °C, moved gently over the dent for a few moments.",
    ],
  },
  {
    h: "Durability & re-usability",
    p: [
      "Screenery is designed for multiple uses, unlike materials such as cardboard or foam. The material does not wear and tear, nor does the colour or print fade over time. Screenery is weatherproof and waterproof and needs no special storage conditions; suitable for rooms as well as public and outdoor spaces. Used with due care, it should last for many years.",
    ],
  },
  { h: "Ordering", p: ["Prices as listed; bespoke themes, colours and artwork on request. Lead times and delivery on enquiry."] },
];

const certs = [
  ["cert-fire-bs-en-13501", "Fire rated BS EN 13501"],
  ["cert-m1", "M1 emission class"],
  ["cert-cradle-to-cradle", "Cradle to Cradle certified"],
  ["cert-eco-1", "eco-1"],
  ["cert-sustainable", "Sustainable"],
  ["cert-made-in-britain", "Made in Britain"],
  ["cert-patented", "Patented"],
  ["cert-hand-made", "Hand made"],
];

const kicker = "font-[family-name:var(--font-poppins)] text-[11px] tracking-[0.28em] uppercase text-[#b23a3a] font-medium";
const rule = "border-t border-[#d9d3c7]";

export default function FestivePage() {
  return (
    <main className={`${bitter.variable} ${poppins.variable} bg-[#f7f4ee] text-[#1f1d1a] font-[family-name:var(--font-poppins)] font-light`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#f7f4ee]/90 backdrop-blur-md border-b border-[#e6e0d4]">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Screenery home">
            <Image src="/images/screenery-logo-dark.svg" alt="Screenery" width={200} height={41} className="h-6 md:h-7 w-auto" priority />
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline text-[11px] tracking-[0.28em] uppercase text-[#7a7468]">Festive Collection 2026</span>
            <Link
              href="/#contact"
              className="text-[11px] tracking-[0.2em] uppercase font-medium bg-[#1f1d1a] text-white px-4 py-2.5 rounded-full hover:bg-[#b23a3a] transition-colors"
            >
              Request quote
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 md:px-10 pt-10 md:pt-16 pb-12 md:pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:grid-rows-[auto_auto] lg:gap-x-12 lg:gap-y-8">
          <div className="relative aspect-[390/333] overflow-hidden rounded-[10px] lg:col-start-1 lg:row-start-1 xl:row-span-2 xl:aspect-auto xl:h-full xl:min-h-[560px]">
            <Image src="/festive/hero.jpg" alt="Gingerbread House and Biscuit Bed Wrapper in a hotel room" fill priority sizes="(min-width:1024px) 800px, 100vw" className="object-cover object-[12%_50%]" />
          </div>
          <div className="lg:col-start-2 lg:row-start-1">
            <p className={kicker}>Festive Collection 2026</p>
            <h1 className="font-[family-name:var(--font-bitter)] font-normal text-[34px] md:text-[40px] leading-[1.1] mt-3">
              A Festive Wonderland, set up within minutes.
            </h1>
            <p className="mt-5 text-[15px] leading-[1.65] text-[#3f3b35]">
              Turn any hotel room, lobby or restaurant into a candy-house Christmas for your youngest guests. A gingerbread play house, a biscuit bed wrapper and a family of festive friends — printed recycled felt, delivered flat, standing in minutes and packed away after the season.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:col-start-1 lg:row-start-2 xl:col-start-2 xl:row-start-2 xl:grid-cols-1 xl:self-end [&_figure]:max-w-[300px] xl:[&_figure]:max-w-[230px]">
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
                <Image src="/festive/lobby.jpg" alt="Gingerbread House in a hotel lobby" fill sizes="640px" quality={90} className="object-cover" />
              </div>
              <figcaption className="mt-2 text-[10px] tracking-[0.26em] uppercase text-[#7a7468]">Hotel lobby &amp; reception area</figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
                <Image src="/festive/dining.jpg" alt="Festive figures in a hotel restaurant" fill sizes="640px" quality={90} className="object-cover" />
              </div>
              <figcaption className="mt-2 text-[10px] tracking-[0.26em] uppercase text-[#7a7468]">Restaurant &amp; events</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="mx-auto max-w-6xl px-6 md:px-10 pb-16 md:pb-24">
        <p className={`${kicker} mb-8`}>The pieces</p>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {items.map((it) => (
            <article key={it.n} className="flex flex-col">
              <div className="relative aspect-[3/2] overflow-hidden rounded-[6px]">
                <Image src={it.img} alt={it.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
              </div>
              <p className={`${kicker} mt-6`}>
                {it.n} · {it.kicker}
              </p>
              <h2 className="font-[family-name:var(--font-bitter)] font-normal text-[26px] md:text-[28px] leading-tight mt-1">{it.title}</h2>
              <p className="mt-3 text-[14px] leading-[1.65] text-[#3f3b35]">{it.copy}</p>
              <div className={`${rule} mt-5 pt-3 text-[12px] leading-[1.7] text-[#7a7468] [&_b]:font-medium [&_b]:text-[#1f1d1a]`}>{it.dims}</div>
              <div className={`${rule} mt-auto pt-3 text-[13px] leading-[1.7] [&_b]:font-medium`}>{it.price}</div>
            </article>
          ))}
        </div>
      </section>

      {/* Trusted by */}
      <section className="mx-auto max-w-6xl px-6 md:px-10 pb-16 md:pb-24">
        <p className={`${kicker} mb-6`}>Trusted by</p>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-x-8 gap-y-6 opacity-60">
          {logos.map((l) => (
            <div key={l.src} className="relative aspect-[520/180]">
              <Image src={l.src} alt={l.alt} fill sizes="160px" className="object-contain scale-[0.8]" />
            </div>
          ))}
        </div>
      </section>

      {/* Information */}
      <section className="bg-white border-t border-[#e6e0d4]">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-24">
          <p className={kicker}>General information</p>
          <h2 className="font-[family-name:var(--font-bitter)] font-normal text-[28px] md:text-[32px] leading-tight mt-2">Durability, material &amp; care.</h2>
          <p className="mt-3 text-[15px] text-[#3f3b35]">High-performance luxury room divider, made from 100% PET recycled panels.</p>
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-2xl">
            <div className="relative aspect-[1082/367] overflow-hidden rounded-[6px]">
              <Image src="/festive/felt-orange.jpg" alt="Orange felt close-up" fill sizes="340px" className="object-cover" />
            </div>
            <div className="relative aspect-[1082/367] overflow-hidden rounded-[6px]">
              <Image src="/festive/felt-green.jpg" alt="Green felt close-up" fill sizes="340px" className="object-cover" />
            </div>
          </div>
          <div className="mt-10 columns-1 md:columns-2 gap-12 [&>div]:break-inside-avoid">
            {info.map((s) => (
              <div key={s.h} className="mb-6">
                <h3 className="font-medium text-[13px] tracking-[0.02em] text-[#1f1d1a]">{s.h}</h3>
                {s.p.map((t, i) => (
                  <p key={i} className={`text-[13px] leading-[1.7] text-[#3f3b35] ${i ? "mt-3" : "mt-1"}`}>
                    {t}
                  </p>
                ))}
              </div>
            ))}
            <div className="mb-6">
              <h3 className="font-medium text-[13px] text-[#1f1d1a]">Contact</h3>
              <p className="text-[13px] leading-[1.7] text-[#3f3b35] mt-1">
                Screenery™ by Wanderland ·{" "}
                <a href="mailto:alicia@wanderland.london" className="underline underline-offset-2 hover:text-[#b23a3a]">
                  alicia@wanderland.london
                </a>
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 md:gap-8">
            {certs.map(([f, alt]) => (
              <Image key={f} src={`/festive/${f}.png`} alt={alt} width={140} height={140} className="h-14 md:h-16 w-auto" />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
