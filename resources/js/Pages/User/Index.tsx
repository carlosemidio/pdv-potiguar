import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { User } from '@/types/User';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Edit, LogIn, ShieldCheck, ShieldX, Plus, MoreVertical } from 'lucide-react';
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

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="max-w-5xl">
                    <div className="mb-3 w-full max-w-2xl">
                        <UsersFilterBar filters={{ ...filters }} />
                    </div>

                    <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mb-6'>
                        {users?.data?.map((user) => (
                            <li key={user.uuid} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
                                <div className="flex items-center justify-between gap-2 relative p-2">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className='min-w-0 flex-1'>
                                            <div className="flex items-center gap-2">
                                                <p className='font-semibold text-sm truncate'>{user.name}</p>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${user.status ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}>
                                                    {user.status ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </div>
                                            <div className='mt-1 text-[11px] text-gray-600 dark:text-gray-400 truncate'>
                                                {user.email}
                                            </div>
                                            <div className='mt-1 flex flex-wrap gap-1.5'>
                                                {user.roles?.map((role) => (
                                                    <span key={role.id} className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px]'>
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 absolute top-1 right-1'>
                                        {can('users_edit') && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <SecondaryButton size='sm' className='!px-2 !py-1' title='Ações'>
                                                        <MoreVertical className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align='right' width='48'>
                                                    <button
                                                        type='button'
                                                        onClick={() => loginAsUser(user.uuid)}
                                                        className='block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 focus:outline-none'
                                                    >
                                                        <span className='inline-flex items-center gap-2'>
                                                            <LogIn className='w-4 h-4' /> Entrar como usuário
                                                        </span>
                                                    </button>
                                                    <Dropdown.Link href={route('user.edit', { uuid: user.uuid })}>
                                                        <span className='inline-flex items-center gap-2'>
                                                            <Edit className='w-4 h-4' /> Editar
                                                        </span>
                                                    </Dropdown.Link>
                                                    {user.status ? (
                                                        <button
                                                            type='button'
                                                            onClick={() => changeUserStatus(user.uuid)}
                                                            className='block w-full px-4 py-2 text-start text-sm leading-5 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 focus:outline-none'
                                                        >
                                                            <span className='inline-flex items-center gap-2'>
                                                                <ShieldX className='w-4 h-4' /> Desabilitar
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type='button'
                                                            onClick={() => changeUserStatus(user.uuid)}
                                                            className='block w-full px-4 py-2 text-start text-sm leading-5 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 focus:outline-none'
                                                        >
                                                            <span className='inline-flex items-center gap-2'>
                                                                <ShieldCheck className='w-4 h-4' /> Habilitar
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