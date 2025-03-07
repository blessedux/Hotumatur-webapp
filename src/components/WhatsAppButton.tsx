'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const WhatsAppButton = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const whatsappNumber = '+56998897762'; // Replace with your WhatsApp number
    const message = 'Hola! Me gustaría conocer más sobre Rapa Nui y reservar un Tour con Ustedes! me pueden dar más información?'; // Default message

    const whatsappLink = `https://wa.me/${whatsappNumber.replace(
        /[^\d]/g,
        ''
    )}?text=${encodeURIComponent(message)}`;

    const button = (
        <div
            className="whatsapp-button-container"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 99999,
                pointerEvents: 'none',
                isolation: 'isolate'
            }}
        >
            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 pointer-events-auto md:w-16 md:h-16"
                style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    willChange: 'transform'
                }}
                aria-label="Chat on WhatsApp"
            >
                <FaWhatsapp className="text-white text-3xl" />
            </a>
        </div>
    );

    if (!mounted) return null;

    // Create a portal to render the button at the root level
    return createPortal(
        button,
        document.body
    );
};

export default WhatsAppButton;