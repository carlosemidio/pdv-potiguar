import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import Pagination from '@/Components/Pagination/Pagination';
import { Table } from '@/types/Table';

export default function Index({
    auth,
    tables,
}: PageProps<{ tables: PaginatedData<Table> }>) {
    const [confirmingTableDeletion, setConfirmingTableDeletion] = useState(false);
    const [tableIdToDelete, setTableIdToDelete] = useState<number | null>(null);

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
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Mesas
                </h2>
            }
        >
            <Head title="Mesas" />

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-2">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3'>
                        {tables?.data?.map((table) => (
                            <Card key={table.id} className="relative p-3 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                <p className='font-semibold text-base truncate'>{table.name}</p>
                                <div className='flex justify-end absolute top-2 right-2'>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${disponibilityColors[table.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}>
                                        {table.status_name}
                                    </span>
                                </div>

                                <div className='mt-1 text-sm text-gray-700 dark:text-gray-300'>
                                    <span className='text-gray-600 dark:text-gray-400'>Loja: </span>
                                    {table?.store?.name || <span className="italic text-gray-400">Sem loja</span>}
                                </div>

                                <div className='mt-1 grid grid-cols-2 gap-2'>
                                    <div>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>Criado em</p>
                                        <span className='text-xs'>
                                            {new Date(table.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>Atualizado em</p>
                                        <span className='text-xs'>
                                            {new Date(table.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex gap-1.5 mt-2 justify-end'>
                                    {(can('tables_delete') && (table.user_id != null)) && (
                                        <DangerButton size='sm' onClick={() => confirmTableDeletion(table.id)} title="Deletar mesa">
                                            <Trash className='w-4 h-4' />
                                        </DangerButton>
                                    )}
                                    {(can('tables_edit') && (table.user_id != null)) && (
                                        <Link href={route('tables.edit', { id: table.id })}>
                                            <SecondaryButton size='sm' title="Editar mesa">
                                                <Edit className='w-4 h-4' />
                                            </SecondaryButton>
                                        </Link>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Pagination links={links} />

                    {tables?.data?.length === 0 && (
                        <div className="text-center py-2 text-gray-500 dark:text-gray-400">
                            Nenhuma mesa cadastrada.
                        </div>
                    )}

                    {can('tables_create') && (
                        <Link href={route('tables.create')}>
                            <button
                                aria-label="Nova mesa"
                                className="fixed bottom-14 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                            >
                                <Plus className='w-6 h-6' />
                            </button>
                        </Link>
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