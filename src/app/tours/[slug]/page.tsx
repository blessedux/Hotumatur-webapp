import { productsService } from '@/services/products.service'
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'
import { Suspense } from 'react'

interface Props {
    params: {
        slug: string
    }
}

async function getProduct(slug: string) {
    return await productsService.getBySlug(slug)
}

export default async function ProductPage({ params }: Props) {
    const product = await getProduct(params.slug)

    if (!product) {
        return <div>Producto no encontrado</div>
    }

    const subtitulo = product.meta_data.find(meta => meta.key === 'subtitulo')?.value
    const productAttributes = product.attributes.map(attr => ({
        name: attr.name.charAt(0).toUpperCase() + attr.name.slice(1),
        value: attr.options[0]
    }))

    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <div className="min-h-[calc(100dvh-80px-700px)] mx-auto">
                <section className="relative h-[500px] w-full overflow-hidden">
                    <Image
                        src={product.images[0]?.src || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover object-center absolute inset-0"
                        sizes="100vw"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20">
                        <div className="container mx-auto px-4 h-full flex flex-col justify-center text-white">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
                            {subtitulo && (
                                <p className="text-xl md:text-2xl text-gray-100 mb-4">{subtitulo}</p>
                            )}
                        </div>
                    </div>
                </section>
                <div className="container mx-auto py-12 px-4">
                    <div
                        className="prose prose-lg max-w-none
                            prose-headings:font-bold prose-headings:text-gray-900
                            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-gray-600 prose-p:leading-relaxed
                            prose-ul:mt-4 prose-ul:list-disc prose-ul:pl-6
                            prose-li:text-gray-600 prose-li:mb-2
                            prose-strong:text-gray-900 prose-strong:font-semibold"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                    <Card className="mt-10">
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-bold mb-6">Detalles del Tour</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {productAttributes.map((attr) => (
                                    <div key={attr.name} className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <div>
                                            <span className="font-semibold">{attr.name}: </span>
                                            <span>{attr.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Suspense>
    )
} 