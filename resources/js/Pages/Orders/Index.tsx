import Card from '@/Components/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Plus } from 'lucide-react';
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
                <div className="mx-auto w-full lg:px-2">
                    <div className="mb-3">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-2.5 flex flex-col md:flex-row md:items-end gap-2.5 border border-gray-200 dark:border-gray-700">
                            <form className="flex flex-col md:flex-row gap-2.5 w-full" onSubmit={handleFilter}>
                                <div className="flex flex-col min-w-[110px]">
                                    <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Status</label>
                                    <select
                                        id="status"
                                        className="border rounded px-2 py-1 w-full focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
                                        defaultValue={data.status}
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

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {
                            orders?.data?.map((order) => (
                                <Card key={order.id} className="p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className='font-semibold text-sm'>{order.number ? `Pedido #${order.number}` : 'Pedido sem número'}</p>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium
                                                ${
                                                    OrderStatusColors[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                }
                                            `}
                                        >
                                            {order.status_name}
                                        </span>
                                    </div>
                                    <div className='mt-1 flex flex-col gap-1'>
                                        <div className='flex items-center gap-2'>
                                            <p className='text-xs font-medium text-gray-600 dark:text-gray-400'>Cliente:</p>
                                            <span className="bg-gray-100 rounded px-1.5 py-0.5 text-[11px] dark:bg-gray-800 dark:text-gray-200 min-h-[20px]">
                                                {order?.customer?.name || <span className="italic text-gray-400">Sem cliente</span>}
                                            </span>
                                        </div>
                                        {order.table && (
                                            <div className='flex items-center gap-2'>
                                                <p className='text-xs font-medium text-gray-600 dark:text-gray-400'>Mesa:</p>
                                                <span className="bg-gray-100 rounded px-1.5 py-0.5 text-[11px] dark:bg-gray-800 dark:text-gray-200 min-h-[20px]">
                                                    {order.table.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='mt-1.5'>
                                        <p className='text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'>Resumo:</p>
                                        {order.items.length > 0 ? (
                                            <ul className='max-h-24 overflow-y-auto pr-1.5 space-y-0.5'>
                                                {order.items.map((item) => (
                                                    <li key={item.id} className='text-[11px] text-gray-700 dark:text-gray-300'>
                                                        {item.quantity}x {item.store_product_variant?.product_variant.name} - {parseFloat(item.total_price as any).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className='text-xs italic text-gray-400'>Nenhum item no pedido.</p>
                                        )}
                                    </div>
                                    <div className='grid grid-cols-2 gap-2.5 mt-2.5'>
                                        <div>
                                            <p className='text-xs text-gray-600 dark:text-gray-400'>Total:</p>
                                            <span className='font-semibold'>
                                                {parseFloat(order.total_amount as any).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-600 dark:text-gray-400'>Pago:</p>
                                            <span className={`font-semibold ${(Number(order.paid_amount) < Number(order.total_amount)) ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                                {parseFloat(order.paid_amount as any).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='mt-2 grid grid-cols-2 gap-1.5'>
                                        <div>
                                            <p className='text-[11px] text-gray-500 dark:text-gray-400'>Criado em</p>
                                            <span className='text-[11px]'>
                                                {new Date(order.created_at).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='text-[11px] text-gray-500 dark:text-gray-400'>Atualizado em</p>
                                            <span className='text-[11px]'>
                                                {new Date(order.updated_at).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='flex gap-1.5 mt-2.5 justify-end'>
                                        {(can('orders_edit') && (order.user_id != null)) && (
                                            <SecondaryButton size="sm" title="Editar pedido" className="flex items-center gap-1" onClick={() => handleOpenOrderModal(order)}>
                                                <Edit className='w-4 h-4' />
                                            </SecondaryButton>
                                        )}

                                        {can('orders_view') && (
                                            <Link href={route('orders.show', { id: order.id })}>
                                                <SecondaryButton size="sm" className="flex items-center gap-1" title="Ver detalhes do pedido">
                                                    <Eye className='w-4 h-4' />
                                                </SecondaryButton>
                                            </Link>
                                        )}
                                    </div>
                                </Card>
                            ))
                        }
                    </div>
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
                                className="fixed bottom-14 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
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