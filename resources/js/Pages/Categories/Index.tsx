import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { Category } from '@/types/Category';
import Pagination from '@/Components/Pagination/Pagination';
import CategoryFormModal from '@/Components/CategoryFormModal';
import SimpleSearchBar from '@/Components/SimpleSearchBar';

export default function Index({
    auth,
    categories,
    search,
}: PageProps<{ categories: PaginatedData<Category>, search?: string }>) {

    const [confirmingCategoryDeletion, setConfirmingCategoryDeletion] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const confirmCategoryDeletion = (id: number) => {
        setCategoryIdToDelete(id);
        setConfirmingCategoryDeletion(true);
    };

    const deleteCategory = () => {
        destroy(route('categories.destroy', { id: categoryIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingCategoryDeletion(false);
        setCategoryIdToDelete(null);
        clearErrors();
        reset();
    };

    const handleOpenModalForCreate = () => {
        setCategoryToEdit(null);
        setIsOpen(true);
    };

    const handleOpenModalForEdit = (category: Category) => {
        setCategoryToEdit(category);
        setIsOpen(true);
    };

    const categoryToDelete = categories?.data?.find
        ? categories.data.find(category => category.id === categoryIdToDelete)
        : null;

    const {
        meta: { links },
    } = categories;

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Categorias
                    </h1>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {categories.data.length} {categories.data.length === 1 ? 'categoria' : 'categorias'}
                    </div>
                </div>
            }
        >
            <Head title="Categorias" />

            <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
                    {/* Filter Section */}
                    <div className="mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Filtros de Busca
                            </h3>
                            <SimpleSearchBar field='name' search={search} />
                        </div>
                    </div>

                    {/* Categories Grid */}
                    {categories.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {categories.data.map((category) => (
                                    <div key={category.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                        {/* Category Header */}
                                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                                            {category.name}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.status === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}>
                                                    {category.status === 1 ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Category Content */}
                                        <div className="p-6">
                                            {/* Hierarchy Info */}
                                            <div className="mb-4">
                                                {category.parent && typeof category.parent === 'object' && 'name' in category.parent ? (
                                                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                                                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                            Subcategoria de: {(category.parent as any).name}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg">
                                                        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                                                            Categoria Principal
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Category Meta */}
                                            <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                    Criado em {category.created_at ? new Date(category.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                {(can('categories_edit') && category.user_id != null) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenModalForEdit(category)}
                                                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                    >
                                                        <span className="inline-flex items-center justify-center gap-2">
                                                            <Edit className="w-4 h-4" />
                                                            Editar
                                                        </span>
                                                    </button>
                                                )}
                                                {(can('categories_delete') && category.user_id != null) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => confirmCategoryDeletion(category.id)}
                                                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                    >
                                                        <span className="inline-flex items-center justify-center gap-2">
                                                            <Trash className="w-4 h-4" />
                                                            Excluir
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
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
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Nenhuma categoria cadastrada
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Organize seus produtos criando categorias e subcategorias.
                            </p>
                            {can('categories_create') && (
                                <button
                                    onClick={handleOpenModalForCreate}
                                    className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-5 h-5" />
                                    Criar Primeira Categoria
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Floating Action Button & Modals */}
            {can('categories_create') && (
                <>
                    <CategoryFormModal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        category={categoryToEdit}
                    />

                    {categories.data.length > 0 && (
                        <button
                            aria-label="Nova categoria"
                            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
                            onClick={handleOpenModalForCreate}
                        >
                            <Plus className="h-7 w-7 group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            {categoryToDelete && (
                <Modal show={confirmingCategoryDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteCategory(); }} className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Confirmar Exclusão
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Esta ação não pode ser desfeita
                                </p>
                            </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                            <p className="text-red-800 dark:text-red-200 font-medium">
                                Tem certeza que deseja deletar a categoria "{categoryToDelete.name}"?
                            </p>
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                Uma vez que a categoria é deletada, todos os seus recursos e dados serão permanentemente removidos. Esta ação não pode ser desfeita.
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
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Deletando...' : 'Confirmar Exclusão'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}
