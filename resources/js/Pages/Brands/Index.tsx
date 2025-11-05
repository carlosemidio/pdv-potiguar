import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, Award, CheckCircle, XCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { Brand } from '@/types/Brand';
import BrandFormModal from '@/Components/BrandFormModal';
import SimpleSearchBar from '@/Components/SimpleSearchBar';
import Pagination from '@/Components/Pagination/Pagination';

export default function Index({
    auth,
    brands,
    search,
    trashed,
}: PageProps<{ brands: PaginatedData<Brand>, search?: string, trashed?: boolean }>) {

    const [confirmingBrandDeletion, setConfirmingBrandDeletion] = useState(false);
    const [brandIdToDelete, setBrandIdToDelete] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const confirmBrandDeletion = (id: number) => {
        setBrandIdToDelete(id);
        setConfirmingBrandDeletion(true);
    };

    const deleteBrand = () => {
        destroy(route('brands.destroy', { id: brandIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingBrandDeletion(false);
        setBrandIdToDelete(null);
        clearErrors();
        reset();
    };

    const openModal = (brand: Brand | null) => {
        setBrandToEdit(brand);
        setIsOpen(true);
    };

    const brandToDelete = brands?.data?.find
        ? brands.data.find(brand => brand.id === brandIdToDelete)
        : null;

    const {
        meta: { links },
    } = brands;

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Marcas
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Gerencie as marcas dos produtos
                            </p>
                        </div>
                    </div>
                    {can('brands_create') && (
                        <button
                            onClick={() => openModal(null)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Nova Marca
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Marcas" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container px-4 py-6 max-w-7xl">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-900 dark:text-orange-200 uppercase tracking-wide">Total de Marcas</p>
                                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
                                        {brands.meta.total}
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-500 rounded-lg">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-900 dark:text-green-200 uppercase tracking-wide">Marcas Ativas</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                                        {brands.data.filter(b => b.status === 1).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-500 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-900 dark:text-red-200 uppercase tracking-wide">Marcas Inativas</p>
                                    <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
                                        {brands.data.filter(b => b.status === 0).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-red-500 rounded-lg">
                                    <XCircle className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Brands Grid */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Lista de Marcas
                                    </h3>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {brands.meta.total} marcas cadastradas
                                </div>
                            </div>

                            {/* Filter Section */}
                            <div className="mt-4">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Filtros de Busca
                                    </h3>
                                    <SimpleSearchBar field='name' search={search} withTrashed={true} trashed={trashed} placeholder='Buscar por nome da marca...' />
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {brands?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {brands.data.map((brand) => (
                                        <div
                                            key={brand.id}
                                            className={`relative rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200
                                                ${brand.deleted_at
                                                    ? 'bg-gray-100 dark:bg-gray-900 opacity-60'
                                                    : 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750'}
                                            `}
                                        >
                                            {/* Tag Deletada */}
                                            {brand.deleted_at && (
                                                <div className="absolute top-3 left-3 z-50 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow">
                                                    Deletada
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {brand.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                                            {brand.name}
                                                        </h4>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            brand.status === 1 
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                                                        }`}>
                                                            {brand.status === 1 ? (
                                                                <>
                                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                                    Ativa
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle className="w-3 h-3 mr-1" />
                                                                    Inativa
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    {(can('brands_edit') && !brand.deleted_at) && (
                                                        <button
                                                            onClick={() => openModal(brand)}
                                                            className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 transition-colors"
                                                            title="Editar marca"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {(can('brands_delete') && !brand.deleted_at) && (
                                                        <button
                                                            onClick={() => confirmBrandDeletion(brand.id)}
                                                            className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition-colors"
                                                            title="Excluir marca"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {(brand.deleted_at && can('brands_delete')) && (
                                                        <button
                                                            onClick={() => router.put(route('brands.restore', brand.id), {}, { preserveScroll: true })}
                                                            className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-800 text-green-600 dark:text-green-400 transition-colors"
                                                            title="Restaurar marca"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <Award className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                Nenhuma marca encontrada
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                Comece adicionando sua primeira marca.
                                            </p>
                                        </div>
                                        {can('brands_create') && (
                                            <button
                                                onClick={() => openModal(null)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Adicionar Marca
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <Pagination links={links} />
                    </div>
                </div>
            </div>

            <BrandFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} brand={brandToEdit} />

            {can('brands_create') && (
                <button
                    aria-label="Nova marca"
                    className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg h-14 w-14 transition-all duration-200 hover:shadow-xl"
                    onClick={() => openModal(null)}
                >
                    <Plus className="h-6 w-6" />
                </button>
            )}

            {brandToDelete && (
                <Modal show={confirmingBrandDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteBrand(); }} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar a marca <span className="font-bold">{brandToDelete.name}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Uma vez que a marca é deletada, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar Marca
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}
