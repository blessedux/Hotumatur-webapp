"use client";

import React from "react";
import dynamic from "next/dynamic"; // Dynamically import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import Footer from "@/components/Footer";
import NewsletterSection from "./components/NewsletterSection";

// Dynamically import TypewriterText with SSR disabled
const TypewriterText = dynamic(() => import("./components/TypewriterText"), {
    ssr: false,
});

const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 via-blue-100 to-white">
            {/* Contact Form Section */}
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
                        <div className="relative bg-[#181A1B] p-8 text-white rounded-lg overflow-hidden">
                            {/* Background Video */}
                            <video
                                className="absolute inset-0 w-full h-full object-cover"
                                src="https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/Contact-Card-background-video.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                            ></video>

                            {/* Typing Text Content */}
                            <div className="relative z-10">
                                <TypewriterText
                                    title="Información de Contacto"
                                    subtext="Escríbenos y nuestro equipo se pondrá en contacto contigo lo antes posible."
                                />
                            </div>

                            {/* Optional Dark Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
                        </div>

                        {/* Right Panel */}
                        <div className="bg-white p-8">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre">Nombre</Label>
                                        <Input id="nombre" placeholder="Nombre" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="apellido">Apellido</Label>
                                        <Input id="apellido" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="ejemplo@correo.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="telefono">Teléfono</Label>
                                        <Input id="telefono" type="tel" placeholder="+1 012 3456 789" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="mb-2">¿Con qué tienes dudas?</Label>
                                    <RadioGroup defaultValue="tours" className="flex flex-row gap-6">
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="tours" id="tours" />
                                            <Label htmlFor="tours">Tours</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="arriendos" id="arriendos" />
                                            <Label htmlFor="arriendos">Arriendos</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="guias" id="guias" />
                                            <Label htmlFor="guias">Guías</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="otro" id="otro" />
                                            <Label htmlFor="otro">Otro</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Mensaje</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Escribe tu mensaje..."
                                        className="min-h-[120px] resize-none w-full"
                                    />
                                </div>

                                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300">
                                    Enviar Mensaje
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <NewsletterSection />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ContactPage;