import Card from '@/Components/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
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
import OrderStatusColors from '@/utils/OrderStatusColors';
import { MdWhatsapp } from 'react-icons/md';
import OrderDiscountFormModal from '@/Components/OrderDiscountFormModal';
import { BiEdit } from 'react-icons/bi';

export default function Index({
    auth,
    order,
    whatsappUrl
}: PageProps<{ order?: { data: Order }, whatsappUrl?: string }>) {
    const { delete: destroy, reset, patch } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

    const orderCanBeModified = order?.data.status !== 'completed' && order?.data.status !== 'canceled';

    const handleDeleteItem = (item: OrderItem) => {
        Swal.fire({
            title: 'Remover item',
            text: `Remover ${item.quantity}x ${item.store_product_variant?.product_variant?.name} do pedido?`,
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

    const handleRejectOrder = () => {
        Swal.fire({
            title: 'Rejeitar pedido',
            text: `Tem certeza que deseja rejeitar o pedido #${order?.data.id}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, rejeitar',
            cancelButtonText: 'Manter pedido',
        }).then((result) => {
            if (result.isConfirmed) {
                patch(route('orders.reject', order!.data.id));
            }
        });
    };

    const handleApproveOrder = () => {
        Swal.fire({
            title: 'Confirmar pedido',
            text: `Tem certeza que deseja confirmar o pedido #${order?.data.id}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, confirmar',
            cancelButtonText: 'Manter pedido',
        }).then((result) => {
            if (result.isConfirmed) {
                patch(route('orders.confirm', order!.data.id));
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
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                    Pedido #{order?.data ? order.data.id : 'N/A'}
                </h2>
            }
        >
            <Head title="Pedidos" />

            <section className="py-2 px-2 md:py-4 md:px-3 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 min-h-screen">
                <div className="max-w-2xl md:max-w-4xl">
                    <div className="mb-2 flex justify-between items-center">
                        <Link href={route('orders.index')}>
                            <SecondaryButton size="sm">
                                <span className="inline-flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Voltar
                                </span>
                            </SecondaryButton>
                        </Link>
                    </div>

                    <div className="p-2 md:p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm relative">
                        {/* Status badge */}
                        <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${OrderStatusColors[order?.data?.status ?? 'pending']}`}>
                                {order?.data.status_name || 'N/A'}
                            </span>
                        </div>

                        <div className="mt-1">
                            {order?.data.customer_name && (
                                <Info label="Cliente" value={order.data.customer_name} />
                            )}

                            {order?.data.table && (
                                <Info label="Mesa" value={order.data.table.name} />
                            )}

                            <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 mt-2">Itens</span>
                            {order?.data.items.length ? (
                                <ul className="space-y-1">
                                    {order.data.items.map((item) => (
                                        <li key={item.id}>
                                            <div className="flex items-start justify-between gap-1.5 p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 relative">
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                                        {item.quantity}x {item.store_product_variant?.product_variant?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                        {item.unit_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} cada, Total = {(item.total_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        {item.order_item_options?.some(opt => opt.addon_group_option?.additional_price > 0) && (
                                                            <span className="ml-2 text-green-700 dark:text-green-300 font-semibold">(acréscimo por opções)</span>
                                                        )}
                                                    </div>
                                                    {item.order_item_options && item.order_item_options.length > 0 && (
                                                        <div className="mt-1">
                                                            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Opções:</span>
                                                            {/* Agrupa por grupo */}
                                                            <ul className="ml-3 mt-1 space-y-0.5">
                                                                {Object.entries(
                                                                    item.order_item_options.reduce((acc: Record<string, typeof item.order_item_options>, option) => {
                                                                        const groupName = option.addon_group_option.addon_group?.name || 'Outros';
                                                                        if (!acc[groupName]) acc[groupName] = [];
                                                                        acc[groupName].push(option);
                                                                        return acc;
                                                                    }, {} as Record<string, typeof item.order_item_options>)
                                                                ).map(([groupName, options]) => (
                                                                    <li key={groupName} className="text-[11px] text-gray-700 dark:text-gray-300">
                                                                        <span className="font-semibold text-blue-700 dark:text-blue-300 mr-1">{groupName}:</span>
                                                                        <span>
                                                                            {(options as any[]).map((option, idx) => {
                                                                                const name = option.addon_group_option?.addon?.name || 'N/A';
                                                                                const additionalPrice = option.addon_group_option?.additional_price;
                                                                                return (
                                                                                    <span key={idx} className="mr-2">
                                                                                        {option.quantity}x {name}
                                                                                        {additionalPrice > 0 && (
                                                                                            <span className="text-green-700 dark:text-green-300 font-semibold ml-1">+ R$ {Number(additionalPrice).toFixed(2)}</span>
                                                                                        )}
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {item.order_item_addons && item.order_item_addons.length > 0 && (
                                                        <div className="mt-2">
                                                            <span className="font-semibold text-gray-700 dark:text-gray-300">Adicionais:</span>
                                                            <ul className="list-disc list-inside">
                                                                {item.order_item_addons.map((itemAddon) => (
                                                                    <li key={itemAddon.id} className="text-[11px] text-gray-700 dark:text-gray-300">
                                                                        <span className="font-semibold text-blue-700 dark:text-blue-300 mr-1">{itemAddon.quantity}x</span>
                                                                        <span>{itemAddon.variant_addon?.addon?.name || 'N/A'}</span>
                                                                        <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                                                                            ({itemAddon.unit_price} cada, Total = {itemAddon.total_price})
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                                {orderCanBeModified && (
                                                    <button
                                                        className="absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition"
                                                        title="Remover item"
                                                        onClick={() => handleDeleteItem(item)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-800 dark:text-gray-200 text-sm">Nenhum item no pedido.</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 mt-3">
                            <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg p-1.5 shadow-sm">
                                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Valor Bruto</span>
                                <span className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium truncate">
                                    {order?.data.items.length
                                        ? order.data.items.reduce((acc, item) => acc + (Number(item.total_price) || 0), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                        : 'R$ 0,00'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg p-1 shadow-sm">
                                    <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Desconto</span>
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <span className="text-xs text-gray-800 dark:text-gray-200 font-medium ml-1">
                                                {order?.data.discount_type === 1 ? '(%)' : '(R$)'}
                                            </span>
                                            <span className="text-xs text-gray-800 dark:text-gray-200 font-medium ml-1">
                                                {(order?.data.discount_value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-800 dark:text-gray-200 font-medium ml-1">
                                                R$ {(order?.data.discount ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {orderCanBeModified && (
                                    <>
                                        <button
                                            type="button"
                                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                            onClick={() => setIsDiscountModalOpen(true)}
                                        >
                                            <BiEdit className="inline w-8 h-8 mr-1" />
                                        </button>

                                        <OrderDiscountFormModal
                                            isOpen={isDiscountModalOpen}
                                            onClose={() => setIsDiscountModalOpen(false)}
                                            order={order?.data ?? null}
                                        />
                                    </>
                                )}
                            </div>

                            <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg p-1.5 shadow-sm">
                                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Valor Total</span>
                                <span className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium truncate">{(order?.data.total_amount ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>

                            <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg p-1.5 shadow-sm">
                                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Valor Pago</span>
                                <span className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium truncate">{(order?.data.paid_amount ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>

                            <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg p-1.5 shadow-sm">
                                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Valor Restante</span>
                                <span className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium truncate">{((order?.data.total_amount ?? 0) - (order?.data.paid_amount ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        </div>

                        {order?.data.payments && order.data.payments.length > 0 && (
                            <div className="mt-3 border-top border-gray-200 dark:border-gray-700 pt-2">
                                <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Pagamentos</span>
                                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
                                    {order.data.payments.map((payment) => (
                                        <li key={payment.id}>
                                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {payment.method}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(payment.created_at)}</span>
                                                </div>
                                                <div className="mt-1 flex items-center justify-between">
                                                    <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm">
                                                        {parseFloat(payment.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                    <span className="text-[11px] text-gray-600 dark:text-gray-400 truncate max-w-[60%]">{payment.notes ? payment.notes : '—'}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {orderCanBeModified && (
                            <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-2">
                                <div className="flex gap-2 overflow-x-auto no-scrollbar">                                    
                                    {order?.data.status === 'pending' && (
                                        <>
                                            <DangerButton size="sm" onClick={handleRejectOrder} className="whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                                </svg>
                                                Rejeitar
                                            </span>
                                        </DangerButton>
                                        <PrimaryButton size="sm" onClick={handleApproveOrder} className="whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Confirmar
                                            </span>
                                        </PrimaryButton>
                                        </>
                                    )}
                                    {(order?.data.status === 'confirmed' || order?.data.status === 'in_progress') && (
                                        <>
                                            <DangerButton size="sm" onClick={handleCancelOrder} className="whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M7 7h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                                    </svg>
                                                    Cancelar
                                                </span>
                                            </DangerButton>
                                            <PrimaryButton size="sm" onClick={handleFinishOrder} className="whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2v-5a2 2 0 00-2-2h-3l-2-2H7a2 2 0 00-2 2v7a2 2 0 002 2z" />
                                                    </svg>
                                                    Finalizar
                                                </span>
                                            </PrimaryButton>
                                            <SecondaryButton size="sm" onClick={() => setIsPaymentsModalOpen(true)} className="whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 11h16M4 15h7" />
                                                    </svg>
                                                    Pagamento
                                                </span>
                                            </SecondaryButton>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {whatsappUrl && (
                            <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-2">
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm">
                                    <MdWhatsapp className="w-5 h-5" />
                                    WhatsApp
                                </a>
                            </div>
                        )}

                        {/* Modals */}
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
                    </div>

                    {/* Floating Action Button for adding items */}
                    {order?.data.status === 'in_progress' && (
                        <button
                            aria-label="Adicionar item"
                            onClick={() => setIsModalOpen(true)}
                            className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    )}
                </div>
            </section>
        </AuthenticatedLayout>
    );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-1 mt-1 shadow-sm gap-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{label}:</span>
            <span className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium truncate">{value}</span>
        </div>
    );
}
