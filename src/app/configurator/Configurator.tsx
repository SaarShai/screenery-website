"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { defaultConfig, type Config, type DesignSummary, type Kit } from "@/lib/configurator/config";
import type { CaptureFn } from "./Viewer";
import DesignGroup from "./controls/DesignGroup";
import LookGroup from "./controls/LookGroup";
import LogoGroup from "./controls/LogoGroup";
import SetGroup from "./controls/SetGroup";
import QuoteSheet from "./QuoteSheet";

// WebGL only exists in the browser, and the 3D bundle stays out of the first load.
const Viewer = dynamic(() => import("./Viewer"), { ssr: false });

const json = { "content-type": "application/json" };

function generationsUsed(): number {
  return Number(document.cookie.match(/(?:^|;\s*)sc_gen=(\d+)/)?.[1] ?? 0);
}

export default function Configurator({ design, configId }: { design?: string; configId?: string }) {
  const [designs, setDesigns] = useState<DesignSummary[]>([]);
  const [kit, setKit] = useState<Kit | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [tab, setTab] = useState<"3d" | "photo">("3d");
  const [shared, setShared] = useState<string | null>(null);
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState<{ url: string; summary: string; unsupported: string[]; config: string } | null>(null);
  const [gate, setGate] = useState<"closed" | "open" | "sent">("closed");
  const [email, setEmail] = useState("");
  const [used, setUsed] = useState(0);
  const capture = useRef<CaptureFn | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // index, saved config and (when the design is known up front) the kit load in parallel
      const [list, saved] = await Promise.all([
        fetch("/configurator/kits/index.json").then((r) => r.json() as Promise<DesignSummary[]>),
        configId ? fetch(`/api/configurator/c/${configId}`).then((r) => (r.ok ? (r.json() as Promise<Config>) : null)) : Promise.resolve<Config | null>(null),
      ]);
      if (cancelled) return;
      setDesigns(list);
      const id = saved?.kitId ?? design ?? list[0]?.id;
      if (!id) return;

      const loaded: Kit = await fetch(`/configurator/kits/${id}/kit.json`).then((r) => r.json());
      if (cancelled) return;
      setKit(loaded);
      setConfig(saved?.kitId === loaded.id ? saved : defaultConfig(loaded));
      setUsed(generationsUsed());
    })().catch(() => setError("Could not load the design catalogue."));
    return () => {
      cancelled = true;
    };
  }, [design, configId]);

  const patch = useCallback((p: Partial<Config>) => setConfig((c) => (c ? { ...c, ...p } : c)), []);

  async function selectDesign(id: string) {
    if (id === kit?.id) return;
    const loaded: Kit = await fetch(`/configurator/kits/${id}/kit.json`).then((r) => r.json());
    setKit(loaded);
    setConfig(defaultConfig(loaded));
  }

  async function share() {
    if (!config) return;
    const res = await fetch("/api/configurator/c", { method: "POST", headers: json, body: JSON.stringify(config) });
    const { url } = await res.json();
    const full = new URL(url, window.location.href).toString();
    try {
      await navigator.clipboard.writeText(full);
      setShared("Link copied");
    } catch {
      setShared(full);
    }
    setTimeout(() => setShared(null), 2000);
  }

  async function updatePreview() {
    if (!config || busy) return;
    setGenerateMessage(null);
    const png = capture.current?.();
    if (!png) {
      setGenerateMessage("Open the 3D view first so the preview can be captured.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/configurator/generate", { method: "POST", headers: json, body: JSON.stringify({ config, capture: png }) });
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        setPhoto({ url: data.url, summary: data.summary, unsupported: data.unsupported ?? [], config: JSON.stringify(config) });
        setTab("photo");
      } else if (data.gate) {
        setGate("open");
      } else {
        setGenerateMessage(data.message ?? "Preview could not be requested.");
      }
    } finally {
      setBusy(false);
      setUsed(generationsUsed());
    }
  }

  async function signUp() {
    const res = await fetch("/api/configurator/signup", { method: "POST", headers: json, body: JSON.stringify({ email }) });
    if (res.ok) setGate("sent");
    else setGenerateMessage((await res.json().catch(() => ({}))).error ?? "Sign-up failed.");
  }

  const stale = photo !== null && config !== null && photo.config !== JSON.stringify(config);

  return (
    <div className="flex min-h-screen flex-col wide:h-screen wide:overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-line px-6">
        <span className="text-[13px] tracking-[0.08em]">Screenery™ · Design your set</span>
        <div className="flex items-center gap-3">
          {shared && <span className="text-[12px] text-muted">{shared}</span>}
          <button type="button" className="ghost" onClick={share} disabled={!config}>
            Share
          </button>
          <button type="button" className="ghost" onClick={() => setQuoteOpen(true)} disabled={!kit || !config}>
            Request quote
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col wide:min-h-0 wide:flex-row">
        <div className="relative h-[56vh] shrink-0 wide:h-auto wide:w-[62%]">
          <div className="absolute left-5 top-5 z-10 flex border border-line bg-background">
            {(["3d", "photo"] as const).map((t) => (
              <button
                key={t}
                type="button"
                className="ghost border-0"
                aria-pressed={tab === t}
                onClick={() => setTab(t)}
              >
                {t === "3d" ? "3D" : "Photo"}
              </button>
            ))}
          </div>
          {tab === "3d" ? (
            <Viewer kit={kit} config={config} capture={capture} />
          ) : photo ? (
            <div className="flex h-full flex-col bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element -- generated file served from the app */}
              <img src={photo.url} alt={photo.summary} className="min-h-0 flex-1 object-contain" />
              <p className="px-6 py-3 text-[12px] text-muted">
                {photo.summary}
                {stale && " · The set has changed since this photo. Update preview to refresh."}
              </p>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-surface px-8 text-center">
              <p className="max-w-xs text-sm text-muted">Press Update preview to see a photo of your set.</p>
            </div>
          )}
        </div>

        <aside className="flex-1 border-t border-line wide:max-w-[380px] wide:overflow-y-auto wide:border-l wide:border-t-0">
          {error && <p className="px-6 py-6 text-[13px] text-accent">{error}</p>}
          {kit && config && (
            <>
              <DesignGroup
                designs={designs}
                selected={kit.id}
                onSelect={selectDesign}
                onDescribe={() => textRef.current?.focus()}
              />
              <LookGroup config={config} onChange={patch} textRef={textRef} />
              <LogoGroup config={config} onChange={patch} />
              <SetGroup kit={kit} config={config} onChange={patch} />
              <div className="px-6 py-6">
                <button type="button" className="primary w-full" onClick={updatePreview} disabled={busy}>
                  {busy ? "Making your photo · about a minute" : "Update preview"}
                </button>
                {generateMessage && <p className="mt-3 text-[12px] text-muted">{generateMessage}</p>}
                {photo && photo.unsupported.length > 0 && (
                  <p className="mt-3 text-[12px] text-muted">Not in this preview: {photo.unsupported.join("; ")}</p>
                )}
                {gate === "open" && (
                  <form
                    className="mt-4 flex flex-col gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      signUp();
                    }}
                  >
                    <span className="micro">Your first preview is free. Add your email for more.</span>
                    <input
                      type="email"
                      required
                      className="field"
                      placeholder="you@hotel.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="ghost">
                      Send confirmation link
                    </button>
                  </form>
                )}
                {gate === "sent" && (
                  <p className="mt-3 text-[12px] text-muted">Check your inbox and open the link, then press Update preview again.</p>
                )}
                {used >= 1 && gate === "closed" && (
                  <p className="mt-3 text-[12px] text-muted">1 free preview, then sign up for more</p>
                )}
              </div>
            </>
          )}
        </aside>
      </div>

      {quoteOpen && kit && config && (
        <QuoteSheet kit={kit} config={config} onClose={() => setQuoteOpen(false)} />
      )}
    </div>
  );
}
