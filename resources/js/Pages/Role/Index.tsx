import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import Dropdown from "@/Components/Dropdown";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Role } from "@/types/Role";
import { can } from "@/utils/authorization";
import { Head, Link, useForm } from "@inertiajs/react";
import { Edit, Eye, Trash, Plus, MoreVertical, Shield, Users, Key, Crown } from "lucide-react";
import { useState } from "react";
import { formatCustomDateTime } from "@/utils/date-format";

export default function Index({
    auth,
    roles,
}: PageProps<{ roles: { data: Role[] } }>) {
    const [confirmingRoleDeletion, setConfirmingRoleDeletion] = useState(false);
    const [roleIdToDelete, setRoleIdToDelete] = useState<number | null>(null);

    const { delete: destroy, processing, reset, clearErrors } = useForm();

    const confirmRoleDeletion = (id: number) => {
        setRoleIdToDelete(id);
        setConfirmingRoleDeletion(true);
    };

    const deleteUser = () => {
        destroy(route("role.destroy", { id: roleIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingRoleDeletion(false);
        setRoleIdToDelete(null);
        clearErrors();
        reset();
    };

    const roleToDelete = roles.data.find((role) => role.id === roleIdToDelete);

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Funções
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Gerencie funções e perfis de acesso do sistema
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Funções" />

            <div className="space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Lista de Funções */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 px-6 sm:px-8 py-6 border-b border-indigo-100 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                        <Crown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    Gerenciamento de Funções
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    {roles?.data?.length || 0} funções cadastradas
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        {roles?.data?.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                    <Crown className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Nenhuma função cadastrada
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Comece criando as primeiras funções do sistema.
                                </p>
                                {can("roles_create") && (
                                    <Link href={route("role.create")}>
                                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                                            <Plus className="w-4 h-4" />
                                            Criar Primeira Função
                                        </button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {roles.data.map((role) => (
                                    <div
                                        key={role.id}
                                        className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-600 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="p-6">
                                            {/* Header da Função */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                                            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2">
                                                                {role.display_name}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Código da Função */}
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                                    <Key className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Código:</span>
                                                    <code className="text-xs font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                                                        {role.name}
                                                    </code>
                                                </div>
                                            </div>

                                            {/* Permissões */}
                                            {role.permissions && role.permissions.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                                        <Users className="w-4 h-4 text-purple-500" />
                                                        <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Permissões:</span>
                                                        <span className="text-sm font-bold text-purple-800 dark:text-purple-200">
                                                            {role.permissions.length}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Data de criação */}
                                            <div className="pt-3 border-t border-gray-100 dark:border-gray-600">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                    Criada em {role.created_at ? formatCustomDateTime(role.created_at) : '—'}
                                                </div>
                                            </div>

                                            {/* Ações */}
                                            <div className="flex gap-2 justify-end pt-4 mt-4 border-t border-gray-100 dark:border-gray-600">
                                                {can('roles_view') && (
                                                    <Link href={route('role.show', { id: role.id })}>
                                                        <button className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 transition-all duration-200" title="Ver detalhes">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                )}
                                                {can('roles_edit') && (
                                                    <Link href={route('role.edit', { id: role.id })}>
                                                        <button className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-800 text-green-600 dark:text-green-400 transition-all duration-200" title="Editar função">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                )}
                                                {can('roles_delete') && (
                                                    <button
                                                        onClick={() => confirmRoleDeletion(role.id)}
                                                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition-all duration-200"
                                                        title="Excluir função"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            {can("roles_create") && (
                <Link href={route("role.create")}>
                    <button
                        aria-label="Nova função"
                        className="fixed bottom-6 right-6 z-50 group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-2xl h-14 w-14 transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                        <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                    </button>
                </Link>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {roleToDelete && (
                <Modal show={confirmingRoleDeletion} onClose={closeModal}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            deleteUser();
                        }}
                        className="p-8"
                    >
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                                <Trash className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Confirmar Exclusão
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Tem certeza que deseja deletar a função <span className="font-bold text-red-600">{roleToDelete.display_name}</span>?
                            </p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                ⚠️ Uma vez que a função é deletada, todos os seus recursos e dados serão permanentemente removidos.
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
                                {processing ? 'Deletando...' : 'Deletar Função'}
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
