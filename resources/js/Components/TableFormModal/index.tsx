import { X, Table2, Hash } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { useEffect } from "react";
import { Table } from "@/types/Table";
import InputError from "../InputError";

interface TableFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    table?: Table | null;
}

export default function TableFormModal({ isOpen, onClose, table }: TableFormModalProps) {
    const { data, setData, patch, post, processing, errors, reset } = useForm({
        name: table?.name ?? '',
    });

    useEffect(() => {
        setData({
            name: table?.name ?? '',
        });
    }, [table]);

    const isEdit = !!table;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('tables.update', table!.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        } else {
            post(route('tables.store'), {
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
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Table2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {isEdit ? 'Editar Mesa' : 'Nova Mesa'}
                                </h3>
                                <p className="text-emerald-100 text-sm">
                                    {isEdit ? 'Atualize as informações da mesa' : 'Adicione uma nova mesa ao restaurante'}
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
                    <div className="space-y-2">
                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Hash className="w-4 h-4" />
                            Nome da Mesa
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Ex: Mesa 1, Mesa da Varanda, Mesa VIP..."
                            disabled={processing}
                        />
                        <InputError className="mt-1" message={errors.name} />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Digite um nome único e fácil de identificar para a mesa
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
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:ring-emerald-500"
                        >
                            {processing ? 'Salvando...' : (isEdit ? 'Atualizar Mesa' : 'Criar Mesa')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
