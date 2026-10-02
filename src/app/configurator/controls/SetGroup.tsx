"use client";

import type { Config, Kit } from "@/lib/configurator/config";

export default function SetGroup({
  kit,
  config,
  onChange,
}: {
  kit: Kit;
  config: Config;
  onChange: (patch: Partial<Config>) => void;
}) {
  return (
    <section className="border-b border-line px-6 py-6">
      <h2 className="micro mb-4">Set</h2>

      {kit.layouts.length > 1 && (
        <div className="mb-5">
          <span className="micro">Layout</span>
          <div className="mt-2 flex border border-line">
            {kit.layouts.map((l) => (
              <button
                key={l.id}
                type="button"
                className="ghost flex-1 border-0"
                aria-pressed={config.layout === l.id}
                onClick={() => onChange({ layout: l.id })}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {kit.parts.some((p) => p.hinge) && (
        <div className="mb-5">
          <span className="micro">Doors</span>
          <div className="mt-2 flex border border-line">
            {(["closed", "open"] as const).map((d) => (
              <button
                key={d}
                type="button"
                className="ghost flex-1 border-0"
                aria-pressed={(config.doors ?? "closed") === d}
                onClick={() => onChange({ doors: d })}
              >
                {d === "closed" ? "Closed" : "Open"}
              </button>
            ))}
          </div>
        </div>
      )}

      {kit.extras.length > 0 && (
        <div className="mb-5">
          <span className="micro">Extras</span>
          <ul className="mt-2">
            {kit.extras.map((e) => {
              const on = config.extras.includes(e.id);
              return (
                <li key={e.id} className="flex items-center justify-between border-b border-line py-2 last:border-b-0">
                  <span className="text-[13px]">{e.label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={e.label}
                    onClick={() =>
                      onChange({ extras: on ? config.extras.filter((id) => id !== e.id) : [...config.extras, e.id] })
                    }
                    className="relative h-5 w-9 border transition-colors"
                    style={{
                      borderColor: on ? "var(--color-accent)" : "var(--color-line)",
                      backgroundColor: on ? "var(--color-accent)" : "transparent",
                    }}
                  >
                    <span
                      className="absolute top-1/2 h-3 w-3 -translate-y-1/2 transition-[left]"
                      style={{
                        left: on ? "calc(100% - 0.9rem)" : "0.15rem",
                        backgroundColor: on ? "var(--color-background)" : "var(--color-muted)",
                      }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div>
        <span className="micro">Panels</span>
        {kit.chain ? (
          <div className="mt-2 flex items-center gap-6">
            {(["left", "right"] as const).map((side) => {
              const n = config.wings?.[side] ?? 0;
              const max = kit.chain?.sides[side] ? kit.chain.max_extra : 0;
              const set = (v: number) => onChange({ wings: { left: 0, right: 0, ...config.wings, [side]: v } });
              return (
                <div key={side} className="flex items-center gap-2">
                  <span className="text-[12px] text-muted capitalize">{side}</span>
                  <button type="button" className="ghost px-3" disabled={n <= 0} aria-label={`Fewer panels ${side}`} onClick={() => set(n - 1)}>
                    −
                  </button>
                  <span className="text-[13px] tabular-nums">+{n}</span>
                  <button type="button" className="ghost px-3" disabled={n >= max} aria-label={`More panels ${side}`} onClick={() => set(n + 1)}>
                    +
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 text-[12px] text-muted">Fixed for this design</p>
        )}
      </div>
    </section>
  );
}
