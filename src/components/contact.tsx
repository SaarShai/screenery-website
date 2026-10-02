"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { loadDraft, saveDraft } from "@/lib/enquiry";

export default function Contact() {
  const ref = useRef(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [designs, setDesigns] = useState<string[]>([]);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  // Restore the draft (designs and typed fields) from earlier in this tab, then keep it saved.
  useEffect(() => {
    const d = loadDraft();
    setDesigns(d.designs);
    setFields(d.fields);
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) saveDraft({ designs, fields });
  }, [loaded, designs, fields]);

  // "Enquire about …" adds that design here, brings the form into view and moves focus to it.
  useEffect(() => {
    const add = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      setDesigns((d) => (d.includes(name) ? d : [...d, name]));
      setSubmitted(false);
      document.getElementById("contact")?.scrollIntoView();
      heading.current?.focus({ preventScroll: true });
    };
    addEventListener("enquire", add);
    return () => removeEventListener("enquire", add);
  }, []);

  const field = (k: string) => ({
    name: k,
    value: fields[k] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFields((f) => ({ ...f, [k]: e.target.value })),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      company: formData.get("company") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      website: formData.get("website") as string,
      designs,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "We could not send your enquiry. Please email alicia@wanderland.london.");
      }

      setSubmitted(true);
      setDesigns([]);
      setFields({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 px-6 md:px-12 bg-[#221c16]"
      ref={ref}
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Slide in only: the form must stay visible if scripts never load */}
        <motion.div
          initial={{ y: 30 }}
          animate={isInView ? { y: 0 } : { y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[13px] tracking-[0.3em] uppercase text-[#c4a97d] mb-6">
            Get in Touch
          </p>
          <h2 ref={heading} tabIndex={-1} className="font-display text-3xl md:text-5xl text-white leading-tight mb-6 outline-none">
            Bring Screenery to
            <br />
            your hotel
          </h2>
          <p className="text-white/75 text-base max-w-lg mx-auto">
            Interested in learning more? Our team will be in touch
            within 24&nbsp;hours.
          </p>
          <p className="mt-3 mb-10 text-white/60 text-[14px] max-w-lg mx-auto">
            Or email Alicia at{" "}
            <a href="mailto:alicia@wanderland.london" className="text-white/85 underline underline-offset-4 decoration-white/30 hover:decoration-white">
              alicia@wanderland.london
            </a>
            . We use your details only to reply to your enquiry.
          </p>
        </motion.div>

        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: 20 }}
            animate={isInView ? { y: 0 } : { y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 text-left"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact-name" className="text-white/70 text-xs tracking-[0.15em] uppercase block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  {...field("name")}
                  id="contact-name"
                  autoComplete="name"
                  required
                  className="w-full bg-transparent border-b border-white/20 text-white py-3 text-[15px] font-light focus:outline-none focus:border-[#c4a97d] transition-colors placeholder:text-white/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-company" className="text-white/70 text-xs tracking-[0.15em] uppercase block mb-2">
                  Hotel / Company
                </label>
                <input
                  type="text"
                  {...field("company")}
                  id="contact-company"
                  autoComplete="organization"
                  required
                  className="w-full bg-transparent border-b border-white/20 text-white py-3 text-[15px] font-light focus:outline-none focus:border-[#c4a97d] transition-colors placeholder:text-white/50"
                  placeholder="Your hotel or company"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-email" className="text-white/70 text-xs tracking-[0.15em] uppercase block mb-2">
                Email
              </label>
              <input
                type="email"
                {...field("email")}
                  id="contact-email"
                  autoComplete="email"
                required
                className="w-full bg-transparent border-b border-white/20 text-white py-3 text-[15px] font-light focus:outline-none focus:border-[#c4a97d] transition-colors placeholder:text-white/50"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="text-white/70 text-xs tracking-[0.15em] uppercase block mb-2">
                Message <span className="normal-case tracking-normal text-white/50">(optional)</span>
              </label>
              <textarea
                {...field("message")}
                id="contact-message"
                rows={3}
                maxLength={2000}
                className="w-full resize-y bg-transparent border-b border-white/20 text-white py-3 text-[15px] font-light focus:outline-none focus:border-[#c4a97d] transition-colors placeholder:text-white/50"
                placeholder="Rooms or spaces, quantities, dates…"
              />
            </div>

            {designs.length > 0 && (
              <div>
                <p className="text-white/70 text-xs tracking-[0.15em] uppercase mb-3">Interested in</p>
                <ul className="flex flex-wrap gap-2">
                  {designs.map((d) => (
                    <li key={d} className="flex items-center gap-2 border border-white/30 pl-3 text-[13px] text-white">
                      {d}
                      <button type="button" onClick={() => setDesigns(designs.filter((x) => x !== d))} aria-label={`Remove ${d}`} className="px-2 py-1 text-white/70 hover:text-white">✕</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Honeypot for bots; hidden from people and screen readers */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

            <p role="alert" className="text-red-400 text-sm font-light">{error}</p>

            <div className="pt-6">
              <button
                type="submit"
                disabled={sending}
                className="group relative inline-flex items-center gap-3 text-[13px] tracking-[0.2em] uppercase bg-[#c4a97d] text-[#17150f] px-10 py-4 hover:bg-[#f6f1e8] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Sending…" : "Request Quote"}
                <span className="w-4 h-[1px] bg-current transition-all duration-500 group-hover:w-6" />
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="py-16"
            role="status"
          >
            <p className="text-white text-2xl font-extralight mb-4">
              Thank you for your enquiry.
            </p>
            <p className="text-white/75">
              We&apos;ll be in touch within 24 hours.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
