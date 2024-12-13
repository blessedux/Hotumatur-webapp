import HeroSection from '@/components/MainHero';
import ToursSection from '@/components/ToursSection';
import ServicesSection from '@/components/ServicesSection';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <div className="relative z-0">
      <main>
        <HeroSection />
        <div className="container mx-auto py-40">
          <ToursSection />
          <ServicesSection />
          <Testimonials />
        </div>
      </main>
    </div>
  );
}
