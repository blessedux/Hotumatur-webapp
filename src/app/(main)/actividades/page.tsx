import NewsletterSection from "@/components/NewsletterSection";
import { StatsCard } from "@/components/nosotros/stats-card";
import { BlogCard } from "@/components/nosotros/blog-card";
import AboutHero from "@/components/nosotros/AboutHero";
import PlanTrip from "@/components/nosotros/plan-trip";
import Services from "@/components/nosotros/services";
import { SpecialTripsSection } from "@/components/nosotros/special-trips";
import Team from "@/components/nosotros/team";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/nosotros/gallery";
import Partners from "@/components/nosotros/partners";
import Image from "next/image";
import { FlightMap } from "@/components/flight-map";
import { FaUsers, FaSuitcase, FaChartBar, FaStar } from "react-icons/fa";
import ProductSection from "@/components/ProductSection";

const heroImage = "https://backend.hotumatur.com/wp-content/uploads/2024/12/Nosotoro-Bio-image.webp";

export default function ActividadesPage() {
    return (
        <div className="min-h-screen pt-[120px] md:pt-[140px] lg:pt-[160px]">
            {/* Hero Section */}
            <ProductSection />
            {/* Special Trips */}
            <SpecialTripsSection />

            {/* Blog Section */}
            <section className=" flex justify-center">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mt-12 mb-12">Últimas Novedades</h2>
                    <div className="grid md:grid-cols-3 gap-8 mx-auto">
                        <BlogCard
                            title="Viajes Educativos: Explorando Rapa Nui con Estudiantes"
                            category="Educación"
                            href="#"
                            imageUrl="https://backend.hotumatur.com/wp-content/uploads/2024/12/Motu-Tours1.webp"
                        />
                        <BlogCard
                            title="Paquetes Corporativos: Una Experiencia Única para Empresas"
                            category="Corporativo"
                            href="#"
                            imageUrl="https://backend.hotumatur.com/wp-content/uploads/2024/12/Easter-Island-Trekking-Experience-Chile.webp"
                        />
                        <BlogCard
                            title="Testimonios de Nuestros Viajeros: La Magia de Rapa Nui"
                            category="Testimonios"
                            href="#"
                            imageUrl="https://backend.hotumatur.com/wp-content/uploads/2024/12/pexels-bianeyre-1236028-1.webp"
                        />
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <NewsletterSection />

        </div >
    );
}