import { ImageGallery } from "./ImageGallery";
import { Button } from "@/components/ui/button";

interface SpecialTourSectionProps {
    title: string;
    images: string[];
    description: string;
    isTextRight: boolean;
}

export function SpecialTourSection({ title, images, description, isTextRight }: SpecialTourSectionProps) {
    // Define predefined WhatsApp messages based on tour type
    const messages: Record<string, string> = {
        "Giras de estudios": "Hola, estoy interesado en obtener más información sobre las giras de estudio. ¿Podrían enviarme detalles sobre disponibilidad y precios?",
        "Tour corporativos": "Hola, me gustaría conocer más sobre el tour corporativo. ¿Podrían brindarme información sobre paquetes y servicios?",
        "Agencias de viajes": "Hola, estoy interesado en la aventura en la isla. ¿Me pueden enviar más información sobre la experiencia y costos?",
    };

    // Get the appropriate message based on the title or use a default message
    const whatsappMessage = messages[title] || "Hola, me gustaría recibir información sobre sus tours.";

    // WhatsApp link with encoded message
    const whatsappLink = `https://wa.me/56912345678?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-6">{title}</h2>
                <div className={`flex flex-col ${isTextRight ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}>
                    <div className="w-full md:w-1/2">
                        <ImageGallery images={images} />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col">
                        <p className="text-lg mb-4">{description}</p>
                        <Button asChild className="self-start">
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                Solicitar cotización
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}