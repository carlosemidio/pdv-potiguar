import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Order } from '@/types/Order';
import { Printer } from '@/types/Printer';
import OrderItemFormModal from '@/Components/OrderItemFormModal';
import { useState } from 'react';
import { OrderItem } from '@/types/OrderItem';
import Swal from 'sweetalert2';
import { DollarSignIcon, PercentIcon } from 'lucide-react';
import OrderPaymentsForm from '@/Components/OrderPaymentsForm';
import { formatDateTime } from '@/utils/date-format';
import { MdLocalPrintshop, MdLocalShipping, MdOutlineFormatListNumbered, MdWhatsapp } from 'react-icons/md';
import OrderDiscountFormModal from '@/Components/OrderDiscountFormModal';
import PrintOrderFormModal from '@/Components/PrintOrderFormModal';
import PrintOrderItemsFormModal from '@/Components/PrintOrderItemsFormModal';
import OrderItemsList from '@/Components/OrderItemsList';
import PaymentsList from '@/Components/PaymentsList';

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
    const [isPrintOrderItemsModalOpen, setIsPrintOrderItemsModalOpen] = useState(false);

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
                        Pedido #{order?.data ? order.data.id : 'N/A'}
                    </h1>
                </div>
            }
        >
            <Head title={`Pedido #${order?.data?.id || 'N/A'}`} />

            <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-4 py-2 max-w-6xl">
                    {/* Customer and Table Information */}
                    {(order?.data.customer || order?.data.table) && (
                        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {order?.data.customer && (
                                    <div className="space-y-2">
                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente: </span>
                                        <span className="text-lg md:text-xl font-medium text-gray-900 dark:text-white">{order.data.customer.name}</span>
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

                    <div className="border-gray-200 dark:border-gray-700 flex justify-start items-center space-x-2 md:space-x-4 overflow-x-auto">
                        {order?.data.items.length ? (
                            <OrderItemsList items={order.data.items} />
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

                    {/* Floating Action Button for adding items */}
                    {order?.data.status === 'in_progress' && (
                        <button
                            aria-label="Adicionar item"
                            onClick={() => setIsModalOpen(true)}
                            className="fixed bottom-56 lg:bottom-32 right-6 z-50 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-14 w-14 md:h-16 md:w-16"
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

                    {order?.data.payments && order.data.payments.length > 0 && (
                        <PaymentsList payments={order.data.payments} formatDateTime={formatDateTime} />
                    )}
                </div>
            </section>

            <section className="fixed bottom-16 left-0 md:bottom-0 md:left-80 md:right-0 md:flex md:justify-start md:items-center bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40 p-4">
                {order?.data.status === 'pending' && (
                    <div className="border-t border-gray-200 dark:border-gray-700">
                        {order?.data.status === 'pending' && (
                            <div className="flex flex-wrap gap-2 md:gap-3">
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

                                {whatsappUrl && (
                                    <a 
                                        href={whatsappUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 md:gap-2 p-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                    >
                                        <MdWhatsapp className="w-6 h-6" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center p-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Subtotal: <span className="font-semibold text-gray-900 dark:text-white">{order?.data.amount}</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Desconto: <span className="font-semibold text-gray-900 dark:text-white">{order?.data.discount}</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total: <span className="font-semibold text-gray-900 dark:text-white">{order?.data.total_amount}</span>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
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
                            </>
                        )}

                        {(order?.data.status === 'in_progress') && (
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                <SecondaryButton onClick={handlePrintOrder} className="inline-flex items-center gap-2 px-4 py-2.5">
                                    <MdLocalPrintshop />
                                </SecondaryButton>

                                <SecondaryButton onClick={handlePrintOrderItems} className="inline-flex items-center gap-2 px-4 py-2.5">
                                    <MdOutlineFormatListNumbered />
                                </SecondaryButton>

                                {!order?.data?.items.some(i => i.status !== 'ready') && (
                                    <SecondaryButton onClick={handleShipOrder} className="inline-flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm">
                                        <MdLocalShipping className="w-4 h-4" />
                                    </SecondaryButton>
                                )}

                                <SecondaryButton onClick={() => setIsDiscountModalOpen(true)} className="inline-flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm">
                                    <PercentIcon className="w-4 h-4" />
                                </SecondaryButton>
                                <SecondaryButton onClick={() => setIsPaymentsModalOpen(true)} className="inline-flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm">
                                    <DollarSignIcon className="w-4 h-4" />
                                </SecondaryButton>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}