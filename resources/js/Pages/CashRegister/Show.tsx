import { useState } from "react";
import { Head } from "@inertiajs/react";
import { ArrowDownCircle, ArrowUpCircle, CircleDot } from "lucide-react";
import Card from "@/Components/Card";
import { PageProps, PaginatedData } from "@/types";
import CashRegister from "@/types/CashRegister";
import { formatCurrency } from "@/utils/helpers";
import CashRegisterFormModal from "@/Components/CashRegisterFormModal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CashMovementFormModal from "@/Components/CashMovementFormModal";
import { CashMovement } from "@/types/CashMovement";
import Pagination from "@/Components/Pagination/Pagination";

export default function CashRegisterIndex({
    auth,
    cashRegister,
    movements,
}: PageProps<{
    cashRegister: { data: CashRegister };
    movements: PaginatedData<CashMovement>;
}>) {
    const [closeCashRegisterModal, setCloseCashRegisterModal] = useState(false);
    const [openCashMovementsModal, setOpenCashMovementsModal] = useState(false);

    const { links } = movements.meta;
    const register = cashRegister.data;

    // Cálculo dos totais
    const totalEntradas = movements.data
        .filter((m) => ["sale", "addition", "opening"].includes(m.type))
        .reduce((sum, m) => sum + Number(m.amount), 0);

    const totalSaidas = movements.data
        .filter((m) => !["sale", "addition", "opening"].includes(m.type))
        .reduce((sum, m) => sum + Number(m.amount), 0);

    const expectedBalance = cashRegister.data.system_balance;

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Caixa
                    </h1>
                </div>
            }
        >
            <Head title="Caixa Atual" />

            <div className="p-4 md:p-6 space-y-6">
                {/* Card principal com status e ferramentas */}
                <Card className="p-6 space-y-4 relative max-w-5xl">
                    {/* Header com status e ferramentas */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <CircleDot
                                    size={16}
                                    className={`${
                                        register.status === 1
                                            ? "text-green-500"
                                            : "text-gray-400"
                                    }`}
                                />
                                <span
                                    className={`text-sm font-semibold ${
                                        register.status === 1
                                            ? "text-green-600"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {register.status === 1 ? "Aberto" : "Fechado"}
                                </span>
                            </div>

                            <p className="font-semibold text-lg text-gray-900 dark:text-white">
                                Responsável: {register.user.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                Abertura: {new Date(register.opened_at).toLocaleString()}
                            </p>
                            {register.closed_at && (
                                <p className="text-sm text-gray-600">
                                    Fechamento: {new Date(register.closed_at).toLocaleString()}
                                </p>
                            )}
                        </div>

                        {/* Card Tools */}
                        <div className="flex space-x-2 mt-4 md:mt-0">
                            {register.status === 1 && (
                                <>
                                    <button
                                        onClick={() => setOpenCashMovementsModal(true)}
                                        className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        Adicionar Movimento
                                    </button>
                                    <button
                                        onClick={() => setCloseCashRegisterModal(true)}
                                        className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                    >
                                        Fechar Caixa
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Resumo financeiro */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-300">Entradas</p>
                            <p className="text-lg font-semibold text-green-600">
                                {formatCurrency(totalEntradas)}
                            </p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-300">Saídas</p>
                            <p className="text-lg font-semibold text-red-600">
                                {formatCurrency(totalSaidas)}
                            </p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-300">Saldo esperado</p>
                            <p className={`text-lg font-semibold text-yellow-600`}>
                                {formatCurrency(expectedBalance ?? 0)}
                            </p>
                        </div>

                        {register.status === 0 && (
                            <>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 dark:text-gray-300">Valor de fechamento</p>
                                    <p className="text-lg font-semibold text-blue-600">
                                        {formatCurrency(cashRegister.data.closing_amount ?? 0)}
                                    </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 dark:text-gray-300">Diferença</p>
                                    <p
                                        className={`text-lg font-semibold ${
                                            (cashRegister.data.difference ?? 0) >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {formatCurrency(cashRegister.data.difference ?? 0)}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Modais */}
                    <CashRegisterFormModal
                        isOpen={closeCashRegisterModal}
                        onClose={() => setCloseCashRegisterModal(false)}
                        registerId={register.id}
                    />
                    <CashMovementFormModal
                        isOpen={openCashMovementsModal}
                        onClose={() => setOpenCashMovementsModal(false)}
                        registerId={register.id}
                    />
                </Card>

                {/* Movimentos */}
                <Card className="p-4 md:p-6 max-w-5xl">
                    <h2 className="text-lg font-semibold mb-4">Movimentos</h2>

                    {movements.data.length > 0 ? (
                        <div className="space-y-2">
                            {movements.data.map((m) => {
                                const isEntrada = ["sale", "addition", "opening"].includes(m.type);
                                return (
                                    <div
                                        key={m.id}
                                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                            <p className="text-xs text-gray-500">
                                                {new Date(m.created_at).toLocaleString()}
                                            </p>
                                            <span
                                                className={`mt-1 sm:mt-0 inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                                                    isEntrada
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {isEntrada ? (
                                                    <ArrowUpCircle size={12} className="mr-1" />
                                                ) : (
                                                    <ArrowDownCircle size={12} className="mr-1" />
                                                )}
                                                {isEntrada ? "Entrada" : "Saída"}
                                            </span>
                                            <p className="mt-1 sm:mt-0 text-sm text-gray-800 dark:text-gray-200">
                                                {m.description}
                                            </p>
                                        </div>
                                        <p
                                            className={`mt-2 sm:mt-0 sm:text-right text-sm font-bold ${
                                                isEntrada
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {isEntrada ? "+" : "-"}
                                            {formatCurrency(m.amount)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mt-4">
                            Nenhum movimento registrado.
                        </p>
                    )}

                    <div className="mt-4">
                        <Pagination links={links} />
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
