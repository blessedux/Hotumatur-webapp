'use client'

import React, { useEffect, useState } from 'react'

const flightPaths = [
  { id: 1, d: "M700,50 Q375,140 50,280", delay: 0 },  // North America
  { id: 2, d: "M750,150 Q400,215 50,280", delay: 3 }, // Europe
  { id: 3, d: "M750,250 Q400,265 50,280", delay: 6 }, // Asia
  { id: 4, d: "M650,350 Q350,315 50,280", delay: 9 }, // Australia
  { id: 5, d: "M400,350 Q225,315 50,280", delay: 12 }, // South America
]

export function FlightMap() {
  const [activePath, setActivePath] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePath((prev) => (prev + 1) % flightPaths.length)
    }, 4000) // Change active path every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-10">Vuelos a Rapa Nui</h2>
        <div className="relative w-full" style={{ paddingBottom: '50%' }}>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://backend.hotumatur.com/wp-content/uploads/2024/12/MAP_final.png)',
            }}
          >
            <svg
              viewBox="0 0 800 400"
              className="w-full h-full"
            >
              {/* Rapa Nui marker */}
              <circle cx="50" cy="280" r="5" fill="#21b8c7" />
              
              {/* Flight paths */}
              {flightPaths.map((path, index) => (
                <g key={path.id}>
                  <path
                    d={path.d}
                    fill="none"
                    stroke="#21b8c7"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className={`transition-opacity duration-1000 ${
                      index === activePath ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="1000"
                      to="0"
                      dur="4s"
                      begin={`${path.delay}s`}
                      fill="freeze"
                      repeatCount="indefinite"
                    />
                  </path>
                  <g
                    className={`transition-opacity duration-1000 ${
                      index === activePath ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <animateMotion
                      dur="4s"
                      begin={`${path.delay}s`}
                      fill="freeze"
                      repeatCount="indefinite"
                      rotate="auto"
                    >
                      <mpath href={`#path${path.id}`} />
                    </animateMotion>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M21 16L12 7L3 16H5L12 9L19 16H21Z" fill="currentColor"/>
                      <path d="M12 12L17 17H7L12 12Z" fill="currentColor"/>
                    </svg>
                  </g>
                </g>
              ))}
              
              {/* Hidden paths for animateMotion */}
              {flightPaths.map((path) => (
                <path
                  key={`path${path.id}`}
                  id={`path${path.id}`}
                  d={path.d}
                  fill="none"
                  stroke="none"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

