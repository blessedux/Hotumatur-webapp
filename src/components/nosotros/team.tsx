'use client'

import { useState } from 'react'
import Image from "next/image"

// Define the TeamMember type
interface TeamMember {
    name: string;
    role: string;
    image: string;
    bio: string;
    specialties: string[];
    languages: string[];
}

const team: TeamMember[] = [
    {
        name: "Ana Pakarati",
        role: "Guía Turística",
        image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/Team-member1.webp",
        bio: "Ana Pakarati es una experta en la historia y cultura de Rapa Nui. Con más de 15 años de experiencia como guía, Ana ha desarrollado un profundo conocimiento de los sitios arqueológicos y las tradiciones locales. Su pasión por compartir la rica herencia de la isla se refleja en cada tour que lidera.",
        specialties: ["Sitios arqueológicos", "Tradiciones culturales", "Flora y fauna local"],
        languages: ["Español", "Inglés", "Rapanui"]
    },
    {
        name: "Juan Tepano",
        role: "Guía Turístico",
        image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/Team-member1.webp",
        bio: "Juan Tepano, nacido y criado en Rapa Nui, es un apasionado narrador de historias y experto en ecoturismo. Con una formación en biología marina, Juan ofrece una perspectiva única sobre la ecología de la isla y su importancia en el ecosistema del Pacífico.",
        specialties: ["Ecoturismo", "Snorkel y buceo", "Conservación marina"],
        languages: ["Español", "Inglés", "Francés"]
    },
    {
        name: "María Tuki",
        role: "Guía Turística",
        image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/Team-member1.webp",
        bio: "María Tuki es una talentosa artista y guía cultural. Su conocimiento de las artes tradicionales de Rapa Nui, incluyendo el tallado en madera y la danza, añade una dimensión única a sus tours. María se especializa en experiencias inmersivas que permiten a los visitantes conectar profundamente con la cultura viva de la isla.",
        specialties: ["Artes tradicionales", "Danza y música", "Gastronomía local"],
        languages: ["Español", "Inglés", "Alemán"]
    },
    {
        name: "Carlos Huke",
        role: "Guía de Aventuras",
        image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/Team-member1.webp",
        bio: "Carlos Huke es un experimentado guía de aventuras con un profundo amor por la naturaleza de Rapa Nui. Especializado en senderismo y exploración de cuevas, Carlos ofrece a los visitantes una perspectiva única de los paisajes menos conocidos de la isla.",
        specialties: ["Senderismo", "Exploración de cuevas", "Fotografía de naturaleza"],
        languages: ["Español", "Inglés", "Japonés"]
    },
    {
        name: "Sofía Rapu",
        role: "Guía Cultural",
        image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/Team-member1.webp",
        bio: "Sofía Rapu, descendiente de una antigua familia Rapa Nui, es una apasionada defensora de la preservación cultural. Como guía, Sofía se especializa en compartir las leyendas, mitos y tradiciones orales de la isla, ofreciendo a los visitantes una inmersión profunda en el rico patrimonio cultural de Rapa Nui.",
        specialties: ["Leyendas y mitos", "Genealogía Rapa Nui", "Astronomía tradicional"],
        languages: ["Español", "Inglés", "Rapanui"]
    }
]

export default function Team() {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-semibold text-black">
                        Conoce a Nuestro Equipo
                    </h2>
                    <h3 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                        Guías Expertos
                    </h3>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {team.map((member, index) => (
                        <div
                            key={member.name}
                            className="group relative overflow-hidden rounded-lg bg-gray-900/50 p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105"
                            onClick={() => setSelectedMember(member)}
                        >
                            <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
                                <Image
                                    src={member.image}
                                    alt={`Foto de ${member.name}, ${member.role}`}
                                    width={160}
                                    height={160}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <h4 className="text-xl font-semibold text-white">{member.name}</h4>
                            <p className="text-[#21b8c7]">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMember(null)}></div>
                    <div className="relative bg-gray-900 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-4 right-4 text-white hover:text-[#21b8c7]"
                            onClick={() => setSelectedMember(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex flex-col items-center">
                            <div className="mb-6 h-48 w-48 overflow-hidden rounded-full">
                                <Image
                                    src={selectedMember.image}
                                    alt={`Foto de ${selectedMember.name}, ${selectedMember.role}`}
                                    width={192}
                                    height={192}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <h4 className="text-2xl font-semibold text-white mb-2">{selectedMember.name}</h4>
                            <p className="text-[#21b8c7] mb-4">{selectedMember.role}</p>
                            <p className="text-gray-300 mb-6 text-center">{selectedMember.bio}</p>
                            <div className="w-full">
                                <h5 className="text-lg font-semibold text-white mb-2">Especialidades:</h5>
                                <ul className="list-disc list-inside text-gray-300 mb-4">
                                    {selectedMember.specialties.map((specialty, index) => (
                                        <li key={index}>{specialty}</li>
                                    ))}
                                </ul>
                                <h5 className="text-lg font-semibold text-white mb-2">Idiomas:</h5>
                                <p className="text-gray-300">{selectedMember.languages.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

