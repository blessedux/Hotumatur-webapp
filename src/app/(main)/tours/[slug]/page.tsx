import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MdAccessTime } from "react-icons/md";
import { RiBatteryChargeLine } from "react-icons/ri";
import { CheckCircle } from 'lucide-react'
import { VscError } from "react-icons/vsc";
import SingleTourSelector from "@/components/SingleTourSelector";
import { Metadata } from "next";

async function getProduct(slug: string) {
    const baseUrl = process.env.NEXT_PUBLIC_WC_API_URL || 'http://backend.hotumatur.com';
    const response = await fetch(`${baseUrl}/api/products/${slug}`, {
        next: { revalidate: 60 }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }

    return response.json();
}

const iconConfig = {
    'duracion': {
        icon: MdAccessTime,
        size: 'h-6 w-6',
        color: 'text-blue-500'
    },
    'dificultad': {
        icon: RiBatteryChargeLine,
        size: 'h-7 w-7',
        color: 'text-amber-500'
    },
    'incluye': {
        icon: CheckCircle,
        size: 'h-5 w-5',
        color: 'text-green-500'
    },
    'no incluye': {
        icon: VscError,
        size: 'h-6 w-6',
        color: 'text-red-500'
    }
} as const;

interface MetaData {
    key: string;
    value: string;
    id: number;
}

interface ProductAttribute {
    name: string;
    options: string[];
}

interface MappedAttribute {
    name: string;
    value: string;
}

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: {
    params: Params
    searchParams: SearchParams
}) {
    const params = await props.params
    const slug = params.slug

    const getData = async () => {
        const product = await getProduct(slug)
        if (!product) {
            return null
        }
        const subtitulo = product.meta_data.find((meta: MetaData) => meta.key === 'subtitulo')?.value
        const productAttributes = product.attributes.map((attr: ProductAttribute) => ({
            name: attr.name.charAt(0).toUpperCase() + attr.name.slice(1),
            value: attr.options[0]
        }))
        return {
            ...product,
            subtitulo,
            productAttributes
        }
    }

    const tourData = await getData()
    if (!tourData) {
        return <div>Producto no encontrado</div>
    }

    return (
        <div className="min-h-[calc(100dvh-80px-700px)] mx-auto">
            <section className="relative h-[600px] w-full overflow-hidden">
                <Image
                    src={tourData.images[0]?.src || "/placeholder.svg"}
                    alt={tourData.name}
                    fill
                    className="object-cover object-center absolute inset-0"
                    sizes="100vw"
                    priority
                />
                <div className="absolute inset-0 bg-black/20 ">
                    <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-10 text-white max-w-[1200px]">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{tourData.name}</h1>
                        {tourData.subtitulo && (
                            <p className="text-xl md:text-2xl text-gray-100 mb-4">{tourData.subtitulo}</p>
                        )}
                        <div className="flex items-center gap-4">
                            <p className="text-2xl md:text-3xl font-medium text-gray-200">
                                ${Number(tourData.price).toLocaleString('es-CL')} <span className="text-lg">/por persona</span>
                            </p>


                        </div>
                        <div className="max-w-md pt-4">
                            <SingleTourSelector
                                tourId={tourData.id}
                                tourName={tourData.name}
                                tourPrice={Number(tourData.price)}
                                tourImage={tourData.images[0]?.src || "/placeholder.svg"}
                            />

                        </div>

                    </div>
                </div>
            </section>
            <div className="container mx-auto py-12 px-4 max-w-[1200px]">
                <div
                    className="prose prose-lg max-w-none
                            prose-headings:font-bold prose-headings:text-gray-900
                            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-gray-600 prose-p:leading-relaxed
                            prose-ul:mt-4 prose-ul:list-disc prose-ul:pl-6
                            prose-li:text-gray-600 prose-li:mb-2
                            prose-strong:text-gray-900 prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: tourData.description }}
                />
                <Card className="mt-10">
                    <CardContent className="p-10">
                        <h3 className="text-2xl font-bold mb-6">Detalles del Tour</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tourData.productAttributes.map((attr: MappedAttribute) => {
                                const config = iconConfig[attr.name.toLowerCase() as keyof typeof iconConfig] || {
                                    icon: CheckCircle,
                                    size: 'h-5 w-5',
                                    color: 'text-gray-600'
                                };
                                const Icon = config.icon;

                                if (attr.name.toLowerCase() === 'incluye' || attr.name.toLowerCase() === 'no incluye') {
                                    const items = attr.value
                                        .split('•')
                                        .map(item => item.trim())
                                        .filter(item => item !== '');

                                    return (
                                        <div key={attr.name} className="space-y-2">
                                            <div className="flex items-center gap-2 font-semibold">
                                                <Icon className={`${config.size} ${config.color}`} />
                                                <span>{attr.name}</span>
                                            </div>
                                            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-gray-600">
                                                {items.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={attr.name} className="flex items-center gap-2">
                                        <Icon className={`${config.size} ${config.color}`} />
                                        <div>
                                            <span className="font-semibold">{attr.name}: </span>
                                            <span>{attr.value}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export async function generateMetadata(props: {
    params: Params
    searchParams: SearchParams
}): Promise<Metadata> {
    const params = await props.params
    const product = await getProduct(params.slug)

    return {
        title: `Tour - ${product.name}`,
        description: product.description?.replace(/<[^>]*>/g, '').slice(0, 160) || `Details for the tour ${params.slug}`,
    }
} 