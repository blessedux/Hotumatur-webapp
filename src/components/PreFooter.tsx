import TourSelector from '@/components/TourSelector'


// const tours = [
//     "Tour Arqueológico",
//     "Tour de Playas",
//     "Tour de Moais",
//     "Tour de Atardecer",
//     "Tour Volcánico",
// ]

export default function BookingForm() {
    return (
        <div className="relative w-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1f45d4] to-[#327ef8]" />
            <div className="absolute inset-0 bg-[url('/images/pattern-flowers-2.png')] bg-repeat opacity-10" />
            <div className="relative mx-auto max-w-4xl px-4 py-32 text-white">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">Reserva tu Aventura</h1>
                    <p className="text-xl text-white/90">
                        Vive momentos inolvidables en Rapa Nui, con experiencias diseñadas a tu medida
                    </p>
                </div>

                <TourSelector />

            </div>
        </div>
    )
}

