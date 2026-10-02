"use client";

import Link from "next/link";
import { enquire } from "@/lib/enquiry";

/** A festive piece's quote link: adds the piece to the quote draft, then opens the home page form. */
export default function FestiveEnquire({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <Link
      href="/#contact"
      onClick={() => enquire(name)}
      className="group/e inline-flex items-center gap-2 py-2 text-[11px] font-medium uppercase tracking-[0.2em] underline decoration-[#1f1d1a]/25 underline-offset-4 transition-colors hover:text-[#b23a3a] hover:decoration-[#b23a3a]"
    >
      {children}
      <span aria-hidden className="transition-transform duration-200 group-hover/e:translate-x-1">→</span>
    </Link>
  );
}
