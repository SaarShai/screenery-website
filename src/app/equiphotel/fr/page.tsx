import type { Metadata } from "next";
import EquipHotel from "../EquipHotel";

export const metadata: Metadata = {
  title: "The Family Suite à EquipHotel 2026 | Wanderland et partenaires",
  description: "Wanderland, Wildhood, Stroodles et Bayard à EquipHotel Paris, du 2 au 5 novembre 2026, pavillon 7.2 A044. Hospitalité familiale et Global Kids Hospitality Report 2027.",
  keywords: ["EquipHotel", "Wanderland", "Wildhood", "Stroodles", "Bayard", "Family Suite", "Kids Hospitality Report 2027"],
  alternates: { canonical: "/equiphotel/fr", languages: { en: "/equiphotel", fr: "/equiphotel/fr" } },
  openGraph: { title: "The Family Suite · EquipHotel Paris 2026", description: "Wanderland, Wildhood, Stroodles et Bayard · Jeu, lecture et moments partagés en famille.", locale: "fr_FR", url: "/equiphotel/fr", images: [{ url: "/equiphotel/play-cafe.webp", width: 1536, height: 1024, alt: "Café de jeu illustré Screenery" }] },
};

export default function Page() { return <EquipHotel lang="fr" />; }
