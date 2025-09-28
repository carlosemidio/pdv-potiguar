import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface ComboOptionGroupFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    sp_variant_id: number;
}

export default function ComboOptionGroupFormModal({
    isOpen,
    onClose,
    sp_variant_id
}: ComboOptionGroupFormModalProps) {
    const { data, setData, post, processing } = useForm({
        sp_variant_id: sp_variant_id,
        name: '',
        is_required: false,
        min_options: 0,
        max_options: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('combo-option-groups.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData({
                    sp_variant_id: sp_variant_id,
                    name: '',
                    is_required: false,
                    min_options: 0,
                    max_options: 0,
                });
                onClose();
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">Adicionar grupo de opções</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nome do grupo
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
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_required"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={data.is_required}
                                    onChange={(e) => setData('is_required', e.target.checked)}
                                    disabled={processing}
                                />
                                <label htmlFor="is_required" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Seleção obrigatória
                                </label>
                            </div>

                            <div>
                                <label htmlFor="min_options" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Mínimo de opções selecionáveis
                                </label>
                                <input
                                    type="number"
                                    id="min_options"
                                    min={0}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.min_options}
                                    onChange={(e) => setData('min_options', parseInt(e.target.value))}
                                    required
                                    disabled={processing}
                                />
                            </div>

                            <div>
                                <label htmlFor="max_options" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Máximo de opções selecionáveis
                                </label>
                                <input
                                    type="number"
                                    id="max_options"
                                    min={0}
                                    step={0.01}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.max_options}
                                    onChange={(e) => setData('max_options', parseInt(e.target.value))}
                                    required
                                    disabled={processing}
                                />
                            </div>

                            <div className="mt-3 flex justify-end items-center gap-2">
                                <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                                <PrimaryButton onClick={submit}>Salvar</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
