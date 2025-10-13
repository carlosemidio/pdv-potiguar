import { FormEventHandler, useState, useEffect } from "react";
import PrimaryButton from "../PrimaryButton"
import SecondaryButton from "../SecondaryButton";
import { useForm } from "@inertiajs/react";
import Modal from "../Modal";
import { Button } from "@headlessui/react";
import { 
  X, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Wallet, 
  Calculator, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  Receipt,
  Zap
} from "lucide-react";
import InputLabel from "../InputLabel";
import { Order } from "@/types/Order";

interface Props {
  order?: Order,
  isOpen: boolean,
  onClose: () => void,
}

interface PaymentMethod {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    key: 'dinheiro',
    label: 'Dinheiro',
    icon: Banknote,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-300 dark:border-green-700'
  },
  {
    key: 'pix',
    label: 'PIX',
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-300 dark:border-blue-700'
  },
  {
    key: 'cartao_debito',
    label: 'Cartão de Débito',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-300 dark:border-purple-700'
  },
  {
    key: 'cartao_credito',
    label: 'Cartão de Crédito',
    icon: CreditCard,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    borderColor: 'border-indigo-300 dark:border-indigo-700'
  },
  {
    key: 'outro',
    label: 'Outro',
    icon: Wallet,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    borderColor: 'border-gray-300 dark:border-gray-700'
  }
];

export default function OrderPaymentsForm({ order, isOpen, onClose }: Props) {
  const [remainingAmount, setRemainingAmount] = useState(0);
  
  const { data, setData, post, errors, processing, reset } = useForm({
    order_id: order?.id || null,
    method: '',
    amount: 0,
    notes: '',
  });

  useEffect(() => {
    if (order) {
      const remaining = order.total_amount - order.paid_amount;
      setRemainingAmount(remaining);
      // Auto-fill with remaining amount
      if (remaining > 0 && data.amount === 0) {
        setData('amount', remaining);
      }
    }
  }, [order, data.amount]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('payments.store'), {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  const selectedMethod = paymentMethods.find(method => method.key === data.method);
  const isValidAmount = data.amount > 0 && data.amount <= remainingAmount;
  const totalPaid = (order?.paid_amount || 0) + data.amount;
  const willBeFullyPaid = totalPaid >= (order?.total_amount || 0);

  const handleQuickAmount = (percentage: number) => {
    const amount = remainingAmount * (percentage / 100);
    setData('amount', Math.round(amount * 100) / 100);
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="relative">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Registrar Pagamento
                </h2>
                <p className="text-sm text-emerald-100">
                  Pedido #{order?.id}
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
          {/* Resumo financeiro */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-200">Resumo do Pagamento</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total do Pedido</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {(order?.total_amount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Já Pago</div>
                <div className="text-lg font-bold text-green-600">
                  {(order?.paid_amount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Restante</div>
                <div className="text-lg font-bold text-red-600">
                  {remainingAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Métodos de pagamento com cards visuais */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Método de Pagamento
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = data.method === method.key;
                  
                  return (
                    <button
                      key={method.key}
                      type="button"
                      onClick={() => setData('method', method.key)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? `${method.borderColor} ${method.bgColor}`
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Icon className={`w-6 h-6 ${
                          isSelected ? method.color : 'text-gray-400'
                        }`} />
                        <span className={`font-medium text-sm ${
                          isSelected ? `${method.color} dark:text-white` : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {method.label}
                        </span>
                        {isSelected && (
                          <CheckCircle className={`w-4 h-4 ${method.color}`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.method && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.method}</span>
                </div>
              )}
            </div>

            {/* Valor do pagamento */}
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Valor do Pagamento
              </label>
              
              {/* Botões de valores rápidos */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleQuickAmount(25)}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(50)}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(75)}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  75%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(100)}
                  className="px-3 py-2 text-sm bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-800/50 text-green-800 dark:text-green-200 rounded-lg transition-colors font-medium"
                >
                  Total
                </button>
              </div>

              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-lg font-semibold ${
                    isValidAmount
                      ? 'border-green-300 focus:border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-4 focus:ring-blue-500/20`}
                  value={data.amount}
                  onChange={(e) => setData('amount', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={remainingAmount}
                  step="0.01"
                  disabled={processing}
                  placeholder="0,00"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              {errors.amount && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.amount}</span>
                </div>
              )}

              {/* Preview do pagamento */}
              {data.amount > 0 && isValidAmount && (
                <div className="mt-3 p-3 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Após este pagamento:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {totalPaid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {(order?.total_amount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  {willBeFullyPaid && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm mt-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Pedido será totalmente pago!</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notas */}
            <div>
              <InputLabel htmlFor="notes" value="Observações (opcional)" />
              <textarea
                id="notes"
                className="mt-2 w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                rows={3}
                disabled={processing}
                placeholder="Adicione observações sobre este pagamento..."
              />
              {errors.notes && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.notes}</span>
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <SecondaryButton onClick={onClose} disabled={processing}>
                Cancelar
              </SecondaryButton>
              <PrimaryButton 
                onClick={submit}
                disabled={processing || !data.method || !isValidAmount}
                className="relative"
              >
                {processing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
                <span className={processing ? 'invisible' : ''}>
                  Registrar Pagamento
                </span>
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}