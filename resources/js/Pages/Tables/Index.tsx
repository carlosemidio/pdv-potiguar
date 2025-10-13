import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import Pagination from '@/Components/Pagination/Pagination';
import { Table } from '@/types/Table';
import TableFormModal from '@/Components/TableFormModal';

export default function Index({
    auth,
    tables,
}: PageProps<{ tables: PaginatedData<Table> }>) {
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
        available: 'bg-green-500 text-white',
        occupied: 'bg-red-500 text-white',
        reserved: 'bg-yellow-500 text-white',
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Mesas
                </h2>
            }
        >
            <Head title="Mesas" />

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="max-w-5xl">
                    <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                        {tables?.data?.map((table) => (
                            <li key={table.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
                                <div className="flex items-center justify-between gap-2 relative p-2">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className='min-w-0 flex-1'>
                                            <div className="flex items-center gap-2">
                                                <p className='font-semibold text-sm truncate'>{table.name}</p>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${disponibilityColors[table.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                                                    {table.status_name}
                                                </span>
                                            </div>
                                            <div className='mt-1 flex flex-wrap items-end gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                {table?.store?.name && (
                                                    <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px]'>
                                                        {table.store.name}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">
                                                    {new Date(table.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 absolute top-1 right-1'>
                                        {(can('tables_edit') || can('tables_delete')) && table.user_id != null && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <SecondaryButton size='sm' className='!px-2 !py-1' title='Ações'>
                                                        <MoreVertical className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align='right' width='48'>
                                                    {can('tables_edit') && table.user_id != null && (
                                                        <button
                                                            type='button'
                                                            onClick={() => handleOpenModalForEdit(table)}
                                                            className='block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 focus:outline-none'
                                                        >
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Edit className='w-4 h-4' /> Editar
                                                            </span>
                                                        </button>
                                                    )}
                                                    {can('tables_delete') && table.user_id != null && (
                                                        <button
                                                            type='button'
                                                            onClick={() => confirmTableDeletion(table.id)}
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
                            </li>
                        ))}
                    </ul>

                    <Pagination links={links} />

                    {tables?.data?.length === 0 && (
                        <div className="text-center py-2 text-gray-500 dark:text-gray-400">
                            Nenhuma mesa cadastrada.
                        </div>
                    )}

                    <TableFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} table={tableToEdit} />

                    {can('tables_create') && (
                        <button
                            aria-label="Nova mesa"
                            className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                            onClick={handleOpenModalForCreate}
                        >
                            <Plus className='w-6 h-6' />
                        </button>
                    )}
                </div>
            </section>

            {tableToDelete && (
                <Modal show={confirmingTableDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteTable(); }} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar a mesa <span className="font-bold">{tableToDelete.name}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Uma vez que a mesa é deletada, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar Mesa
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}