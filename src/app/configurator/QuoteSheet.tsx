"use client";

import { useEffect, useState } from "react";
import type { Config, Kit } from "@/lib/configurator/config";

export default function QuoteSheet({
  kit,
  config,
  onClose,
}: {
  kit: Kit;
  config: Config;
  onClose: () => void;
}) {
  const [state, setState] = useState<"form" | "sending" | "sent">("form");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const layout = kit.layouts.find((l) => l.id === config.layout)?.label ?? config.layout;
  const extras = kit.extras.filter((e) => config.extras.includes(e.id)).map((e) => e.label);
  const wings = (["left", "right"] as const).filter((s) => (config.wings?.[s] ?? 0) > 0).map((s) => `+${config.wings?.[s]} ${s}`);
  const summary = `${kit.name} · ${layout}${wings.length ? ` · panels ${wings.join(", ")}` : ""}${extras.length ? ` · ${extras.join(", ")}` : ""}`;

  async function submit(form: FormData) {
    setState("sending");
    setError(null);
    const body = {
      config,
      contact: {
        name: String(form.get("name") ?? ""),
        company: String(form.get("company") ?? ""),
        email: String(form.get("email") ?? ""),
      },
      sets: Number(form.get("sets") ?? 1),
      country: String(form.get("country") ?? ""),
      targetDate: String(form.get("targetDate") ?? ""),
      notes: String(form.get("notes") ?? ""),
    };
    const res = await fetch("/api/configurator/quote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setState("sent");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not send the request.");
      setState("form");
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex justify-end bg-ink/20" onClick={onClose}>
      <aside
        className="h-full w-full max-w-[420px] overflow-y-auto border-l border-line bg-background px-6 py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="micro">Request quote</h2>
            <p className="mt-2 text-[13px] text-muted">{summary}</p>
          </div>
          <button type="button" className="ghost" onClick={onClose}>
            Close
          </button>
        </div>

        {state === "sent" ? (
          <p className="text-[13px]">
            Thank you. Screenery has your set and will reply with a quote by email.
          </p>
        ) : (
          <form action={submit} className="flex flex-col gap-4">
            <label className="block">
              <span className="micro">Name</span>
              <input name="name" required className="field mt-2" />
            </label>
            <label className="block">
              <span className="micro">Company</span>
              <input name="company" required className="field mt-2" />
            </label>
            <label className="block">
              <span className="micro">Email</span>
              <input name="email" type="email" required className="field mt-2" />
            </label>
            <label className="block">
              <span className="micro">Sets</span>
              <input name="sets" type="number" min={1} defaultValue={1} className="field mt-2" />
            </label>
            <label className="block">
              <span className="micro">Delivery country</span>
              <input name="country" className="field mt-2" />
            </label>
            <label className="block">
              <span className="micro">Target date</span>
              <input name="targetDate" type="date" className="field mt-2" />
            </label>
            <label className="block">
              <span className="micro">Notes</span>
              <textarea name="notes" className="field mt-2 h-24 resize-none" />
            </label>
            {error && <p className="text-[12px] text-accent">{error}</p>}
            <button type="submit" className="primary" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send request"}
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
