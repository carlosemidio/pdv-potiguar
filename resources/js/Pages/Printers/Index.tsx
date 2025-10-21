import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, Printer as PrinterIcon, Wifi, WifiOff, AlertTriangle, CheckCircle, Store, Hash, Cable, Clock, Zap, Settings } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import Pagination from '@/Components/Pagination/Pagination';
import { Printer } from '@/types/Printer';
import PrinterFormModal from '@/Components/PrinterFormModal';
import SimpleSearchBar from '@/Components/SimpleSearchBar';

export default function Index({
    auth,
    printers,
    search
}: PageProps<{ printers: PaginatedData<Printer>, search?: string }>) {
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
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                            <PrinterIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Impressoras
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Gerencie dispositivos de impressão do sistema
                            </p>
                        </div>
                    </div>
                    {can('printers_create') && (
                        <button
                            onClick={handleOpenModalForCreate}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Nova Impressora
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Impressoras" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-6 max-w-7xl">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-900 dark:text-green-200 uppercase tracking-wide">Online</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                                        {printers.data.filter(p => p.status === 'online').length}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-500 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-900 dark:text-red-200 uppercase tracking-wide">Offline</p>
                                    <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
                                        {printers.data.filter(p => p.status === 'offline').length}
                                    </p>
                                </div>
                                <div className="p-3 bg-red-500 rounded-lg">
                                    <WifiOff className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200 uppercase tracking-wide">Com Erro</p>
                                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1">
                                        {printers.data.filter(p => p.status === 'error').length}
                                    </p>
                                </div>
                                <div className="p-3 bg-amber-500 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200 uppercase tracking-wide">Total</p>
                                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                                        {printers.data.length}
                                    </p>
                                </div>
                                <div className="p-3 bg-indigo-500 rounded-lg">
                                    <PrinterIcon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Impressoras Grid */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <PrinterIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Lista de Impressoras
                                    </h3>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {printers.data.length} impressoras cadastradas
                                </div>
                            </div>

                            {/* Filter Section */}
                            <div className="mt-4">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Filtros de Busca
                                    </h3>
                                    <SimpleSearchBar field='name' search={search} />
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {printers?.data?.length > 0 ? (
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                    {printers?.data?.map((printer) => {
                                        const status = statusConfig[printer.status] || statusConfig.offline;
                                        const connectionType = connectionTypeConfig[printer.type?.toLowerCase()] || connectionTypeConfig.usb;
                                        
                                        return (
                                            <div key={printer.id} className="group relative bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-indigo-900/10 dark:to-purple-900/10 rounded-2xl shadow-lg hover:shadow-2xl border border-indigo-200 dark:border-indigo-700/50 transition-all duration-300 hover:-translate-y-2 hover:rotate-1 overflow-hidden">
                                                {/* Decoração de fundo */}
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full transform translate-x-6 -translate-y-6"></div>
                                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-400/10 to-indigo-400/10 rounded-full transform -translate-x-4 translate-y-4"></div>
                                                
                                                {/* Header do Card */}
                                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-indigo-200 dark:border-indigo-700 relative">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                                                <PrinterIcon className="w-6 h-6 text-white" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 truncate">
                                                                    {printer.name}
                                                                </h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
                                                                        {status.icon}
                                                                        {status.label}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                                                                    ID: #{printer.id}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Botões de Ação - Sempre Visíveis */}
                                                <div className="absolute top-3 right-3 flex gap-1 z-50">
                                                    {can('printers_edit') && printer.user_id != null && (
                                                        <button
                                                            onClick={() => handleOpenModalForEdit(printer)}
                                                            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95"
                                                            title="Editar impressora"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {can('printers_delete') && printer.user_id != null && (
                                                        <button
                                                            onClick={() => confirmPrinterDeletion(printer.id)}
                                                            className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95"
                                                            title="Excluir impressora"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Corpo do Card */}
                                                <div className="p-6 space-y-4 relative">
                                                    {/* Informações da Loja */}
                                                    {printer?.store?.name && (
                                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-xl border-l-4 border-blue-500">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                                                    <Store className="w-4 h-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300 block">Loja</span>
                                                                    <span className="text-sm font-bold text-blue-800 dark:text-blue-200">{printer.store.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Tipo de Conexão */}
                                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-800/20 rounded-xl border-l-4 border-purple-500">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                                                <span className={connectionType.color}>
                                                                    {connectionType.icon}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-medium text-purple-700 dark:text-purple-300 block">Conexão</span>
                                                                <span className="text-sm font-bold text-purple-800 dark:text-purple-200 capitalize">
                                                                    {printer.type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Caminho do Dispositivo */}
                                                    {printer.device_path && (
                                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 rounded-xl border-l-4 border-green-500">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                                                    <Settings className="w-4 h-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-medium text-green-700 dark:text-green-300 block">Caminho</span>
                                                                    <span className="text-sm font-bold text-green-800 dark:text-green-200 font-mono">{printer.device_path}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Informações Técnicas */}
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-1 gap-2 text-xs">
                                                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl border-l-4 border-gray-400">
                                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Fornecedor:</span>
                                                                <span className="font-bold text-gray-900 dark:text-gray-100">{printer.vendor_id}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl border-l-4 border-gray-400">
                                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Produto:</span>
                                                                <span className="font-bold text-gray-900 dark:text-gray-100">{printer.product_id}</span>
                                                            </div>
                                                            {printer.product_name && (
                                                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl border-l-4 border-gray-400">
                                                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Dispositivo:</span>
                                                                    <span className="font-bold text-gray-900 dark:text-gray-100 truncate ml-2">{printer.product_name}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Footer com timestamp */}
                                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                Última atualização
                                                            </span>
                                                            <span className="font-medium">
                                                                {new Date(printer.updated_at).toLocaleDateString('pt-BR', {
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
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <PrinterIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                        Nenhuma impressora cadastrada
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                        Adicione sua primeira impressora para começar a imprimir recibos e pedidos de forma eficiente.
                                    </p>
                                    {can('printers_create') && (
                                        <button
                                            onClick={handleOpenModalForCreate}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Nova Impressora
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

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