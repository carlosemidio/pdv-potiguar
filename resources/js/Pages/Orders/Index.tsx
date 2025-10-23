import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, Edit, Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { can } from '@/utils/authorization';
import Pagination from '@/Components/Pagination/Pagination';
import { Order } from '@/types/Order';
import SearchableCustomersSelect from '@/Components/SearchableCustomersSelect';
import { Customer } from '@/types/Customer';
import OrderFormModal from '@/Components/OrderFormModal';
import { Table } from '@/types/Table';
import OrderStatusColors from '@/utils/OrderStatusColors';

export default function Index({
    auth,
    orders,
    tables,
    filters,
}: PageProps<{ orders: PaginatedData<Order>, tables: { data: Table[] }, filters: { status?: string; date_from?: string; date_to?: string; customer?: Customer } }>) {
    const { data, setData, get, errors, processing } = useForm({
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        customer_id: filters.customer ? filters.customer.id : null,
    });

    const [customer, setCustomer] = useState<Customer | null>(filters.customer ?? null);
    const [order, setOrder] = useState<Order | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenOrderModal = (order: Order | null) => {
        setOrder(order);
        setIsOpen(true);
    };

    const handleFilter: FormEventHandler = (e) => {
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
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pedidos</h1>
                    {can('orders_create') && (
                        <button
                            onClick={() => handleOpenOrderModal(null)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Novo Pedido
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Pedidos" />

            <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container px-4 max-w-6xl">
                    <form
                        className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4"
                        onSubmit={handleFilter}
                        >
                        {/* Status Filter */}
                        <div className="flex-1 min-w-[120px] sm:min-w-[160px]">
                            <select
                                id="status"
                                className="w-full text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="pending">Pendente</option>
                                <option value="confirmed">Confirmado</option>
                                <option value="in_progress">Em andamento</option>
                                <option value="rejected">Rejeitado</option>
                                <option value="shipped">Enviado</option>
                                <option value="completed">Concluído</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>

                        {/* Date From */}
                        <div className="flex-1 min-w-[120px] sm:min-w-[140px]">
                            <input
                                type="date"
                                className="w-full text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors"
                                value={data.date_from}
                                onChange={(e) => setData('date_from', e.target.value)}
                            />
                        </div>

                        {/* Date To */}
                        <div className="flex-1 min-w-[120px] sm:min-w-[140px]">
                            <input
                                type="date"
                                className="w-full text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors"
                                value={data.date_to}
                                onChange={(e) => setData('date_to', e.target.value)}
                            />
                        </div>

                        {/* Customer */}
                        <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
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
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200"
                            >
                                Filtrar
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all duration-200"
                            >
                                Limpar
                            </button>
                        </div>
                    </form>

                    {/* Lista de Pedidos */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-200 dark:divide-gray-700 shadow-sm">
                        {orders.data.length > 0 ? (
                            orders.data.map((order) => {
                                const total = Number(order.total_amount);
                                const paid = Number(order.paid_amount);
                                const pending = Math.max(total - paid, 0);
                                const createdAt = new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                const createdDate = new Date(order.created_at).toLocaleDateString('pt-BR');

                                return (
                                    <div
                                        key={order.id}
                                        onClick={() => window.location.href = route('orders.show', order.id)}
                                        className="relative flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                    >
                                        {/* Status no canto superior direito */}
                                        <span
                                            className={`absolute top-0 right-0 text-xs px-2 py-0.5 rounded-full font-semibold ${OrderStatusColors[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                                            >
                                            {order.status_name}
                                        </span>

                                        {/* Info principal */}
                                        <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                                                    Pedido #{order.number || order.id}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {createdDate} às {createdAt}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Cliente, mesa e financeiro */}
                                        <div className="flex justify-between items-center w-full md:w-auto gap-4 mt-2 md:mt-0">
                                            <div className="flex-1">
                                                <p className="truncate">{order.customer?.name || 'Sem cliente'}</p>
                                                {order.table && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    Mesa {order.table.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right md:text-left flex-shrink-0">
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </p>
                                                {pending > 0 ? (
                                                    <p className="text-xs text-red-500 dark:text-red-400">
                                                    Falta {pending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-green-500 dark:text-green-400">Pago</p>
                                                )}
                                            </div>

                                            {/* Ações */}
                                            <div className="flex gap-2 sm:mt-4">
                                                {(can('orders_edit') && order.user_id != null) && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleOpenOrderModal(order); }}
                                                        className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                );
                            })
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">Nenhum pedido encontrado</div>
                        )}
                    </div>

                    <div className="flex justify-center mt-6">
                        <Pagination links={orders.meta.links} />
                    </div>

                    {can('orders_create') && (
                        <OrderFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} tables={tables.data} order={order ?? null} />
                    )}
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
