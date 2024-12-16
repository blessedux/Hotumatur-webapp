import Image from "next/image"

const gallery = [
    {
        src: "https://backend.hotumatur.com/wp-content/uploads/2024/11/835481a75410efaac35d2a4593bef8f8.webp",
        alt: "Vista panorámica de Rapa Nui"
    },
    {
        src: "https://backend.hotumatur.com/wp-content/uploads/2024/11/viaje-a-ios-motus.webp",
        alt: "Viaje a los Motus"
    },
    {
        src: "https://backend.hotumatur.com/wp-content/uploads/2024/11/4877a51aa25f8369662cc9f845d1a336-1.webp",
        alt: "Moai al atardecer"
    },
    {
        src: "https://backend.hotumatur.com/wp-content/uploads/2024/11/rear-view-man-standing-against-rock-formation-1-scaled-1.webp",
        alt: "Hombre observando formación rocosa"
    },
    {
        src: "https://backend.hotumatur.com/wp-content/uploads/2024/11/Palmeras-Anakena-scaled.jpg",
        alt: "Palmeras en la playa Anakena"
    },
    {
        src: "https://backend.hotumatur.com/wp-content/uploads/2024/12/orongo.webp",
        alt: "Vista de Orongo"
    },
    {
        src: "https://backend.hotumatur.com/wp-content/uploads/2024/12/SaveClip.App_467800294_558923963446183_6199225768949597065_n.webp",
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

