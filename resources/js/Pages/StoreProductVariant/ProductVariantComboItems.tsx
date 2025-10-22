import ComboItemDeleteFormModal from '@/Components/ComboItemDeleteFormModal';
import ComboItemFormModal from '@/Components/ComboItemFormModal';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { Package, PlusCircle, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProductVariantComboItemsProps {
    variant: StoreProductVariant;
}

export default function ProductVariantComboItems({ variant }: ProductVariantComboItemsProps) {
    const [isComboItemModalOpen, setIsComboItemModalOpen] = useState(false);
    const [isComboItemDeleteModalOpen, setIsComboItemDeleteModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-4">
                    <h3 className='text-xl font-bold text-orange-700 dark:text-orange-300 flex items-center gap-2'>
                        <Settings className="w-5 h-5" />
                        Opções Fixas do Combo
                    </h3>
                    <div className="flex gap-2">
                        {variant?.combo_items && variant.combo_items.length > 0 && (
                            <button 
                                onClick={() => setIsComboItemDeleteModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 rounded-xl font-medium transition-all duration-200"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remover
                            </button>
                        )}
                        <button 
                            onClick={() => setIsComboItemModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Adicionar Item
                        </button>
                    </div>
                </div>

                {variant?.combo_items && variant.combo_items.length > 0 ? (
                    <div className="grid gap-3">
                        {variant.combo_items.map((option, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                        <Package className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                            {option.item_variant?.product_variant?.name || '-'}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Item fixo do combo
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm font-semibold">
                                        Qtd: {option.quantity}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma opção fixa cadastrada</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Clique em "Adicionar Item" para começar</p>
                    </div>
                )}
            </div>

            <ComboItemFormModal
                isOpen={isComboItemModalOpen}
                onClose={() => setIsComboItemModalOpen(false)}
                sp_variant_id={variant?.id ?? 0}
                quantity={1}
            />

            {variant?.combo_items && variant.combo_items.length > 0 && (
                <ComboItemDeleteFormModal
                    isOpen={isComboItemDeleteModalOpen}
                    onClose={() => setIsComboItemDeleteModalOpen(false)}
                    comboItems={variant.combo_items}
                />
            )}
        </div>
    );
}
