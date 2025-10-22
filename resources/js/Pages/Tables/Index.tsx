import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Edit, Trash, Plus, MoreVertical, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import Pagination from '@/Components/Pagination/Pagination';
import { Table } from '@/types/Table';
import TableFormModal from '@/Components/TableFormModal';
import SimpleSearchBar from '@/Components/SimpleSearchBar';

export default function Index({
    auth,
    tables,
    search
}: PageProps<{ tables: PaginatedData<Table>, search?: string }>) {
    const [confirmingTableDeletion, setConfirmingTableDeletion] = useState(false);
    const [tableIdToDelete, setTableIdToDelete] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [tableToEdit, setTableToEdit] = useState<Table | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const toggleTableStatus = (table: any) => {
        const newStatus = table.status === 'available' ? 'reserved' : 'available';
        
        router.patch(route('tables.update-status', table.id), {
            status: newStatus
        }, {
            preserveScroll: true,
            onError: (errors: any) => {
                console.error('❌ Erro ao alterar status:', errors);
            }
        });
    };

    const confirmTableDeletion = (id: number) => {
        setTableIdToDelete(id);
        setConfirmingTableDeletion(true);
    };

    const deleteTable = () => {
        destroy(route('tables.destroy', { id: tableIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingTableDeletion(false);
        setTableIdToDelete(null);
        clearErrors();
        reset();
    };

    const handleOpenModalForCreate = () => {
        setTableToEdit(null);
        setIsOpen(true);
    }

    const handleOpenModalForEdit = (table: Table) => {
        setTableToEdit(table);
        setIsOpen(true);
    };

    const tableToDelete = tables?.data?.find
        ? tables.data.find(table => table.id === tableIdToDelete)
        : null;

    const {
        meta: { links },
    } = tables;

    const disponibilityColors: Record<string, string> = {
        available: 'bg-green-500 border-green-600 text-white shadow-green-200',
        occupied: 'bg-red-500 border-red-600 text-white shadow-red-200',
        reserved: 'bg-yellow-500 border-yellow-600 text-white shadow-yellow-200',
    };

    const statusLabels: Record<string, string> = {
        available: 'Disponível',
        occupied: 'Ocupada',
        reserved: 'Reservada',
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Gestão de Mesas
                    </h1>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        {tables.data.length} {tables.data.length === 1 ? 'mesa' : 'mesas'}
                    </div>
                </div>
            }
        >
            <Head title="Mesas" />

            <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
                    {/* Status Legend */}
                    <div className="mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Status das Mesas
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Disponível</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Ocupada</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Reservada</span>
                                </div>
                            </div>
                        </div>

                        {/* Filter Section */}
                        <div className="mt-4">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Filtros de Busca
                                </h3>
                                <SimpleSearchBar field='display_name' search={search} />
                            </div>
                        </div>
                    </div>

                    {/* Tables Floor Plan */}
                    {tables.data.length > 0 ? (
                        <>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                                    Planta Baixa do Restaurante
                                </h3>
                                
                                {/* Interactive Floor Plan */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 min-h-[500px] relative border-2 border-dashed border-blue-200 dark:border-blue-700">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 place-items-center">
                                        {tables.data.map((table, index) => (
                                            <a key={index} href={table.order_id ? route('orders.show', table.order_id) : '#'}>
                                                <div key={table.id} className="relative group">
                                                    {/* Table Representation */}
                                                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 ${disponibilityColors[table.status] || 'bg-gray-100 border-gray-300 text-gray-800'} 
                                                        flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 
                                                        hover:scale-110 hover:shadow-xl group-hover:z-10 relative animate-pulse-slow`}
                                                        style={{ animationDelay: `${index * 0.1}s` }}
                                                    >
                                                        {/* Table Icon */}
                                                        <svg className="w-6 h-6 md:w-8 md:h-8 mb-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        
                                                        {/* Table Number */}
                                                        <span className="text-xs md:text-sm font-bold">
                                                            {table.name}
                                                        </span>
                                                    </div>

                                                    {/* Table Details Tooltip */}
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                                        <div className="bg-gray-900 dark:bg-gray-700 text-white p-3 rounded-lg shadow-xl min-w-max">
                                                            <div className="text-center">
                                                                <h4 className="font-semibold text-sm mb-1">{table.name}</h4>
                                                                <p className="text-xs text-gray-300">
                                                                    Status: {statusLabels[table.status] || table.status_name}
                                                                </p>
                                                                {table?.store?.name && (
                                                                    <p className="text-xs text-gray-300 mt-1">
                                                                        Loja: {table.store.name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {/* Tooltip Arrow */}
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons - Always Visible */}
                                                    {(can('tables_edit') || can('tables_delete')) && table.user_id != null && (
                                                        <div className="absolute -top-2 -right-2 flex gap-1 z-50">
                                                            {/* Status Toggle Button */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleTableStatus(table);
                                                                }}
                                                                disabled={table.status === 'occupied'}
                                                                className={`w-8 h-8 ${
                                                                    table.status === 'available' 
                                                                        ? 'bg-orange-600 hover:bg-orange-700' 
                                                                        : table.status === 'occupied'
                                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                                        : 'bg-green-600 hover:bg-green-700'
                                                                } text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95`}
                                                                title={
                                                                    table.status === 'occupied'
                                                                        ? 'Mesa ocupada - não pode alterar'
                                                                        : table.status === 'available'
                                                                        ? 'Reservar mesa'
                                                                        : 'Liberar reserva'
                                                                }
                                                            >
                                                                {table.status === 'available' ? (
                                                                    <Clock className="w-4 h-4" />
                                                                ) : table.status === 'occupied' ? (
                                                                    <MoreVertical className="w-4 h-4" />
                                                                ) : (
                                                                    <CheckCircle className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                            
                                                            {/* Edit Button */}
                                                            {can('tables_edit') && table.user_id != null && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleOpenModalForEdit(table);
                                                                    }}
                                                                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95"
                                                                    title="Editar mesa"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            
                                                            {/* Delete Button */}
                                                            {can('tables_delete') && table.user_id != null && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        confirmTableDeletion(table.id);
                                                                    }}
                                                                    className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95"
                                                                    title="Excluir mesa"
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </a>
                                        ))}
                                    </div>

                                    {/* Restaurant Layout Elements */}
                                    <div className="absolute top-4 left-4 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-3 h-3 bg-brown-400 rounded"></div>
                                            <span>Entrada</span>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute top-4 right-4 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-3 h-3 bg-blue-400 rounded"></div>
                                            <span>Cozinha</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center">
                                <Pagination links={links} />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Nenhuma mesa cadastrada
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Comece criando suas primeiras mesas para organizar o restaurante.
                            </p>
                            {can('tables_create') && (
                                <button
                                    onClick={handleOpenModalForCreate}
                                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-5 h-5" />
                                    Criar Primeira Mesa
                                </button>
                            )}
                        </div>
                    )}

                    {/* Table Form Modal */}
                    <TableFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} table={tableToEdit} />

                    {/* Floating Action Button */}
                    {can('tables_create') && tables.data.length > 0 && (
                        <button
                            aria-label="Nova mesa"
                            className="fixed bottom-16 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
                            onClick={handleOpenModalForCreate}
                        >
                            <Plus className="h-7 w-7 group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            {tableToDelete && (
                <Modal show={confirmingTableDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteTable(); }} className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Confirmar Exclusão da Mesa
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Esta ação não pode ser desfeita
                                </p>
                            </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                            <p className="text-red-800 dark:text-red-200 font-medium">
                                Tem certeza que deseja deletar a mesa "{tableToDelete.name}"?
                            </p>
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                Uma vez que a mesa é deletada, todos os seus dados, pedidos associados e histórico serão permanentemente removidos. Esta ação não pode ser desfeita.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Deletando...' : 'Confirmar Exclusão'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}