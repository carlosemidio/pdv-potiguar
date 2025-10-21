import { X, Printer as PrinterIcon, FileText, CheckSquare, Check, Square } from "lucide-react";
import Modal from "../Modal";
import { Printer } from "@/types/Printer";
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
  const { data, setData, post, processing, errors, reset } = useForm<{
    printer_id: string;
    order_id: number;
    order_items_ids: number[];
  }>({
    printer_id: printers && printers.length > 0 ? printers[0].id.toString() : '',
    order_id: order.id,
    order_items_ids: []
  });

  const [selectedPrinter, setSelectedPrinter] = useState<number | null>(
    printers && printers.length > 0 ? printers[0].id : null
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | null>(null);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    if (!data.printer_id) {
      setFeedbackMessage('Selecione uma impressora para continuar.');
      setFeedbackType('error');
      return;
    }

    if (data.order_items_ids.length === 0) {
      setFeedbackMessage('Selecione pelo menos um item para imprimir.');
      setFeedbackType('warning');
      return;
    }

    setFeedbackMessage(null);
    setFeedbackType(null);

    post(route('order.items.print', { orderId: order.id, printerId: data.printer_id }), {
      preserveScroll: false,
      preserveState: false,
      onSuccess: () => {
        setFeedbackMessage(`${data.order_items_ids.length} ${data.order_items_ids.length === 1 ? 'item enviado' : 'itens enviados'} para impressão.`);
        setFeedbackType('success');
        reset();
        setSelectedPrinter(null);
        onClose();
      },
      onError: () => {
        setFeedbackMessage('Houve um erro ao enviar os itens para impressão. Tente novamente.');
        setFeedbackType('error');
      }
    });
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden w-full max-w-lg sm:max-w-xl lg:max-w-3xl">
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
        <div className="p-6 space-y-6">
          {/* Feedback Message */}
          {feedbackMessage && (
            <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
              feedbackType === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200' :
              feedbackType === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200' :
              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200'
            }`}>
              {feedbackMessage}
            </div>
          )}

          {/* Order Items */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Itens do Pedido
              </h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setData('order_items_ids', order.items.map(i => i.id))}
                  className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-colors"
                >
                  Selecionar Todos
                </button>
                <button
                  type="button"
                  onClick={() => setData('order_items_ids', [])}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                  Limpar Seleção
                </button>
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto space-y-2">
              {order.items.map(item => {
                const selected = data.order_items_ids.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={selected}
                      onChange={e => {
                        if (e.target.checked) {
                          setData('order_items_ids', [...data.order_items_ids, item.id]);
                        } else {
                          setData('order_items_ids', data.order_items_ids.filter(id => id !== item.id));
                        }
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{item.quantity}x {item.store_product_variant?.product_variant?.name ?? ''}</div>
                    </div>
                    {selected && <Check className="w-5 h-5 text-blue-600" />}
                  </label>
                )
              })}
            </div>
          </div>

          {/* Printer Selection */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border-l-4 border-green-500">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
              <PrinterIcon className="w-5 h-5" />
              Impressora de Destino
            </h4>
            {printers && printers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {printers.map(printer => {
                  const selected = selectedPrinter === printer.id;
                  return (
                    <button
                      key={printer.id}
                      type="button"
                      onClick={() => {
                        setSelectedPrinter(printer.id);
                        setData('printer_id', printer.id.toString());
                      }}
                      className={`flex items-center gap-2 p-3 border rounded-xl transition-all duration-200 w-full ${
                        selected
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
                      }`}
                    >
                      <PrinterIcon className={`w-5 h-5 ${selected ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className="font-medium text-gray-900 dark:text-gray-100">{printer.name} ({printer.type})</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm text-yellow-700 dark:text-yellow-300">
                Nenhuma impressora disponível. Configure uma impressora antes de imprimir itens.
              </div>
            )}
          </div>

          {/* Actions */}
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
              onClick={submit}
              disabled={processing || !selectedPrinter || data.order_items_ids.length === 0}
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
        </div>
      </div>
    </Modal>
  );
}
