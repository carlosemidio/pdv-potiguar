import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { User } from '@/types/User';
import { Head, usePage } from '@inertiajs/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, DollarSign, ShoppingCart, Package, Store, BarChart3, Activity, Calendar } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function Dashboard({ auth }: PageProps) {
    const {
        incomesToday,
        pendingIncomes,
        inProgressOrders,
        finishedOrdersToday,
        viewsByPeriod,
        totalProducts,
        totalStores,
        stores
    } = usePage<PageProps & {
        auth: { user: User };
        incomesToday: number;
        pendingIncomes: number;
        inProgressOrders: number;
        finishedOrdersToday: number;
        viewsByPeriod: Record<string, number>;
        totalProducts: number;
        totalStores: number;
        stores: { id: number; name: string }[];
    }>().props;

    const user = auth.user;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    },
                    padding: 20,
                    usePointStyle: true,
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        size: 11,
                    },
                },
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        size: 11,
                    },
                },
            },
        },
        elements: {
            line: {
                tension: 0.4,
            },
            point: {
                radius: 4,
                hoverRadius: 6,
            },
        },
    };

    const periodKeys = Object.keys(viewsByPeriod || {});
    const labels = periodKeys.map(date => {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        return d.toLocaleDateString();
    });

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Visualizações',
                data: periodKeys.map((key) => viewsByPeriod[key] || 0),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(59, 130, 246)',
                pointHoverBorderWidth: 3,
            },
        ],
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Dashboard
                    </h1>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date().toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
                                        <BarChart3 className="w-8 h-8" />
                                        Bem-vindo, {user.name}! 
                                    </h2>
                                    <p className="text-indigo-100 text-lg">
                                        Aqui está um resumo das suas atividades e métricas principais.
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <Activity className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                                Métricas Principais
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Revenue Today */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                        Hoje
                                    </span>
                                </div>
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Receita de Hoje
                                </h4>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    R$ {incomesToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Vendas realizadas hoje
                                </p>
                            </div>

                            {/* Pending Revenues */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                                        Pendente
                                    </span>
                                </div>
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Receitas Pendentes
                                </h4>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    R$ {pendingIncomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Aguardando confirmação
                                </p>
                            </div>

                            {/* Orders in Progress */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
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
                            </div>

                            {/* Finished Orders Today */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                                        Concluído
                                    </span>
                                </div>
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Pedidos Finalizados
                                </h4>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {finishedOrdersToday}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Entregues hoje
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Total Products */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400 rounded-full">
                                        Catálogo
                                    </span>
                                </div>
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Total de Produtos
                                </h4>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {totalProducts}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Produtos cadastrados no sistema
                                </p>
                            </div>

                            {/* Total Stores */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                        <Store className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 rounded-full">
                                        Rede
                                    </span>
                                </div>
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Total de Lojas
                                </h4>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {totalStores}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Lojas registradas na rede
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                                    Análise de Visualizações
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <TrendingUp className="w-4 h-4" />
                                <span>Últimos 7 dias</span>
                            </div>
                        </div>
                        <div className="h-80">
                            <Line options={options} data={data} />
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                                Métricas Principais
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Today's Revenue */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-xl border border-green-200 dark:border-green-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-500 rounded-lg">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-900 dark:text-green-200 uppercase tracking-wide">Receita Hoje</p>
                                    <p className="text-2xl md:text-3xl font-bold text-green-900 dark:text-green-100 mt-1">
                                        {Number(incomesToday).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                </div>
                            </div>

                            {/* Pending Revenue */}
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-6 rounded-xl border border-amber-200 dark:border-amber-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-amber-500 rounded-lg">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200 uppercase tracking-wide">A Receber</p>
                                    <p className="text-2xl md:text-3xl font-bold text-amber-900 dark:text-amber-100 mt-1">
                                        {Number(pendingIncomes).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                </div>
                            </div>

                            {/* Orders in Progress */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-500 rounded-lg">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200 uppercase tracking-wide">Em Andamento</p>
                                    <p className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                                        {inProgressOrders}
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">pedidos</p>
                                </div>
                            </div>

                            {/* Completed Orders */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-xl border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-purple-500 rounded-lg">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-purple-900 dark:text-purple-200 uppercase tracking-wide">Finalizados Hoje</p>
                                    <p className="text-2xl md:text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                                        {finishedOrdersToday}
                                    </p>
                                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">pedidos</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Overview */}
                    <div className="mb-8">
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                            Visão Geral do Sistema
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Produtos Cadastrados</h4>
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {totalProducts}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Total de produtos no sistema
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Lojas Ativas</h4>
                                    <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                                        <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {totalStores}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Lojas registradas no sistema
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                                Visualizações por Período
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Últimos 7 dias
                            </div>
                        </div>
                        <div className="h-80">
                            <Line options={options} data={data} />
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
