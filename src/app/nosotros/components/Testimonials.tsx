import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const testimonials = [
    {
        id: 1,
        name: "María González",
        text: "Una experiencia inolvidable. Los guías son increíblemente conocedores y apasionados por la cultura Rapa Nui.",
        rating: 5,
        image: "/placeholder.svg?height=100&width=100"
    },
    {
        id: 2,
        name: "Carlos Mendoza",
        text: "Los tours están muy bien organizados y el servicio es excepcional. Definitivamente volveré.",
        rating: 5,
        image: "/placeholder.svg?height=100&width=100"
    },
    {
        id: 3,
        name: "Ana Silva",
        text: "Increíble atención al detalle y un equipo muy profesional. La mejor manera de conocer la isla.",
        rating: 5,
        image: "/placeholder.svg?height=100&width=100"
    }
]

export default function Testimonials() {
    return (
        <section className="py-20">
            <div className="container">
                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-semibold text-[#21b8c7]">
                        Testimonios
                    </h2>
                    <h3 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                        Lo Que Dicen Nuestros Clientes
                    </h3>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="bg-gray-900/50">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                                        <div className="flex text-yellow-400">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className="h-4 w-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-400">{testimonial.text}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

