import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { User } from '@/types/User';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Edit, LogIn, ShieldCheck, ShieldX } from 'lucide-react';
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

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto max-w-7xl lg:px-8">

                    <div className='flex justify-end'>
                        {can('users_create') && (
                            <Link href={route('user.create')}>
                                <PrimaryButton>
                                    Novo Usuário
                                </PrimaryButton>
                            </Link>
                        )}
                    </div>
                    
                    <div className="mb-6 mt-4">
                        <UsersFilterBar filters={{ ...filters }} />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4'>
                        {
                            users?.data?.map((user) => (
                                <Card key={user.uuid} className='relative min-h-40 flex flex-col justify-between'>
                                    <p className='font-semibold'>{user.name}</p>
                                    <p className='text-sm'>{user.email}</p>
                                    <div className='mt-4 flex justify-end absolute top-0 right-2'>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                            {user.status ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <div className='mt-4'>
                                        <p className='text-sm mb-1'>Funções</p>
                                        <div className='flex gap-1'>
                                            {user.roles?.map((role) => (
                                                <span key={role.id} className="bg-gray-100 rounded-lg p-1 text-sm dark:bg-gray-700">
                                                    {role.display_name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='flex gap-2 mt-2 justify-end'>
                                        {can('users_edit') && (
                                            <>
                                                <SecondaryButton>
                                                    <LogIn className='w-5 h-5' onClick={() => loginAsUser(user.uuid)} />
                                                </SecondaryButton>

                                                {user.status ? (
                                                    <DangerButton onClick={() => changeUserStatus(user.uuid)}>
                                                        { <ShieldX className='w-5 h-5' /> }
                                                    </DangerButton>
                                                ): (
                                                    <PrimaryButton onClick={() => changeUserStatus(user.uuid)} >
                                                        <ShieldCheck className='w-5 h-5' />
                                                    </PrimaryButton> 
                                                )}

                                                <Link href={route('user.edit',  { uuid: user?.uuid })}>
                                                    <SecondaryButton>
                                                        <Edit className='w-5 h-5' />
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

            {userToChangeStatus && (
                <Modal show={confirmingUserDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); changeStatus(); }} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja {userToChangeStatus.status ? 'desabilitar' : 'habiliar'} {userToChangeStatus.name}?
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