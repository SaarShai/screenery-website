import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
