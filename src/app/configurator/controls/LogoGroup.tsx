"use client";

import { useEffect, useRef, useState } from "react";
import type { Config } from "@/lib/configurator/config";

const ACCEPTED = ["image/png", "image/svg+xml"];

export default function LogoGroup({
  config,
  onChange,
}: {
  config: Config;
  onChange: (patch: Partial<Config>) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  // Object URLs live only for this session; the config carries the data URL.
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  function accept(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("PNG or SVG only.");
      return;
    }
    setError(null);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    const reader = new FileReader();
    reader.onload = () => onChange({ logo: { name: file.name, dataUrl: String(reader.result) } });
    reader.readAsDataURL(file);
  }

  return (
    <section className="border-b border-line px-6 py-6">
      <h2 className="micro mb-4">Logo</h2>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          accept(e.dataTransfer.files[0]);
        }}
        className="flex flex-col items-center gap-3 border border-dashed border-line bg-surface px-4 py-6 text-center"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- a local object URL, not an optimisable asset
          <img src={previewUrl} alt={config.logo?.name ?? "Logo"} className="max-h-16 max-w-full" />
        ) : (
          <p className="text-[12px] text-muted">Drop a PNG or SVG here</p>
        )}
        <button type="button" className="ghost" onClick={() => input.current?.click()}>
          {config.logo ? "Replace" : "Choose file"}
        </button>
        <input
          ref={input}
          type="file"
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => accept(e.target.files?.[0])}
        />
        {config.logo && <p className="text-[12px] text-muted">{config.logo.name}</p>}
        {error && <p className="text-[12px] text-accent">{error}</p>}
      </div>
    </section>
  );
}
