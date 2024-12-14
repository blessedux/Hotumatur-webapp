import { Metadata } from "next"
import ContactHero from "./components/contact-hero"
import ContactInfo from "./components/contact-info"
import BookingForm from "./components/booking-form"
import ContactMap from "./components/contact-map"

export const metadata: Metadata = {
    title: "Contacto | Hotumatur",
    description: "Contáctanos para planificar tu próxima aventura en Rapa Nui",
}

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#0a0d14]">
            <ContactHero />
            <ContactInfo />
            <BookingForm />
            <ContactMap />
        </main>
    )
}

