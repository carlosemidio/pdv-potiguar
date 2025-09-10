import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
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
        'available': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'occupied': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        'reserved': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    Mesas
                </h2>
            }
        >
            <Head title="Mesas" />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 min-h-screen'>
                <div className="mx-auto max-w-7xl lg:px-8">

                    <div className='flex justify-end mb-6'>
                        {can('tables_create') && (
                            <Link href={route('tables.create')}>
                                <PrimaryButton className="flex items-center gap-2 shadow-md hover:scale-105 transition-transform">
                                    <span className="font-semibold">+ Adicionar mesa</span>
                                </PrimaryButton>
                            </Link>
                        )}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            tables?.data?.map((table) => (
                                <Card key={table.id} className="p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className='font-bold text-lg'>{table.name}</p>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium
                                                ${
                                                    disponibilityColors[table.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                }
                                            `}
                                        >
                                            {table.status_name}
                                        </span>
                                    </div>
                                    <div className='mt-2'>
                                        <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Loja</p>
                                        <span className="block bg-gray-100 rounded-lg p-2 text-sm dark:bg-gray-800 dark:text-gray-200 min-h-[40px]">
                                            {table?.store?.name || <span className="italic text-gray-400">Sem loja</span>}
                                        </span>
                                    </div>
                                    <div className='mt-2 grid grid-cols-2 gap-2'>
                                        <div>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>Criado em</p>
                                            <span className='text-xs'>
                                                {new Date(table.created_at).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>Atualizado em</p>
                                            <span className='text-xs'>
                                                {new Date(table.updated_at).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='flex gap-2 mt-4 justify-end'>
                                        {(can('tables_delete') && (table.user_id != null)) && (
                                            <DangerButton
                                                onClick={() => confirmTableDeletion(table.id)}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                title="Deletar mesa"
                                            >
                                                <Trash className='w-5 h-5' />
                                            </DangerButton>
                                        )}
                                        {(can('tables_edit') && (table.user_id != null)) && (
                                            <Link href={route('tables.edit', { id: table.id })}>
                                                <SecondaryButton
                                                    className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                    title="Editar mesa"
                                                >
                                                    <Edit className='w-5 h-5' />
                                                </SecondaryButton>
                                            </Link>
                                        )}
                                    </div>
                                </Card>
                            ))
                        }                    
                    </div>
                    
                    <Pagination links={links} />
                    
                    {tables?.data?.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhuma mesa cadastrada.
                        </div>
                    )}
                </div>
            </section>

            {tableToDelete && (
                <Modal show={confirmingTableDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteTable(); }} className="p-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Tem certeza que deseja deletar a mesa <span className="font-bold">{tableToDelete.name}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 mb-6">
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