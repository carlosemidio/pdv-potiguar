import { Payment } from "@/types/Payment";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";

interface PaymentsListExpandableProps {
  payments: Payment[];
  formatDateTime: (date: string) => string;
}

export default function PaymentsListExpandable({ payments, formatDateTime }: PaymentsListExpandableProps) {
  const { delete: destroy } = useForm({});

  const [openPayments, setOpenPayments] = useState<number[]>([]);
  const allIds = payments.map((p) => p.id);
  const allExpanded = openPayments.length === allIds.length;

  const togglePayment = (id: number) => {
    setOpenPayments((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setOpenPayments((prev) => (prev.length === payments.length ? [] : allIds));
  };

  const deletePayment = (id: number) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(route('payments.destroy', id), {
          onSuccess: () => {
            Swal.fire(
              'Deletado!',
              'O pagamento foi deletado com sucesso.',
              'success'
            );
          },
          onError: () => {
            Swal.fire(
              'Erro!',
              'Houve um problema ao deletar o pagamento.',
              'error'
            );
          },
        });
      }
    });
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
      {/* Cabeçalho com botão Expandir todos */}
      {payments.length > 0 && (
        <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Pagamentos {payments.length > 0 && (
              `(${payments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })})`
            )}
          </h3>
          <button
            onClick={toggleAll}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            {allExpanded ? "Recolher todos" : "Expandir todos"}
          </button>
        </div>
      )}

      {payments.map((payment) => {
        const isOpen = openPayments.includes(payment.id);
        const hasNotes = !!payment.notes;

        return (
          <div key={payment.id}>
            <div
              onClick={() => togglePayment(payment.id)}
              className={`w-full flex justify-between items-center px-3 py-2 text-left transition ${
                hasNotes
                  ? "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  : "cursor-default opacity-80"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {payment.method}
                </span>
                {hasNotes && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    observações
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {parseFloat(payment.amount.toString()).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePayment(payment.id);
                  }}
                  className="text-red-600 hover:text-red-800"
                  title="Deletar pagamento"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {hasNotes && (
                  <>
                    {isOpen ? (
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </>
                )}
              </div>
            </div>

            {hasNotes && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-screen p-3 pt-0" : "max-h-0 p-0"
                }`}
              >
                <div className="text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 mt-1 pt-2">
                  <p className="italic text-xs md:text-sm">"{payment.notes}"</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateTime(payment.created_at)}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
