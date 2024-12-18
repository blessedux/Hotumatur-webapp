"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import NewsletterSection from "./components/NewsletterSection";

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        message: "",
        dudas: "tours",
    });

    const [status, setStatus] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleRadioChange = (value: string) => {
        setFormData({ ...formData, dudas: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                setStatus(result.message || "Mensaje enviado correctamente");
                setFormData({
                    nombre: "",
                    apellido: "",
                    email: "",
                    telefono: "",
                    message: "",
                    dudas: "tours",
                });
            } else {
                throw new Error(result.error || "Error al enviar el mensaje");
            }
        } catch (error: Error | unknown) {
            setStatus(error instanceof Error ? error.message : 'Error desconocido');
        }
    };

    return (
        <div className="w-full py-12 bg-gradient-to-b from-blue-50 via-blue-100 to-white">
            <section className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-2">Contáctanos</h1>
                    <p className="text-muted-foreground">
                        ¿Alguna pregunta o comentario? ¡Envíanos un mensaje!
                    </p>
                </div>

                <div className="max-w-5xl mx-auto rounded-lg shadow-2xl overflow-hidden bg-white">
                    <div className="grid md:grid-cols-2 backdrop-blur-sm">
                        {/* Left Panel */}
                        <div className="relative bg-[#2159E2] text-white overflow-hidden h-full">
                            <div className="absolute inset-0">
                                <iframe
                                    src="https://player.vimeo.com/video/1037857996?autoplay=1&muted=1&loop=1&background=1"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        width: '200%',
                                        height: '200%',
                                        transform: 'translate(-50%, -50%) scale(1.2)',
                                        objectFit: 'cover',
                                    }}
                                    frameBorder="0"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                    title="Contact Background Video"
                                ></iframe>
                            </div>
                            <div className="relative z-10 p-8">
                                <h2 className="text-4xl font-bold mb-4">Información de Contacto</h2>
                                <p className="text-lg">
                                    Escríbenos y nuestro equipo se pondrá en contacto contigo lo antes posible.
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
                        </div>

                        {/* Right Panel */}
                        <div className="bg-white p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre">Nombre</Label>
                                        <Input id="nombre" value={formData.nombre} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="apellido">Apellido</Label>
                                        <Input id="apellido" value={formData.apellido} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={formData.email} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="telefono">Teléfono</Label>
                                        <Input id="telefono" type="tel" value={formData.telefono} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label>¿Con qué tienes dudas?</Label>
                                    <RadioGroup defaultValue="tours" onValueChange={handleRadioChange} className="flex flex-row gap-6">
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="tours" id="tours" />
                                            <Label htmlFor="tours">Tours</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="arriendos" id="arriendos" />
                                            <Label htmlFor="arriendos">Arriendos</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Mensaje</Label>
                                    <Textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Escribe tu mensaje..."
                                        className="min-h-[120px] resize-none w-full"
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Enviar Mensaje
                                </Button>
                                {status && (
                                    <p className="text-center text-sm mt-4 text-gray-700">{status}</p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <NewsletterSection />
        </div>
    );
};

export default ContactPage;