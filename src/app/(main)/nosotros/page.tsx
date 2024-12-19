import NewsletterSection from "@/components/NewsletterSection";
import { StatsCard } from "@/components/nosotros/stats-card";
import { BlogCard } from "@/components/nosotros/blog-card";
import AboutHero from "@/components/nosotros/about-hero";
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

const heroImage = "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/Nosotoro-Bio-image.webp";

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <AboutHero />

            {/* Our Story Section */}
            <section className="mb-24">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <p className="text-lg leading-relaxed ml-12 w-50%">
                            En Hotumatur, somos mucho más que una agencia de viajes; somos los embajadores oficiales de Rapa Nui.
                        </p>
                        <p className="text-lg leading-relaxed ml-12 w-50">
                            Nuestro compromiso va más allá de ofrecer tours y experiencias turísticas. Somos un equipo de guías locales nacidos y criados en la Isla de Pascua, quienes conocemos la historia, los secretos y las tradiciones de Rapa Nui como nadie más.
                        </p>
                    </div>
                    <div className="relative mt-20 h-[400px]">
                        <Image
                            src={heroImage}
                            alt="Nuestra Historia"
                            fill
                            className="object-cover rounded-lg"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="mb-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatsCard number="15" label="Viajeros Felices" icon={<FaUsers />} />
                    <StatsCard number="50" label="Paquetes Exclusivos" icon={<FaSuitcase />} />
                    <StatsCard number="100" label="Autenticidad Local" icon={<FaChartBar />} />
                    <StatsCard number="5" label="Experiencia Premium" icon={<FaStar />} />
                </div>
            </section>

            {/* Mission and Values Section */}
            <section className="hidden max-w-4xl mx-auto">
                <div className="space-y-12">
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Nuestra Misión</h3>
                        <p className="text-lg leading-relaxed">
                            Cada recorrido con Hotumatur es una invitación a descubrir la esencia más pura de nuestra cultura ancestral. Conocemos cada moai, cada paisaje y cada leyenda porque hemos crecido rodeados de su majestuosidad. Contamos la historia, la vivimos y la compartimos con orgullo.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Nuestro Compromiso</h3>
                        <p className="text-lg leading-relaxed">
                            Nuestra misión es conectar a las personas con la magia y el misterio que hacen única a la Isla de Pascua. Queremos que cada visitante se lleve más que recuerdos: una conexión profunda con las raíces, los relatos y la espiritualidad que hacen de Rapa Nui un lugar irrepetible en el mundo.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Nuestros Valores</h3>
                        <p className="text-lg leading-relaxed">
                            En Hotumatur, creemos que el turismo debe ser responsable y auténtico. Por eso, trabajamos codo a codo con la comunidad local para preservar nuestro patrimonio cultural y natural. Nuestros tours no son solo viajes; son experiencias transformadoras, diseñadas para que cada visitante sienta el latido de la isla, admire su belleza y comprenda su alma.
                        </p>
                    </div>
                </div>
            </section>
            {/* Special Trips */}
            <SpecialTripsSection />

            {/* Team Section */}
            <Team />

            {/* Testimonials */}
            <Testimonials />

            {/* Partners Section */}
            <Partners />

            {/* Gallery Section */}
            <Gallery />

            {/* Blog Section */}
            <section className=" flex justify-center">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mt-12 mb-12">Últimas Novedades</h2>
                    <div className="grid md:grid-cols-3 gap-8 mx-auto">
                        <BlogCard
                            title="Viajes Educativos: Explorando Rapa Nui con Estudiantes"
                            category="Educación"
                            href="#"
                            imageUrl="https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/Motu-Tours1.webp"
                        />
                        <BlogCard
                            title="Paquetes Corporativos: Una Experiencia Única para Empresas"
                            category="Corporativo"
                            href="#"
                            imageUrl="https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/Easter-Island-Trekking-Experience-Chile.webp"
                        />
                        <BlogCard
                            title="Testimonios de Nuestros Viajeros: La Magia de Rapa Nui"
                            category="Testimonios"
                            href="#"
                            imageUrl="https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/pexels-bianeyre-1236028-1.webp"
                        />
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <NewsletterSection />

        </div >
    );
}