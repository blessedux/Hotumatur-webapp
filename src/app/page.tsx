import HeroSection from '@/components/MainHero';
import ToursSection from '@/components/ToursSection';
import ServicesSection from '@/components/ServicesSection';
import Testimonials from '@/components/Testimonials';
import PreFooter from '@/components/PreFooter';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative z-0">
      <main>
        <HeroSection />
        <div>
          <ToursSection />
          <ServicesSection />
          <Testimonials />
          <PreFooter />
          <Footer />
        </div>
      </main>
    </div>
  );
}
