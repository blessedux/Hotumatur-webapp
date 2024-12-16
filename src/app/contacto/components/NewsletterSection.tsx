'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react'; // Assuming you're using lucide-react for icons.

export default function NewsletterSection() {
    return (
        <section
            className="bg-zinc-900 py-16 px-4 relative bg-cover bg-center mx-4 my-8 rounded-2xl overflow-hidden"
            style={{
                backgroundImage: `url('https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/54748532.webp')`,

            }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl"></div>

            {/* Content */}
            <div className="relative container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Suscríbete a nuestro Newsletter
                    </h2>
                    <p className="text-white mb-8">
                        Únete a nuestra comunidad y recibe en tu correo ofertas especiales,
                        consejos de viaje y las historias más auténticas de la mágica Isla de Pascua.
                    </p>

                    {/* Input and Button */}
                    <div className="flex gap-2 max-w-md mx-auto">
                        <Input
                            placeholder="Tu dirección de Email"
                            type="email"
                            className="bg-white rounded-full px-4 py-2 focus:outline-none"
                        />
                        <Button
                            size="icon"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}