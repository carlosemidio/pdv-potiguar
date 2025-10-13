import { Button } from "@headlessui/react";
import { X, Plus, Edit3 } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { useEffect } from "react";
import { Addon } from "@/types/Addon";
import InputError from "../InputError";

interface AddonFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    addon?: Addon | null;
}

export default function AddonFormModal({ isOpen, onClose, addon }: AddonFormModalProps) {
    const { data, setData, patch, post, processing, errors, reset } = useForm({
        name: addon?.name ?? '',
    });

    useEffect(() => {
        setData({
            name: addon?.name ?? '',
        });
    }, [addon]);

    const isEdit = !!addon;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('addons.update', addon!.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        } else {
            post(route('addons.store'), {
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
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                {isEdit ? (
                                    <Edit3 className="w-6 h-6" />
                                ) : (
                                    <Plus className="w-6 h-6" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">
                                    {isEdit ? 'Editar Complemento' : 'Novo Complemento'}
                                </h2>
                                <p className="text-purple-100 text-sm">
                                    {isEdit ? 'Atualize as informações do complemento' : 'Adicione um novo complemento ao cardápio'}
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
                        {/* Nome do Complemento */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <Plus className="w-4 h-4 text-purple-600" />
                                Nome do Complemento
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Ex: Queijo extra, Bacon, Molho especial..."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 placeholder-gray-400"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                disabled={processing}
                            />
                            <InputError className="mt-1" message={errors.name} />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                💡 Dica: Use nomes claros e descritivos para facilitar a identificação pelos clientes
                            </p>
                        </div>

                        {/* Informações Adicionais */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                            <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
                                📋 Sobre Complementos
                            </h3>
                            <p className="text-xs text-purple-700 dark:text-purple-300">
                                Complementos são itens extras que podem ser adicionados aos produtos. 
                                Eles ajudam a personalizar pedidos e aumentar o valor médio das vendas.
                            </p>
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
                                className="flex-1 justify-center py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {isEdit ? 'Salvando...' : 'Criando...'}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        {isEdit ? (
                                            <Edit3 className="w-4 h-4" />
                                        ) : (
                                            <Plus className="w-4 h-4" />
                                        )}
                                        {isEdit ? 'Salvar Alterações' : 'Criar Complemento'}
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
