import HeroSection from "@/components/home/HeroSection";
import MarqueeBand from "@/components/home/MarqueeBand";
import FinalCTASection from "@/components/home/FinalCTASection";
import CategorySection from "@/components/menu/CategorySection";
import FeaturedMenu from "@/components/menu/FeaturedMenu";
import OffersSection from "@/components/home/OffersSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <MarqueeBand />
      <CategorySection />
      <OffersSection />
      <FeaturedMenu />
      <FinalCTASection />
    </main>
  );
}
