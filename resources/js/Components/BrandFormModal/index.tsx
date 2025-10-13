import { Button } from "@headlessui/react";
import { X, Palette } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { useEffect } from "react";
import { Brand } from "@/types/Brand";
import InputError from "../InputError";

interface BrandFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    brand?: Brand | null;
}

export default function BrandFormModal({ isOpen, onClose, brand }: BrandFormModalProps) {
    const { data, setData, patch, post, processing, errors, reset } = useForm({
        name: brand?.name ?? '',
        status: brand?.status ?? 1,
    });

    useEffect(() => {
        setData({
            name: brand?.name ?? '',
            status: brand?.status ?? 1,
        });
    }, [brand]);

    const isEdit = !!brand;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('brands.update', brand!.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        } else {
            post(route('brands.store'), {
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
            <div className="bg-white dark:bg-gray-800 shadow-xl w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Palette className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {isEdit ? 'Editar Marca' : 'Nova Marca'}
                                </h3>
                                <p className="text-amber-100 text-sm">
                                    {isEdit ? 'Atualize as informações da marca' : 'Adicione uma nova marca ao catálogo'}
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
                    {/* Nome da Marca */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Palette className="w-4 h-4" />
                            Nome da Marca
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Ex: Coca-Cola, Nike, Apple..."
                            disabled={processing}
                        />
                        <InputError className="mt-1" message={errors.name} />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Status da Marca
                        </label>
                        <select
                            id="status"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            value={data.status}
                            onChange={(e) => setData('status', Number(e.target.value))}
                            required
                            disabled={processing}
                        >
                            <option value={1}>🟢 Ativo - Disponível para produtos</option>
                            <option value={0}>🔴 Inativo - Oculto do sistema</option>
                        </select>
                        <InputError className="mt-1" message={errors.status} />
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
                            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 focus:ring-amber-500"
                        >
                            {processing ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar Marca')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
