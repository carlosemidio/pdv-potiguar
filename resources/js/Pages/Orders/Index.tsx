import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Plus, MoreVertical } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { can } from '@/utils/authorization';
import Pagination from '@/Components/Pagination/Pagination';
import { Order } from '@/types/Order';
import SearchableCustomersSelect from '@/Components/SearchableCustomersSelect';
import { Customer } from '@/types/Customer';
import OrderStatusColors from '@/utils/OrderStatusColors';
import OrderFormModal from '@/Components/OrderFormModal';
import { Table } from '@/types/Table';

export default function Index({
    auth,
    orders,
    tables,
    filters,
}: PageProps<{ orders: PaginatedData<Order>, tables: { data: Table[] }, filters: { status?: string; date_from?: string; date_to?: string; customer?: Customer  } }>) {
    // Initialize form data
    const { data, setData, get, errors, processing } = useForm({
        status: filters.status || 'pending',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        customer_id: filters.customer ? filters.customer.id : null
    });

    const [customer, setCustomer] = useState<Customer | null>(filters.customer ?? null);
    const [order, setOrder] = useState<Order | null>(null);

    const handleOpenOrderModal = (order: Order | null) => {
        setOrder(order);
        setIsOpen(true);
    };

    const [isOpen, setIsOpen] = useState(false);

    const {
        meta: { links },
    } = orders;

    const handleFilter : FormEventHandler = (e) => {
        e.preventDefault();
        get(route('orders.index'), { preserveState: false });
    };

    const handleClear = () => {    
        window.location.href = route('orders.index');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Pedidos
                    </h1>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                        </svg>
                        {orders.data.length} {orders.data.length === 1 ? 'pedido' : 'pedidos'}
                    </div>
                </div>
            }
        >
            <Head title="Pedidos" />
            
            <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
                    {/* Filters Section */}
                    <div className="mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Filtros de Busca
                            </h3>
                            <form className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-4" onSubmit={handleFilter}>
                                {/* Status Filter */}
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status do Pedido
                                    </label>
                                    <select
                                        id="status"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                    >
                                        <option value="">Todos os Status</option>
                                        <option value="pending">Pendente</option>
                                        <option value="confirmed">Confirmado</option>
                                        <option value="in_progress">Em andamento</option>
                                        <option value="rejected">Rejeitado</option>
                                        <option value="shipped">Enviado</option>
                                        <option value="completed">Concluído</option>
                                        <option value="cancelled">Cancelado</option>
                                    </select>
                                </div>

                                {/* Date Range */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Data Inicial
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        id="date_from"
                                        value={data.date_from}
                                        onChange={e => setData('date_from', e.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Data Final
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        id="date_to"
                                        value={data.date_to}
                                        onChange={e => setData('date_to', e.target.value)}
                                    />
                                </div>

                                {/* Customer Filter */}
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Cliente
                                    </label>
                                    <SearchableCustomersSelect
                                        selectedCustomer={customer}
                                        setCustomer={(c) => {
                                            setCustomer(c);
                                            setData('customer_id', c ? c.id : null);
                                        }}
                                        isDisabled={processing}
                                    />
                                    <input type="hidden" id="customer_id" value={data.customer_id ?? ''} />
                                </div>

                                {/* Action Buttons */}
                                <div className="md:col-span-2 flex flex-col gap-2 md:gap-0 md:flex-row md:items-end">
                                    <div className="flex gap-2 w-full">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 md:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="inline-flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                </svg>
                                                Filtrar
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClear}
                                            className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                                        >
                                            <span className="inline-flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                </svg>
                                                Limpar
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Orders Grid */}
                    {orders.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                                {orders.data.map((order) => {
                                    const total = Number(order.total_amount);
                                    const paid = Number(order.paid_amount);
                                    const pending = Math.max(total - paid, 0);
                                    const createdAt = new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                    const createdDate = new Date(order.created_at).toLocaleDateString('pt-BR');
                                    const itemsCount = order.items.length;
                                    const itemsPreview = order.items.slice(0, 2).map(i => `${i.quantity}x ${i.store_product_variant?.product_variant?.name ?? '—'}`).join(', ');
                                    const hasMoreItems = (itemsCount > 2);

                                    return (
                                        <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                            {/* Card Header */}
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-gray-900 dark:text-white">
                                                                    {order.number ? `#${order.number}` : 'Sem Número'}
                                                                </h3>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {createdDate} às {createdAt}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${OrderStatusColors[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}
                                                    >
                                                        {order.status_name}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-6">
                                                {/* Customer & Table Info */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                                                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                            {order?.customer?.name || 'Sem cliente'}
                                                        </span>
                                                    </div>
                                                    {order.table && (
                                                        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg">
                                                            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                                                                Mesa {order.table.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                                                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Items Preview */}
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Itens do Pedido:</h4>
                                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                                        {itemsCount > 0 ? (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {itemsPreview}{hasMoreItems ? ' e mais...' : ''}
                                                            </p>
                                                        ) : (
                                                            <p className="text-sm italic text-gray-400">Sem itens</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Financial Info */}
                                                <div className="space-y-3 mb-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total:</span>
                                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Pagamento:</span>
                                                        {pending > 0 ? (
                                                            <span className="text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">
                                                                Falta {pending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                                                                Pago Integralmente
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                    {can('orders_view') && (
                                                        <Link 
                                                            href={route('orders.show', { id: order.id })}
                                                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center py-2.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                        >
                                                            <span className="inline-flex items-center justify-center gap-2">
                                                                <Eye className="w-4 h-4" />
                                                                Ver Detalhes
                                                            </span>
                                                        </Link>
                                                    )}
                                                    {(can('orders_edit') && order.user_id != null) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenOrderModal(order)}
                                                            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                        >
                                                            <span className="inline-flex items-center justify-center gap-2">
                                                                <Edit className="w-4 h-4" />
                                                                Editar
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Pagination */}
                            <div className="flex justify-center">
                                <Pagination links={links} />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Nenhum pedido encontrado
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Não há pedidos que correspondam aos filtros selecionados.
                            </p>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    )}

                    {/* Floating Action Button */}
                    {can('orders_create') && (
                        <>
                            <OrderFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} tables={tables.data} order={order ?? null} />

                            <button
                                aria-label="Novo pedido"
                                className="fixed bottom-16 right-6 z-50 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
                                onClick={() => setIsOpen(true)}
                            >
                                <Plus className="h-7 w-7 group-hover:scale-110 transition-transform" />
                            </button>
                        </>
                    )}
                </div>
            </section>
        </AuthenticatedLayout>
    );
}