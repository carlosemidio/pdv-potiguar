import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import Pagination from '@/Components/Pagination/Pagination';
import { Order } from '@/types/Order';

export default function Index({
    auth,
    orders,
}: PageProps<{ orders: PaginatedData<Order> }>) {

    const [confirmingOrderDeletion, setConfirmingOrderDeletion] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState<number | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const confirmOrderDeletion = (id: number) => {
        setOrderIdToDelete(id);
        setConfirmingOrderDeletion(true);
    };

    const deleteOrder = () => {
        destroy(route('orders.destroy', { id: orderIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingOrderDeletion(false);
        setOrderIdToDelete(null);
        clearErrors();
        reset();
    };

    const orderToDelete = orders?.data?.find
        ? orders.data.find(order => order.id === orderIdToDelete)
        : null;

    const {
        meta: { links },
    } = orders;

    const statusColors: Record<string, string> = {
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'canceled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
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

                    <div className='flex justify-end mb-6'>
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
                                    <div className='mt-2'>
                                        <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Cliente</p>
                                        <span className="block bg-gray-100 rounded-lg p-2 text-sm dark:bg-gray-800 dark:text-gray-200 min-h-[40px]">
                                            {order?.customer_name || <span className="italic text-gray-400">Sem cliente</span>}
                                        </span>

                                        {order.table && (
                                            <div className='mt-2'>
                                                <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Mesa</p>
                                                <span className="block bg-gray-100 rounded-lg p-2 text-sm dark:bg-gray-800 dark:text-gray-200 min-h-[40px]">
                                                    {order.table.name}
                                                </span>
                                            </div>
                                        )}
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
                                        {(can('orders_delete') && (order.user_id != null)) && (
                                            <DangerButton
                                                onClick={() => confirmOrderDeletion(order.id)}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                title="Deletar pedido"
                                            >
                                                <Trash className='w-5 h-5' />
                                            </DangerButton>
                                        )}
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

            {orderToDelete && (
                <Modal show={confirmingOrderDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteOrder(); }} className="p-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Tem certeza que deseja deletar o pedido <span className="font-bold">{orderToDelete.number}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Uma vez que o pedido é deletado, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar Pedido
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}