'use client';

import { Card, CardContent } from "@/components/ui/card";
import HotelCard from "@/components/HotelCard";
import { useDirectTranslation } from '@/hooks/useTranslatedText';

export default function Partners() {
    // Use our custom hook for direct translations
    const strategicAlliancesText = useDirectTranslation(
        "Strategic Alliances",
        "Alianzas estratégicas"
    );

    return (
        <section className="container py-24 w-full">


            {/* Tupa Hotel Highlighted Card */}
            <Card className="relative overflow-hidden rounded-lg shadow-lg bg-[#2D2D2D] text-white">
                <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">


                    <section className="container py-24">
                        <h2 className="text-3xl font-bold text-center mb-12">{strategicAlliancesText}</h2>
                        <HotelCard />
                    </section>
                    {/* Right Section: Content */}
                    <CardContent className="flex-1 flex flex-col justify-center space-y-4">
                        {/* Badge */}


                    </CardContent>
                </div>
            </Card>
        </section>
    );
}