import { Variant } from "@/types/Variant"
import { useState } from "react"
import Card from "../Card";

interface Props {
    variants: Variant[]
}

export default function VariantsList({ variants }: Props) {
    return (
        <div className="mt-8 w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Variantes
            </h2>

            <div className="mt-2">
                {variants.length > 0 ? (
                    variants?.map((variant) => (
                        <Card key={variant.id} className="p-4 bg-white shadow rounded-lg mb-2">
                            <p className="text-sm text-gray-600">Preço: {variant.price}</p>
                            <p className="text-sm text-gray-600">Quantidade: {variant.stock_quantity}</p>
                            <p className="text-sm text-gray-600 mt-2">SKU: {variant.sku}</p>
                            <p className="text-sm text-gray-600 mt-2">Atributos:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {variant.attributes && variant.attributes.length > 0 ? (
                                    variant.attributes.map((attr, index) => (
                                        <li key={index}>{attr.name}: {attr.value}</li>
                                    ))
                                ) : (
                                    <li>Nenhum atributo disponível</li>
                                )}
                            </ul>

                            {variant.images && variant.images.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {variant.images.map((image: { file_url: string; name: string }, index: number) => (
                                        <div key={index} className="w-full h-24 bg-gray-200 rounded-lg flex justify-center items-center relative mb-4">
                                            <img
                                                src={image.file_url}
                                                alt={image.name}
                                                className="mt-2 w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500">Nenhuma variante encontrada.</p>
                )}
            </div>
        </div>
    )
}
