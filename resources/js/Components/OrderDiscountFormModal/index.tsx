import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { Order } from "@/types/Order";
import { FormEventHandler } from "react";

interface OrderDiscountFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export default function OrderDiscountFormModal({ isOpen, onClose, order }: OrderDiscountFormModalProps) {
    const { data, setData, patch, processing } = useForm({
        order_id: order?.id ?? null,
        discount_type: order?.discount_type ?? 0,
        discount_value: order?.discount_value ?? 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('orders.applyDiscount', order!.id));
        onClose();
    };

    return <>
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">{ order ? `Desconto no Pedido #${order.id}` : 'Desconto no Pedido' }</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3"> 
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="discount_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tipo de Desconto
                                </label>
                                <select
                                    id="discount_type"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.discount_type}
                                    onChange={(e) => setData('discount_type', parseInt(e.target.value))}
                                    disabled={processing}
                                >
                                    <option value={0}>Valor Fixo</option>
                                    <option value={1}>Porcentagem</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="discount_value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Valor do Desconto {data.discount_type === 1 ? '(%)' : ''}
                                </label>
                                <input
                                    type="number"
                                    id="discount_value"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.discount_value}
                                    onChange={(e) => setData('discount_value', parseFloat(e.target.value))}
                                    min={0}
                                    max={data.discount_type === 1 ? 100 : undefined}
                                    step="0.01"
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
    </>
}