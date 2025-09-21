import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Unit } from "@/types/Unit";
import { Ingredient } from "@/types/Ingredient";
import { AddonIngredient } from "@/types/AddonIngredient";
import SearchableIngredientsSelect from "../SearchableIngredientsSelect";

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
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">{isEdit ? `Editar` : 'Adicionar'} ingrediente do addon</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="ingredient_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Ingrediente
                                </label>
                                <SearchableIngredientsSelect
                                    selectedIngredient={ingredient}
                                    setIngredient={(ing) => handleIngredientChange(ing)}
                                    isDisabled={processing}
                                />
                            </div>
                            <div>
                                <label htmlFor="unit_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Unidade
                                </label>
                                <select
                                    id="unit_id"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.unit_id}
                                    onChange={(e) => setData('unit_id', Number(e.target.value))}
                                    required
                                    disabled={processing}
                                >
                                    {units?.map(unit => (
                                        <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Quantidade
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    min={0.01}
                                    step={0.01}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                            </div>
                            <div className="mt-3 flex justify-end items-center gap-2">
                                <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                                <PrimaryButton onClick={submit}>{isEdit ? 'Salvar' : 'Iniciar'}</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
