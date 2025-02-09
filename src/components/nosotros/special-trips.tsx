import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SpecialTripsSection() {
    return (

        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-muted overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="absolute -inset-8 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://backend.hotumatur.com/wp-content/uploads/2024/12/about_6_1-1.webp')`,
                    }}
                />
            </div>

            {/* Content */}
            <div className="container relative z-20 px-4 md:px-6 flex items-center justify-between">
                {/* Card */}
                <Card className="w-full max-w-2xl bg-white shadow-lg relative z-30 lg:ml-auto transform translate-x-10">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold tracking-tight">
                            Viajes Especiales
                        </CardTitle>
                        <CardDescription>
                            Experiencias personalizadas para estudiantes y grupos corporativos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Descubre nuestros paquetes exclusivos para viajes estudiantiles y retiros corporativos.
                            Crea recuerdos inolvidables y fortalece los lazos del equipo con experiencias de viaje
                            diseñadas especialmente para ti.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <Button asChild>
                            <Link href="/special-tours">Solicitar Cotización</Link>
                        </Button>

                    </CardFooter>
                </Card>

                {/* Image */}
                <div
                    className="absolute left-0 w-full h-full lg:w-[70%] lg:h-[160%] ml-0 lg:ml-20 transform lg:-translate-x-10 rounded-none lg:rounded-lg overflow-hidden shadow-xl"
                >
                    <img
                        src="https://backend.hotumatur.com/wp-content/uploads/2024/12/Hiking-Rapa-Nui-1024x395-1.webp"
                        alt="Special Trips Background"
                        className="object-cover w-full h-full"
                        style={{
                            objectPosition: "left left 25%",
                        }}
                    />
                </div>
            </div>
        </section>
    );
}