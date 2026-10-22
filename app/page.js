import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/menu/CategorySection";
import FeaturedMenu from "@/components/menu/FeaturedMenu";
import OffersSection from "@/components/home/OffersSection";

export default function Home() {
  return (
    <>
   

      <main>
        <HeroSection />
        <CategorySection />
         <OffersSection />
        <FeaturedMenu />
      </main>
    </>
  );
}