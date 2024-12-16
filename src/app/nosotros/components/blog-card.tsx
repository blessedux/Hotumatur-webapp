import { ArrowRight } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

interface BlogCardProps {
    title: string
    category: stringa
    href: string
    imageUrl: string
}

export function BlogCard({ title, category, href, imageUrl }: BlogCardProps) {
    return (
        <div className="group cursor-pointer">
            <div className="overflow-hidden rounded-lg">
                <Image
                    src={imageUrl}
                    alt={title}
                    width={400}
                    height={300}
                    className="aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">{category}</p>
                <h3 className="font-semibold leading-tight">{title}</h3>
                <Link
                    href={href}
                    className="inline-flex items-center text-sm text-primary hover:underline"
                >
                    READ MORE
                    <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
            </div>
        </div>
    )
}

