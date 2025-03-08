'use client'
import NewsletterSection from "@/components/NewsletterSection";
import { SpecialTripsSection } from "@/components/nosotros/special-trips";
import ProductSection from "@/components/ProductSection";
import BlogSection from "@/components/BlogSection";

const heroImage = "https://backend.hotumatur.com/wp-content/uploads/2024/12/Nosotoro-Bio-image.webp";

export default function ToursEspecialesPage() {
    return (
        <div className="min-h-screen pt-36">
            {/* Hero Section */}
            <ProductSection categoryId={26} />
            <SpecialTripsSection />
            <BlogSection />
            <NewsletterSection />
        </div>
    );
}