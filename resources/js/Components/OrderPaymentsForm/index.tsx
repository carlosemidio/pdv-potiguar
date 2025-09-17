import { FormEventHandler, useState } from "react";
import PrimaryButton from "../PrimaryButton"
import { useForm } from "@inertiajs/react";
import Modal from "../Modal";
import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import InputLabel from "../InputLabel";
import { Order } from "@/types/Order";

interface Props {
  order?: Order,
  isOpen: boolean,
  onClose: () => void,
}

export default function OrderPaymentsForm({ order, isOpen, onClose }: Props) {
  const [orderFilter, setOrderFilter] = useState<string>('');
  const { data, setData, post, errors, processing } = useForm({
    order_id: order?.id || null,
    method: '',
    amount: 0,
    notes: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    const maxAmount = order ? (order.total_amount - order.paid_amount) : undefined;
    if (maxAmount !== undefined && data.amount > maxAmount) {
      alert('O valor do pagamento não pode exceder o valor restante do pedido.');
      return;
    }
    post(route('payments.store'));
    setData({ order_id: order?.id || null, method: '', amount: 0, notes: '' });
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="p-3">
          <div className="flex justify-between">
              <p className="text-lg">Adicionar Pagamento ao Pedido #{order?.id}</p>
              <Button onClick={onClose}>
                  <X size={20} />
              </Button>
          </div>

          <div className="mt-3"> 
            <div className="space-y-3">
              <div>
                <InputLabel htmlFor="amount" value="Valor" />
                <input
                    type="number"
                    id="amount"
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={data.amount}
                    onChange={(e) => setData('amount', parseFloat(e.target.value))}
                    min={0}
                    max={order ? (order.total_amount - order.paid_amount) : undefined}
                    step="0.01"
                />
                {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
                <InputLabel htmlFor="method" value="Método de Pagamento" />
                <select
                    id="method"
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={data.method}
                    onChange={(e) => setData('method', e.target.value)}
                >
                    <option value="">Selecione um método</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="pix">PIX</option>
                    <option value="outro">Outro</option>
                </select>
                {errors.method && <p className="text-red-600 text-sm mt-1">{errors.method}</p>}
            </div>

            <div>
                <InputLabel htmlFor="notes" value="Notas (opcional)" />
                <textarea
                    id="notes"
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    rows={3}
                />
                {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes}</p>}
            </div>

            <div className="flex justify-end">
              <PrimaryButton
                onClick={submit}
                disabled={
                  processing ||
                  data.amount < 0 ||
                  !data.method ||
                  (order && data.amount > (order.total_amount - order.paid_amount))
                }
              >
                Adicionar Pagamento
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
  </Modal>
  )
}