import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
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
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    Pedidos
                </h2>
            }
        >
            <Head title="Pedidos" />
            <section className='py-2 px-2 text-gray-800 dark:text-gray-200 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 min-h-screen'>
                <div className="max-w-5xl">
                    <div className="mb-3">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-2.5 flex flex-col md:flex-row md:items-end gap-2.5 border border-gray-200 dark:border-gray-700">
                            <form className="flex flex-col md:flex-row gap-2.5 w-full" onSubmit={handleFilter}>
                                <div className="flex flex-col min-w-[110px]">
                                    <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Status</label>
                                    <select
                                        id="status"
                                        className="border rounded px-2 py-1 w-full focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
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
                                <div className="flex gap-2">
                                    <div className="flex flex-col min-w-[110px]">
                                        <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Data de</label>
                                        <input
                                            type="date"
                                            className="border rounded px-2 py-1 w-full focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
                                            id="date_from"
                                            value={data.date_from}
                                            onChange={e => setData('date_from', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-[110px]">
                                        <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">até</label>
                                        <input
                                            type="date"
                                            className="border rounded px-2 py-1 w-full focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
                                            id="date_to"
                                            value={data.date_to}
                                            onChange={e => setData('date_to', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[170px]">
                                    <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Cliente</label>
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
                                <div className="flex flex-row gap-2 items-end">
                                    <PrimaryButton size="sm" type="submit">
                                        <span className="inline-flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                                            </svg>
                                            Filtrar
                                        </span>
                                    </PrimaryButton>
                                    <SecondaryButton size="sm" type="button" onClick={handleClear}>
                                        <span className="inline-flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v2h6V4a1 1 0 00-1-1m-4 0h4" />
                                            </svg>
                                            Limpar
                                        </span>
                                    </SecondaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    <ul className='grid grid-cols-1 md:grid-cols-2 gap-2 mb-6'>
                        {orders?.data?.map((order) => {
                            const total = Number(order.total_amount);
                            const paid = Number(order.paid_amount);
                            const pending = Math.max(total - paid, 0);
                            const createdAt = new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                            const itemsCount = order.items.length;
                            const itemsPreview = order.items.slice(0, 2).map(i => `${i.quantity}x ${i.store_product_variant?.product_variant?.name ?? '—'}`).join(', ');
                            const hasMoreItems = (itemsCount > 2);

                            return (
                                <li key={order.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
                                    <div className="flex items-start justify-between gap-2 relative p-2">
                                        {can('orders_view') ? (
                                            <Link href={route('orders.show', { id: order.id })} className="flex-1 min-w-0 rounded-md -m-1 p-1 pr-9 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="font-semibold text-sm truncate">{order.number ? `#${order.number}` : 'Pedido sem número'}</p>
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${OrderStatusColors[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}
                                                    >
                                                        {order.status_name}
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-700 dark:text-gray-300">
                                                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{order?.customer?.name || 'Sem cliente'}</span>
                                                    {order.table && (
                                                        <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Mesa {order.table.name}</span>
                                                    )}
                                                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{itemsCount} {itemsCount === 1 ? 'item' : 'itens'}</span>
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">{createdAt}</span>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 truncate">
                                                    {itemsCount > 0 ? (
                                                        <span className="truncate inline-block max-w-full">
                                                            {itemsPreview}{hasMoreItems ? '…' : ''}
                                                        </span>
                                                    ) : (
                                                        <span className="italic text-gray-400">Sem itens</span>
                                                    )}
                                                </div>
                                                <div className="mt-1 flex items-center justify-between">
                                                    <div className="text-xs">
                                                        <span className="text-gray-600 dark:text-gray-400 mr-1">Total:</span>
                                                        <span className="font-semibold">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                    </div>
                                                    <div className="text-xs">
                                                        {pending > 0 ? (
                                                            <span className="font-semibold text-red-600 dark:text-red-400">Falta {pending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                        ) : (
                                                            <span className="font-semibold text-green-600 dark:text-green-400">Pago</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="font-semibold text-sm truncate">{order.number ? `#${order.number}` : 'Pedido sem número'}</p>
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${OrderStatusColors[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}
                                                    >
                                                        {order.status_name}
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-700 dark:text-gray-300">
                                                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{order?.customer?.name || 'Sem cliente'}</span>
                                                    {order.table && (
                                                        <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Mesa {order.table.name}</span>
                                                    )}
                                                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{itemsCount} {itemsCount === 1 ? 'item' : 'itens'}</span>
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">{createdAt}</span>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 truncate">
                                                    {itemsCount > 0 ? (
                                                        <span className="truncate inline-block max-w-full">
                                                            {itemsPreview}{hasMoreItems ? '…' : ''}
                                                        </span>
                                                    ) : (
                                                        <span className="italic text-gray-400">Sem itens</span>
                                                    )}
                                                </div>
                                                <div className="mt-1 flex items-center justify-between">
                                                    <div className="text-xs">
                                                        <span className="text-gray-600 dark:text-gray-400 mr-1">Total:</span>
                                                        <span className="font-semibold">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                    </div>
                                                    <div className="text-xs">
                                                        {pending > 0 ? (
                                                            <span className="font-semibold text-red-600 dark:text-red-400">Falta {pending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                        ) : (
                                                            <span className="font-semibold text-green-600 dark:text-green-400">Pago</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-1 absolute top-1 right-1">
                                            {(can('orders_view') || (can('orders_edit') && order.user_id != null)) && (
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <SecondaryButton size="sm" className="!px-2 !py-1" title="Ações">
                                                            <MoreVertical className='w-4 h-4' />
                                                        </SecondaryButton>
                                                    </Dropdown.Trigger>
                                                    <Dropdown.Content align='right' width='48'>
                                                        {can('orders_view') && (
                                                            <Dropdown.Link href={route('orders.show', { id: order.id })}>
                                                                <span className='inline-flex items-center gap-2'>
                                                                    <Eye className='w-4 h-4' /> Ver detalhes
                                                                </span>
                                                            </Dropdown.Link>
                                                        )}
                                                        {(can('orders_edit') && order.user_id != null) && (
                                                            <button
                                                                type='button'
                                                                onClick={() => handleOpenOrderModal(order)}
                                                                className='block w-full px-4 py-2 text-start text-sm leading-5 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none'
                                                            >
                                                                <span className='inline-flex items-center gap-2'>
                                                                    <Edit className='w-4 h-4' /> Editar pedido
                                                                </span>
                                                            </button>
                                                        )}
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    
                    <Pagination links={links} />

                    {orders?.data?.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhum pedido cadastrado.
                        </div>
                    )}

                    {can('orders_create') && (
                        <>
                            <OrderFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} tables={tables.data} order={order ?? null} />

                            <button
                                aria-label="Novo pedido"
                                className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                                onClick={() => setIsOpen(true)}
                            >
                                <Plus className="h-6 w-6" />
                            </button>
                        </>
                    )}
                </div>
            </section>
        </AuthenticatedLayout>
    );
}