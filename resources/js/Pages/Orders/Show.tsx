import Card from '@/Components/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Order } from '@/types/Order';
import OrderItemFormModal from '@/Components/OrderItemFormModal';
import { useState } from 'react';
import { OrderItem } from '@/types/OrderItem';
import Swal from 'sweetalert2';
import OrderPaymentsForm from '@/Components/OrderPaymentsForm';
import { formatDateTime } from '@/utils/date-format';

export default function Index({
    auth,
    order,
}: PageProps<{ order?: { data: Order } }>) {
    const { delete: destroy, reset, patch } = useForm();

    const statusColors: Record<string, string> = {
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'canceled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
    const [tab, setTab] = useState<'items' | 'details'>('items');

    const orderCanBeModified = order?.data.status === 'pending' || order?.data.status === 'in_progress';

    const handleDeleteItem = (item: OrderItem) => {
        Swal.fire({
            title: 'Remover item',
            text: `Remover ${item.quantity}x ${item.variant ? item.variant.name : item.product.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, remover',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
            destroy(route('orders.items.destroy', { id: item.id }), {
                preserveScroll: true,
                onFinish: () => reset(),
            });
            }
        });
    };

    const handleCancelOrder = () => {
        Swal.fire({
            title: 'Cancelar pedido',
            text: `Tem certeza que deseja cancelar o pedido #${order?.data.id}? Esta ação não pode ser desfeita.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, cancelar',
            cancelButtonText: 'Manter pedido',
        }).then((result) => {
            if (result.isConfirmed) {
                patch(route('orders.cancel', order!.data.id));
            }
        });
    };

    const handleFinishOrder = () => {
        Swal.fire({
            title: 'Finalizar pedido',
            text: `Tem certeza que deseja finalizar o pedido #${order?.data.id}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, finalizar',
            cancelButtonText: 'Manter pedido',
        }).then((result) => {
            if (result.isConfirmed) {
                patch(route('orders.finish', order!.data.id));
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    Pedido #{order?.data ? order.data.id : 'N/A'}
                </h2>
            }
        >
            <Head title="Pedidos" />

            <section className="py-4 px-2 md:py-8 md:px-4 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 min-h-screen">
                <div className="max-w-2xl md:max-w-4xl">
                    <div className="mb-4 flex justify-between items-center">
                        <Link href={route('orders.index')}>
                            <PrimaryButton>Voltar</PrimaryButton>
                        </Link>
                    </div>

                    <Card className="p-4 md:p-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg relative">
                        {/* por o status como card tools */}

                        <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[order?.data?.status ?? 'pending']}`}>
                                {order?.data.status_name || 'N/A'}
                            </span>
                        </div>

                        <div className="mt-2">
                            {order?.data.customer_name && (
                                <Info label="Cliente" value={order.data.customer_name} />
                            )}

                            {order?.data.table && (
                                <Info label="Mesa" value={order.data.table.name} />
                            )}

                            <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 mt-3">Itens</span>
                            {order?.data.items.length ? (
                                <ul className="space-y-2">
                                    {order.data.items.map((item) => (
                                        <li key={item.id}>
                                            <Card className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm relative">
                                                <div>
                                                    <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                                        {item.quantity}x {item.variant ? item.variant.name : item.product.name}
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                        {item.unit_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} cada = {item.unit_price * item.quantity}
                                                    </div>
                                                    {item.item_addons?.length > 0 && (
                                                        <div className="mt-1">
                                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Complementos:</span>
                                                            <ul className="ml-3 mt-1 space-y-1">
                                                                {item.item_addons.map((addon, idx) => (
                                                                    <li key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                                                                        {addon.quantity}x {addon.addon?.name || 'N/A'} - {addon.unit_price} = {addon.total_price}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-2 mr-8 md:mt-0 text-gray-800 dark:text-gray-200 font-medium">
                                                    Total: {item.total_price}
                                                </div>

                                                {orderCanBeModified && (
                                                    <button
                                                        className="absolute top-2 right-2 px-1 py-1 text-xs rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition flex items-center"
                                                        title="Remover item"
                                                        onClick={() => handleDeleteItem(item)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </Card>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-800 dark:text-gray-200 text-sm">Nenhum item no pedido.</p>
                            )}

                            {orderCanBeModified && (
                                <div className="sticky left-0 bottom-0 self-start bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-lg w-full md:w-auto">
                                    <PrimaryButton onClick={() => setIsModalOpen(true)} className="shadow-lg">
                                        Adicionar Item
                                    </PrimaryButton>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                            <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-3 shadow-sm">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Valor Total</span>
                                <span className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium truncate">{(order?.data.total_amount ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>

                            <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-3 shadow-sm">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Valor Pago</span>
                                <span className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium truncate">{(order?.data.paid_amount ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>

                            <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-3 shadow-sm">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Valor Restante</span>
                                <span className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium truncate">{((order?.data.total_amount ?? 0) - (order?.data.paid_amount ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        </div>

                        {order?.data.payments && order.data.payments.length > 0 && (
                            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                                <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Pagamentos</span>
                                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {order.data.payments.map((payment) => (
                                        <li key={payment.id}>
                                            <Card className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm relative">
                                                <div className="absolute top-2 right-2">
                                                    <span className="p-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {payment.method}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                    <div className="text-xs">
                                                        {payment.notes ? payment.notes : 'N/A'}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
                                                    <span className="text-gray-800 dark:text-gray-200 font-medium text-md">
                                                        {parseFloat(payment.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 text-left">
                                                        {formatDateTime(payment.created_at)}
                                                    </span>
                                                </div>
                                            </Card>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                            {orderCanBeModified && (
                                <div className="mt-4 flex flex-col md:flex-row gap-2">
                                    <PrimaryButton
                                        onClick={handleCancelOrder}
                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                    >
                                        Cancelar Pedido
                                    </PrimaryButton>

                                    <PrimaryButton
                                        onClick={handleFinishOrder}
                                        className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                    >
                                        Finalizar Pedido
                                    </PrimaryButton>

                                    <PrimaryButton
                                        onClick={() => setIsPaymentsModalOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                                    >
                                        Adicionar Pagamento
                                    </PrimaryButton>
                                </div>
                            )}
                        </div>

                        <OrderItemFormModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            order={order?.data as Order}
                        />

                        <OrderPaymentsForm
                            order={order?.data as Order}
                            isOpen={isPaymentsModalOpen}
                            onClose={() => setIsPaymentsModalOpen(false)}
                        />
                    </Card>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-3 shadow-sm gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{label}:</span>
            <span className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium truncate">{value}</span>
        </div>
    );
}
