import { X, Printer as PrinterIcon, FileText } from "lucide-react";
import Modal from "../Modal";
import { Printer } from "@/types/Printer";
import Swal from 'sweetalert2';
import { FormEventHandler, useState } from "react";
import { Order } from "@/types/Order";
import { useForm } from "@inertiajs/react";

interface PrintOrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    printers?: Printer[];
}

export default function PrintOrderFormModal({ isOpen, onClose, order, printers }: PrintOrderFormModalProps) {
    const { data, setData, post, processing, errors } = useForm({
        printer_id: printers && printers.length > 0 ? printers[0].id.toString() : '',
        order_id: order.id,
    });

    const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!selectedPrinter) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Selecione uma impressora para continuar.',
            });
            return;
        }

        post(route('order.print', { orderId: order.id, printerId: selectedPrinter.id }), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso',
                    text: 'Pedido enviado para impressão.',
                });
                setData({ printer_id: '', order_id: order.id });
                setSelectedPrinter(null);
                onClose();
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Houve um erro ao enviar o pedido para impressão.',
                });
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                                <PrinterIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    Imprimir Pedido
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Pedido #{order?.id}
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
                        {/* Informações do Pedido */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl p-4 border-l-4 border-gray-400">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                        Detalhes do Pedido
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {order?.items?.length || 0} {order?.items?.length === 1 ? 'item' : 'itens'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seleção de Impressora */}
                        {printers && printers.length > 0 && (
                            <div>
                                <label htmlFor="printer_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Selecionar Impressora
                                </label>
                                <div className="relative">
                                    <PrinterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        id="printer_id"
                                        name="printer_id"
                                        className="block w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 bg-white text-gray-900 transition-colors duration-200"
                                        value={data.printer_id}
                                        onChange={(e) => {
                                            const printer = printers?.find(p => p.id === parseInt(e.target.value));
                                            setSelectedPrinter(printer || null);
                                            setData('printer_id', e.target.value);
                                        }}
                                        required
                                        disabled={processing || !printers || printers.length === 0}
                                    >
                                        <option value="">-- Selecione uma impressora --</option>
                                        {printers && printers.map((printer) => (
                                            <option key={printer.id} value={printer.id}>
                                                {printer.name} ({printer.type})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.printer_id && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                        {errors.printer_id}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Se não há impressoras */}
                        {(!printers || printers.length === 0) && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <PrinterIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                    <div>
                                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                                            Nenhuma impressora disponível
                                        </h4>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                            Configure uma impressora antes de imprimir pedidos.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

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
                                disabled={processing || !selectedPrinter}
                                className="order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Imprimindo...
                                    </>
                                ) : (
                                    <>
                                        <PrinterIcon className="w-4 h-4" />
                                        Imprimir Pedido
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
