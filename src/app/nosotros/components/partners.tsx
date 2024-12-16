import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/app/nosotros/components/badge";
import HotelCard from "@/app/nosotros/components/HotelCard";

export default function Partners() {
    return (
        <section className="container py-24">


            {/* Tupa Hotel Highlighted Card */}
            <Card className="relative overflow-hidden rounded-lg shadow-lg bg-[#2D2D2D] text-white">
                <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">


                    <section className="container py-24">
                        <h2 className="text-3xl font-bold text-center mb-12">Nuestros Socios</h2>
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