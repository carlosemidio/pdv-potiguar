import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { Unit } from '@/types/Unit';
import { Head, Link } from '@inertiajs/react';
import { Package, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import ProductVariantTabs from './ProductVariantTabs';
import ProductVariantDetails from './ProductVariantDetails';
import ProductVariantIngredients from './ProductVariantIngredients';
import ProductVariantGroupOptions from './ProductVariantGroupOptions';
import ProductVariantAddons from './ProductVariantAddons';
import ProductVariantComboOptions from './ProductVariantComboOptions';
import ProductVariantComboItems from './ProductVariantComboItems';

export default function Index({
    auth,
    storeProductVariant,
    units
}: PageProps<{ storeProductVariant: { data: StoreProductVariant }, units: { data: Unit[] } }>) {
    const [tab, setTab] = useState<'detalhes' | 'opcoes-fixas' | 'opcoes-variaveis' | 'ingredientes' | 'grupos-de-opcoes' | 'complementos'>('detalhes');
    const variant = storeProductVariant?.data;

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {variant?.product_variant?.name || 'Variante de Produto'}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {variant?.product_variant?.sku && `SKU: ${variant.product_variant.sku}`}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Produtos" />
            <section className='px-2 text-gray-800 dark:text-gray-200 space-y-6'>
                <div className="mx-auto">
                    {/* Botão Voltar */}
                    <div className="flex items-center mb-6">
                        <Link href={route('store-product-variant.index')}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                                <ArrowLeft className="w-4 h-4" />
                                Voltar
                            </button>
                        </Link>
                    </div>

                    {/* Navegação por Tabs Moderna */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <ProductVariantTabs tab={tab} setTab={setTab} isCombo={variant?.is_combo ?? undefined} />
                        
                        {/* Conteúdo das Tabs */}
                        <div className="p-6">
                            {tab === 'detalhes' && (
                                <ProductVariantDetails variant={variant} />
                            )}

                            {((tab === 'ingredientes') && (!variant?.is_combo)) && (
                                <ProductVariantIngredients
                                    variant={variant}
                                    units={units.data}
                                />
                            )}

                            {((tab === 'opcoes-fixas') && (variant?.is_combo)) && (
                                <ProductVariantComboItems variant={variant} />
                            )}

                            {((tab === 'opcoes-variaveis') && (variant?.is_combo)) && (
                                <ProductVariantComboOptions variant={variant} />
                            )}

                            {((tab === 'grupos-de-opcoes') && (!variant?.is_combo)) && (
                                <ProductVariantGroupOptions 
                                    variant={variant}
                                />
                            )}

                            {tab === 'complementos' && (
                                <ProductVariantAddons
                                    variant={variant}
                                    units={units.data}
                                />
                            )}                        
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}