import {
  Chatbot,
  CTA,
  Education,
  FAQ,
  Features,
  Footer,
  Hero,
  HighRisk,
  Navbar,
  Prevention,
  Problem,
  Screening,
  Workflow,
} from "@/features/home";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Features />
        <Screening />
        <Education />
        <Prevention />
        <HighRisk />
        <Workflow />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
