import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Permission } from '@/types/Permission';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
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

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-8">

                    <div className='flex justify-end'>
                        {can('permission_create') && (
                            <Link href={route('permission.create')}>
                                <PrimaryButton>
                                    Nova Permissão
                                </PrimaryButton>
                            </Link>
                        )}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4'>
                        {
                            permissions.data.map((permission) => (
                                <Card key={permission.id}>
                                    <p className='font-semibold'>{permission.display_name}</p>
                                    <div className='mt-4'>
                                        <p className='text-sm mb-1'>Código</p>
                                        <span className="bg-gray-100 rounded-lg p-1 text-sm dark:bg-gray-700">
                                            {permission.name}
                                        </span>
                                    </div>
                                    <div className='flex  gap-2 mt-2 justify-end'>
                                        {can('permission_delete') && (
                                            <DangerButton onClick={() => confirmPermissionDeletion(permission.id)}>
                                                <Trash className='w-5 h-5' />
                                            </DangerButton>
                                        )}
                                        {can('permission_edit') && (
                                            <Link href={route('permission.edit', { id: permission.id })}>
                                                <SecondaryButton>
                                                    <Edit className='w-5 h-5' />
                                                </SecondaryButton>
                                            </Link>
                                        )}
                                        {/* {can('permission_view') && (
                                            <Link href={route('permission.show', { id: permission.id })}>
                                                <PrimaryButton>
                                                    Detalhes
                                                </PrimaryButton>
                                            </Link>
                                        )} */}
                                    </div>
                                </Card>
                            ))
                        }

                        <Pagination links={links} />

                        {permissions.data.length === 0 && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                Nenhuma permissão encontrada.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {permissionToDelete && (
                <Modal show={confirmingPermissionDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deletePermission(); }} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar a função {permissionToDelete.display_name}?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Uma vez que a função é deletada, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar Função
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}