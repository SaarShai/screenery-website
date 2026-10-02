import type { Metadata } from "next";
import "./configurator.css";

// Temporary section: the 3D configurator, imported from its own app on 2026-10-01. Not linked or indexed yet.
export const metadata: Metadata = {
  title: "Screenery™ · Design your set",
  description: "Configure a Screenery set and request a quote.",
  robots: { index: false, follow: false },
};

export default function ConfiguratorLayout({ children }: { children: React.ReactNode }) {
  return <div className="configurator min-h-screen">{children}</div>;
}
