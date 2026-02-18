import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import About from "@/components/about";
import Collection from "@/components/collection";
import Bespoke from "@/components/bespoke";
import Clients from "@/components/clients";
import Specs from "@/components/specs";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import StickyCta from "@/components/sticky-cta";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Collection />
      <Bespoke />
      <Clients />
      <Specs />
      <Contact />
      <Footer />
      <StickyCta />
    </main>
  );
}
