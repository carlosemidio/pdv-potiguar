import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { useEffect } from "react";
import { Unit } from "@/types/Unit";
import { Ingredient } from "@/types/Ingredient";
import InputError from "../InputError";

interface IngredientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    units: Unit[];
    ingredient?: Ingredient | null;
}

export default function IngredientFormModal({ isOpen, onClose, units, ingredient }: IngredientFormModalProps) {
    const { data, setData, patch, post, processing, errors, reset } = useForm({
        name: ingredient?.name ?? '',
        unit_id: ingredient?.unit_id ?? (units?.[0]?.id ?? ''),
    });

    useEffect(() => {
        setData({
            name: ingredient?.name ?? '',
            unit_id: ingredient?.unit_id ?? (units?.[0]?.id ?? ''),
        });
    }, [ingredient, units]);

    const isEdit = !!ingredient;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('ingredients.update', ingredient!.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        } else {
            post(route('ingredients.store'), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">{isEdit ? `Editar` : 'Adicionar'} ingrediente</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    disabled={processing}
                                />

                                <InputError className="mt-1" message={errors.name} />
                            </div>
                            <div>
                                <label htmlFor="unit_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Unidade
                                </label>
                                <select
                                    id="unit_id"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.unit_id}
                                    onChange={(e) => setData('unit_id', e.target.value)}
                                    required
                                    disabled={processing}
                                >
                                    {units?.map(unit => (
                                        <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>
                                    ))}
                                </select>

                                <InputError className="mt-1" message={errors.unit_id} />
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
