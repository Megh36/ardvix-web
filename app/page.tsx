import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProblemStrip from "@/components/ProblemStrip";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import Verticals from "@/components/Verticals";
import Proof from "@/components/Proof";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <ProblemStrip />
        <HowItWorks />
        <Services />
        <Verticals />
        <Proof />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
