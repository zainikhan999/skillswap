import HeroSection from "./components/homepage/herosection";
import FeaturesSection from "./components/homepage/featuressection";
import HowItWorksSection from "components/homepage/howitworks";
import PopularSkillsSection from "components/homepage/skillsection";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <HeroSection />
      <PopularSkillsSection />
      <FeaturesSection />
      <HowItWorksSection />
      {/* Add more sections below like <FeaturesSection />, <CTASection />, etc. */}
    </div>
  );
}
