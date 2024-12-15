import HeroSection from '@/components/MainHero';
import ProductSection from '@/components/ProductSection';
import ServicesSection from '@/components/ServicesSection';
import Testimonials from '@/components/Testimonials';
import PreFooter from '@/components/PreFooter';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="relative z-0">
      <main>
        <HeroSection />
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <ProductSection />
          </Suspense>
          <ServicesSection />
          <Testimonials />
          <PreFooter />
        </div>
      </main>
    </div>
  );
}
