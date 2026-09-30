import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], axes: ["opsz", "SOFT"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

const description =
  "Felt play-screens for hotels: a children's play area in minutes. Illustrated, hand-finished in Britain, flat-packed when the guests check out.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.screenery.design"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Screenery",
    title: "Screenery™ — Themed Rooms Within Minutes",
    description,
    images: [{ url: "/images/princess-v33-hero.jpg", width: 2400, height: 1600, alt: "Princess Palace play-screen in a hotel suite" }],
  },
  twitter: { card: "summary_large_image" },
  title: "Screenery™ — Themed Rooms Within Minutes",
  description:
    "Transform any hotel room into a family-friendly suite — in minutes and in budget. Screenery™ delights kids and impresses parents.",
  keywords: [
    "hotel room divider",
    "themed room divider",
    "hotel family suite",
    "Screenery",
    "luxury room divider",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
