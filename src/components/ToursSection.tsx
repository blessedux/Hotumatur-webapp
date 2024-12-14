import Image from "next/image"
import { Button } from "@/components/ui/button"

interface TourCard {
    title: string
    subtitle: string
    price: number
    image: string
}

const tours: TourCard[] = [
    {
        title: "Mountain Hiking Tour",
        subtitle: "Mountain Hiking Tour",
        price: 89,
        image: "/placeholder.svg?height=400&width=600",
    },
    {
        title: "Machu Picchu, Peru",
        subtitle: "Machu Picchu, Peru",
        price: 99,
        image: "/placeholder.svg?height=400&width=600",
    },
    {
        title: "The Grand Canyon, Arizona",
        subtitle: "Mountain Hiking Tour",
        price: 70,
        image: "/placeholder.svg?height=400&width=600",
    },
    {
        title: "Mountain Hiking Tour",
        subtitle: "Mountain Hiking Tour",
        price: 89,
        image: "/placeholder.svg?height=400&width=600",
    },
    {
        title: "Machu Picchu, Peru",
        subtitle: "Machu Picchu, Peru",
        price: 99,
        image: "/placeholder.svg?height=400&width=600",
    },
    {
        title: "The Grand Canyon, Arizona",
        subtitle: "Mountain Hiking Tour",
        price: 70,
        image: "/placeholder.svg?height=400&width=600",
    },
]

export default function TourSection() {
    return (
        <section className="w-full px-4 py-32 md:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                        Vive La Esencia De Rapa Nui
                    </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {tours.map((tour, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-lg border bg-background p-2"
                        >
                            <div className="aspect-[4/3] overflow-hidden rounded-md">
                                <Image
                                    src={tour.image}
                                    alt={tour.title}
                                    width={600}
                                    height={400}
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold">{tour.title}</h3>
                                <p className="text-sm text-muted-foreground">{tour.subtitle}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-bold">${tour.price}</span>
                                        <span className="text-sm text-muted-foreground">/Person</span>
                                    </div>
                                    <Button variant="secondary" size="sm">
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
