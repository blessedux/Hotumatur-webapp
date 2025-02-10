'use client'

import { useState, useRef } from 'react'
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
        name: "Franco",
        role: "Guía Turística",
        image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/Team-member1.webp",
        bio: "Franco, con su profundo conocimiento de la arqueología de Rapa Nui, ha dedicado los últimos 8 años a compartir la fascinante historia de la isla. Su pasión por la fotografía y su habilidad para encontrar los mejores ángulos hacen que cada tour sea una experiencia única y memorable.",
        specialties: ["Fotografía", "Arqueología", "Historia local"],
        languages: ["Español", "Inglés", "Portugués"]
    },
    {
        name: "Javi",
        role: "Guía Turístico",
        image: "https://backend.hotumatur.com/wp-content/uploads/2025/01/team-member2.webp",
        bio: "Javi, nacida y criada en Rapa Nui, es una apasionada del mar y experta en snorkel. Su experiencia como instructor de buceo y su conocimiento de la vida marina local hacen que sus tours de snorkel sean experiencias educativas y emocionantes. Su energía contagiosa y su amor por la conservación marina inspiran a todos los visitantes.",
        specialties: ["Snorkel", "Vida marina", "Conservación"],
        languages: ["Español", "Inglés", "Francés"]
    },
    {
        name: "Simón",
        role: "Guía Turística",
        image: "https://backend.hotumatur.com/wp-content/uploads/2025/01/team-member3.webp",
        bio: "Simón combina su formación en antropología con un profundo conocimiento de las tradiciones orales de Rapa Nui. Especializado en tours culturales, comparte historias fascinantes sobre la mitología y las leyendas de la isla. Su capacidad para conectar el pasado con el presente hace que cada visita sea una experiencia enriquecedora.",
        specialties: ["Antropología", "Tradiciones orales", "Mitología"],
        languages: ["Español", "Inglés", "Alemán"]
    },
    {
        name: "Tete",
        role: "Guía de Aventuras",
        image: "https://backend.hotumatur.com/wp-content/uploads/2025/01/team-member4.webp",
        bio: "Tete es nuestro experto en aventuras al aire libre. Con más de una década de experiencia en senderismo y exploración, conoce cada rincón de la isla. Su especialidad es guiar excursiones al amanecer y atardecer, ofreciendo perspectivas únicas de los moai y el paisaje volcánico de Rapa Nui.",
        specialties: ["Senderismo", "Fotografía paisajística", "Geología"],
        languages: ["Español", "Inglés", "Rapanui"]
    },
    {
        name: "Pou",
        role: "Guía Cultural",
        image: "https://backend.hotumatur.com/wp-content/uploads/2025/01/team-memeber5.webp",
        bio: "Pou, descendiente de una antigua familia Rapa Nui, es un guardián de las tradiciones culturales de la isla. Su profundo conocimiento de la danza, música y artesanía tradicional enriquece cada tour con demostraciones prácticas y relatos personales. Su conexión con la comunidad local ofrece a los visitantes una perspectiva auténtica de la vida isleña.",
        specialties: ["Danza tradicional", "Artesanía", "Historia familiar"],
        languages: ["Español", "Inglés", "Rapanui"]
    },
    {
        name: "Sergio Rapu",
        role: "Arqueólogo",
        image: "https://backend.hotumatur.com/wp-content/uploads/2025/01/team-member6.webp",
        bio: "Sergio Rapu, reconocido arqueólogo y experto en la cultura Rapa Nui, ha participado en numerosas investigaciones y proyectos de conservación en la isla. Su extensa experiencia y conocimiento académico, combinados con su capacidad para explicar conceptos complejos de manera accesible, hacen que sus tours sean verdaderas clases magistrales sobre la historia y arqueología de la isla.",
        specialties: ["Arqueología", "Conservación", "Investigación"],
        languages: ["Español", "Inglés", "Rapanui", "Francés"]
    }
]

export default function Team() {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
    const [modalPosition, setModalPosition] = useState({ top: 0 })

    const handleMemberClick = (member: TeamMember, event: React.MouseEvent) => {
        const clickedElement = event.currentTarget
        const rect = clickedElement.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop

        // Calculate the modal position based on the clicked card
        const topPosition = rect.top + scrollTop - 100 // Adjust the offset as needed

        setModalPosition({ top: topPosition })
        setSelectedMember(member)
    }

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
                            onClick={(e) => handleMemberClick(member, e)}
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
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSelectedMember(null)}
                >
                    <div
                        className="absolute left-1/2 -translate-x-1/2 w-full max-w-2xl p-4 transition-all duration-300"
                        style={{
                            top: `${modalPosition.top}px`,
                            transform: `translateX(-50%)`,
                        }}
                    >
                        <div
                            className="relative bg-gray-900 rounded-lg p-8 w-full shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-4 right-4 text-white hover:text-[#21b8c7] transition-colors"
                                onClick={() => setSelectedMember(null)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            <div className="overflow-y-auto max-h-[70vh]">
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
                                    <h4 className="text-2xl font-semibold text-white mb-2">
                                        {selectedMember.name}
                                    </h4>
                                    <p className="text-[#21b8c7] mb-4">
                                        {selectedMember.role}
                                    </p>
                                    <p className="text-gray-300 mb-6 text-center">
                                        {selectedMember.bio}
                                    </p>
                                    <div className="w-full">
                                        <h5 className="text-lg font-semibold text-white mb-2">
                                            Especialidades:
                                        </h5>
                                        <ul className="list-disc list-inside text-gray-300 mb-4">
                                            {selectedMember.specialties.map((specialty, index) => (
                                                <li key={index}>{specialty}</li>
                                            ))}
                                        </ul>
                                        <h5 className="text-lg font-semibold text-white mb-2">
                                            Idiomas:
                                        </h5>
                                        <p className="text-gray-300">
                                            {selectedMember.languages.join(', ')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

