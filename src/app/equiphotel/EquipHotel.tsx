import Image from "next/image";
import Link from "next/link";
import { copy } from "./content";
import styles from "./equiphotel.module.css";

const partners = [
  { name: "Screenery", href: "/", image: "/images/birthday-hotel-hero.jpg" },
  { name: "Bayard", href: "https://www.bayard-jeunesse.com/", image: "/equiphotel/bayard-biblimobile.png" },
  { name: "Wildhood", href: "https://wildhood.es", image: "/equiphotel/wildhood-playsuite.webp" },
  { name: "Stroodles", href: "https://stroodles.co.uk", image: "/equiphotel/stroodles-drinks.jpg" },
];

export default function EquipHotel({ lang }: { lang: "en" | "fr" }) {
  const t = copy[lang];

  return (
    <div className={styles.page} lang={lang}>
      <a className={styles.skip} href="#content">{t.skip}</a>
      <header className={styles.header}>
        <Link className={styles.wordmark} href="/" aria-label={t.home}>Screenery<span>by Wanderland</span></Link>
        <nav className={styles.languages} aria-label={t.languageLabel}>
          <Link href="/equiphotel" lang="en" hrefLang="en" aria-current={lang === "en" ? "page" : undefined}>EN</Link>
          <span aria-hidden="true">/</span>
          <Link href="/equiphotel/fr" lang="fr" hrefLang="fr" aria-current={lang === "fr" ? "page" : undefined}>FR</Link>
        </nav>
      </header>
      <main id="content">
        <section className={styles.intro} aria-labelledby="title">
          <p className={styles.date}>EquipHotel Paris · {t.date}</p>
          <p className={styles.suite}>The Family Suite <span>{t.by}</span></p>
          <h1 id="title">{t.title}</h1>
          <p className={styles.credit}>{t.credit}</p>
          <p className={styles.description}>{t.intro}</p>
          <p className={styles.stand}>{t.pavilion} · Paris Expo Porte de Versailles</p>
        </section>
        <section className={styles.partners} aria-label={t.partners}>
          {partners.map((partner) => (
            <a className={styles.partner} href={partner.href} key={partner.name}>
              <div className={`${styles.partnerImage} ${partner.name === "Bayard" ? styles.bayardImage : ""}`}>
                <Image src={partner.image} alt="" fill sizes="(max-width: 600px) 50vw, (max-width: 900px) 50vw, 25vw" />
              </div>
              <span>{partner.name}<span aria-hidden="true">↗</span></span>
            </a>
          ))}
        </section>
        <section id="report" className={styles.report} aria-labelledby="report-title">
          <div className={styles.cover}><Image src="/equiphotel/report-cover.webp" alt={t.coverAlt} width={1000} height={1414} sizes="(max-width: 700px) 55vw, 260px" /></div>
          <div className={styles.reportCopy}>
            <h2 id="report-title">{t.reportTitle}</h2>
            <p>{t.reportIntro}</p>
            <div className={styles.reportLinks}>
              <a href="https://www.wanderland.london/report">{t.readReport} <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>{t.footer}</footer>
    </div>
  );
}
