'use client';

import { FaTripadvisor } from 'react-icons/fa';

export default function AboutHero() {



    return (
        <div className="relative h-[calc(100dvh-80px)] md:h-[calc(100dvh-132px)] w-full overflow-hidden z-[1]">
            {/* Video Background */}
            <div className="absolute top-0 left-0 w-full h-full z-[0]">
                <iframe
                    src="https://player.vimeo.com/video/1039507385?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                    className="absolute 
            xl:top-1/2 xl:h-[200%] xl:w-[200%] xl:[aspect-ratio:16/9]
            top-[calc(50%-4px)] left-1/2 w-[177.77777778vh] min-w-full min-h-[calc(100%+6px)] 
            -translate-x-1/2 -translate-y-1/2"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-start justify-center px-4 text-white">
                {/* Title */}
                <h1 className="mb-4 text-left text-3xl md:text-5xl  font-bold">Nuestra Historia</h1>

                {/* Main Content */}
                <div className="w-full max-w-2xl rounded-lg p-6 py-10">
                    <p className="text-left text-lg md:text-2xl leading-relaxed">
                        En Hotumatur trabajamos para preservar la cultura y compartir la magia de la Isla de Pascua con el mundo.
                    </p>

                </div>

                {/* Review Card Positioned Slightly Right */}
                <a
                    href="https://www.tripadvisor.com/Attraction_Review-g316040-d26626022-Reviews-Hotumatur_RapaNui-Easter_Island.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-4 bottom-8 md:right-16 md:bottom-16 block w-[90%] sm:w-[70%] md:w-[50%] lg:max-w-[25%] opacity-70 transition-opacity hover:opacity-100"
                >
                    <div className="flex items-center rounded-lg bg-white text-black p-4 shadow-md text-xs gap-3">
                        {/* TripAdvisor Icon */}

                        <FaTripadvisor className='w-9 h-9' />

                        {/* Card Content */}
                        <div>
                            <h3 className="font-bold text-sm mb-1">Hotumatur Rapa Nui</h3>
                            <p className="text-gray-700 text-xs mb-1">4.5 ★ | 249 Reseñas</p>
                            <p className="text-gray-500 italic">
                                "Una experiencia inolvidable. ¡Altamente recomendado!"
                            </p>
                        </div>
                    </div>
                </a>
            </div>
        </div >
    );
}