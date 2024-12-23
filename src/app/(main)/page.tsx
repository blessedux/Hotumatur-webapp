import HeroSection from '@/components/MainHero';
import ProductSection from '@/components/ProductSection';
import ServicesSection from '@/components/ServicesSection';
import Testimonials from '@/components/Testimonials';
import PreFooter from '@/components/PreFooter';
import Preloader from '@/components/Preloader';
import { Suspense } from 'react';
import Gallery from '@/components/nosotros/gallery';


export default function Home() {
  return (
    <div className="relative z-0">
      <main >
        <HeroSection />
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <ProductSection />
          </Suspense>
          <Gallery />
          <ServicesSection />
          <Testimonials />
          <PreFooter />

        </div>
      </main >
    </div >
  );
}
