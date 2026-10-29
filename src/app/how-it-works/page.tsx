import type { Metadata } from "next";
import Link from "next/link";
import AnimatedLogo from "@/components/animated-logo";
import Comparison from "./comparison";
import styles from "./gallery.module.css";

export const metadata: Metadata = {
  title: "Before and after | Screenery",
  description: "Explore how Screenery transforms rooms and shared spaces.",
  alternates: { canonical: "/how-it-works" },
};

const scenes = [
  { id: "festive", title: "Festive", flip: true },
  { id: "paris", title: "Paris" },
  { id: "marine-pod", title: "Marine Pod" },
  { id: "cafe", title: "Play Café" },
  { id: "reading", title: "Reading Corner", flip: true },
  { id: "san-francisco", title: "San Francisco" },
  { id: "marine-bed", title: "Marine Bed Wrapper" },
  { id: "birthday", title: "Birthday" },
  { id: "treehouse", title: "Treehouse" },
  { id: "aurora", title: "Aurora" },
  { id: "racecar", title: "Race Car" },
  { id: "festive-lobby", title: "Festive Lobby", width: 2560, height: 1634 },
];

export default function GalleryPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" aria-label="Screenery home" className={styles.logo}><AnimatedLogo /></Link>
        <Link href="/">Explore Screenery <span aria-hidden="true">↗</span></Link>
      </header>
      <div className={styles.content}>
        <div className={styles.intro}>
          <h1>Themed rooms in 10 minutes.</h1>
          <p>Drag the slider to see each space transform.</p>
        </div>
        <div className={styles.grid}>
          {scenes.map((scene) => <Comparison key={scene.id} {...scene} />)}
        </div>
      </div>
    </main>
  );
}
