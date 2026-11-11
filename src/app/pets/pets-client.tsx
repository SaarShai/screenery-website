"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { enquire, loadDraft, saveDraft } from "@/lib/enquiry";
import data from "@/data/pets-hotel.json";

type Model = "alcove" | "suite";
const LABEL = { alcove: "Alcove", suite: "Suite" } as const;
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

/** The five style cards and the bespoke card. Each card has its own Alcove / Suite switch; "Enquire" puts "<Style> — <Model>" in the quote form. */
export function Styles() {
  const [models, setModels] = useState<Record<string, Model>>({});
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-14 mt-12 md:mt-16 border-t border-[#d8d0c1] pt-10 md:pt-12">
      {data.styles.map((d, i) => {
        const m = models[d.id] ?? "alcove";
        return (
          <article key={d.id} className="flex flex-col">
            <div className="relative overflow-hidden bg-[#ece5d8]">
              <Image src={`/pets/hotel/bespoke-${d.id}-${m}.jpg`} alt={`${d.name}, ${LABEL[m]} model`} width={1536} height={1024}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="w-full aspect-[3/2] object-cover" />
            </div>
            <p className="mt-5 text-[10px] tracking-[0.22em] uppercase text-[#716a5e]">No. {ROMAN[i]}</p>
            <h3 className="font-display text-[25px] leading-[1.15] mt-1.5">{d.name}</h3>
            <p className="text-[14px] leading-[1.65] text-[#47423a] mt-2">{d.text}</p>
            <p className="text-[13px] leading-[1.6] text-[#716a5e] mt-2"><span className="text-[#1b1915]">Toppers:</span> {d.toppers}</p>
            <div className="mt-auto pt-5">
              <div className="flex border border-[#d8d0c1]" role="group" aria-label={`Choose a model for ${d.name}`}>
                {(["alcove", "suite"] as const).map((k) => (
                  <button key={k} type="button" aria-pressed={m === k} onClick={() => setModels((s) => ({ ...s, [d.id]: k }))}
                    className={`flex-1 min-h-[44px] text-[11px] tracking-[0.16em] uppercase py-2.5 ${m === k ? "bg-[#1b1915] text-[#f5f0e7]" : "text-[#47423a] hover:text-[#1b1915]"}`}>
                    {LABEL[k]}
                  </button>
                ))}
              </div>
              <div className="flex items-baseline justify-between gap-3 mt-3">
                <p className="text-[12px] text-[#716a5e]">{data.size[m]}</p>
                <p className="font-display text-[17px] whitespace-nowrap">
                  £395 <span className="font-sans text-[11px] text-[#716a5e]">ex VAT</span>
                </p>
              </div>
              <button type="button" onClick={() => enquire(`${d.name} — ${LABEL[m]}`)}
                className="mt-1 py-3.5 text-[11px] tracking-[0.16em] uppercase underline decoration-[#1b1915] decoration-1 underline-offset-[6px] hover:text-[#2f4170] hover:decoration-[#2f4170]">
                Enquire about this style
              </button>
            </div>
          </article>
        );
      })}
      <article className="flex flex-col">
        <div className="relative overflow-hidden bg-[#ece5d8] aspect-[3/2]">
          <Image src="/pets/hotel/bespoke-travelposter-alcove.jpg" alt="Detail of the Grand Tour style: a grand hotel on a lake, with a terrier and a cat on the terrace" width={1536} height={1024}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="w-full h-full object-cover scale-[1.75] origin-[52%_26%]" />
        </div>
        <p className="mt-5 text-[10px] tracking-[0.22em] uppercase text-[#716a5e]">Bespoke</p>
        <h3 className="font-display text-[25px] leading-[1.15] mt-1.5">Your hotel in the art</h3>
        <p className="text-[14px] leading-[1.65] text-[#47423a] mt-2">Your building, your colours, your hotel&apos;s name.</p>
        <div className="mt-auto pt-5">
          <div className="flex items-baseline justify-end gap-3 mt-3">
            <p className="font-display text-[17px] whitespace-nowrap"><span className="font-sans text-[11px] text-[#716a5e]">from</span> £895</p>
          </div>
          <BespokeLink className="inline-block mt-1 py-3.5 text-[11px] tracking-[0.16em] uppercase underline decoration-[#1b1915] decoration-1 underline-offset-[6px] hover:text-[#2f4170] hover:decoration-[#2f4170]" />
        </div>
      </article>
    </div>
  );
}

export function BespokeLink({ className = "inline-block mt-5 py-3.5 text-[12px] tracking-[0.18em] uppercase underline decoration-[#1b1915] decoration-1 underline-offset-[6px] hover:text-[#2f4170] hover:decoration-[#2f4170]" }: { className?: string }) {
  return <a href="#enquire" onClick={() => enquire("Bespoke")} className={className}>Ask about bespoke artwork</a>;
}

const label = "text-[11px] tracking-[0.2em] uppercase text-[#f5f0e7]/55";
const input = "mt-2 w-full bg-transparent border-b border-[#f5f0e7]/30 focus:border-[#f5f0e7] outline-none py-3 text-[16px] placeholder:text-[#f5f0e7]/45";

/** The quote form. It sends to /api/contact, as the home page form does. The API has no fields for rooms, model and date, so they go at the top of the message. */
export function QuoteForm() {
  const [designs, setDesigns] = useState<string[]>([]);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [flash, setFlash] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const d = loadDraft();
    setDesigns(d.designs);
    setFields(d.fields);
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) saveDraft({ designs, fields });
  }, [loaded, designs, fields]);

  useEffect(() => {
    const add = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      setDesigns((d) => (d.includes(name) ? d : [...d, name]));
      setDone(false);
      setFlash((n) => n + 1);
      document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
    };
    addEventListener("enquire", add);
    return () => removeEventListener("enquire", add);
  }, []);

  // The Model field follows the chosen cards (Alcove, Suite or Both); the visitor can change it.
  useEffect(() => {
    const models = new Set(designs.map((l) => (l.endsWith("Suite") ? "Suite" : l.endsWith("Alcove") ? "Alcove" : "")).filter(Boolean));
    if (models.size) setFields((f) => ({ ...f, model: models.size > 1 ? "Both" : [...models][0] }));
  }, [designs]);

  const field = (k: string) => ({
    name: k,
    value: fields[k] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFields((f) => ({ ...f, [k]: e.target.value })),
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    const f = fields;
    const extra = [f.rooms && `Number of rooms: ${f.rooms}`, f.model && f.model !== "Not sure yet" && `Model: ${f.model}`, f.needed_by && `Needed by: ${f.needed_by}`].filter(Boolean).join("\n");
    const body = {
      name: f.name ?? "",
      company: f.hotel ?? "",
      email: f.email ?? "",
      message: [extra, f.message].filter(Boolean).join("\n\n"),
      website: new FormData(e.currentTarget).get("website") as string,
      designs,
    };
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "We could not send your enquiry. Please email alicia@wanderland.london.");
      }
      setDone(true);
      setDesigns([]);
      setFields({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="md:col-span-6 md:col-start-7 space-y-6">
      <style>{"@keyframes pets-flash{0%,100%{background-color:transparent}20%{background-color:rgba(196,169,125,.22)}}"}</style>
      <div>
        <p className={`${label} mb-3`}>Your selection</p>
        <div key={flash} style={flash ? { animation: "pets-flash 1.6s ease" } : undefined} className="flex flex-wrap gap-2 min-h-[40px] items-center">
          {designs.length === 0 && <span className="text-[14px] text-[#f5f0e7]/55">None yet. Choose from the styles, or tell us below.</span>}
          {designs.map((d) => (
            <span key={d} className="inline-flex items-center gap-2 border border-[#f5f0e7]/30 px-3 py-2 text-[13px]">
              {d}
              <button type="button" aria-label={`Remove ${d}`} onClick={() => setDesigns(designs.filter((x) => x !== d))}
                className="inline-flex items-center justify-center w-11 h-11 -my-3 -mr-3 text-[#f5f0e7]/55 hover:text-[#f5f0e7]">×</button>
            </span>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <label className="block"><span className={label}>Name</span>
          <input required autoComplete="name" maxLength={200} {...field("name")} className={input} /></label>
        <label className="block"><span className={label}>Hotel</span>
          <input required autoComplete="organization" maxLength={200} {...field("hotel")} className={input} /></label>
        <label className="block"><span className={label}>Email</span>
          <input required type="email" autoComplete="email" maxLength={320} {...field("email")} className={input} /></label>
        <label className="block"><span className={label}>Number of rooms</span>
          <input inputMode="numeric" placeholder="e.g. 6" maxLength={20} {...field("rooms")} className={input} /></label>
        <label className="block"><span className={label}>Model</span>
          <select {...field("model")} value={fields.model ?? "Not sure yet"} className={`${input} [color-scheme:dark] [&>option]:text-[#1b1915]`}>
            <option>Not sure yet</option><option>Alcove</option><option>Suite</option><option>Both</option>
          </select></label>
        <label className="block"><span className={label}>Needed by <span className="normal-case tracking-normal">(optional)</span></span>
          <input type="date" {...field("needed_by")} className={`${input} [color-scheme:dark] text-[#f5f0e7]/80`} /></label>
      </div>
      <label className="block"><span className={label}>Message <span className="normal-case tracking-normal">(optional)</span></span>
        <textarea rows={3} maxLength={1800} placeholder="Bed sizes, rooms, a bespoke idea…" {...field("message")} className={`${input} resize-none`} /></label>
      {/* Honeypot for bots; hidden from people and screen readers */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-2">
        <button type="submit" disabled={sending} className="bg-[#f5f0e7] text-[#1b1915] text-[12px] tracking-[0.18em] uppercase px-8 py-4 hover:bg-[#c4a97d] transition-colors disabled:opacity-50">
          {sending ? "Sending…" : "Request a quote"}
        </button>
        <p className="text-[12px] text-[#f5f0e7]/55">No obligation. We use your details only to reply.</p>
      </div>
      <p role="alert" className="text-[14px] text-red-300">{error}</p>
      {done && <p role="status" className="text-[14px] text-[#c4a97d]">Thank you. Your enquiry is with the Screenery team.</p>}
    </form>
  );
}

/** Phone only: a slim bar with the price and the quote button. It hides while the form is on screen. */
export function StickyBar() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = document.getElementById("enquire");
    if (!el) return;
    const io = new IntersectionObserver(([en]) => setHidden(en.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div style={hidden ? { transform: "translateY(110%)" } : undefined}
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#f5f0e7]/95 backdrop-blur border-t border-[#d8d0c1] px-4 py-3 flex items-center justify-between gap-3 transition-transform">
      <div className="leading-tight">
        <p className="font-display text-[18px]">£395 <span className="font-sans text-[11px] text-[#716a5e]">per set, ex VAT</span></p>
        <p className="text-[11px] text-[#716a5e]">First deliveries from early December</p>
      </div>
      <a href="#enquire" className="inline-flex items-center min-h-[44px] bg-[#1b1915] text-[#f5f0e7] text-[11px] tracking-[0.16em] uppercase px-5 py-3 whitespace-nowrap">Request a quote</a>
    </div>
  );
}
