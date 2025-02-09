'use client'
import NewsletterSection from "@/components/NewsletterSection";
import { BlogCard } from "@/components/nosotros/blog-card";
import { SpecialTripsSection } from "@/components/nosotros/special-trips";
import ProductSection from "@/components/ProductSection";

const heroImage = "https://backend.hotumatur.com/wp-content/uploads/2024/12/Nosotoro-Bio-image.webp";

export default function ToursEspecialesPage() {
    return (
        <div className="min-h-screen pt-36">
            {/* Hero Section */}
            <ProductSection categoryId={26} />

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