import HeroSection from "../components/Home/HeroSection";
import PropertySearchSection from "../components/Home/PropertySearch";
import ServiceSection from "../components/Home/ServiceSection";
import UtilitySection from "../components/Home/UtilitySection";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-[var(--color-bg)] text-[var(--color-darkest)]">
        <HeroSection />
        <UtilitySection/>
        <ServiceSection/>
        <PropertySearchSection/>
    </main>
  )
}