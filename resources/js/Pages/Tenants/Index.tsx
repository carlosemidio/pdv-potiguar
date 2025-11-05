import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Tenant } from '@/types/Tenant';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash, Plus, MoreVertical, Building, Globe, Calendar } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import SimpleSearchBar from '@/Components/SimpleSearchBar';

export default function Index({
    auth,
    tenants,
    search
}: PageProps<{ tenants: { data: Tenant[] }, search?: string }>) {
    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const [showModal, setShowModal] = useState(false);
    const [tenant, setTenant] = useState<Tenant | null>(null);

    const handleDeleteClick = (tenant: Tenant) => {
        setTenant(tenant);
        setShowModal(true);
    };

    const deleteTenant = () => {
        destroy(route('tenant.destroy', { id: tenant?.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                setTenant(null);
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setShowModal(false);
        clearErrors();
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                            Empresas
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Gerencie empresas e organizações do sistema
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Empresas" />

            <div className="space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Lista de Empresas */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 px-6 sm:px-8 py-6 border-b border-cyan-100 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                                        <Building className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    Gestão de Empresas
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    {tenants?.data?.length || 0} empresas cadastradas
                                </p>
                            </div>
                        </div>
                        {/* Filter Section */}
                        <div className="mt-4">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Filtros de Busca
                                </h3>
                                <SimpleSearchBar field='name' search={search} />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        {tenants?.data?.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                    <Building className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Nenhuma empresa cadastrada
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Comece criando a primeira empresa do sistema.
                                </p>
                                {can('tenants_create') && (
                                    <Link href={route('tenant.create')}>
                                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                                            <Plus className="w-4 h-4" />
                                            Criar Primeira Empresa
                                        </button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tenants.data.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-600 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="p-6">
                                            {/* Header da Empresa */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg">
                                                            <Building className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                                        </div>
                                                        <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200 line-clamp-2">
                                                            {item.name}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="mb-4">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                                                    item.status 
                                                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                                                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                                                }`}>
                                                    <div className={`w-2 h-2 rounded-full ${item.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    {item.status ? 'Ativa' : 'Inativa'}
                                                </span>
                                            </div>

                                            {/* Domínio */}
                                            {item.domain && (
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                                        <Globe className="w-4 h-4 text-blue-500" />
                                                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Domínio:</span>
                                                        <code className="text-xs font-mono bg-blue-100 dark:bg-blue-800/50 px-2 py-1 rounded text-blue-800 dark:text-blue-200">
                                                            {item.domain}
                                                        </code>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Data de atualização */}
                                            <div className="pt-3 border-t border-gray-100 dark:border-gray-600">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <Calendar className="w-3 h-3" />
                                                    Atualizada em {formatCustomDateTime(item.updated_at)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu de Ações */}
                                        {(can('tenants_view') || can('tenants_edit') || can('tenants_delete')) && (
                                            <div className="absolute top-4 right-4">
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <button className="p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                                                            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                                        </button>
                                                    </Dropdown.Trigger>
                                                    <Dropdown.Content align="right" width="48">
                                                        {can('tenants_edit') && (
                                                            <Dropdown.Link href={route('tenant.edit', { id: item.id })}>
                                                                <span className="inline-flex items-center gap-2">
                                                                    <Edit className="w-4 h-4" /> Editar
                                                                </span>
                                                            </Dropdown.Link>
                                                        )}
                                                        {can('tenants_delete') && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteClick(item)}
                                                                disabled={processing}
                                                                className="block w-full px-4 py-2 text-start text-sm leading-5 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 focus:outline-none disabled:opacity-50 transition-colors"
                                                            >
                                                                <span className="inline-flex items-center gap-2">
                                                                    <Trash className="w-4 h-4" /> Excluir
                                                                </span>
                                                            </button>
                                                        )}
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            {can('tenants_create') && (
                <Link href={route('tenant.create')}>
                    <button
                        aria-label="Nova empresa"
                        className="fixed bottom-6 right-6 z-50 group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-2xl h-14 w-14 transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                        <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                    </button>
                </Link>
            )}

            {/* Modal de Confirmação de Exclusão */}
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={(e) => { e.preventDefault(); deleteTenant(); }} className="p-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                            <Trash className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Confirmar Exclusão
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Tem certeza que deseja deletar a empresa <span className="font-bold text-red-600">{tenant?.name}</span>?
                        </p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            ⚠️ Uma vez que a empresa é deletada, todos os seus recursos e dados serão permanentemente removidos.
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
                            {processing ? 'Deletando...' : 'Deletar Empresa'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    )
}
