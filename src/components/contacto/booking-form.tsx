import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = {
      name: nameRef.current?.value.trim() || "MISSING",
      email: emailRef.current?.value.trim() || "MISSING",
      message: messageRef.current?.value.trim() || "MISSING",
    };

    console.log("📤 Sending JSON to API:", JSON.stringify(formData));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("📩 API Response:", data);

      if (response.ok) {
        alert("✅ Mensaje enviado correctamente.");
      } else {
        alert("❌ No se pudo enviar el mensaje: " + data.message);
      }
    } catch (error) {
      console.error("❌ Error al enviar el mensaje:", error);
      alert("❌ Error de red. No se pudo enviar el mensaje.");
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input name="name" ref={nameRef} placeholder="Nombre" required />
      <Input name="email" ref={emailRef} type="email" placeholder="Email" required />
      <Input name="phone" ref={phoneRef} type="tel" placeholder="Teléfono" />
      <Input name="date" ref={dateRef} type="date" required />
      <Input name="subject" ref={subjectRef} placeholder="Asunto" required />
      <Textarea name="message" ref={messageRef} placeholder="Mensaje" required />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
      </Button>
    </form>
  );
}