import Card from '@/Components/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { can } from '@/utils/authorization';
import Pagination from '@/Components/Pagination/Pagination';
import { Order } from '@/types/Order';
import SearchableCustomersSelect from '@/Components/SearchableCustomersSelect';
import { Customer } from '@/types/Customer';

export default function Index({
    auth,
    orders,
    filters,
}: PageProps<{ orders: PaginatedData<Order>, filters: { status?: string; date_from?: string; date_to?: string; customer?: Customer  } }>) {
    // Initialize form data
    const { data, setData, get, errors, processing } = useForm({
        status: filters.status || 'pending',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        customer_id: filters.customer ? filters.customer.id : null
    });

    const [customer, setCustomer] = useState<Customer | null>(null);

    const {
        meta: { links },
    } = orders;

    const statusColors: Record<string, string> = {
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

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
            <section className='py-12 px-4 text-gray-800 dark:text-gray-200 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 min-h-screen'>
                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="mb-6">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col md:flex-row md:items-end gap-4 border border-gray-200 dark:border-gray-700">
                            <form className="flex flex-col md:flex-row gap-4 w-full" onSubmit={handleFilter}>
                                <div className="flex flex-col min-w-[140px]">
                                    <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Status</label>
                                    <select
                                        id="status"
                                        className="border rounded px-2 py-1 w-full focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
                                        defaultValue={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                    >
                                        <option value="">Todos</option>
                                        <option value="pending">Pendente</option>
                                        <option value="in_progress">Em andamento</option>
                                        <option value="completed">Concluído</option>
                                        <option value="cancelled">Cancelado</option>
                                    </select>
                                </div>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <div className="flex flex-col min-w-[140px]">
                                        <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Data de</label>
                                        <input
                                            type="date"
                                            className="border rounded px-2 py-1 w-full focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
                                            id="date_from"
                                            value={data.date_from}
                                            onChange={e => setData('date_from', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-[140px]">
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
                                <div className="flex flex-col min-w-[180px]">
                                    <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Cliente</label>
                                    <div>
                                        <SearchableCustomersSelect
                                            selectedCustomer={customer}
                                            setCustomer={(customer) => {
                                                setCustomer(customer);
                                                setData('customer_id', customer ? customer.id : null);
                                            }}
                                            isDisabled={processing}
                                        />
                                    </div>
                                    <input type="hidden" id="customer_id" value={data.customer_id ?? ''} />
                                </div>
                                <div className="flex flex-row gap-2 items-end">
                                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow mt-2">Filtrar</button>
                                    <button type="button" onClick={handleClear} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg shadow mt-2">Limpar</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mb-6 flex flex-col md:flex-row md:items-center">
                        {can('orders_create') && (
                            <Link href={route('orders.create')}>
                                <PrimaryButton className="flex items-center gap-2 shadow-md hover:scale-105 transition-transform">
                                    <span className="font-semibold">+ Adicionar pedido</span>
                                </PrimaryButton>
                            </Link>
                        )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            orders?.data?.map((order) => (
                                <Card key={order.id} className="p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className='font-bold text-lg'>{order.number ? `Pedido #${order.number}` : 'Pedido sem número'}</p>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium
                                                ${
                                                    statusColors[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                }
                                            `}
                                        >
                                            {order.status_name}
                                        </span>
                                    </div>
                                    <div className='mt-2 flex flex-col gap-2'>
                                        <div className='flex items-center gap-2'>
                                            <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Cliente:</p>
                                            <span className="bg-gray-100 rounded-lg px-2 py-1 text-sm dark:bg-gray-800 dark:text-gray-200 min-h-[28px]">
                                                {order?.customer?.name || <span className="italic text-gray-400">Sem cliente</span>}
                                            </span>
                                        </div>
                                        {order.table && (
                                            <div className='flex items-center gap-2'>
                                                <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Mesa:</p>
                                                <span className="bg-gray-100 rounded-lg px-2 py-1 text-sm dark:bg-gray-800 dark:text-gray-200 min-h-[28px]">
                                                    {order.table.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='mt-4'>
                                        <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Resumo:</p>
                                        {order.items.length > 0 ? (
                                            <ul className='max-h-32 overflow-y-auto pr-2'>
                                                {order.items.map((item) => (
                                                    <li key={item.id} className='text-xs text-gray-700 dark:text-gray-300'>
                                                        {item.quantity}x {item.store_product_variant?.product_variant.name} - R$ {item.total_price}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className='text-sm italic text-gray-400'>Nenhum item no pedido.</p>
                                        )}
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 mt-4'>
                                        <div>
                                            <p className='text-sm text-gray-600 dark:text-gray-400'>Total:</p>
                                            <span className='font-semibold'>R$ {order.total_amount}</span>
                                        </div>
                                        <div>
                                            <p className='text-sm text-gray-600 dark:text-gray-400'>Pago:</p>
                                            <span className={`font-semibold ${(order.paid_amount < order.total_amount) ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                                R$ {order.paid_amount}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='mt-2 grid grid-cols-2 gap-2'>
                                        <div>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>Criado em</p>
                                            <span className='text-xs'>
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
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>Atualizado em</p>
                                            <span className='text-xs'>
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
                                    <div className='flex gap-2 mt-4 justify-end'>
                                        {(can('orders_edit') && (order.user_id != null)) && (
                                            <Link href={route('orders.edit', { id: order.id })}>
                                                <SecondaryButton
                                                    className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                    title="Editar pedido"
                                                >
                                                    <Edit className='w-5 h-5' />
                                                </SecondaryButton>
                                            </Link>
                                        )}
                                        {can('orders_view') && (
                                            <Link href={route('orders.show', { id: order.id })}>
                                                <SecondaryButton
                                                    className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                    title="Ver detalhes do pedido"
                                                >
                                                    Detalhes
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
                </div>
            </section>
        </AuthenticatedLayout>
    );
}