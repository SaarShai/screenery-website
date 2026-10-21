import Image from "next/image";
import Link from "next/link";
import { copy, partners } from "./content";
import styles from "./equiphotel.module.css";

export default function EquipHotel({ lang }: { lang: "en" | "fr" }) {
  const t = copy[lang];
  const i = lang === "fr" ? 1 : 0;
  const mail = "mailto:alicia@wanderland.london";

  return (
    <div className={styles.page} lang={lang}>
      <a className={styles.skip} href="#content">{t.skip}</a>
      <header className={styles.header}>
        <Link className={styles.wordmark} href="/" aria-label={t.home}>Screenery<span>by Wanderland</span></Link>
        <nav aria-label={lang === "fr" ? "Navigation principale" : "Main navigation"}>
          <a href="#partners">{t.partners}</a><a href="#report">{t.report}</a>
          <div className={styles.languages} aria-label={t.languageLabel}>
            <Link href="/equiphotel" lang="en" hrefLang="en" aria-current={lang === "en" ? "page" : undefined}>EN</Link>
            <span aria-hidden="true">/</span>
            <Link href="/equiphotel/fr" lang="fr" hrefLang="fr" aria-current={lang === "fr" ? "page" : undefined}>FR</Link>
          </div>
        </nav>
      </header>
      <main id="content">
        <section className={styles.hero} aria-labelledby="title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>EquipHotel Paris · {t.date}</p>
            <p className={styles.suite}>The Family Suite <span>{t.by}</span></p>
            <h1 id="title">{t.title}</h1>
            <p className={styles.credit}>{t.credit}</p>
            <p className={styles.intro}>{t.intro}</p>
            <div className={styles.actions}><a className={styles.button} href="#visit">{t.visit} <span aria-hidden="true">↗</span></a><a className={styles.textLink} href="#report">{t.reportLink} <span aria-hidden="true">↓</span></a></div>
            <p className={styles.stand}>{t.pavilion} <span>Paris Expo Porte de Versailles</span></p>
          </div>
          <figure className={styles.heroImage}>
            <Image src="/equiphotel/play-cafe.webp" alt={t.heroAlt} width={1536} height={1024} sizes="(max-width: 800px) 100vw, 58vw" preload />
            <figcaption>{t.caption}</figcaption>
          </figure>
        </section>
        <section className={`${styles.section} ${styles.about}`} aria-labelledby="about-title">
          <div><p className={styles.eyebrow}>{t.eyebrow}</p><h2 id="about-title">{t.question}</h2></div>
          <div className={styles.prose}><p>{t.about}</p><p>{t.about2}</p></div>
          <div className={styles.experiences}>{t.experiences.map((title, n) => <div key={title}><span className={styles.number}>0{n + 1}</span><h3>{title}</h3><p>{t.experienceText[n]}</p></div>)}</div>
        </section>
        <section id="partners" className={`${styles.section} ${styles.partnerSection}`} aria-labelledby="partners-title">
          <p className={styles.eyebrow}>{t.partners}</p><h2 id="partners-title">{t.meet}</h2><p className={styles.sectionIntro}>{t.meetIntro}</p>
          <div className={styles.partners}>{partners.map((partner) => <article className={styles.partner} key={partner.name}>
            <div className={`${styles.logo} ${partner.name === "Wildhood" ? styles.wildhoodLogo : ""}`}><Image src={`/equiphotel/${partner.logo}`} alt={`${partner.name} logo`} width={partner.name === "Wildhood" ? 159 : 400} height={partner.name === "Wildhood" ? 75 : 180} /></div>
            <h3>{partner.name}</h3><p className={styles.role}>{partner.role[i]}</p><p>{partner.description[i]}</p>
            <div className={styles.partnerLinks}><a href={partner.website}>{t.website} <span aria-hidden="true">↗</span></a><a href={partner.linkedin} aria-label={`${partner.name} LinkedIn`}>LinkedIn <span aria-hidden="true">↗</span></a>{partner.name === "Wanderland" ? <Link href="/">{t.screenery} <span aria-hidden="true">↗</span></Link> : null}</div>
          </article>)}</div>
        </section>
        <section className={`${styles.section} ${styles.gallery}`} aria-labelledby="gallery-title">
          <h2 id="gallery-title">{t.galleryTitle}</h2><p className={styles.sectionIntro}>{t.galleryIntro}</p>
          <div className={styles.galleryGrid}>
            <figure><Image src="/equiphotel/wildhood-playsuite.webp" alt={t.wildhoodAlt} width={1451} height={1084} sizes="(max-width: 700px) 100vw, 50vw" /><figcaption>{t.wildhoodCaption}</figcaption></figure>
            <figure><Image src="/equiphotel/bayard-cabane.webp" alt={t.bayardAlt} width={1600} height={1600} sizes="(max-width: 700px) 100vw, 50vw" /><figcaption>{t.bayardCaption}</figcaption></figure>
          </div>
        </section>
        <section id="report" className={styles.report} aria-labelledby="report-title">
          <div className={styles.reportInner}>
            <div className={styles.cover}><Image src="/equiphotel/report-cover.webp" alt={t.coverAlt} width={1000} height={1414} sizes="(max-width: 800px) 70vw, 30vw" /></div>
            <div><p className={styles.eyebrow}>{t.research}</p><h2 id="report-title">{t.reportTitle}</h2><p>{t.reportIntro}</p><p>{t.reportIntro2}</p></div>
            <div className={styles.findings}>
              <article><p className={styles.stat}>7 <span>{t.finding1}</span></p><h3>{t.finding1Title}</h3><p className={styles.source}>{t.finding1Source}</p></article>
              <article><p className={styles.stat}>66%</p><h3>{t.finding2Title}</h3><p className={styles.source}>{t.finding2Source}</p><a href="https://stories.hilton.com/releases/2026-trends-release">{t.source} ↗</a></article>
            </div>
            <blockquote><p>“{t.quote}”</p><cite>{t.quoteSource}</cite></blockquote>
            <div className={styles.reportAccess}><p>{t.access}</p><a className={styles.lightButton} href={`${mail}?subject=Global%20Kids%20Hospitality%20Report%202027`}>{t.askReport} <span aria-hidden="true">↗</span></a></div>
          </div>
        </section>
        <section id="visit" className={`${styles.section} ${styles.visit}`} aria-labelledby="visit-title">
          <div><p className={styles.eyebrow}>{t.locationLabel}</p><h2 id="visit-title">{t.visitTitle}</h2><p className={styles.sectionIntro}>{t.credit}</p></div>
          <div className={styles.visitDetails}><p>EquipHotel Paris<br /><strong>{t.date}</strong><br />{t.location}</p><p className={styles.location}>{t.pavilion}</p><div className={styles.actions}><a className={styles.button} href={lang === "fr" ? "https://www.equiphotel.com/fr-fr.html" : "https://www.equiphotel.com/en-gb.html"}>{t.eventWebsite} <span aria-hidden="true">↗</span></a><a className={styles.textLink} href={`${mail}?subject=EquipHotel%20%E2%80%94%20The%20Family%20Suite`}>{t.email} ↗</a></div></div>
        </section>
      </main>
      <footer className={styles.footer}><p>{t.footer}</p><p>{t.credits}</p><Link href="/">screenery.design ↗</Link></footer>
    </div>
  );
}
