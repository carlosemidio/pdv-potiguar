import { X, Tag } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { FormEventHandler } from "react";
import { TbCash } from "react-icons/tb";

interface CashRegisterFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    registerId?: number;
}

export default function CashRegisterFormModal({ isOpen, onClose, registerId }: CashRegisterFormModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        opening_amount: '',
        closing_amount: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route(`cash.${registerId ? 'close' : 'open'}`, registerId), {
            preserveScroll: true,
            preserveState: true
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
                                    {registerId ? 'Fechar Caixa' : 'Abrir Caixa'}
                                </h3>
                                <p className="text-purple-100 text-sm">
                                    {registerId ? 'Preencha o valor de fechamento para encerrar o caixa.' : 'Preencha o valor de abertura para iniciar o caixa.'}
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
                    {/* Nome da Categoria */}
                    {registerId ? (
                        <div className="space-y-2">
                            <label htmlFor="closing_amount" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <TbCash className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                Valor de Fechamento
                            </label>
                            <input
                                type="number"
                                id="closing_amount"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                value={data.closing_amount}
                                onChange={(e) => setData('closing_amount', e.target.value)}
                                required
                                placeholder="0.00"
                                disabled={processing}
                                step="0.01"
                            />
                            <InputError className="mt-1" message={errors.closing_amount} />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label htmlFor="opening_amount" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <TbCash className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                Valor de Abertura
                            </label>
                            <input
                                type="number"
                                id="opening_amount"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                value={data.opening_amount}
                                onChange={(e) => setData('opening_amount', e.target.value)}
                                required
                                placeholder="0.00"
                                disabled={processing}
                                step="0.01"
                            />
                            <InputError className="mt-1" message={errors.opening_amount} />
                        </div>
                    )}

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
                            {processing ? 'Salvando...' : (registerId ? 'Fechar Caixa' : 'Abrir Caixa')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}