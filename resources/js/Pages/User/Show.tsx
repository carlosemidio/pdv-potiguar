import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { User } from '@/types/User';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({
    user,
    auth
}: PageProps<{ user: User }>) {

    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const confirmUserDeletion = (uuid: string) => {
        setUserIdToDelete(uuid);
        setConfirmingUserDeletion(true);
    };

    const deleteUser = () => {
        destroy(route('user.destroy', { uuid: userIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setUserIdToDelete(null);
        clearErrors();
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Usários - { user.name }
                </h2>
            }
        >
            <Head title="Tenants" />

            <section className='py-8 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-8">
                    <div className="mb-4">
                        <Link href={route('user.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>
                    <div className='grid grid-cols-1 gap-3 mt-4'>
                        <Card key={user.uuid}>
                            
                            <p>{user.name}</p>
                            <div>
                                <p className='text-sm mb-2 mt-3'>Funções</p>
                                <div className='flex gap-2'>
                                    {user.roles?.map((role) => (
                                        <span key={role.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-50">
                                            {role.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className='flex gap-2 mt-2 justify-end'>
                                <DangerButton onClick={() => confirmUserDeletion(user.uuid)}>
                                    Deletar
                                </DangerButton>
                                <Link href={route('user.edit', { id: user.uuid })}>
                                    <SecondaryButton>
                                        Editar
                                    </SecondaryButton>
                                </Link>
                            </div>
                            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                                <form onSubmit={(e) => { e.preventDefault(); deleteUser(); }} className="p-6">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Tem certeza que deseja deletar o usuário {user.name}?
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Uma vez que o usuário é deletado, todos os seus recursos e
                                        dados serão permanentemente deletados.
                                    </p>

                                    <div className="mt-6 flex justify-end">
                                        <SecondaryButton onClick={closeModal}>
                                            Cancelar
                                        </SecondaryButton>

                                        <DangerButton className="ms-3" disabled={processing}>
                                            Deletar Usuário
                                        </DangerButton>
                                    </div>
                                </form>
                            </Modal>
                        </Card>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}