import { X, Tag } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { FormEventHandler } from "react";
import { TbCash } from "react-icons/tb";
import { cashMovementTypes } from "@/utils/cashMovementTypes";

interface CashMovementFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    registerId?: number;
}

export default function CashMovementFormModal({ isOpen, onClose, registerId }: CashMovementFormModalProps) {
    const { data, setData, post, processing, errors } = useForm({
        cash_register_id: registerId || '',
        type: '',
        amount: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('cash.movement', registerId), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData({
                    cash_register_id: registerId || '',
                    type: '',
                    amount: '',
                    description: ''
                });

                onClose();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="bg-white dark:bg-gray-800 shadow-xl w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Tag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    Adicionar Movimento de Caixa
                                </h3>
                                <p className="text-purple-100 text-sm">
                                    Adicione um novo movimento de caixa
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
                    {/* type */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tipo de Movimento
                        </label>
                        <div className="mt-1">
                            <select
                                id="type"
                                name="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                required
                            >
                                <option value="" disabled>
                                    Selecione o tipo de movimento
                                </option>
                                {cashMovementTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <InputError message={errors.type} className="mt-2" />
                    </div>

                    {/* amount */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Valor do Movimento
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <TbCash className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                        <InputError message={errors.amount} className="mt-2" />
                    </div>

                    {/* description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Descrição (opcional)
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="block w-full shadow-sm sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2.5"
                                placeholder="Descrição do movimento de caixa"
                            ></textarea>
                        </div>
                        <InputError message={errors.description} className="mt-2" />
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
                            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500"
                        >
                            {processing ? 'Salvando...' : 'Salvar Movimento'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}