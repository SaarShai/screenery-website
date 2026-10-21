import type { Metadata } from "next";
import EquipHotel from "./EquipHotel";

export const metadata: Metadata = {
  title: "The Family Suite at EquipHotel 2026 | Wanderland & Partners",
  description: "Meet Wanderland, Wildhood, Stroodles and Bayard at EquipHotel Paris, 2–5 November 2026, Pavilion 7.2 A044. Explore family hospitality and the Global Kids Hospitality Report 2027.",
  keywords: ["EquipHotel", "Wanderland", "Wildhood", "Stroodles", "Bayard", "Family Suite", "Kids Hospitality Report 2027"],
  alternates: { canonical: "/equiphotel", languages: { en: "/equiphotel", fr: "/equiphotel/fr" } },
  openGraph: { title: "The Family Suite · EquipHotel Paris 2026", description: "Wanderland, Wildhood, Stroodles & Bayard · Family hospitality through play, stories and time together.", url: "/equiphotel", images: [{ url: "/equiphotel/play-cafe.webp", width: 1536, height: 1024, alt: "Screenery play café illustration" }] },
};

export default function Page() { return <EquipHotel lang="en" />; }
