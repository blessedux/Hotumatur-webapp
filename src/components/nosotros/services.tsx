import { useDirectTranslation } from '@/hooks/useTranslatedText';

export default function Services() {
    // Use our custom hook for direct translations
    const ourServicesText = useDirectTranslation(
        "Our Services",
        "Nuestros Servicios"
    );

    const servicesDescriptionText = useDirectTranslation(
        "We offer a variety of services for you to enjoy the best experience in Rapa Nui.",
        "Ofrecemos una variedad de servicios para que disfrutes de la mejor experiencia en Rapa Nui."
    );

    return (
        <section className="py-16 bg-[#0a0d14] text-white">
            <h2 className="text-3xl font-bold text-center">{ourServicesText}</h2>
            <p className="mt-4 text-center text-lg">
                {servicesDescriptionText}
            </p>
        </section>
    );
}
