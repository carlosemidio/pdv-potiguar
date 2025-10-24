import { X, Palette } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import InputError from "../InputError";
import Menu from "@/types/Menu";

interface MenuFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    menu?: Menu;
}

export default function MenuFormModal({ isOpen, onClose, menu }: MenuFormModalProps) {
    const { data, setData, patch, post, processing, errors, reset } = useForm({
        name: menu?.name ?? '',
        is_permanent: menu ? Number(menu.is_permanent) : 1,
    });

    const isEdit = !!menu;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('menus.update', menu!.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        } else {
            post(route('menus.store'), {
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
            <div className="bg-white dark:bg-gray-800 shadow-xl w-full rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Palette className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {isEdit ? 'Editar Menu' : 'Novo Menu'}
                                </h3>
                                <p className="text-amber-100 text-sm">
                                    {isEdit ? 'Atualize as informações do menu' : 'Adicione um novo menu ao catálogo'}
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
                    {/* Nome do menu */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Palette className="w-4 h-4" />
                            Nome do Menu
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Ex: almoço, jantar, feijoada de sábado..."
                            disabled={processing}
                        />
                        <InputError className="mt-1" message={errors.name} />
                    </div>

                    {/* Is permanent */}
                    <div className="space-y-2">
                        <label htmlFor="is_permanent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            É fixo? Ex: Almoço de segunda a sexta
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="is_permanent"
                                    value={1}
                                    checked={data.is_permanent === 1}
                                    onChange={() => setData('is_permanent', 1)}
                                    disabled={processing}
                                    className="text-amber-600 focus:ring-amber-500 border-gray-300 dark:border-gray-600"
                                />
                                <span className="ml-2 text-gray-700 dark:text-gray-300">Sim</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="is_permanent"
                                    value={0}
                                    checked={data.is_permanent === 0}
                                    onChange={() => setData('is_permanent', 0)}
                                    disabled={processing}
                                    className="text-amber-600 focus:ring-amber-500 border-gray-300 dark:border-gray-600"
                                />
                                <span className="ml-2 text-gray-700 dark:text-gray-300">Não</span>
                            </label>
                        </div>
                        <InputError className="mt-1" message={errors.is_permanent} />
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
                            {processing ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Cadastrar Menu')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
