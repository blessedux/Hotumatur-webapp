import NewsletterSection from "@/app/contacto/components/NewsletterSection";
import Footer from "@/components/Footer";
import { StatsCard } from "./components/stats-card";
import { BlogCard } from "./components/blog-card";
import AboutHero from "./components/about-hero";
import PlanTrip from "./components/plan-trip";
import Services from "./components/services";
import { SpecialTripsSection } from "./components/special-trips";
import Team from "./components/team";
import Testimonials from "./components/Testimonials";
import Gallery from "./components/gallery";
import Partners from "./components/partners";
import Image from "next/image";

const heroImage = "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/Nosotoro-Bio-image.webp";

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <AboutHero />

            {/* Our Story Section */}
            <section className="container py-24">
                <div className="max-w-3xl mx-auto text-center mb-12">

                    <p className="text-muted-foreground">
                        En Hotumatur, somos mucho más que una agencia de viajes; somos los embajadores oficiales de Rapa Nui.

                        Nuestro compromiso va más allá de ofrecer tours y experiencias turísticas. Somos un equipo de guías locales nacidos y criados en la Isla de Pascua, quienes conocemos la historia, los secretos y las tradiciones de Rapa Nui como nadie más.

                        Cada recorrido con Hotumatur es una invitación a descubrir la esencia más pura de nuestra cultura ancestral. Conocemos cada moai, cada paisaje y cada leyenda porque hemos crecido rodeados de su majestuosidad. No solo contamos la historia, la vivimos y la compartimos con orgullo.

                        Nuestra misión es conectar a las personas con la magia y el misterio que hacen única a la Isla de Pascua. Queremos que cada visitante se lleve más que recuerdos: una conexión profunda con las raíces, los relatos y la espiritualidad que hacen de Rapa Nui un lugar irrepetible en el mundo.

                        En Hotumatur, creemos que el turismo debe ser responsable y auténtico. Por eso, trabajamos codo a codo con la comunidad local para preservar nuestro patrimonio cultural y natural. Nuestros tours no son solo viajes; son experiencias transformadoras, diseñadas para que cada visitante sienta el latido de la isla, admire su belleza y comprenda su alma.
                    </p>
                </div>
                <div className="relative h-[400px] mb-16">
                    <Image
                        src={heroImage}
                        alt="Nuestra Historia"
                        fill
                        className="object-cover rounded-lg"
                        priority
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatsCard number="15K+" label="Viajeros Felices" />
                    <StatsCard number="50+" label="Paquetes Exclusivos" />
                    <StatsCard number="100%" label="Autenticidad Local" />
                    <StatsCard number="5 Estrellas" label="Experiencia Premium" />
                </div>
            </section>

            {/* Plan Your Trip */}
            <PlanTrip />

            {/* Our Services */}
            <Services />

            {/* Special Trips */}
            <SpecialTripsSection />

            {/* Team Section */}
            <Team />

            {/* Testimonials */}
            <Testimonials />

            {/* Work Culture Section */}
            <section className="container py-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Nuestra Cultura de Trabajo</h2>
                        <p className="text-muted-foreground mb-8">
                            En Hotumatur, trabajamos con pasión y compromiso para brindar un
                            servicio excepcional. Creemos en la entrega rápida, la comunicación
                            clara y la mejora continua de nuestros procesos.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-2">
                                <span className="h-2 w-2 bg-primary rounded-full"></span>
                                <span>Entrega Rápida</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="h-2 w-2 bg-primary rounded-full"></span>
                                <span>Pasión por la Exploración</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="h-2 w-2 bg-primary rounded-full"></span>
                                <span>Comunicación Transparente</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="h-2 w-2 bg-primary rounded-full"></span>
                                <span>Evaluación Continua</span>
                            </li>
                        </ul>
                    </div>
                    <div className="relative h-[400px]">
                        <Image
                            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
                            alt="Cultura de Trabajo"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <Partners />

            {/* Gallery Section */}
            <Gallery />

            {/* Blog Section */}
            <section className="container py-24">
                <h2 className="text-3xl font-bold text-center mb-12">Últimas Novedades</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <BlogCard
                        title="Viajes Educativos: Explorando Rapa Nui con Estudiantes"
                        category="Educación"
                        href="#"
                        imageUrl="https://images.pexels.com/photos/2103127/pexels-photo-2103127.jpeg"
                    />
                    <BlogCard
                        title="Paquetes Corporativos: Una Experiencia Única para Empresas"
                        category="Corporativo"
                        href="#"
                        imageUrl="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg"
                    />
                    <BlogCard
                        title="Testimonios de Nuestros Viajeros: La Magia de Rapa Nui"
                        category="Testimonios"
                        href="#"
                        imageUrl="https://images.pexels.com/photos/214574/pexels-photo-214574.jpeg"
                    />
                </div>
            </section>

            {/* Newsletter Section */}
            <NewsletterSection />

        </div>
    );
}