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
import { orderItemStatuses, orderItemStatusesColor } from '@/utils/OrderItemStatuses';
import PrintOrderFormModal from '@/Components/PrintOrderFormModal';
import PrintOrderItemsFormModal from '@/Components/PrintOrderItemsFormModal';

export default function Index({
    auth,
    order,
    whatsappUrl
}: PageProps<{ order?: { data: Order }, whatsappUrl?: string }>) {
    const { delete: destroy, reset, patch } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    const [isPrintOrderModalOpen, setIsPrintOrderModalOpen] = useState(false);
    const [isPrintOrderItemsModalOpen, setIsPrintOrderItemsModalOpen] = useState(false);

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

    const handleShipOrder = () => {
        Swal.fire({
            title: 'Enviar pedido',
            text: `Tem certeza que deseja enviar o pedido #${order?.data.id}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, enviar',
            cancelButtonText: 'Manter pedido',
        }).then((result) => {
            if (result.isConfirmed) {
                patch(route('orders.ship', order!.data.id));
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

    const nextStatus = (itemId: number) => {
        Swal.fire({
            title: 'Avançar status do item',
            text: `Tem certeza que deseja avançar o status deste item?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, avançar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                patch(route('orders.items.nextStatus', { id: itemId }));
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Pedido #{order?.data ? order.data.id : 'N/A'}
                    </h1>
                    <div className="hidden md:block">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${OrderStatusColors[order?.data?.status ?? 'pending']}`}>
                            {order?.data.status_name || 'N/A'}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={`Pedido #${order?.data?.id || 'N/A'}`} />

            <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
                    {/* Header Actions */}
                    <div className="mb-6 flex justify-between items-center">
                        <Link href={route('orders.index')}>
                            <SecondaryButton className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                                Voltar aos Pedidos
                            </SecondaryButton>
                        </Link>
                        
                        {/* Mobile Status Badge */}
                        <div className="block md:hidden">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${OrderStatusColors[order?.data?.status ?? 'pending']}`}>
                                {order?.data.status_name || 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Customer and Table Information */}
                        {(order?.data.customer || order?.data.table) && (
                            <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {order?.data.customer && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</h3>
                                            <p className="text-lg md:text-xl font-medium text-gray-900 dark:text-white">{order.data.customer.name}</p>
                                        </div>
                                    )}

                                    {order?.data.table && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mesa</h3>
                                            <p className="text-lg md:text-xl font-medium text-gray-900 dark:text-white">{order.data.table.name}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Itens do Pedido</h3>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {order?.data.items.length || 0} {order?.data.items.length === 1 ? 'item' : 'itens'}
                                </span>
                            </div>

                            {order?.data.items.length ? (
                                <div className="space-y-6">
                                    {order.data.items.map((item) => (
                                        <div key={item.id} className="group relative bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-600 shadow-sm">
                                            {/* Status Badge */}
                                            <div className="absolute top-4 right-4">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${orderItemStatusesColor[item.status as keyof typeof orderItemStatusesColor]}`}>
                                                    {orderItemStatuses[item.status as keyof typeof orderItemStatuses]}
                                                </span>
                                            </div>

                                            {/* Product Header */}
                                            <div className="pr-20 mb-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm font-bold mr-3">
                                                                {item.quantity}
                                                            </span>
                                                            {item.store_product_variant?.product_variant?.name || 'N/A'}
                                                        </h4>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                {item.unit_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} cada
                                                            </span>
                                                            <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full font-medium">
                                                                Subtotal: {(item.unit_price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                            </span>
                                                            {item.order_item_options?.some(opt => opt.addon_group_option?.additional_price > 0) && (
                                                                <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-300 font-semibold">
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                    Com personalizações
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Item Details */}
                                            <div className="space-y-4">
                                                {/* Fixed Combo Items */}
                                                {item.store_product_variant?.combo_items && item.store_product_variant.combo_items.length > 0 && (
                                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                        <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                                                            </svg>
                                                            Itens Inclusos
                                                        </h5>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {item.store_product_variant.combo_items.map((ci) => (
                                                                <div key={ci.id} className="flex items-center py-2 px-3 bg-white dark:bg-gray-800 rounded-lg">
                                                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs font-bold mr-3">
                                                                        {ci.quantity}
                                                                    </span>
                                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                        {ci.item_variant?.product_variant?.name || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Combo Options */}
                                                {item.combo_option_items && item.combo_option_items.length > 0 && (
                                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                                        <h5 className="text-sm font-semibold text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                            </svg>
                                                            Opções do Combo
                                                        </h5>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {item.combo_option_items.map((coi) => (
                                                                <div key={coi.id} className="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg">
                                                                    <div className="flex items-center">
                                                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full text-xs font-bold mr-3">
                                                                            {coi.quantity}
                                                                        </span>
                                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                            {coi.combo_option_item?.store_product_variant?.product_variant?.name || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    {coi.unit_price > 0 && (
                                                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                                            +{Number(coi.unit_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Customizations */}
                                                {item.order_item_options && item.order_item_options.length > 0 && (
                                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                                        <h5 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            Personalizações
                                                        </h5>
                                                        <div className="space-y-3">
                                                            {Object.entries(
                                                                item.order_item_options.reduce((acc: Record<string, typeof item.order_item_options>, option) => {
                                                                    const groupName = option.addon_group_option?.addon_group?.name ?? 'Outros';
                                                                    if (!acc[groupName]) acc[groupName] = [];
                                                                    acc[groupName].push(option);
                                                                    return acc;
                                                                }, {} as Record<string, typeof item.order_item_options>)
                                                            ).map(([groupName, options]) => (
                                                                <div key={groupName} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                                                                    <div className="font-medium text-sm text-gray-900 dark:text-white mb-2">{groupName}:</div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {(options as any[]).map((option, idx) => {
                                                                            const name = option.addon_group_option?.addon?.name || 'N/A';
                                                                            const additionalPrice = option.addon_group_option?.additional_price;
                                                                            return (
                                                                                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                                                                                    <span className="font-medium">{option.quantity}x</span>
                                                                                    <span>{name}</span>
                                                                                    {additionalPrice > 0 && (
                                                                                        <span className="text-green-600 dark:text-green-400 font-semibold">
                                                                                            +{Number(additionalPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                                                        </span>
                                                                                    )}
                                                                                </span>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Add-ons */}
                                                {item.order_item_addons && item.order_item_addons.length > 0 && (
                                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                        <h5 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                                            </svg>
                                                            Adicionais
                                                        </h5>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {item.order_item_addons.map((itemAddon) => (
                                                                <div key={itemAddon.id} className="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs font-bold">
                                                                            {itemAddon.quantity}
                                                                        </span>
                                                                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                                                                            {itemAddon.variant_addon?.addon?.name || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                            {Number(itemAddon.total_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                            {Number(itemAddon.unit_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} cada
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Notes */}
                                                {item.notes && (
                                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                            </svg>
                                                            Observações
                                                        </h5>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed bg-white dark:bg-gray-800 p-3 rounded-lg">
                                                            {item.notes}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Item Total */}
                                                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Total do Item:</span>
                                                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                            {item.total_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            {orderCanBeModified && (
                                                <div className="absolute top-4 right-16 flex items-center gap-2">
                                                    {item.status !== 'served' && (
                                                        <button
                                                            className="p-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm hover:shadow-md"
                                                            title="Avançar status do item"
                                                            onClick={() => nextStatus(item.id)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    
                                                    <button
                                                        className="p-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm hover:shadow-md"
                                                        title="Remover item"
                                                        onClick={() => handleDeleteItem(item)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Nenhum item no pedido</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">Adicione itens para começar a processar este pedido.</p>
                                    {order?.data.status === 'in_progress' && (
                                        <PrimaryButton onClick={() => setIsModalOpen(true)}>
                                            Adicionar Item
                                        </PrimaryButton>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Financial Summary */}
                        <div className="border-t border-gray-200 dark:border-gray-700 p-6 md:p-8">
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-6">Resumo Financeiro</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 uppercase tracking-wide">Valor Bruto</h4>
                                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">
                                        {order?.data.items.length
                                            ? order.data.items.reduce((acc, item) => acc + (Number(item.total_price) || 0), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                            : 'R$ 0,00'}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-6 rounded-xl border border-amber-200 dark:border-amber-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-amber-900 dark:text-amber-200 uppercase tracking-wide">Desconto</h4>
                                        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl md:text-3xl font-bold text-amber-900 dark:text-amber-100">
                                            {(order?.data.discount ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                        <div className="text-xs text-amber-700 dark:text-amber-300">
                                            {order?.data.discount_type === 1 ? 'Percentual' : 'Valor Fixo'}: {order?.data.discount_value ?? 0}
                                            {order?.data.discount_type === 1 ? '%' : ''}
                                        </div>
                                    </div>
                                    {orderCanBeModified && (
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
                                            onClick={() => setIsDiscountModalOpen(true)}
                                        >
                                            <BiEdit className="w-4 h-4" />
                                            Editar
                                        </button>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-green-900 dark:text-green-200 uppercase tracking-wide">Valor Total</h4>
                                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="text-2xl md:text-3xl font-bold text-green-900 dark:text-green-100">
                                        {(order?.data.total_amount ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-purple-900 dark:text-purple-200 uppercase tracking-wide">
                                            {((parseFloat(String(order?.data.total_amount ?? 0)) < parseFloat(String(order?.data.paid_amount ?? 0))) ? 'Troco' : 'Pendente')}
                                        </h4>
                                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl md:text-3xl font-bold text-purple-900 dark:text-purple-100">
                                            {Math.abs(((order?.data.total_amount ?? 0) - (order?.data.paid_amount ?? 0))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                        <div className="text-xs text-purple-700 dark:text-purple-300">
                                            Pago: {(order?.data.paid_amount ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payments Section */}
                        {order?.data.payments && order.data.payments.length > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6 md:p-8">
                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-6">Histórico de Pagamentos</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {order.data.payments.map((payment) => (
                                        <div key={payment.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {payment.method}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(payment.created_at)}</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {parseFloat(payment.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </span>
                                            </div>
                                            {payment.notes && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                                                    "{payment.notes}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {orderCanBeModified && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6 md:p-8">
                                <div className="flex flex-wrap gap-3">                                    
                                    {order?.data.status === 'pending' && (
                                        <>
                                            <DangerButton onClick={handleRejectOrder} className="inline-flex items-center gap-2 px-4 py-2.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                                </svg>
                                                Rejeitar Pedido
                                            </DangerButton>
                                            <PrimaryButton onClick={handleApproveOrder} className="inline-flex items-center gap-2 px-4 py-2.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Confirmar Pedido
                                            </PrimaryButton>
                                        </>
                                    )}

                                    {(order?.data.status === 'confirmed' || order?.data.status === 'in_progress' || order?.data.status === 'shipped') && (
                                        <>
                                            <DangerButton onClick={handleCancelOrder} className="inline-flex items-center gap-2 px-4 py-2.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M7 7h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                                </svg>
                                                Cancelar Pedido
                                            </DangerButton>
                                            <PrimaryButton onClick={handleFinishOrder} className="inline-flex items-center gap-2 px-4 py-2.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2v-5a2 2 0 00-2-2h-3l-2-2H7a2 2 0 00-2 2v7a2 2 0 002 2z" />
                                                </svg>
                                                Finalizar Pedido
                                            </PrimaryButton>
                                            <SecondaryButton onClick={() => setIsPaymentsModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 11h16M4 15h7" />
                                                </svg>
                                                Registrar Pagamento
                                            </SecondaryButton>
                                        </>
                                    )}

                                    {(order?.data.status === 'in_progress') && !order?.data?.items.some(i => i.status !== 'ready') && (
                                        <SecondaryButton onClick={handleShipOrder} className="inline-flex items-center gap-2 px-4 py-2.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h11M9 21V3m0 0L5 7m4-4l4 4m6 6h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5M16 5l3 3-3 3" />
                                            </svg>
                                            Marcar como Enviado
                                        </SecondaryButton>
                                    )}

                                    <SecondaryButton onClick={() => setIsPrintOrderModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m10 0v1a3 3 0 01-3 3H8a3 3 0 01-3-3v-1m10 0H7m10-4H7m5 0V5a2 2 0 012-2h0a2 2 0 012 2v8z" />
                                        </svg>
                                        Imprimir Pedido
                                    </SecondaryButton>

                                    <SecondaryButton onClick={() => setIsPrintOrderItemsModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m10 0v1a3 3 0 01-3 3H8a3 3 0 01-3-3v-1m10 0H7m10-4H7m5 0V5a2 2 0 012-2h0a2 2 0 012 2v8z" />
                                        </svg>
                                        Imprimir Itens Selecionados
                                    </SecondaryButton>
                                </div>
                            </div>
                        )}

                        {/* WhatsApp Link */}
                        {whatsappUrl && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6 md:p-8">
                                <a 
                                    href={whatsappUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                                >
                                    <MdWhatsapp className="w-5 h-5" />
                                    Enviar no WhatsApp
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Floating Action Button for adding items */}
                    {order?.data.status === 'in_progress' && (
                        <button
                            aria-label="Adicionar item"
                            onClick={() => setIsModalOpen(true)}
                            className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-14 w-14 md:h-16 md:w-16"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
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

                    <OrderDiscountFormModal
                        isOpen={isDiscountModalOpen}
                        onClose={() => setIsDiscountModalOpen(false)}
                        order={order?.data ?? null}
                    />

                    <PrintOrderFormModal
                        isOpen={isPrintOrderModalOpen}
                        onClose={() => setIsPrintOrderModalOpen(false)}
                        order={order?.data as Order}
                    />

                    <PrintOrderItemsFormModal
                        isOpen={isPrintOrderItemsModalOpen}
                        onClose={() => setIsPrintOrderItemsModalOpen(false)}
                        order={order?.data as Order}
                    />
                </div>
            </section>
        </AuthenticatedLayout>
    );
}