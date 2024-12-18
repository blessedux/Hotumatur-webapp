import { MapPin, Phone, Mail } from 'lucide-react'

const contactInfo = [
  {
    icon: MapPin,
    title: "Dirección",
    details: ["Atamu Tekena s/n", "Hanga Roa, Rapa Nui, Chile"]
  },
  {
    icon: Phone,
    title: "Teléfono",
    details: ["+56 9 9999 9999", "+56 9 8888 8888"]
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@hotumatur.com", "reservas@hotumatur.com"]
  }
]

export default function ContactInfo() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-satisfy text-[#21b8c7]">
            Conversemos
          </h2>
          <h3 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Información de Contacto
          </h3>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {contactInfo.map((info) => (
            <div
              key={info.title}
              className="rounded-lg bg-gray-900/50 p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#21b8c7]/10">
                <info.icon className="h-8 w-8 text-[#21b8c7]" />
              </div>
              <h4 className="mb-2 text-xl font-semibold text-white">
                {info.title}
              </h4>
              {info.details.map((detail, index) => (
                <p
                  key={index}
                  className="text-gray-400"
                >
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

