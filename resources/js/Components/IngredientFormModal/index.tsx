import { Button } from "@headlessui/react";
import { X, Package, Scale } from "lucide-react";
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
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">
                                    {isEdit ? 'Editar Ingrediente' : 'Novo Ingrediente'}
                                </h2>
                                <p className="text-green-100 text-sm">
                                    {isEdit ? 'Atualize as informações do ingrediente' : 'Adicione um novo ingrediente ao sistema'}
                                </p>
                            </div>
                        </div>
                        <Button 
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Nome do Ingrediente */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <Package className="w-4 h-4 text-green-600" />
                                Nome do Ingrediente
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Ex: Farinha de trigo, Açúcar, etc."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                disabled={processing}
                            />
                            <InputError className="mt-1" message={errors.name} />
                        </div>

                        {/* Unidade de Medida */}
                        <div className="space-y-2">
                            <label htmlFor="unit_id" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <Scale className="w-4 h-4 text-blue-600" />
                                Unidade de Medida
                            </label>
                            <select
                                id="unit_id"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                value={data.unit_id}
                                onChange={(e) => setData('unit_id', e.target.value)}
                                required
                                disabled={processing}
                            >
                                <option value="" disabled>Selecione uma unidade</option>
                                {units?.map(unit => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name} ({unit.symbol})
                                    </option>
                                ))}
                            </select>
                            <InputError className="mt-1" message={errors.unit_id} />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <SecondaryButton 
                                onClick={onClose}
                                className="flex-1 justify-center py-3"
                                disabled={processing}
                            >
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton 
                                type="submit"
                                className="flex-1 justify-center py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {isEdit ? 'Salvando...' : 'Criando...'}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        {isEdit ? 'Salvar Alterações' : 'Criar Ingrediente'}
                                    </div>
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
