import Image from "next/image"

const gallery = [
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/835481a75410efaac35d2a4593bef8f8.webp",
        alt: "Vista panorámica de Rapa Nui"
    },
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/viaje-a-ios-motus.webp",
        alt: "Viaje a los Motus"
    },
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/1000039572.jpg",
        alt: "Moai al atardecer"
    },
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/poike-volcano-view-from-1.webp",
        alt: "Hombre observando formación rocosa"
    },
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/Palmeras-Anakena-scaled-1.jpg",
        alt: "Palmeras en la playa Anakena"
    },
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/Palmeras-Anakena-scaled-1.jpg",
        alt: "Vista de Orongo"
    },
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/Palmeras-Anakena-scaled-1.jpg",
        alt: "Escena cultural de Rapa Nui"
    }
]

export default function Gallery() {
    return (
        <section className="py-20 bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-white mb-12">Galería de Rapa Nui</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.map((image, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

