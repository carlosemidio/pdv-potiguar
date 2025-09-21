import Card from '@/Components/Card';
import SecondaryButton from '@/Components/SecondaryButton';
import VariantAddonDeleteFormModal from '@/Components/VariantAddonDeleteFormModal';
import VariantAddonFormModal from '@/Components/VariantAddonFormModal';
import VariantIngredientDeleteFormModal from '@/Components/VariantIngredientDeleteFormModal';
import VariantIngredientFormModal from '@/Components/VariantIngredientFormModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { Unit } from '@/types/Unit';
import { Head, Link } from '@inertiajs/react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Index({
    auth,
    storeProductVariant,
    units
}: PageProps<{ storeProductVariant: { data: StoreProductVariant }, units: { data: Unit[] } }>) {
    const [tab, setTab] = useState<'detalhes' | 'ingredientes' | 'complementos'>('detalhes');
    const variant = storeProductVariant?.data;
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
    const [isIngredientDeleteModalOpen, setIsIngredientDeleteModalOpen] = useState(false);
    const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
    const [isAddonDeleteModalOpen, setIsAddonDeleteModalOpen] = useState(false);
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {variant?.product_variant?.name || 'N/A'}
                </h2>
            }
        >
            <Head title="Produtos" />
            <section className='px-2 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto">
                    <div className="mb-4">
                        <Link href={route('store-product-variant.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>
                    <div className="mb-2 flex gap-2 border-b border-gray-200 dark:border-gray-700 text-xs">
                        <button className={`py-2 px-3 font-semibold rounded-t ${tab === 'detalhes' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`} onClick={() => setTab('detalhes')}>Detalhes</button>
                        <button className={`py-2 px-3 font-semibold rounded-t ${tab === 'ingredientes' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`} onClick={() => setTab('ingredientes')}>Ingredientes</button>
                        <button className={`py-2 px-3 font-semibold rounded-t ${tab === 'complementos' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`} onClick={() => setTab('complementos')}>Complementos</button>
                    </div>
                    <div className='grid grid-cols-1 gap-2 mt-2'>
                        {tab === 'detalhes' && (
                            <Card key={variant?.product_variant?.id} className="p-3 relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                                <h3 className='text-base font-bold mb-2 text-blue-700 dark:text-blue-300'>Detalhes</h3>
                                <div className="mb-2 text-xs">
                                    <div>
                                        <span className="block text-gray-500 dark:text-gray-400">Nome</span>
                                        <span className="font-semibold">{variant?.product_variant?.name || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">SKU: </span>
                                        <span className="font-semibold">{variant?.product_variant?.sku || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Categoria: </span>
                                        <span>{variant?.product_variant?.product?.category?.name || 'N/A'}</span>
                                    </div>
                                    {variant?.product_variant?.product?.brand && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Marca: </span>
                                            <span>{variant?.product_variant?.product?.brand?.name || 'N/A'}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-2">
                                    <span className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1">Descrição</span>
                                    <div className="prose prose-xs dark:prose-invert max-w-none" dangerouslySetInnerHTML={{
                                        __html: variant?.product_variant?.product?.description || ''
                                    }} />
                                </div>

                                <div className="flex justify-start align-center gap-2 mb-2 w-full">
                                    <div className="bg-blue-50 dark:bg-blue-900 rounded p-2 flex flex-col items-center justify-center max-w-[180px] w-1/2">
                                        <span className="text-[10px] text-blue-700 dark:text-blue-300">Preço</span>
                                        <span className="text-base font-bold text-blue-700 dark:text-blue-300">{variant?.price ? `R$ ${variant?.price}` : 'N/A'}</span>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900 rounded p-2 flex flex-col items-center justify-center max-w-[180px] w-1/2">
                                        <span className="text-[10px] text-green-700 dark:text-green-300">Estoque</span>
                                        <span className="text-base font-bold text-green-700 dark:text-green-300">{variant?.stock_quantity !== null ? variant?.stock_quantity : 'N/A'}</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-0 mt-1">
                                    <span className="block text-[10px] text-gray-500 dark:text-gray-400">Criado em</span>
                                    <span className="text-xs text-gray-700 dark:text-gray-300">
                                        {variant?.created_at
                                            ? new Date(variant.created_at).toLocaleDateString('pt-BR', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : 'N/A'
                                        }
                                    </span>
                                </div>
                            </Card>
                        )}
                        {tab === 'ingredientes' && (
                            <Card className="p-3 relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                                <h3 className='text-base font-bold mb-2 text-blue-700 dark:text-blue-300'>Ingredientes</h3>
                                {variant?.ingredients && variant.ingredients.length > 0 ? (
                                    <ul className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                                        {variant.ingredients.map((ingredient, idx) => (
                                            <li key={idx} className="flex flex-row gap-4 justify-start">
                                                <span className="font-semibold">{ingredient.ingredient?.name || '-'}</span>
                                                <span className="text-gray-500 dark:text-gray-400">{ingredient.quantity}({ingredient.unit?.symbol || ''})</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className='text-gray-500 dark:text-gray-400'>Nenhum ingrediente cadastrado.</div>
                                )}
                                <div className="mt-3 flex justify-start items-center gap-2">
                                    <SecondaryButton onClick={() => setIsIngredientDeleteModalOpen(true)}>
                                        <Trash2 className="w-4 h-4 mr-1 inline text-red-700 dark:text-red-300" />
                                        Remover
                                    </SecondaryButton>

                                    <SecondaryButton onClick={() => setIsIngredientModalOpen(true)}>
                                        <PlusCircle className="w-4 h-4 mr-1 inline text-blue-700 dark:text-blue-300" />
                                    </SecondaryButton>
                                </div>
                            </Card>
                        )}

                        {tab === 'complementos' && (
                            <Card className="p-3 relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                                <h3 className='text-base font-bold mb-2 text-blue-700 dark:text-blue-300'>Complementos</h3>
                                {variant?.variant_addons && variant.variant_addons.length > 0 ? (
                                    <ul className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                                        {variant.variant_addons.map((variantAddon, idx) => (
                                            <li key={idx} className="flex flex-row gap-4 justify-start">
                                                <span className="font-semibold">{variantAddon.addon?.name || '-'}</span>
                                                <span className="text-gray-500 dark:text-gray-400">Qtd: {variantAddon.quantity}</span>
                                                <span className="text-gray-500 dark:text-gray-400">Preço: R$ {variantAddon.price || '0.00'}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className='text-gray-500 dark:text-gray-400'>Nenhum complemento cadastrado.</div>
                                )}

                                <div className="mt-3 flex justify-start items-center gap-2">
                                    <SecondaryButton onClick={() => setIsAddonDeleteModalOpen(true)}>
                                        <Trash2 className="w-4 h-4 mr-1 inline text-red-700 dark:text-red-300" />
                                        Remover
                                    </SecondaryButton>

                                    <SecondaryButton onClick={() => setIsAddonModalOpen(true)}>
                                        <PlusCircle className="w-4 h-4 mr-1 inline text-blue-700 dark:text-blue-300" />
                                    </SecondaryButton>
                                </div>
                            </Card>
                        )}

                        <VariantIngredientFormModal
                            sp_variant_id={variant?.id}
                            isOpen={isIngredientModalOpen}
                            onClose={() => setIsIngredientModalOpen(false)}
                            units={units.data}
                        />

                        {variant?.ingredients?.length && (
                            <VariantIngredientDeleteFormModal
                                isOpen={isIngredientDeleteModalOpen}
                                onClose={() => setIsIngredientDeleteModalOpen(false)}
                                variantIngredients={variant.ingredients}
                            />
                        )}

                        <VariantAddonFormModal
                            sp_variant_id={variant?.id}
                            units={units.data}
                            isOpen={isAddonModalOpen}
                            onClose={() => setIsAddonModalOpen(false)}
                        />

                        {variant?.variant_addons && variant.variant_addons.length > 0 && (
                            <VariantAddonDeleteFormModal
                                isOpen={isAddonDeleteModalOpen}
                                onClose={() => setIsAddonDeleteModalOpen(false)}
                                variantAddons={variant.variant_addons}
                            />
                        )}
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}