"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

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
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 px-8 md:px-16 lg:px-24 bg-[#1a1a1a]"
      ref={ref}
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[13px] tracking-[0.3em] uppercase text-[#c4a97d] mb-6">
            Get in Touch
          </p>
          <h2 className="text-3xl md:text-5xl font-extralight text-white leading-tight mb-6">
            Bring Screenery to
            <br />
            your hotel
          </h2>
          <p className="text-white/50 text-base font-light mb-10 max-w-lg mx-auto">
            Interested in learning more? Our team will be in touch
            within 24&nbsp;hours.
          </p>
        </motion.div>

        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 text-left"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-white/40 text-xs tracking-[0.15em] uppercase block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-transparent border-b border-white/20 text-white py-3 text-[15px] font-light focus:outline-none focus:border-[#c4a97d] transition-colors placeholder:text-white/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs tracking-[0.15em] uppercase block mb-2">
                  Hotel / Company
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  className="w-full bg-transparent border-b border-white/20 text-white py-3 text-[15px] font-light focus:outline-none focus:border-[#c4a97d] transition-colors placeholder:text-white/20"
                  placeholder="Your hotel or company"
                />
              </div>
            </div>

            <div>
              <label className="text-white/40 text-xs tracking-[0.15em] uppercase block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-transparent border-b border-white/20 text-white py-3 text-[15px] font-light focus:outline-none focus:border-[#c4a97d] transition-colors placeholder:text-white/20"
                placeholder="your@email.com"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-light">{error}</p>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={sending}
                className="group relative inline-flex items-center gap-3 text-[13px] tracking-[0.2em] uppercase text-white border border-white/30 px-10 py-4 hover:bg-white hover:text-[#1a1a1a] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Sending…" : "Send Enquiry"}
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
          >
            <p className="text-white text-2xl font-extralight mb-4">
              Thank you for your enquiry.
            </p>
            <p className="text-white/50 font-light">
              We&apos;ll be in touch within 24 hours.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
