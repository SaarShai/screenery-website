"use client";

import type { RefObject } from "react";
import { SWATCHES, THEME_PRESETS, type Config } from "@/lib/configurator/config";

const MAX_SWATCHES = 3;

export default function LookGroup({
  config,
  onChange,
  textRef,
}: {
  config: Config;
  onChange: (patch: Partial<Config>) => void;
  textRef: RefObject<HTMLTextAreaElement | null>;
}) {
  function toggleSwatch(hex: string) {
    const on = config.palette.includes(hex);
    if (!on && config.palette.length >= MAX_SWATCHES) return;
    onChange({ palette: on ? config.palette.filter((h) => h !== hex) : [...config.palette, hex] });
  }

  return (
    <section className="border-b border-line px-6 py-6">
      <h2 className="micro mb-4">Look</h2>

      <div className="flex flex-wrap gap-2">
        {THEME_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className="ghost"
            aria-pressed={config.theme.preset === preset}
            onClick={() =>
              onChange({ theme: { ...config.theme, preset: config.theme.preset === preset ? undefined : preset } })
            }
          >
            {preset}
          </button>
        ))}
      </div>

      <label className="mt-5 block">
        <span className="micro">What would you like to change?</span>
        <textarea
          ref={textRef}
          className="field mt-2 h-24 resize-none"
          value={config.theme.text ?? ""}
          placeholder="Sage palette, our logo on the middle wall."
          onChange={(e) => onChange({ theme: { ...config.theme, text: e.target.value } })}
        />
      </label>

      <div className="mt-5">
        <span className="micro">Palette · up to {MAX_SWATCHES}</span>
        <div className="mt-2 flex gap-2">
          {SWATCHES.map((hex) => (
            <button
              key={hex}
              type="button"
              title={hex}
              aria-label={hex}
              aria-pressed={config.palette.includes(hex)}
              onClick={() => toggleSwatch(hex)}
              className="h-8 w-8 border"
              style={{
                backgroundColor: hex,
                borderColor: config.palette.includes(hex) ? "var(--color-accent)" : "var(--color-line)",
                outline: config.palette.includes(hex) ? "1px solid var(--color-accent)" : "none",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
