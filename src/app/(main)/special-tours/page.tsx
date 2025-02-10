import { SpecialTourSection } from '@/components/SpecialTourSection'

const corporateTourImages = [
    'https://backend.hotumatur.com/wp-content/uploads/2024/12/rear-view-man-standing-against-rock-formation-1-scaled-1-1.webp',
    'https://backend.hotumatur.com/wp-content/uploads/2024/12/Ana-Te-Pahu2.webp',
    '/placeholder.svg?height=400&width=800&text=Corporate+Tour+3',
    '/placeholder.svg?height=400&width=800&text=Corporate+Tour+4',
]

const studyTourImages = [
    '/placeholder.svg?height=400&width=800&text=Study+Tour+1',
    '/placeholder.svg?height=400&width=800&text=Study+Tour+2',
    '/placeholder.svg?height=400&width=800&text=Study+Tour+3',
    '/placeholder.svg?height=400&width=800&text=Study+Tour+4',
]

const travelAgencyImages = [
    '/placeholder.svg?height=400&width=800&text=Travel+Agency+1',
    '/placeholder.svg?height=400&width=800&text=Travel+Agency+2',
    '/placeholder.svg?height=400&width=800&text=Travel+Agency+3',
    '/placeholder.svg?height=400&width=800&text=Travel+Agency+4',
]

export default function SpecialToursPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <main>
                <div className="py-8">
                    <div className="container mx-auto px-4 mt-12">

                    </div>
                </div>

                <SpecialTourSection
                    title="Tour corporativos"
                    images={corporateTourImages}
                    description="Ofrecemos tours corporativos diseñados para fomentar el trabajo en equipo y la productividad. Nuestros paquetes incluyen actividades de team building, conferencias en lugares inspiradores y experiencias únicas que fortalecerán los lazos entre sus empleados."
                    isTextRight={true}
                />
                <SpecialTourSection
                    title="Giras de estudios"
                    images={studyTourImages}
                    description="Nuestras giras de estudios combinan educación y aventura. Diseñamos itinerarios que complementan el currículo escolar, ofreciendo a los estudiantes la oportunidad de aprender de primera mano sobre historia, cultura y ciencias en destinos fascinantes."
                    isTextRight={false}
                />
                <SpecialTourSection
                    title="Agencias de viajes"
                    images={travelAgencyImages}
                    description="Colaboramos con agencias de viajes para ofrecer paquetes turísticos excepcionales. Nuestro conocimiento local y red de contactos nos permiten crear experiencias únicas y memorables para sus clientes, desde aventuras de lujo hasta escapadas económicas."
                    isTextRight={true}
                />
            </main>
        </div>
    )
}

