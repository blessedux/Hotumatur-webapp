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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <Card className="w-full max-w-4xl mx-auto">
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
                    <CardFooter className="flex justify-between items-center">
                        <Button asChild>
                            <Link href="/contact">Solicitar Cotización</Link>
                        </Button>
                        <Link
                            href="/contact"
                            className="text-sm text-muted-foreground hover:underline"
                        >
                            Contáctanos para más información
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}