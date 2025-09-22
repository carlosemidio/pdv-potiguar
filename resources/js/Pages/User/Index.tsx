import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { User } from '@/types/User';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Edit, LogIn, ShieldCheck, ShieldX, Plus } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import Pagination from '@/Components/Pagination/Pagination';
import UsersFilterBar from '@/Components/UsersFilterBar';

export default function Page({ auth }: PageProps) {
    const { users, userTypes, filters } = usePage<PageProps & {
        users: PaginatedData<User>;
        filters: { status?: string; field?: string; search?: string };
    }>().props;

    const {
        meta: { links }
    } = users;

    const { post } = useForm();

    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [userIdToChangeStatus, setUserIdToChangeStatus] = useState<string | null>(null);

    const {
        patch,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const changeUserStatus = (uuid: string) => {
        setUserIdToChangeStatus(uuid);
        setConfirmingUserDeletion(true);
    };

    const changeStatus = () => {
        patch(route('user.status', { uuid: userIdToChangeStatus }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setUserIdToChangeStatus(null);
        clearErrors();
        reset();
    };

    const userToChangeStatus = users.data.find(user => user.uuid === userIdToChangeStatus);

    const loginAsUser = (uuid: string) => {
        post(route('user.loginAs', { uuid }))
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Usuários
                </h2>
            }
        >
            <Head title="Usuários" />

            <section className='text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-2">
                    <div className="mb-3 mt-3">
                        <UsersFilterBar filters={{ ...filters }} />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3'>
                        {
                            users?.data?.map((user) => (
                                <Card key={user.uuid} className='relative flex flex-col justify-between p-3 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'>
                                    <p className='font-semibold text-base truncate'>{user.name}</p>
                                    <p className='text-sm text-gray-700 dark:text-gray-300 truncate'>{user.email}</p>
                                    <div className='flex justify-end absolute top-2 right-2'>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                            {user.status ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <div className='mt-1'>
                                        <p className='text-sm mb-1 text-gray-600 dark:text-gray-400'>Funções</p>
                                        <div className='flex gap-1.5 flex-wrap'>
                                            {user.roles?.map((role) => (
                                                <span key={role.id} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">
                                                    {role.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='flex gap-1.5 mt-2 justify-end'>
                                        {can('users_edit') && (
                                            <>
                                                <SecondaryButton size='sm' title='Entrar como usuário' onClick={() => loginAsUser(user.uuid)}>
                                                    <LogIn className='w-4 h-4' />
                                                </SecondaryButton>

                                                {user.status ? (
                                                    <DangerButton size='sm' title='Desabilitar usuário' onClick={() => changeUserStatus(user.uuid)}>
                                                        { <ShieldX className='w-4 h-4' /> }
                                                    </DangerButton>
                                                ): (
                                                    <PrimaryButton size='sm' title='Habilitar usuário' onClick={() => changeUserStatus(user.uuid)} >
                                                        <ShieldCheck className='w-4 h-4' />
                                                    </PrimaryButton> 
                                                )}

                                                <Link href={route('user.edit',  { uuid: user?.uuid })}>
                                                    <SecondaryButton size='sm' title='Editar usuário'>
                                                        <Edit className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </Card>
                            ))
                        }
                    </div>

                    <Pagination links={links} />
                </div>
            </section>

            {can('users_create') && (
                <Link href={route('user.create')}>
                    <button
                        aria-label="Novo usuário"
                        className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                    >
                        <Plus className='w-6 h-6' />
                    </button>
                </Link>
            )}

            {userToChangeStatus && (
                <Modal show={confirmingUserDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); changeStatus(); }} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja {userToChangeStatus.status ? 'desabilitar' : 'habilitar'} {userToChangeStatus.name}?
                        </h2>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            {userToChangeStatus.status ?
                                <DangerButton className="ms-3" disabled={processing}>
                                    Desabilitar
                                </DangerButton> :
                                <PrimaryButton className="ms-3" disabled={processing}>
                                    Habilitar
                                </PrimaryButton>
                            }
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}