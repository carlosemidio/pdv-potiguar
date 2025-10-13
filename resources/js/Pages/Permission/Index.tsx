import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Permission } from '@/types/Permission';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, Shield, Key, Lock } from 'lucide-react';
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
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Permissões
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Gerencie permissões e controle de acesso do sistema
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Permissões" />

            <div className="space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Lista de Permissões */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 px-6 sm:px-8 py-6 border-b border-purple-100 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    Controle de Permissões
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    {permissions?.data?.length || 0} permissões cadastradas
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        {permissions?.data?.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                    <Shield className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Nenhuma permissão encontrada
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Comece criando as primeiras permissões do sistema.
                                </p>
                                {can('permission_create') && (
                                    <Link href={route('permission.create')}>
                                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                                            <Plus className="w-4 h-4" />
                                            Criar Primeira Permissão
                                        </button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {permissions.data.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-600 transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className="p-6">
                                                {/* Header da Permissão */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                                                <Key className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                            </div>
                                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 line-clamp-2">
                                                                {permission.display_name}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Código da Permissão */}
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                                        <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Código:</span>
                                                        <code className="text-xs font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                                                            {permission.name}
                                                        </code>
                                                    </div>
                                                </div>

                                                {/* Ações */}
                                                <div className="flex gap-2 justify-end pt-3 border-t border-gray-100 dark:border-gray-600">
                                                    {can('permission_edit') && (
                                                        <Link href={route('permission.edit', { id: permission.id })}>
                                                            <button className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 transition-all duration-200" title="Editar permissão">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                    )}
                                                    {can('permission_delete') && (
                                                        <button
                                                            onClick={() => confirmPermissionDeletion(permission.id)}
                                                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition-all duration-200"
                                                            title="Excluir permissão"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Paginação */}
                                <div className="mt-8">
                                    <Pagination links={links} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            {can('permission_create') && (
                <Link href={route('permission.create')}>
                    <button
                        aria-label="Nova permissão"
                        className="fixed bottom-6 right-6 z-50 group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-2xl h-14 w-14 transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                        <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                    </button>
                </Link>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {permissionToDelete && (
                <Modal show={confirmingPermissionDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deletePermission(); }} className="p-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                                <Trash className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Confirmar Exclusão
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Tem certeza que deseja deletar a permissão <span className="font-bold text-red-600">{permissionToDelete.display_name}</span>?
                            </p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                ⚠️ Uma vez que a permissão é deletada, todos os seus recursos e dados serão permanentemente removidos.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <SecondaryButton onClick={closeModal} className="order-2 sm:order-1">
                                Cancelar
                            </SecondaryButton>

                            <DangerButton 
                                className="order-1 sm:order-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
                                disabled={processing}
                            >
                                {processing ? 'Deletando...' : 'Deletar Permissão'}
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}