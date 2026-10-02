import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
const subscribe = (f: () => void) => {
  const m = matchMedia(query);
  m.addEventListener("change", f);
  return () => m.removeEventListener("change", f);
};

/**
 * True when the visitor asks for reduced motion. The server and the hydrating render both see
 * false, so the HTML matches; the real value follows straight after.
 */
export function usePrefersStill() {
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => false);
}
