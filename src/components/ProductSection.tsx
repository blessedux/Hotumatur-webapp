'use client'

import { useProducts } from "@/hooks/useProducts"
import { ProductCard } from "@/components/ProductCard"

export default function ProductSection() {
    const { products, loading, error } = useProducts()

    const tours = products.filter(product =>
        product.categories.some(category => category.name === "Tours")
    )

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <section className="w-full px-4 py-32 md:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                        Vive La Esencia De Rapa Nui
                    </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {tours.map((tour) => (
                        <ProductCard key={tour.id} product={tour} />
                    ))}
                </div>
            </div>
        </section>
    )
}
