import VariantAddonDeleteFormModal from '@/Components/VariantAddonDeleteFormModal';
import VariantAddonFormModal from '@/Components/VariantAddonFormModal';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { Unit } from '@/types/Unit';
import { Plus, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProductVariantIngredientsProps {
    variant: StoreProductVariant;
    units: Unit[];
}

export default function ProductVariantIngredients({ variant, units }: ProductVariantIngredientsProps) {
    const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
    const [isAddonDeleteModalOpen, setIsAddonDeleteModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border-l-4 border-amber-500">
                <div className="flex items-center justify-between mb-4">
                    <h3 className='text-xl font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2'>
                        <Plus className="w-5 h-5" />
                        Complementos Extras
                    </h3>
                    <div className="flex gap-2">
                        {variant?.variant_addons && variant.variant_addons.length > 0 && (
                            <button 
                                onClick={() => setIsAddonDeleteModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 rounded-xl font-medium transition-all duration-200"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remover
                            </button>
                        )}
                        <button 
                            onClick={() => setIsAddonModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Adicionar Complemento
                        </button>
                    </div>
                </div>

                {variant?.variant_addons && variant.variant_addons.length > 0 ? (
                    <div className="grid gap-3">
                        {variant.variant_addons.map((variantAddon, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                            {variantAddon.addon?.name || '-'}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Complemento adicional
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm font-semibold">
                                        Qtd: {variantAddon.quantity}
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        R$ {Number(variantAddon.price || 0).toFixed(2).replace('.', ',')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                        <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum complemento cadastrado</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Clique em "Adicionar Complemento" para começar</p>
                    </div>
                )}
            </div>

            <VariantAddonFormModal
                sp_variant_id={variant?.id}
                units={units}
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
    );
}
