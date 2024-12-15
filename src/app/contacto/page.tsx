"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen w-full">
            {/* Contact Form Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-2">Contáctanos</h1>
                    <p className="text-muted-foreground">
                        ¿Alguna pregunta o comentario? ¡Envíanos un mensaje!
                    </p>
                </div>

                <div className="max-w-5xl mx-auto rounded-lg overflow-hidden bg-[url('/placeholder.svg?height=600&width=1000')] bg-cover">
                    <div className="grid md:grid-cols-2 backdrop-blur-sm">
                        {/* Left Panel */}
                        <div className="bg-zinc-800/90 p-8 text-white">
                            <h2 className="text-2xl font-semibold mb-4">
                                Información de Contacto
                            </h2>
                            <p className="text-zinc-300">
                                Escríbenos y nuestro equipo se pondrá en contacto contigo lo antes
                                posible.
                            </p>
                        </div>

                        {/* Right Panel */}
                        <div className="bg-white/90 p-8">
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
                                        <Input
                                            id="telefono"
                                            type="tel"
                                            placeholder="+1 012 3456 789"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>¿Con qué tienes dudas?</Label>
                                    <RadioGroup defaultValue="tours" className="flex flex-wrap gap-6">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="tours" id="tours" />
                                            <Label htmlFor="tours">Tours</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="arriendos" id="arriendos" />
                                            <Label htmlFor="arriendos">Arriendos</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="guias" id="guias" />
                                            <Label htmlFor="guias">Guías</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
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
                                        className="min-h-[120px] resize-none"
                                    />
                                </div>

                                <Button className="bg-black text-white hover:bg-black/90">
                                    Enviar Mensaje
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="bg-zinc-900 py-16 relative bg-cover bg-center"
                style={{ backgroundImage: `url('https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/54748532.webp')` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Suscríbete a nuestro Newsletter
                        </h2>
                        <p className="text-white  mb-8">
                            Únete a nuestra comunidad y recibe en tu correo ofertas especiales,
                            consejos de viaje y las historias más auténticas de la mágica Isla de
                            Pascua.
                        </p>
                        <div className="flex gap-2 max-w-md mx-auto">
                            <Input
                                placeholder="Tu dirección de Email"
                                type="email"
                                className="bg-white"
                            />
                            <Button size="icon" className="bg-blue-600 hover:bg-blue-700">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;