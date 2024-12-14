import HeroSection from '@/components/MainHero';
import ToursSection from '@/components/ToursSection';
import ServicesSection from '@/components/ServicesSection';
import Testimonials from '@/components/Testimonials';
import PreFooter from '@/components/PreFooter';
export default function Home() {
  return (
    <div className="relative z-0">
      <main>
        <HeroSection />
        <div className="py-40">
          <ToursSection />
          <ServicesSection />
          <Testimonials />
          <PreFooter />
        </div>
      </main>
    </div>
  );
}
