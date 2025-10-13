import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, MoreVertical, Printer as PrinterIcon, Wifi, WifiOff, AlertTriangle, CheckCircle, Store, Hash, Cable, Clock, Zap, Settings } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import Pagination from '@/Components/Pagination/Pagination';
import { Printer } from '@/types/Printer';
import PrinterFormModal from '@/Components/PrinterFormModal';

export default function Index({
    auth,
    printers,
}: PageProps<{ printers: PaginatedData<Printer> }>) {
    const [confirmingPrinterDeletion, setConfirmingPrinterDeletion] = useState(false);
    const [printerIdToDelete, setPrinterIdToDelete] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [printerToEdit, setPrinterToEdit] = useState<Printer | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const confirmPrinterDeletion = (id: number) => {
        setPrinterIdToDelete(id);
        setConfirmingPrinterDeletion(true);
    };

    const deletePrinter = () => {
        destroy(route('printers.destroy', { id: printerIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingPrinterDeletion(false);
        setPrinterIdToDelete(null);
        clearErrors();
        reset();
    };

    const handleOpenModalForCreate = () => {
        setPrinterToEdit(null);
        setIsOpen(true);
    }

    const handleOpenModalForEdit = (printer: Printer) => {
        setPrinterToEdit(printer);
        setIsOpen(true);
    };

    const printerToDelete = printers?.data?.find
        ? printers.data.find(printer => printer.id === printerIdToDelete)
        : null;

    const {
        meta: { links },
    } = printers;

    const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
        online: {
            color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
            icon: <CheckCircle className="w-3 h-3" />,
            label: 'Online'
        },
        offline: {
            color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700',
            icon: <WifiOff className="w-3 h-3" />,
            label: 'Offline'
        },
        error: {
            color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
            icon: <AlertTriangle className="w-3 h-3" />,
            label: 'Erro'
        },
    };

    const connectionTypeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
        usb: { icon: <Cable className="w-4 h-4" />, color: 'text-blue-600 dark:text-blue-400' },
        wifi: { icon: <Wifi className="w-4 h-4" />, color: 'text-green-600 dark:text-green-400' },
        ethernet: { icon: <Zap className="w-4 h-4" />, color: 'text-purple-600 dark:text-purple-400' },
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <PrinterIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Impressoras
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Gerencie dispositivos de impressão do sistema
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Impressoras" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Grid de Impressoras */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {printers?.data?.map((printer) => {
                            const status = statusConfig[printer.status] || statusConfig.offline;
                            const connectionType = connectionTypeConfig[printer.type?.toLowerCase()] || connectionTypeConfig.usb;
                            
                            return (
                                <div key={printer.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden">
                                    {/* Header do Card */}
                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                    <PrinterIcon className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                        {printer.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
                                                            {status.icon}
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Menu de Ações */}
                                            {(can('printers_edit') || can('printers_delete')) && printer.user_id != null && (
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                                                            <MoreVertical className='w-4 h-4' />
                                                        </button>
                                                    </Dropdown.Trigger>
                                                    <Dropdown.Content align='right' width='48'>
                                                        {can('printers_edit') && printer.user_id != null && (
                                                            <button
                                                                type='button'
                                                                onClick={() => handleOpenModalForEdit(printer)}
                                                                className='block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 focus:outline-none'
                                                            >
                                                                <span className='inline-flex items-center gap-2'>
                                                                    <Edit className='w-4 h-4' /> Editar
                                                                </span>
                                                            </button>
                                                        )}
                                                        {can('printers_delete') && printer.user_id != null && (
                                                            <button
                                                                type='button'
                                                                onClick={() => confirmPrinterDeletion(printer.id)}
                                                                className='block w-full px-4 py-2 text-start text-sm leading-5 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 focus:outline-none'
                                                            >
                                                                <span className='inline-flex items-center gap-2'>
                                                                    <Trash className='w-4 h-4' /> Excluir
                                                                </span>
                                                            </button>
                                                        )}
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            )}
                                        </div>
                                    </div>

                                    {/* Corpo do Card */}
                                    <div className="p-6 space-y-4">
                                        {/* Informações da Loja */}
                                        {printer?.store?.name && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Store className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                <span className="text-gray-700 dark:text-gray-300">{printer.store.name}</span>
                                            </div>
                                        )}

                                        {/* Tipo de Conexão */}
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className={connectionType.color}>
                                                {connectionType.icon}
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300 capitalize">
                                                {printer.type}
                                            </span>
                                        </div>

                                        {/* Informações Técnicas */}
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-1 gap-2 text-xs">
                                                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <span className="text-gray-600 dark:text-gray-400">Fornecedor:</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{printer.vendor_id}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <span className="text-gray-600 dark:text-gray-400">Produto:</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{printer.product_id}</span>
                                                </div>
                                                {printer.product_name && (
                                                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <span className="text-gray-600 dark:text-gray-400">Dispositivo:</span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100 truncate ml-2">{printer.product_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer com timestamp */}
                                    <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                Atualizado em {new Date(printer.updated_at).toLocaleDateString('pt-BR', { 
                                                    day: '2-digit', 
                                                    month: '2-digit', 
                                                    year: 'numeric', 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Estado vazio */}
                    {printers?.data?.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PrinterIcon className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                Nenhuma impressora cadastrada
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Adicione sua primeira impressora para começar a imprimir recibos e pedidos.
                            </p>
                            {can('printers_create') && (
                                <button
                                    onClick={handleOpenModalForCreate}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-4 h-4" />
                                    Nova Impressora
                                </button>
                            )}
                        </div>
                    )}

                    {/* Paginação */}
                    {printers?.data?.length > 0 && (
                        <div className="mt-8">
                            <Pagination links={links} />
                        </div>
                    )}

                    {/* Modal de Formulário */}
                    <PrinterFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} printer={printerToEdit} />

                    {/* Botão Flutuante */}
                    {can('printers_create') && printers?.data?.length > 0 && (
                        <button
                            aria-label="Nova impressora"
                            className="fixed bottom-20 right-6 z-40 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl h-14 w-14 transition-all duration-200 hover:scale-110"
                            onClick={handleOpenModalForCreate}
                        >
                            <Plus className='w-6 h-6' />
                        </button>
                    )}
                </div>
            </div>

            {printerToDelete && (
                <Modal show={confirmingPrinterDeletion} onClose={closeModal}>
                    <div className="p-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Excluir Impressora
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Tem certeza que deseja deletar a impressora <span className="font-semibold text-gray-900 dark:text-gray-100">"{printerToDelete.name}"</span>?
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Esta ação não pode ser desfeita. Todos os dados relacionados a esta impressora serão permanentemente removidos.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors duration-200 order-2 sm:order-1"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                onClick={deletePrinter}
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed order-1 sm:order-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Excluindo...
                                    </>
                                ) : (
                                    <>
                                        <Trash className="w-4 h-4" />
                                        Excluir Impressora
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}