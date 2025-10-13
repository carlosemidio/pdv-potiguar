import { Button } from "@headlessui/react";
import { X, Utensils, Scale, Hash } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Unit } from "@/types/Unit";
import { Ingredient } from "@/types/Ingredient";
import { AddonIngredient } from "@/types/AddonIngredient";
import SearchableIngredientsSelect from "../SearchableIngredientsSelect";
import InputError from "../InputError";

interface AddonIngredientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    addon_id: number;
    units: Unit[];
    addonIngredient?: AddonIngredient | null;
}

export default function AddonIngredientFormModal({
    isOpen,
    onClose,
    addon_id,
    units,
    addonIngredient,
}: AddonIngredientFormModalProps) {
    const { data, setData, post, processing } = useForm({
        addon_id: addon_id,
        ingredient_id: '' as string | number,
        unit_id: '' as string | number,
        quantity: '',
    });

    const isEdit = !!addonIngredient;
    const [ingredient, setIngredient] = useState<Ingredient | null>(null);

    const handleIngredientChange = (ing: Ingredient | null) => {
        setIngredient(ing);
        setData('ingredient_id', ing ? ing.id : '');
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('addon-ingredients.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => onClose()
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="bg-white dark:bg-gray-800 shadow-xl w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Utensils className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {isEdit ? 'Editar Ingrediente' : 'Adicionar Ingrediente'}
                                </h3>
                                <p className="text-green-100 text-sm">
                                    {isEdit ? 'Atualize o ingrediente do complemento' : 'Adicione um ingrediente ao complemento'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={submit} className="p-6 space-y-6">
                    {/* Ingrediente */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Utensils className="w-4 h-4" />
                            Ingrediente
                        </label>
                        <SearchableIngredientsSelect
                            selectedIngredient={ingredient}
                            setIngredient={(ing) => handleIngredientChange(ing)}
                            isDisabled={processing}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Selecione o ingrediente que será usado no complemento
                        </p>
                    </div>

                    {/* Unidade */}
                    <div className="space-y-2">
                        <label htmlFor="unit_id" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Scale className="w-4 h-4" />
                            Unidade de Medida
                        </label>
                        <select
                            id="unit_id"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            value={data.unit_id}
                            onChange={(e) => setData('unit_id', Number(e.target.value))}
                            required
                            disabled={processing}
                        >
                            <option value="">Selecione uma unidade...</option>
                            {units?.map(unit => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.name} ({unit.symbol})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantidade */}
                    <div className="space-y-2">
                        <label htmlFor="quantity" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Hash className="w-4 h-4" />
                            Quantidade
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            min={0.01}
                            step={0.01}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            value={data.quantity}
                            onChange={(e) => setData('quantity', e.target.value)}
                            required
                            placeholder="Ex: 2.5, 0.25, 1"
                            disabled={processing}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Quantidade necessária do ingrediente para este complemento
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <SecondaryButton 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5"
                        >
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton 
                            type="submit" 
                            disabled={processing}
                            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:ring-green-500"
                        >
                            {processing ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Adicionar Ingrediente')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
