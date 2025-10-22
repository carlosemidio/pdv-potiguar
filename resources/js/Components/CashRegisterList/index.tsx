import { formatCurrency } from "@/utils/helpers";
import CashRegister from "@/types/CashRegister";
import { Link } from "@inertiajs/react";

interface CashRegisterListProps {
    registers: CashRegister[];
}

export default function CashRegisterList({ registers }: CashRegisterListProps) {
    if (!registers || registers.length === 0) {
        return (
            <div className="p-6 text-center text-gray-600 dark:text-gray-400">
                Nenhum caixa encontrado.
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700 w-full overflow-hidden">
            {registers.map((register) => {
                const isOpen = register.status === 1;

                // Determina cor da diferença
                const difference = register.difference ?? 0;
                const differenceColor =
                    difference > 0
                        ? "text-green-600 dark:text-green-400"
                        : difference < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400";

                return (
                    <Link
                        key={register.id}
                        href={route("cash.show", register.id)}
                        className="relative w-full text-left p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center
                                   hover:bg-gray-50 dark:hover:bg-gray-800 transition transform hover:scale-[1.02] hover:shadow-lg"
                    >
                        {/* Status no canto superior direito */}
                        <span
                            className={`absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                isOpen
                                    ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                        >
                            {isOpen ? "Aberto" : "Fechado"}
                        </span>

                        {/* Lado esquerdo: informações do caixa */}
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {register.user?.name || "—"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {isOpen
                                    ? `Aberto em ${register.opened_at}`
                                    : `Fechado em ${register.closed_at}`}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                                <p>Saldo Inicial: {formatCurrency(register.opening_amount || 0)}</p>
                            </div>
                        </div>

                        {/* Lado direito: saldo do sistema */}
                        <div className="mt-2 sm:mt-0 text-right">
                            <p className={differenceColor}>
                                Diferença: {formatCurrency(register.difference || 0)}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
