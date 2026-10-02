import Nav from "@/components/editorial/nav";
import Hero from "@/components/editorial/hero";
import Stats from "@/components/editorial/stats";
import Catalogue from "@/components/editorial/catalogue";
import Specs from "@/components/specs";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Stats />
      <Catalogue />
      <Specs />
      <Contact />
      <Footer />
    </main>
  );
}
