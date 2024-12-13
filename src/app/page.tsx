import HeroSection from '@/components/MainHero';
import ToursSection from '@/components/ToursSection';

export default function Home() {
  return (
    <div className="relative z-0">
      <main>
        <HeroSection />
        <div className="container mx-auto py-40">
          <ToursSection />
        </div>
      </main>
    </div>
  );
}
