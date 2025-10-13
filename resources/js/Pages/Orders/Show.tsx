import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Order } from '@/types/Order';
import { Printer } from '@/types/Printer';
import OrderItemFormModal from '@/Components/OrderItemFormModal';
import { useState } from 'react';
import { OrderItem } from '@/types/OrderItem';
import Swal from 'sweetalert2';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
    printers,
    whatsappUrl
}: PageProps<{ order?: { data: Order }, printers?: { data: Printer[] }, whatsappUrl?: string }>) {
    const { delete: destroy, reset, patch, post } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [isPrintOrderItemsModalOpen, setIsPrintOrderItemsModalOpen] = useState(false);

    const orderCanBeModified = order?.data.status !== 'completed' && order?.data.status !== 'canceled';

    // Função para impressão direta (quando há apenas uma impressora)
    const printOrderDirectly = (printerId: number) => {
        post(route('order.print', { orderId: order?.data.id, printerId: printerId }), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso',
                    text: 'Pedido enviado para impressão.',
                    timer: 2000,
                    showConfirmButton: false
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Houve um erro ao enviar o pedido para impressão.',
                });
            }
        });
    };

    // Função para decidir se abre modal ou imprime diretamente
    const handlePrintOrder = () => {
        if (!printers || printers.data.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Nenhuma impressora',
                text: 'Não há impressoras cadastradas para esta loja.',
            });
            return;
        }

        if (printers.data.length === 1) {
            // Se há apenas uma impressora, imprime diretamente
            printOrderDirectly(printers.data[0].id);
        } else {
            // Se há múltiplas impressoras, abre o modal de seleção
            setIsPrintModalOpen(true);
        }
    };

    // Função para decidir se abre modal ou imprime itens diretamente
    const handlePrintOrderItems = () => {
        if (!printers || printers.data.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Nenhuma impressora',
                text: 'Não há impressoras cadastradas para esta loja.',
            });
            return;
        }

        // Se há múltiplas impressoras, abre o modal de seleção
        setIsPrintOrderItemsModalOpen(true)
    };

        const handleDeleteItem = (item: OrderItem) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: `Deseja realmente remover "${item.store_product_variant?.product_variant?.name || 'este item'}" do pedido?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, remover!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('order-items.destroy', item.id), {
                    onSuccess: () => {
                        Swal.fire(
                            'Removido!',
                            'O item foi removido do pedido.',
                            'success'
                        );
                    }
                });
            }
        });
    };

    const toggleItemExpansion = (itemId: number) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
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
                    <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
                        Pedido #{order?.data ? order.data.id : 'N/A'}
                    </h1>
                    <div className="hidden md:block ml-4">
                        <span className={`inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium ${OrderStatusColors[order?.data?.status ?? 'pending']}`}>
                            {order?.data.status_name || 'N/A'}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={`Pedido #${order?.data?.id || 'N/A'}`} />

            <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-6xl">
                    {/* Header Actions */}
                    <div className="mb-4 md:mb-6 flex justify-between items-center">
                        <Link href={route('orders.index')}>
                            <SecondaryButton className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="hidden sm:inline">Voltar aos Pedidos</span>
                                <span className="sm:hidden">Voltar</span>
                            </SecondaryButton>
                        </Link>
                        
                        {/* Mobile Status Badge */}
                        <div className="block md:hidden">
                            <span className={`inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${OrderStatusColors[order?.data?.status ?? 'pending']}`}>
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



                        {/* Financial Summary */}
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4 md:p-8">
                            <h3 className="text-base md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">Resumo Financeiro</h3>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-3 md:p-6 rounded-lg md:rounded-xl border border-blue-200 dark:border-blue-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs md:text-sm font-medium text-blue-900 dark:text-blue-200 uppercase tracking-wide">Bruto</h4>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="text-lg md:text-3xl font-bold text-blue-900 dark:text-blue-100">
                                        {order?.data.items.length
                                            ? order.data.items.reduce((acc, item) => acc + (Number(item.total_price) || 0), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                            : 'R$ 0,00'}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-3 md:p-6 rounded-lg md:rounded-xl border border-amber-200 dark:border-amber-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs md:text-sm font-medium text-amber-900 dark:text-amber-200 uppercase tracking-wide">Desconto</h4>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-lg md:text-3xl font-bold text-amber-900 dark:text-amber-100">
                                            {(order?.data.discount ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                        <div className="text-xs text-amber-700 dark:text-amber-300 hidden md:block">
                                            {order?.data.discount_type === 1 ? 'Percentual' : 'Valor Fixo'}: {order?.data.discount_value ?? 0}
                                            {order?.data.discount_type === 1 ? '%' : ''}
                                        </div>
                                    </div>
                                    {orderCanBeModified && (
                                        <button
                                            type="button"
                                            className="mt-2 md:mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
                                            onClick={() => setIsDiscountModalOpen(true)}
                                        >
                                            <BiEdit className="w-3 h-3 md:w-4 md:h-4" />
                                            <span className="hidden md:inline">Editar</span>
                                        </button>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-3 md:p-6 rounded-lg md:rounded-xl border border-green-200 dark:border-green-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs md:text-sm font-medium text-green-900 dark:text-green-200 uppercase tracking-wide">Total</h4>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="text-lg md:text-3xl font-bold text-green-900 dark:text-green-100">
                                        {(order?.data.total_amount ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-3 md:p-6 rounded-lg md:rounded-xl border border-purple-200 dark:border-purple-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs md:text-sm font-medium text-purple-900 dark:text-purple-200 uppercase tracking-wide">
                                            {((parseFloat(String(order?.data.total_amount ?? 0)) < parseFloat(String(order?.data.paid_amount ?? 0))) ? 'Troco' : 'Pendente')}
                                        </h4>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-lg md:text-3xl font-bold text-purple-900 dark:text-purple-100">
                                            {Math.abs(((order?.data.total_amount ?? 0) - (order?.data.paid_amount ?? 0))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                        <div className="text-xs text-purple-700 dark:text-purple-300 hidden md:block">
                                            Pago: {(order?.data.paid_amount ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payments Section */}
                        {order?.data.payments && order.data.payments.length > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 md:p-8">
                                <h3 className="text-base md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">Histórico de Pagamentos</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                    {order.data.payments.map((payment) => (
                                        <div key={payment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center justify-between mb-2 md:mb-3">
                                                <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {payment.method}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:inline">{formatDateTime(payment.created_at)}</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                                                    {parseFloat(payment.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </span>
                                            </div>
                                            {payment.notes && (
                                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-2 italic line-clamp-2">
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
                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 md:p-8">
                                <div className="flex flex-wrap gap-2 md:gap-3">                                    
                                    {order?.data.status === 'pending' && (
                                        <>
                                            <DangerButton onClick={handleRejectOrder} className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                                </svg>
                                                <span className="hidden sm:inline">Rejeitar Pedido</span>
                                                <span className="sm:hidden">Rejeitar</span>
                                            </DangerButton>
                                            <PrimaryButton onClick={handleApproveOrder} className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="hidden sm:inline">Confirmar Pedido</span>
                                                <span className="sm:hidden">Confirmar</span>
                                            </PrimaryButton>
                                        </>
                                    )}

                                    {(order?.data.status === 'confirmed' || order?.data.status === 'in_progress' || order?.data.status === 'shipped') && (
                                        <>
                                            <DangerButton onClick={handleCancelOrder} className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M7 7h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                                </svg>
                                                <span className="hidden sm:inline">Cancelar Pedido</span>
                                                <span className="sm:hidden">Cancelar</span>
                                            </DangerButton>
                                            <PrimaryButton onClick={handleFinishOrder} className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2v-5a2 2 0 00-2-2h-3l-2-2H7a2 2 0 00-2 2v7a2 2 0 002 2z" />
                                                </svg>
                                                <span className="hidden sm:inline">Finalizar Pedido</span>
                                                <span className="sm:hidden">Finalizar</span>
                                            </PrimaryButton>
                                            <SecondaryButton onClick={() => setIsPaymentsModalOpen(true)} className="w-full md:w-auto inline-flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 11h16M4 15h7" />
                                                </svg>
                                                <span className="hidden sm:inline">Registrar Pagamento</span>
                                                <span className="sm:hidden">Pagamento</span>
                                            </SecondaryButton>
                                        </>
                                    )}

                                    {(order?.data.status === 'in_progress') && !order?.data?.items.some(i => i.status !== 'ready') && (
                                        <SecondaryButton onClick={handleShipOrder} className="w-full md:w-auto inline-flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h11M9 21V3m0 0L5 7m4-4l4 4m6 6h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5M16 5l3 3-3 3" />
                                            </svg>
                                            <span className="hidden sm:inline">Marcar como Enviado</span>
                                            <span className="sm:hidden">Enviado</span>
                                        </SecondaryButton>
                                    )}

                                    <SecondaryButton onClick={handlePrintOrder} className="inline-flex items-center gap-2 px-4 py-2.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m10 0v1a3 3 0 01-3 3H8a3 3 0 01-3-3v-1m10 0H7m10-4H7m5 0V5a2 2 0 012-2h0a2 2 0 012 2v8z" />
                                        </svg>
                                        Cupom fiscal
                                    </SecondaryButton>

                                    <SecondaryButton onClick={handlePrintOrderItems} className="inline-flex items-center gap-2 px-4 py-2.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m10 0v1a3 3 0 01-3 3H8a3 3 0 01-3-3v-1m10 0H7m10-4H7m5 0V5a2 2 0 012-2h0a2 2 0 012 2v8z" />
                                        </svg>
                                        Itens
                                    </SecondaryButton>
                                </div>
                            </div>
                        )}

                        {/* Order Items - Movido para depois dos botões de ação */}
                        <div className="border-t border-gray-200 dark:border-gray-700 p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Itens do Pedido</h3>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {order?.data.items.length || 0} {order?.data.items.length === 1 ? 'item' : 'itens'}
                                </span>
                            </div>

                            {order?.data.items.length ? (
                                <div className="space-y-3">
                                    {order.data.items.map((item) => {
                                        const isExpanded = expandedItems.has(item.id);
                                        const hasDetails = (
                                            (item.store_product_variant?.combo_items && item.store_product_variant.combo_items.length > 0) ||
                                            (item.combo_option_items && item.combo_option_items.length > 0) ||
                                            (item.order_item_options && item.order_item_options.length > 0) ||
                                            item.notes
                                        );

                                        return (
                                            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative">
                                                {/* Status Badge */}
                                                <span className={`absolute top-4 right-4 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${orderItemStatusesColor[item.status as keyof typeof orderItemStatusesColor]}`}>
                                                    {orderItemStatuses[item.status as keyof typeof orderItemStatuses]}
                                                </span>

                                                {/* Compact Header - Always Visible */}
                                                <div 
                                                    className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
                                                    onClick={() => hasDetails && toggleItemExpansion(item.id)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            {/* Quantity Badge */}
                                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm font-bold">
                                                                {item.quantity}
                                                            </span>

                                                            {/* Product Name and Price */}
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                                                                    {item.store_product_variant?.product_variant?.name || 'N/A'}
                                                                </h4>
                                                                <div className="flex items-center gap-3 text-xs md:text-sm mt-1">
                                                                    <span className="text-gray-600 dark:text-gray-400">
                                                                        {item.unit_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} cada
                                                                    </span>
                                                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                                                        Total: {item.total_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {/* Expand/Collapse Arrow */}
                                                            {hasDetails && (
                                                                <div className="p-1">
                                                                    {isExpanded ? (
                                                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                                                    ) : (
                                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Quick Info Tags */}
                                                    {!isExpanded && hasDetails && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {item.store_product_variant?.combo_items && item.store_product_variant.combo_items.length > 0 && (
                                                                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                                                                    {item.store_product_variant.combo_items.length} itens inclusos
                                                                </span>
                                                            )}
                                                            {item.combo_option_items && item.combo_option_items.length > 0 && (
                                                                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs">
                                                                    {item.combo_option_items.length} opções
                                                                </span>
                                                            )}
                                                            {item.order_item_options && item.order_item_options.length > 0 && (
                                                                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
                                                                    {item.order_item_options.length} personalizações
                                                                </span>
                                                            )}
                                                            {item.notes && (
                                                                <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-xs">
                                                                    Com observações
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Expanded Details */}
                                                {isExpanded && hasDetails && (
                                                    <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                                        <div className="pt-4 space-y-4">
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
                                                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                                    <h5 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center gap-2">
                                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M3 4a1 1 0 000 2h.01a1 1 0 100-2H3zm5 0a1 1 0 100 2h8a1 1 0 100-2H8zm-5 4a1 1 0 100 2h.01a1 1 0 100-2H3zm5 0a1 1 0 100 2h8a1 1 0 100-2H8zm-5 4a1 1 0 100 2h.01a1 1 0 100-2H3zm5 0a1 1 0 100 2h8a1 1 0 100-2H8z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Personalizações
                                                                    </h5>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                        {item.order_item_options.map((oio) => (
                                                                            <div key={oio.id} className="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg">
                                                                                <div className="flex items-center">
                                                                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs font-bold mr-3">
                                                                                        {oio.quantity}
                                                                                    </span>
                                                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                                        {oio.addon_group_option?.addon?.name || 'N/A'}
                                                                                    </span>
                                                                                </div>
                                                                                {oio.addon_group_option?.additional_price > 0 && (
                                                                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                                                        +{Number(oio.addon_group_option.additional_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Notes */}
                                                            {item.notes && (
                                                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                                                    <h5 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Observações
                                                                    </h5>
                                                                    <p className="text-sm text-yellow-800 dark:text-yellow-300 italic">
                                                                        "{item.notes}"
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Action Buttons - Compact */}
                                                {orderCanBeModified && (
                                                    <div className="flex items-center gap-2 pb-4 pl-4">
                                                        <PrimaryButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                nextStatus(item.id);
                                                            }}
                                                            className="px-3 py-1 text-xs"
                                                            title="Próximo status"
                                                        >
                                                            Próximo status
                                                        </PrimaryButton>
                                                        <DangerButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteItem(item);
                                                            }}
                                                            className="px-3 py-1 text-xs"
                                                            title="Remover item"
                                                        >
                                                            Remover
                                                        </DangerButton>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
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

                    {printers && (printers.data as Printer[]).length > 0 && (
                        <PrintOrderFormModal
                            isOpen={isPrintModalOpen}
                            onClose={() => setIsPrintModalOpen(false)}
                            order={order?.data as Order}
                            printers={printers.data as Printer[]}
                        />
                    )}

                    {printers && (printers.data as Printer[]).length > 0 && (
                        <PrintOrderItemsFormModal
                            isOpen={isPrintOrderItemsModalOpen}
                            onClose={() => setIsPrintOrderItemsModalOpen(false)}
                            order={order?.data as Order}
                            printers={printers.data as Printer[]}
                        />
                    )}
                </div>
            </section>
        </AuthenticatedLayout>
    );
}