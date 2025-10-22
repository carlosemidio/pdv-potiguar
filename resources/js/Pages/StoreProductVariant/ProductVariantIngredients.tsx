import VariantIngredientDeleteFormModal from '@/Components/VariantIngredientDeleteFormModal';
import VariantIngredientFormModal from '@/Components/VariantIngredientFormModal';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { Unit } from '@/types/Unit';
import { ChefHat, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProductVariantIngredientsProps {
    variant: StoreProductVariant;
    units: Unit[];
}

export default function ProductVariantIngredients({ variant, units }: ProductVariantIngredientsProps) {
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
    const [isIngredientDeleteModalOpen, setIsIngredientDeleteModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                    <h3 className='text-xl font-bold text-green-700 dark:text-green-300 flex items-center gap-2'>
                        <ChefHat className="w-5 h-5" />
                        Ingredientes da Receita
                    </h3>
                    <div className="flex gap-2">
                        {variant?.variant_ingredients && variant.variant_ingredients.length > 0 && (
                            <button 
                                onClick={() => setIsIngredientDeleteModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 rounded-xl font-medium transition-all duration-200"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remover
                            </button>
                        )}
                        <button 
                            onClick={() => setIsIngredientModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Adicionar Ingrediente
                        </button>
                    </div>
                </div>

                {variant?.variant_ingredients && variant.variant_ingredients.length > 0 ? (
                    <div className="grid gap-3">
                        {variant.variant_ingredients.map((ingredient, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                        <ChefHat className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                            {ingredient.ingredient?.name || '-'}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Ingrediente da receita
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                                        {ingredient.quantity} {ingredient.unit?.symbol || ''}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                        <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum ingrediente cadastrado</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Clique em "Adicionar Ingrediente" para começar</p>
                    </div>
                )}
            </div>

            <VariantIngredientFormModal
                sp_variant_id={variant?.id}
                isOpen={isIngredientModalOpen}
                onClose={() => setIsIngredientModalOpen(false)}
                units={units}
            />

            {variant?.variant_ingredients && variant.variant_ingredients.length > 0 && (
                <VariantIngredientDeleteFormModal
                    isOpen={isIngredientDeleteModalOpen}
                    onClose={() => setIsIngredientDeleteModalOpen(false)}
                    variantIngredients={variant.variant_ingredients}
                />
            )}
        </div>
    );
}
