/**
 * The quote draft: the designs a visitor picked and what they typed in the form. It lives in
 * this browser tab's session storage, so it survives a visit to /festive and back.
 */
export type Draft = { designs: string[]; fields: Record<string, string> };

const KEY = "screenery-enquiry";

export function loadDraft(): Draft {
  try {
    const d = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
    if (d && Array.isArray(d.designs)) return { designs: d.designs, fields: d.fields ?? {} };
  } catch {}
  return { designs: [], fields: {} };
}

export function saveDraft(d: Draft) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(d));
  } catch {}
}

/** Adds a design to the quote. The home page form shows it at once; from /festive the draft carries it there. */
export function enquire(name: string) {
  const d = loadDraft();
  if (!d.designs.includes(name)) saveDraft({ ...d, designs: [...d.designs, name] });
  window.dispatchEvent(new CustomEvent("enquire", { detail: name }));
}
