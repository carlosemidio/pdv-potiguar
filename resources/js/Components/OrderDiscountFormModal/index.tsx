import { Button } from "@headlessui/react";
import { X, Percent, DollarSign, Calculator, TrendingDown, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { Order } from "@/types/Order";
import { FormEventHandler, useState, useEffect } from "react";

interface OrderDiscountFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export default function OrderDiscountFormModal({ isOpen, onClose, order }: OrderDiscountFormModalProps) {
    const [preview, setPreview] = useState({ discountAmount: 0, finalTotal: 0 });
    
    const { data, setData, patch, processing, errors } = useForm({
        order_id: order?.id ?? null,
        discount_type: order?.discount_type ?? 0,
        discount_value: order?.discount_value ?? 0,
    });

    // Calcular preview do desconto
    useEffect(() => {
        if (!order) return;
        
        const subtotal = order.items.reduce((acc, item) => acc + (Number(item.total_price) || 0), 0);
        let discountAmount = 0;
        
        if (data.discount_type === 1) { // Porcentagem
            discountAmount = (subtotal * (data.discount_value / 100));
        } else { // Valor fixo
            discountAmount = data.discount_value;
        }
        
        const finalTotal = Math.max(0, subtotal - discountAmount);
        
        setPreview({ discountAmount, finalTotal });
    }, [data.discount_type, data.discount_value, order]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('orders.applyDiscount', order!.id), {
            onSuccess: () => onClose()
        });
    };

    const subtotal = order?.items.reduce((acc, item) => acc + (Number(item.total_price) || 0), 0) || 0;
    const isValidDiscount = data.discount_value > 0 && (data.discount_type === 0 ? data.discount_value <= subtotal : data.discount_value <= 100);

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="relative bg-white dark:bg-gray-900">
                {/* Header com gradiente */}
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-6 py-4 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <TrendingDown className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">
                                    Aplicar Desconto
                                </h2>
                                <p className="text-sm text-amber-100">
                                    {order ? `Pedido #${order.id}` : 'Novo desconto'}
                                </p>
                            </div>
                        </div>
                        <Button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </Button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Resumo do pedido */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-2 mb-3">
                            <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="font-semibold text-blue-900 dark:text-blue-200">Resumo do Pedido</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Itens:</span>
                                <span className="text-gray-900 dark:text-white">{order?.items.length || 0}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Tipo de desconto com cards visuais */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                Tipo de Desconto
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setData('discount_type', 0)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                        data.discount_type === 0
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <DollarSign className={`w-6 h-6 ${
                                            data.discount_type === 0 ? 'text-green-600' : 'text-gray-400'
                                        }`} />
                                        <span className={`font-medium text-sm ${
                                            data.discount_type === 0 ? 'text-green-900 dark:text-green-200' : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                            Valor Fixo
                                        </span>
                                        {data.discount_type === 0 && (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        )}
                                    </div>
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => setData('discount_type', 1)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                        data.discount_type === 1
                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Percent className={`w-6 h-6 ${
                                            data.discount_type === 1 ? 'text-purple-600' : 'text-gray-400'
                                        }`} />
                                        <span className={`font-medium text-sm ${
                                            data.discount_type === 1 ? 'text-purple-900 dark:text-purple-200' : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                            Porcentagem
                                        </span>
                                        {data.discount_type === 1 && (
                                            <CheckCircle className="w-4 h-4 text-purple-600" />
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Valor do desconto */}
                        <div>
                            <label htmlFor="discount_value" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Valor do Desconto {data.discount_type === 1 ? '(%)' : '(R$)'}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="discount_value"
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-lg font-semibold ${
                                        isValidDiscount
                                            ? 'border-green-300 focus:border-green-500 bg-green-50 dark:bg-green-900/20'
                                            : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
                                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-4 focus:ring-blue-500/20`}
                                    value={data.discount_value}
                                    onChange={(e) => setData('discount_value', parseFloat(e.target.value) || 0)}
                                    min={0}
                                    max={data.discount_type === 1 ? 100 : subtotal}
                                    step={data.discount_type === 1 ? 0.1 : 0.01}
                                    disabled={processing}
                                    placeholder={data.discount_type === 1 ? "Ex: 10.5" : "Ex: 15.00"}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    {data.discount_type === 1 ? (
                                        <Percent className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <span className="text-gray-400 font-medium">R$</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Avisos de validação */}
                            {data.discount_value > 0 && (
                                <div className="mt-2">
                                    {data.discount_type === 1 && data.discount_value > 100 && (
                                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Porcentagem não pode ser maior que 100%</span>
                                        </div>
                                    )}
                                    {data.discount_type === 0 && data.discount_value > subtotal && (
                                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Desconto não pode ser maior que o subtotal</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Preview do desconto */}
                        {data.discount_value > 0 && isValidDiscount && (
                            <div className="p-4 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-green-200 dark:border-green-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <h3 className="font-semibold text-green-900 dark:text-green-200">Preview do Desconto</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Desconto aplicado:</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">
                                            -{preview.discountAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                    </div>
                                    <div className="border-t border-green-200 dark:border-green-700 pt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-900 dark:text-white">Total final:</span>
                                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                                {preview.finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                                        Economia de {((preview.discountAmount / subtotal) * 100).toFixed(1)}% no pedido
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Botões de ação */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <SecondaryButton onClick={onClose} disabled={processing}>
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton 
                                onClick={submit}
                                disabled={processing || !isValidDiscount}
                                className="relative"
                            >
                                {processing && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    </div>
                                )}
                                <span className={processing ? 'invisible' : ''}>
                                    Aplicar Desconto
                                </span>
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}