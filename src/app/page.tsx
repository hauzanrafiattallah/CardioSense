import { EducationSection } from "@/components/education-section";
import { FaqSection } from "@/components/faq-section";
import { FeaturesSection } from "@/components/features-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { HighRiskSection } from "@/components/high-risk-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { LandingMotionProvider } from "@/components/landing-motion-provider";
import { Navbar } from "@/components/navbar";
import { PreventionSection } from "@/components/prevention-section";
import { ScreeningPreviewSection } from "@/components/screening-preview-section";
import { WhyScreeningSection } from "@/components/why-screening-section";

export default function Home() {
  return (
    <LandingMotionProvider>
      <div className="min-h-screen overflow-x-hidden bg-[#FFF8F9]">
        <Navbar />
        <main>
          <HeroSection />
          <WhyScreeningSection />
          <FeaturesSection />
          <ScreeningPreviewSection />
          <EducationSection />
          <PreventionSection />
          <HighRiskSection />
          <HowItWorksSection />
          <FaqSection />
          <FinalCtaSection />
        </main>
        <Footer />
      </div>
    </LandingMotionProvider>
  );
}
