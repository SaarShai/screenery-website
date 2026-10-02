"use client";

import Image from "next/image";
import type { DesignSummary } from "@/lib/configurator/config";

export default function DesignGroup({
  designs,
  selected,
  onSelect,
  onDescribe,
}: {
  designs: DesignSummary[];
  selected?: string;
  onSelect: (id: string) => void;
  onDescribe: () => void;
}) {
  return (
    <section className="border-b border-line px-6 py-6">
      <h2 className="micro mb-4">Design</h2>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {designs.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onSelect(d.id)}
            aria-pressed={d.id === selected}
            className="shrink-0 border p-1 text-left"
            style={{ borderColor: d.id === selected ? "var(--color-accent)" : "var(--color-line)" }}
          >
            <Image src={d.thumbnail} alt="" width={120} height={90} className="block h-[68px] w-[90px] object-cover" />
            <span className="mt-2 block px-1 pb-1 text-[12px]">{d.name}</span>
          </button>
        ))}
      </div>
      <button type="button" className="ghost mt-4" onClick={onDescribe}>
        Describe your own
      </button>
    </section>
  );
}
