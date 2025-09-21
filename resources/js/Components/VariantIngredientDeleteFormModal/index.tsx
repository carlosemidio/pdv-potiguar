import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { VariantIngredient } from "@/types/VariantIngredient";
import Swal from "sweetalert2";

interface VariantIngredientDeleteFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    variantIngredients?: VariantIngredient[] | null;
}

export default function VariantIngredientDeleteFormModal({
    isOpen,
    onClose,
    variantIngredients,
}: VariantIngredientDeleteFormModalProps) {
    const { data, setData, post, processing } = useForm({
        _method: 'delete',
        id: 0,
    });

    const handleIngredientChange = (id: number) => {
        setData('id', id);
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.id) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Por favor, selecione um ingrediente para remover.',
            });
            return;
        }

        post(route('variant-ingredients.destroy', data.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData('id', 0);
                onClose();
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">Remover ingrediente</p>
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
                                <select
                                    id="ingredient_id"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.id}
                                    onChange={(e) => handleIngredientChange(Number(e.target.value))}
                                    required
                                    disabled={processing}
                                >
                                    <option value="">Selecione...</option>
                                    {variantIngredients?.map(variantIngredient => (
                                        <option key={variantIngredient.id} value={variantIngredient.id}>
                                            {variantIngredient.ingredient
                                                ? `${variantIngredient.ingredient.name} - ${variantIngredient.quantity} (${variantIngredient.unit?.symbol ?? ''})`
                                                : `Ingrediente desconhecido - ${variantIngredient.quantity} (${variantIngredient.unit?.symbol ?? ''})`
                                            }
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-3 flex justify-end items-center gap-2">
                                <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                                <PrimaryButton onClick={submit}>Excluir</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
