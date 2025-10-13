import { Button } from "@headlessui/react";
import { X, ChefHat, Scale, Hash, Save, Package } from "lucide-react";
import Modal from "../Modal";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Unit } from "@/types/Unit";
import { Ingredient } from "@/types/Ingredient";
import { VariantIngredient } from "@/types/VariantIngredient";
import SearchableIngredientsSelect from "../SearchableIngredientsSelect";

interface VariantIngredientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    sp_variant_id: number;
    units: Unit[];
    variantIngredient?: VariantIngredient | null;
}

export default function VariantIngredientFormModal({
    isOpen,
    onClose,
    sp_variant_id,
    units,
    variantIngredient,
}: VariantIngredientFormModalProps) {
    const { data, setData, post, processing } = useForm({
        sp_variant_id: sp_variant_id,
        ingredient_id: '' as string | number,
        unit_id: '' as string | number,
        quantity: '',
    });

    const isEdit = !!variantIngredient;
    const [ingredient, setIngredient] = useState<Ingredient | null>(null);

    const handleIngredientChange = (ing: Ingredient | null) => {
        setIngredient(ing);
        setData('ingredient_id', ing ? ing.id : '');
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('variant-ingredients.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => onClose()
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <ChefHat className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {isEdit ? 'Editar Ingrediente' : 'Adicionar Ingrediente'}
                                </h2>
                                <p className="text-green-100 text-sm">
                                    {isEdit ? 'Modifique as informações do ingrediente' : 'Configure um novo ingrediente para a receita'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Seleção de Ingrediente */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-l-4 border-blue-500">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Ingrediente
                            </h4>
                            <SearchableIngredientsSelect
                                selectedIngredient={ingredient}
                                setIngredient={(ing) => handleIngredientChange(ing)}
                                isDisabled={processing}
                            />
                        </div>

                        {/* Unidade de Medida */}
                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-6 border-l-4 border-purple-500">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Scale className="w-5 h-5" />
                                Unidade de Medida
                            </h4>
                            <div className="relative">
                                <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    id="unit_id"
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 bg-white text-gray-900 transition-colors duration-200"
                                    value={data.unit_id}
                                    onChange={(e) => setData('unit_id', Number(e.target.value))}
                                    required
                                    disabled={processing}
                                >
                                    <option value="">Selecione uma unidade</option>
                                    {units?.map(unit => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.name} ({unit.symbol})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Quantidade */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border-l-4 border-orange-500">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Hash className="w-5 h-5" />
                                Quantidade
                            </h4>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    id="quantity"
                                    min={0.01}
                                    step={0.01}
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100 bg-white text-gray-900 transition-colors duration-200"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    required
                                    disabled={processing}
                                    placeholder="Digite a quantidade"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="order-2 sm:order-1 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Cancelar
                        </button>
                        
                        <button
                            type="button"
                            onClick={submit}
                            disabled={processing}
                            className="order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {isEdit ? 'Salvar Alterações' : 'Adicionar Ingrediente'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
