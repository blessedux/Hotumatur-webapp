'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContactHeroVideo() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const videoScale =
    windowWidth < 768
      ? '250%' // Mobile scale
      : windowWidth < 1024
      ? '200%' // Tablet scale
      : '180%'; // Desktop scale

  return (
    <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
      {/* Blurred and Zoomed Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          src="https://player.vimeo.com/video/1038385534?autoplay=1&loop=1&muted=1&background=1"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '300%',
            height: '300%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(20px)',
            zIndex: 0,
          }}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Blurred Background Video"
        ></iframe>
      </div>

      {/* Main Background Video */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <iframe
          src="https://player.vimeo.com/video/1038385534?autoplay=1&loop=1&muted=1&background=1"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: videoScale,
            height: videoScale,
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
          }}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Main Background Video"
        ></iframe>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-20 pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-30 flex flex-col justify-center h-full text-white px-6 lg:px-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
            Contacto
          </h1>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-white" aria-current="page">
                Contacto
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}