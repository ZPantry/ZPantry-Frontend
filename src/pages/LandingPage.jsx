import { AppPreviewSection } from "../components/sections/AppPreviewSection";
import { BenefitsSection } from "../components/sections/BenefitsSection";
import { FeaturesSection } from "../components/sections/FeaturesSection";
import { FinalCtaSection } from "../components/sections/FinalCtaSection";
import { HeroSection } from "../components/sections/HeroSection";
import { HowItWorksSection } from "../components/sections/HowItWorksSection";
import { ProblemSection } from "../components/sections/ProblemSection";
import { ShowcaseSection } from "../components/sections/ShowcaseSection";
import { SolutionSection } from "../components/sections/SolutionSection";
import { TestimonialsSection } from "../components/sections/TestimonialsSection";
import { useLandingEffects } from "../hooks/useLandingEffects";

export function LandingPage() {
  document.title = "Z-Pantry | Trợ lý lập kế hoạch bữa ăn bằng AI";
  useLandingEffects("landing");

  return (
    <main className="landing-page">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <ShowcaseSection />
      <HowItWorksSection />
      <AppPreviewSection />
      <BenefitsSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </main>
  );
}
