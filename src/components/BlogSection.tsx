'use client';

import { BlogCard } from "@/components/nosotros/blog-card";
import { useDirectTranslation } from '@/hooks/useTranslatedText';

export default function BlogSection() {
    // Use our custom hook for direct translations
    const titleText = useDirectTranslation(
        "Latest News",
        "Últimas Novedades"
    );

    const educationalPostText = useDirectTranslation(
        "Educational Tours for Schools and Universities",
        "Tours Educativos para Escuelas y Universidades"
    );

    const corporatePostText = useDirectTranslation(
        "Corporate Retreats in Easter Island",
        "Retiros Corporativos en Isla de Pascua"
    );

    const testimonialsPostText = useDirectTranslation(
        "What Our Clients Say About Us",
        "Lo que Dicen Nuestros Clientes"
    );

    const educationCategoryText = useDirectTranslation(
        "Education",
        "Educación"
    );

    const corporateCategoryText = useDirectTranslation(
        "Corporate",
        "Corporativo"
    );

    const testimonialsCategoryText = useDirectTranslation(
        "Testimonials",
        "Testimonios"
    );

    return (
        <section className="flex justify-center">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mt-12 mb-12">
                    {titleText}
                </h2>
                <div className="grid md:grid-cols-3 gap-8 mx-auto">
                    <BlogCard
                        title={educationalPostText}
                        category={educationCategoryText}
                        href="#"
                        imageUrl="https://backend.hotumatur.com/wp-content/uploads/2024/12/Motu-Tours1.webp"
                    />
                    <BlogCard
                        title={corporatePostText}
                        category={corporateCategoryText}
                        href="#"
                        imageUrl="https://backend.hotumatur.com/wp-content/uploads/2024/12/Easter-Island-Trekking-Experience-Chile.webp"
                    />
                    <BlogCard
                        title={testimonialsPostText}
                        category={testimonialsCategoryText}
                        href="#"
                        imageUrl="https://backend.hotumatur.com/wp-content/uploads/2024/12/pexels-bianeyre-1236028-1.webp"
                    />
                </div>
            </div>
        </section>
    );
} 