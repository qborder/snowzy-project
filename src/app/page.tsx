import { HeroSection, FeaturesSection } from "@/components/hero-section"
import { ProjectShowcase } from "@/components/project-showcase"

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProjectShowcase />
      <FeaturesSection />
    </div>
  );
}
