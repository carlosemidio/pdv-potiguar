import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash, Plus, Package2, Layers3, ChevronLeft, ChevronRight, Puzzle } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { Addon } from '@/types/Addon';
import Pagination from '@/Components/Pagination/Pagination';
import AddonFormModal from '@/Components/AddonFormModal';
import SimpleSearchBar from '@/Components/SimpleSearchBar';

export default function Index({
    auth,
    addons,
    search
}: PageProps<{ addons: PaginatedData<Addon>, search?: string }>) {

    const [confirmingAddonDeletion, setConfirmingAddonDeletion] = useState(false);
    const [addonIdToDelete, setAddonIdToDelete] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [addonToEdit, setAddonToEdit] = useState<Addon | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const confirmAddonDeletion = (id: number) => {
        setAddonIdToDelete(id);
        setConfirmingAddonDeletion(true);
    };

    const deleteAddon = () => {
        destroy(route('addons.destroy', { id: addonIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingAddonDeletion(false);
        setAddonIdToDelete(null);
        clearErrors();
        reset();
    };

    const openModal = (addon: Addon | null) => {
        setAddonToEdit(addon);
        setIsOpen(true);
    };

    const addonToDelete = addons?.data?.find
        ? addons.data.find(addon => addon.id === addonIdToDelete)
        : null;

    const {
        meta: { links },
    } = addons;

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                            <Puzzle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Complementos
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Gerencie os complementos dos produtos
                            </p>
                        </div>
                    </div>
                    {can('addons_create') && (
                        <button
                            onClick={() => openModal(null)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Novo Complemento
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Complementos" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-6 max-w-7xl">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200 uppercase tracking-wide">Total de Complementos</p>
                                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                                        {addons.meta.total}
                                    </p>
                                </div>
                                <div className="p-3 bg-emerald-500 rounded-lg">
                                    <Puzzle className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200 uppercase tracking-wide">Com Ingredientes</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                                        {addons.data.filter(a => a.addon_ingredients && a.addon_ingredients.length > 0).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-500 rounded-lg">
                                    <Package2 className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-900 dark:text-purple-200 uppercase tracking-wide">Sem Ingredientes</p>
                                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                                        {addons.data.filter(a => !a.addon_ingredients || a.addon_ingredients.length === 0).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-500 rounded-lg">
                                    <Layers3 className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Addons Grid */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Puzzle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Lista de Complementos
                                    </h3>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {addons.meta.total} complementos cadastrados
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

                        <div className="p-6">
                            {addons?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {addons.data.map((addon) => (
                                        <div key={addon.id} className="group relative bg-gradient-to-br from-white via-purple-50 to-indigo-50 dark:from-gray-800 dark:via-purple-900/10 dark:to-indigo-900/10 rounded-2xl shadow-lg hover:shadow-2xl border border-purple-200 dark:border-purple-700/50 transition-all duration-300 hover:-translate-y-2 hover:rotate-1 overflow-hidden">
                                            {/* Decoração de fundo */}
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full transform translate-x-6 -translate-y-6"></div>
                                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full transform -translate-x-4 translate-y-4"></div>
                                            
                                            <div className="p-6 relative">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                            <span className="text-white font-bold text-lg">
                                                                {addon.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 truncate">
                                                                {addon.name}
                                                            </h4>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                                ID: #{addon.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Informações dos Ingredientes */}
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-800/20 rounded-xl border-l-4 border-purple-500">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                                                <Package2 className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-medium text-purple-700 dark:text-purple-300 block">Ingredientes</span>
                                                                <span className="text-sm font-bold text-purple-800 dark:text-purple-200">
                                                                    {addon.addon_ingredients && addon.addon_ingredients.length > 0 
                                                                        ? `${addon.addon_ingredients.length} ingrediente${addon.addon_ingredients.length > 1 ? 's' : ''}`
                                                                        : 'Sem ingredientes'
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Botões de Ação - Sempre Visíveis */}
                                                <div className="absolute top-3 right-3 flex gap-1 z-50">
                                                    {can('addons_view') && (
                                                        <Link
                                                            href={route('addons.show', { id: addon.id })}
                                                            className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95"
                                                            title="Ver detalhes"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    )}
                                                    {(can('addons_edit') && addon.user_id != null) && (
                                                        <button
                                                            onClick={() => openModal(addon)}
                                                            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95"
                                                            title="Editar complemento"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {(can('addons_delete') && addon.user_id != null && typeof addon.id === 'number') && (
                                                        <button
                                                            onClick={() => confirmAddonDeletion(addon.id!)}
                                                            className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95"
                                                            title="Excluir complemento"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Lista de Ingredientes */}
                                                {addon.addon_ingredients && addon.addon_ingredients.length > 0 && (
                                                    <div className="space-y-2">
                                                        <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                                                            <Layers3 className="w-3 h-3" />
                                                            Composição
                                                        </h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {addon.addon_ingredients.slice(0, 3).map((addonIngredient) => (
                                                                <span key={addonIngredient.id} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700">
                                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                                                                    {addonIngredient.ingredient?.name || '—'}
                                                                </span>
                                                            ))}
                                                            {addon.addon_ingredients.length > 3 && (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                                                    +{addon.addon_ingredients.length - 3} mais
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Data de criação */}
                                                <div className="pt-3 border-t border-gray-100 dark:border-gray-600">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Criado em {addon.created_at ? new Date(addon.created_at).toLocaleDateString('pt-BR', { 
                                                            day: '2-digit', 
                                                            month: '2-digit', 
                                                            year: 'numeric' 
                                                        }) : '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <Puzzle className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                Nenhum complemento encontrado
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                Comece adicionando seu primeiro complemento.
                                            </p>
                                        </div>
                                        {can('addons_create') && (
                                            <button
                                                onClick={() => openModal(null)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Adicionar Complemento
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {addons?.data?.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-center">
                                    <nav className="flex items-center gap-2">
                                        {links?.map((link, index) => {
                                            if (index === 0) {
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`p-2 rounded-lg border transition-colors ${
                                                            link.url 
                                                                ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' 
                                                                : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </Link>
                                                );
                                            }
                                            
                                            if (index === links.length - 1) {
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`p-2 rounded-lg border transition-colors ${
                                                            link.url 
                                                                ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' 
                                                                : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                );
                                            }
                                            
                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                                        link.active 
                                                            ? 'border-emerald-500 bg-emerald-500 text-white' 
                                                            : link.url 
                                                                ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' 
                                                                : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddonFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} addon={addonToEdit} />

            {can('addons_create') && (
                <button
                    aria-label="Novo complemento"
                    className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg h-14 w-14 transition-all duration-200 hover:shadow-xl"
                    onClick={() => openModal(null)}
                >
                    <Plus className="h-6 w-6" />
                </button>
            )}

            {addonToDelete && (
                <Modal show={confirmingAddonDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteAddon(); }} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar o complemento <span className="font-bold">{addonToDelete?.name}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Uma vez que o complemento é deletado, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar Complemento
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}
