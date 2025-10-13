import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { User, Lock, Trash2, Settings } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    auth,
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Perfil do Usuário
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Gerencie suas informações pessoais, senha e configurações de conta
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Perfil" />

            <div className="space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Informações do Perfil */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 sm:px-8 py-6 border-b border-blue-100 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Informações Pessoais
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Atualize seus dados pessoais e endereço de email
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 sm:p-8">
                        <UpdateProfileInformationForm
                            user={auth.user}
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                        />
                    </div>
                </div>

                {/* Atualizar Senha */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 px-6 sm:px-8 py-6 border-b border-green-100 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                                <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Segurança da Conta
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Mantenha sua conta segura com uma senha forte
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 sm:p-8">
                        <UpdatePasswordForm className="max-w-2xl" />
                    </div>
                </div>

                {/* Excluir Conta */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 px-6 sm:px-8 py-6 border-b border-red-100 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-xl">
                                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Zona de Perigo
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Ações irreversíveis relacionadas à sua conta
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 sm:p-8">
                        <DeleteUserForm className="max-w-2xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
