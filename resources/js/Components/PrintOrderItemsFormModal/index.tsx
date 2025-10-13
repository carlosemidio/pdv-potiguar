import { X, Printer as PrinterIcon, FileText, CheckSquare, Square } from "lucide-react";
import Modal from "../Modal";
import { Printer } from "@/types/Printer";
import Swal from 'sweetalert2';
import { FormEventHandler, useState } from "react";
import { Order } from "@/types/Order";
import { useForm } from "@inertiajs/react";

interface PrintOrderItemsFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    printers?: Printer[];
}

export default function PrintOrderItemsFormModal({ isOpen, onClose, order, printers }: PrintOrderItemsFormModalProps) {
    const { data, setData, patch, post, processing, errors, reset } = useForm<{
        printer_id: string;
        order_id: number;
        order_items_ids: number[];
    }>({
        printer_id: printers && (printers.length > 0) ? printers[0].id.toString() : '',
        order_id: order.id,
        order_items_ids: []
    });

    const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (data.printer_id === '') {
            Swal.fire({
                icon: 'error',
                title: 'Impressora não selecionada',
                text: 'Selecione uma impressora para continuar.',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        if (data.order_items_ids.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Nenhum item selecionado',
                text: 'Selecione pelo menos um item para imprimir.',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        post(route('order.items.print', { orderId: order.id, printerId: data.printer_id }), {
            preserveScroll: false,
            preserveState: false,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: `${data.order_items_ids.length} ${data.order_items_ids.length === 1 ? 'item enviado' : 'itens enviados'} para impressão.`,
                    timer: 2500,
                    showConfirmButton: false
                });
                setData({ printer_id: '', order_id: order.id, order_items_ids: [] });
                setSelectedPrinter(null);
                onClose();
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro na impressão',
                    text: 'Houve um erro ao enviar os itens para impressão. Tente novamente.',
                    confirmButtonColor: '#3B82F6'
                });
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-2xl w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    Imprimir Itens do Pedido
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Pedido #{order?.id} • Selecione os itens para impressão
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <form className="space-y-6" onSubmit={submit}>
                        {/* Seleção de Itens */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-l-4 border-blue-500">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <CheckSquare className="w-5 h-5" />
                                Itens do Pedido
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Selecione os itens que deseja imprimir:
                            </p>
                            
                            <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800">
                                {order.items.map(item => (
                                    <label key={item.id} className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer group">
                                        <div className="flex items-center pt-1">
                                            <input
                                                type="checkbox"
                                                checked={data.order_items_ids.includes(item.id)}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setData('order_items_ids', [...data.order_items_ids, item.id]);
                                                    } else {
                                                        setData('order_items_ids', data.order_items_ids.filter(id => id !== item.id));
                                                    }
                                                }}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                                {item.quantity}x {item.store_product_variant?.product_variant?.name ?? ''}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            
                            {/* Botões de seleção rápida */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setData('order_items_ids', order.items.map(item => item.id))}
                                    className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-300 text-sm rounded-lg transition-colors duration-200 font-medium"
                                >
                                    Selecionar Todos
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('order_items_ids', [])}
                                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors duration-200 font-medium"
                                >
                                    Limpar Seleção
                                </button>
                            </div>
                        </div>

                        {/* Seleção de Impressora */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-l-4 border-green-500">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <PrinterIcon className="w-5 h-5" />
                                Impressora de Destino
                            </h4>
                            
                            {printers && printers.length > 0 ? (
                                <div className="relative">
                                    <PrinterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        id="printer_id"
                                        name="printer_id"
                                        className="block w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 bg-white text-gray-900 transition-colors duration-200"
                                        value={data.printer_id}
                                        onChange={(e) => {
                                            const printer = printers?.find(p => p.id === parseInt(e.target.value));
                                            setSelectedPrinter(printer || null);
                                            setData('printer_id', e.target.value);
                                        }}
                                        required
                                        disabled={processing}
                                    >
                                        {printers.map((printer) => (
                                            <option key={printer.id} value={printer.id}>
                                                {printer.name} ({printer.type})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.printer_id && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                            {errors.printer_id}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <PrinterIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                        <div>
                                            <h5 className="font-medium text-yellow-800 dark:text-yellow-200">
                                                Nenhuma impressora disponível
                                            </h5>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                                Configure uma impressora antes de imprimir itens.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="order-2 sm:order-1 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                Cancelar
                            </button>
                            
                            <button
                                type="submit"
                                disabled={processing || (data.printer_id === '' || data.order_items_ids.length === 0)}
                                className="order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Imprimindo...
                                    </>
                                ) : (
                                    <>
                                        <PrinterIcon className="w-4 h-4" />
                                        Imprimir {data.order_items_ids.length} {data.order_items_ids.length === 1 ? 'Item' : 'Itens'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
