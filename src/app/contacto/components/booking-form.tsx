'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    // Add form submission logic here
    setTimeout(() => setIsSubmitting(false), 1000)
  }

  return (
    <section className="relative py-20">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/placeholder.svg?height=800&width=1600)',
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="container relative z-10">
        <div className="mx-auto max-w-xl rounded-lg bg-white/10 p-8 backdrop-blur-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-satisfy text-[#21b8c7]">
              Reserva un Tour
            </h2>
            <h3 className="mt-2 text-3xl font-bold text-white">
              ¿Listo para la Aventura?
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Input
                  placeholder="Nombre"
                  className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Input
                  type="tel"
                  placeholder="Teléfono"
                  className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Input
                  type="date"
                  className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <div>
              <Input
                placeholder="Asunto"
                className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Mensaje"
                className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400 min-h-[120px]"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#21b8c7] hover:bg-[#21b8c7]/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

