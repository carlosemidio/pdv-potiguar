import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { TrendingUp, ShoppingCart, Package, Store } from 'lucide-react';
import CashRegister from '@/types/CashRegister';
import CashRegisterFormModal from '@/Components/CashRegisterFormModal';
import { useState } from 'react';
import { can } from '@/utils/authorization';

export default function Dashboard({ auth, pendingOrders, inProgressOrders, openedCashRegister }: PageProps<{
    pendingOrders: number | null;
    inProgressOrders: number;
    openedCashRegister: CashRegister | null;
}>) {
    const [openCashRegisterModal, setOpenCashRegisterModal] = useState(false);
    const [closeCashRegisterModal, setCloseCashRegisterModal] = useState(false);

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Dashboard
                    </h1>
                </div>
            }
        >
            <Head title="Dashboard" />

            <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {!openedCashRegister && can('cash-registers_view') && (
                    <CashRegisterFormModal isOpen={openCashRegisterModal} onClose={() => setOpenCashRegisterModal(false)} />
                )}

                <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
                    {/* Key Metrics */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                                Métricas Principais
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {can('cash-registers_view') && openedCashRegister && (
                                <a
                                    href={`/caixas/${openedCashRegister.id}`}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 block hover:ring-2 hover:ring-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-lime-500 rounded-xl flex items-center justify-center">
                                            <Store className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                            Aberto
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Caixa Atual
                                    </h4>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Valor de Abertura: <b>R$ {openedCashRegister.opening_amount}</b>
                                        <br />
                                        Saldo Atual: <b>R$ {openedCashRegister.system_balance}</b>
                                    </span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        Aberto em {new Date(openedCashRegister.opened_at).toLocaleString()}
                                    </p>
                                </a>
                            )}

                            {can('cash-registers_view') && !openedCashRegister && (
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 block hover:ring-2 hover:ring-green-400 focus:outline-none focus:ring-2 focus:ring-green-400">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-lime-500 rounded-xl flex items-center justify-center">
                                            <Store className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                            Fechado
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Caixa Atual
                                    </h4>
                                    <button
                                        onClick={() => setOpenCashRegisterModal(true)}
                                        className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                    >
                                        Abrir Caixa
                                    </button>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        Nenhum caixa aberto no momento.
                                    </p>
                                </div>
                            )}

                            {/* Orders in Progress */}
                            <a
                                href="/pedidos?status=in_progress"
                                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 block hover:ring-2 hover:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                        <ShoppingCart className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                                        Ativo
                                    </span>
                                </div>
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Pedidos em Andamento
                                </h4>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {inProgressOrders}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Sendo preparados agora
                                </p>
                            </a>

                            {pendingOrders !== null && (
                                <a
                                    href="/pedidos?status=pending"
                                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 block hover:ring-2 hover:ring-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                                            <Package className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                                            Pendente
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Pedidos Pendentes
                                    </h4>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {typeof pendingOrders === 'number' ? pendingOrders : 0}
                                    </p>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
