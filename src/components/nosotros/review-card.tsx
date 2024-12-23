import Image from "next/image"
import { Star } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ReviewCard() {
    return (
        <Card className="overflow-hidden max-w-4xl">
            <div className="flex flex-col md:flex-row gap-6 bg-[#2D2D2D] text-white">
                <div className="relative w-full md:w-[300px] h-[300px] group">
                    <Image
                        src="https://backend.hotumatur.com/wp-content/uploads/2024/12/Hotumatur_Logo_BlueBackground.webp"
                        alt="Hotumatur Logo"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <CardContent className="flex-1 py-6">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold hover:underline cursor-pointer">
                            3. Hotumatur RapaNui
                        </h2>

                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-[#00AA6C] text-[#00AA6C]" />
                                ))}
                            </div>
                            <span className="text-lg">46</span>
                        </div>

                        <p className="text-lg text-gray-200">
                            Paint & Pottery Studios • 4WD, ATV & Off-Road Tours
                        </p>

                        <div className="flex items-center gap-3 mt-6">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback>SI</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-300">By sergioignacioa</p>
                                <p className="text-gray-300">
                                    I went with my partner and we received an excellent welcome from Hotumatur and Hotel Tupa. They showed us the most...
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}

