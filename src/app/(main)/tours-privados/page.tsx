"use client";

import NewsletterSection from "@/components/NewsletterSection";
import { SpecialTripsSection } from "@/components/nosotros/special-trips";
import ProductSection from "@/components/ProductSection";
import BlogSection from "@/components/BlogSection";

export default function ToursPrivadosPage() {
    return (
        <div className="min-h-screen pt-32">
            {/* Pass the correct WooCommerce category ID */}
            <ProductSection categoryId={24} />
            <SpecialTripsSection />
            <BlogSection />
            <NewsletterSection />
        </div>
    );
}