import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
    const whatsappNumber = '+56962064520'; // Replace with your WhatsApp number
    const message = 'Hola! Me gustaría conocer más sobre Rapa Nui y reservar un Tour con Ustedes! me pueden dar más información?'; // Default message

    const whatsappLink = `https://wa.me/${whatsappNumber.replace(
        /[^\d]/g,
        ''
    )}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition duration-300 md:w-16 md:h-16"
            style={{ maxWidth: 'calc(100vw - 1rem)', maxHeight: 'calc(100vh - 1rem)' }}
        >
            <FaWhatsapp className="text-white text-3xl" />
        </a>
    );
};

export default WhatsAppButton;