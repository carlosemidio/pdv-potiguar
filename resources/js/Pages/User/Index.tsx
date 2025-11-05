import Modal from '@/Components/Modal';
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
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Usuários
                    </h1>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {users.data.length} {users.data.length === 1 ? 'usuário' : 'usuários'}
                    </div>
                </div>
            }
        >
            <Head title="Usuários" />

            <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container px-4 py-6 md:py-8 max-w-7xl">
                    {/* Filter Section */}
                    <div className="mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Filtros de Busca
                            </h3>
                            <UsersFilterBar filters={{ ...filters }} />
                        </div>
                    </div>

                    {/* Users Grid */}
                    {users.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {users.data.map((user) => (
                                    <div key={user.uuid} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                        {/* User Avatar & Header */}
                                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 px-6 py-6 border-b border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                    <span className="text-white font-bold text-xl">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}>
                                                    {user.status ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                                    {user.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* User Content */}
                                        <div className="p-6">
                                            {/* User Roles */}
                                            <div className="mb-6">
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                    Permissões:
                                                </h4>
                                                {user.roles && user.roles.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {user.roles.map((role) => (
                                                            <span key={role.id} className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-lg text-xs font-medium">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                                {role.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Nenhuma permissão atribuída</span>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            {can('users_edit') && (
                                                <div className="space-y-2">
                                                    {/* Login As User */}
                                                    <button
                                                        type="button"
                                                        onClick={() => loginAsUser(user.uuid)}
                                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                    >
                                                        <span className="inline-flex items-center justify-center gap-2">
                                                            <LogIn className="w-4 h-4" />
                                                            Entrar como Usuário
                                                        </span>
                                                    </button>

                                                    {/* Edit & Status Actions */}
                                                    <div className="flex gap-2">
                                                        <Link 
                                                            href={route('user.edit', { uuid: user.uuid })}
                                                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center py-2.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                        >
                                                            <span className="inline-flex items-center justify-center gap-2">
                                                                <Edit className="w-4 h-4" />
                                                                Editar
                                                            </span>
                                                        </Link>
                                                        
                                                        {user.status ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => changeUserStatus(user.uuid)}
                                                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                            >
                                                                <span className="inline-flex items-center justify-center gap-2">
                                                                    <ShieldX className="w-4 h-4" />
                                                                    Desabilitar
                                                                </span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => changeUserStatus(user.uuid)}
                                                                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                            >
                                                                <span className="inline-flex items-center justify-center gap-2">
                                                                    <ShieldCheck className="w-4 h-4" />
                                                                    Habilitar
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
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
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Nenhum usuário encontrado
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Comece criando usuários para gerenciar o sistema.
                            </p>
                            {can('users_create') && (
                                <Link 
                                    href={route('user.create')}
                                    className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-5 h-5" />
                                    Criar Primeiro Usuário
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Floating Action Button */}
                    {can('users_create') && users.data.length > 0 && (
                        <Link href={route('user.create')}>
                            <button
                                aria-label="Novo usuário"
                                className="fixed bottom-16 right-6 z-50 w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
                            >
                                <Plus className="h-7 w-7 group-hover:scale-110 transition-transform" />
                            </button>
                        </Link>
                    )}
                </div>
            </section>

            {/* Status Change Confirmation Modal */}
            {userToChangeStatus && (
                <Modal show={confirmingUserDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); changeStatus(); }} className="p-6 bg-white dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${userToChangeStatus.status ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                                {userToChangeStatus.status ? (
                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {userToChangeStatus.status ? 'Desabilitar Usuário' : 'Habilitar Usuário'}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Esta ação mudará o status de acesso do usuário
                                </p>
                            </div>
                        </div>

                        <div className={`border rounded-xl p-4 mb-6 ${userToChangeStatus.status ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'}`}>
                            <p className={`font-medium ${userToChangeStatus.status ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                                Tem certeza que deseja {userToChangeStatus.status ? 'desabilitar' : 'habilitar'} "{userToChangeStatus.name}"?
                            </p>
                            <p className={`mt-2 text-sm ${userToChangeStatus.status ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                {userToChangeStatus.status 
                                    ? 'O usuário não conseguirá mais acessar o sistema até ser habilitado novamente.'
                                    : 'O usuário voltará a ter acesso ao sistema com suas permissões anteriores.'
                                }
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
                            
                            {userToChangeStatus.status ? (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Desabilitando...' : 'Desabilitar Usuário'}
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Habilitando...' : 'Habilitar Usuário'}
                                </button>
                            )}
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}