import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Permission } from '@/types/Permission';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import Pagination from '@/Components/Pagination/Pagination';

export default function Index({
    auth,
    permissions,
}: PageProps<{ permissions: PaginatedData<Permission> }>) {

    const [confirmingPermissionDeletion, setConfirmingPermissionDeletion] = useState(false);
    const [permissionIdToDelete, setPermissionIdToDelete] = useState<number | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const confirmPermissionDeletion = (id: number) => {
        setPermissionIdToDelete(id);
        setConfirmingPermissionDeletion(true);
    };

    const deletePermission = () => {
        destroy(route('permission.destroy', { id: permissionIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingPermissionDeletion(false);
        setPermissionIdToDelete(null);
        clearErrors();
        reset();
    };

    const permissionToDelete = permissions.data.find(permission => permission.id === permissionIdToDelete);

    const {
        meta: { links },
    } = permissions;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Permissões
                </h2>
            }
        >
            <Head title="Permissões" />

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-2">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3'>
                        {permissions.data.map((permission) => (
                            <Card key={permission.id} className='p-3 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'>
                                <p className='font-semibold text-base truncate'>{permission.display_name}</p>
                                <div className='mt-1 text-sm text-gray-700 dark:text-gray-300'>
                                    <span className='text-gray-600 dark:text-gray-400'>Código: </span>
                                    <span className='bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs'>
                                        {permission.name}
                                    </span>
                                </div>

                                <div className='flex gap-1.5 mt-2 justify-end'>
                                    {can('permission_delete') && (
                                        <DangerButton size='sm' onClick={() => confirmPermissionDeletion(permission.id)} title='Excluir permissão'>
                                            <Trash className='w-4 h-4' />
                                        </DangerButton>
                                    )}
                                    {can('permission_edit') && (
                                        <Link href={route('permission.edit', { id: permission.id })}>
                                            <SecondaryButton size='sm' title='Editar permissão'>
                                                <Edit className='w-4 h-4' />
                                            </SecondaryButton>
                                        </Link>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Pagination links={links} />

                    {permissions.data.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhuma permissão encontrada.
                        </div>
                    )}

                    {can('permission_create') && (
                        <Link href={route('permission.create')}>
                            <button
                                aria-label="Nova permissão"
                                className="fixed bottom-14 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                            >
                                <Plus className='w-6 h-6' />
                            </button>
                        </Link>
                    )}
                </div>
            </section>

            {permissionToDelete && (
                <Modal show={confirmingPermissionDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deletePermission(); }} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar a permissão {permissionToDelete.display_name}?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Uma vez que a permissão é deletada, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar permissão
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}