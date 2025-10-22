import { FormEventHandler, useState, useEffect } from "react";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import { useForm } from "@inertiajs/react";
import Modal from "../Modal";
import { Button } from "@headlessui/react";
import {
  X,
  Calculator,
  CheckCircle,
  DollarSign,
  Receipt,
  ArrowDownCircle,
} from "lucide-react";
import InputLabel from "../InputLabel";
import { Order } from "@/types/Order";
import paymentMethods from "@/utils/paymentMethods";

interface Props {
  order?: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderPaymentsForm({ order, isOpen, onClose }: Props) {
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);

  const { data, setData, post, errors, processing, reset } = useForm({
    order_id: order?.id || null,
    method: "",
    amount: 0, // valor do pagamento (quanto do pedido será quitado)
    paid_amount: 0, // quanto o cliente entregou (usado apenas no caso cash)
    notes: "",
  });

  useEffect(() => {
    if (order) {
      const remaining = order.total_amount - order.paid_amount;
      setRemainingAmount(remaining);
      if (remaining > 0 && data.amount === 0) {
        setData("amount", remaining);
      }
    }
  }, [order, data.amount]);

  // 🔹 calcula troco quando método é cash
  useEffect(() => {
    if (data.method === "cash") {
      const change = Math.max((data.paid_amount || 0) - (data.amount || 0), 0);
      setChangeAmount(change);
    } else {
      setChangeAmount(0);
    }
  }, [data.paid_amount, data.amount, data.method]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("payments.store"), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const isValidAmount = data.amount > 0;

  const handleQuickAmount = (percentage: number) => {
    const amount = remainingAmount * (percentage / 100);
    setData("amount", Math.round(amount * 100) / 100);
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="flex flex-col max-w-2xl w-full max-h-[95vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Registrar Pagamento
              </h2>
              <p className="text-sm text-emerald-100">Pedido #{order?.id}</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Resumo */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                Resumo do Pagamento
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total do Pedido
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {(order?.total_amount || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Já Pago
                </div>
                <div className="text-lg font-bold text-green-600">
                  {(order?.paid_amount || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Restante
                </div>
                <div className="text-lg font-bold text-red-600">
                  {remainingAmount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Métodos */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Método de Pagamento
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = data.method === method.key;
                  return (
                    <button
                      key={method.key}
                      type="button"
                      onClick={() => setData("method", method.key)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                        isSelected
                          ? `${method.borderColor} ${method.bgColor}`
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isSelected ? method.color : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isSelected
                            ? `${method.color} dark:text-white`
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {method.label}
                      </span>
                      {isSelected && (
                        <CheckCircle
                          className={`w-4 h-4 ${method.color} mt-1`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Valor */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >
                Valor do Pagamento
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleQuickAmount(pct)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      pct === 100
                        ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800/50 font-medium"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {pct === 100 ? "Total" : `${pct}%`}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  className="w-full px-4 py-3 rounded-xl border-2 text-lg font-semibold shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                  value={data.amount.toFixed(2)}
                  onChange={(e) =>
                    setData("amount", parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  step="0.01"
                  placeholder="0,00"
                />
                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Campo adicional se for cash */}
            {data.method === "cash" && (
              <div className="space-y-4">
                <div>
                  <InputLabel htmlFor="paid_amount" value="Valor pago pelo cliente" />
                  <div className="relative mt-2">
                    <input
                      type="number"
                      id="paid_amount"
                      className="w-full px-4 py-3 rounded-xl border-2 text-lg font-semibold shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                      value={data.paid_amount}
                      onChange={(e) =>
                        setData("paid_amount", parseFloat(e.target.value) || 0)
                      }
                      min={0}
                      step="0.01"
                      placeholder="Ex: 100,00"
                    />
                    <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Exibe troco */}
                {data.paid_amount > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="w-5 h-5" />
                      <span className="font-medium">Troco a devolver:</span>
                    </div>
                    <span className="text-lg font-semibold">
                      {changeAmount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Observações */}
            <div>
              <InputLabel htmlFor="notes" value="Observações (opcional)" />
              <textarea
                id="notes"
                rows={3}
                className="mt-2 w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                value={data.notes}
                onChange={(e) => setData("notes", e.target.value)}
                disabled={processing}
                placeholder="Adicione observações sobre este pagamento..."
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <SecondaryButton onClick={onClose} disabled={processing}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton
            onClick={submit}
            disabled={processing || !data.method || !isValidAmount}
          >
            Registrar Pagamento
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
