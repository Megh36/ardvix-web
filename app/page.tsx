import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProblemStrip from "@/components/ProblemStrip";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import Verticals from "@/components/Verticals";
import Proof from "@/components/Proof";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

// No auth, no personalization, no per-request data — force static
// generation so this serves from the edge instead of a cold-starting
// serverless function on every request.
export const dynamic = "force-static";

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
