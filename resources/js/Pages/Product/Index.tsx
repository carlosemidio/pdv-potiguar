import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Product } from '@/types/Product';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import Pagination from '@/Components/Pagination/Pagination';

export default function Index({
    auth,
    products,
}: PageProps<{ products: PaginatedData<Product> }>) {
    const {
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm();

    const [showModal, setShowModal] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);

    const handleDeleteClick = (product: Product) => {
        setProduct(product);
        setShowModal(true);
    };

    const deleteProduct = () => {
        destroy(route('product.destroy', { id: product?.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                setProduct(null);
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setShowModal(false);
        clearErrors();
        reset();
    };

    const { data, meta } = products;

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Produtos
                    </h1>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        {data.length} {data.length === 1 ? 'produto' : 'produtos'}
                    </div>
                </div>
            }
        >
            <Head title="Produtos" />

            <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
                    {/* Products Grid */}
                    {data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {data.map((item) => (
                                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                        {/* Product Content */}
                                        <div className="p-6">
                                            {/* Product Name */}
                                            <div className="mb-4">
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.brand?.name && (
                                                        <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg text-xs font-medium">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            {item.brand.name}
                                                        </span>
                                                    )}
                                                    {item.category?.name && (
                                                        <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-lg text-xs font-medium">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            {item.category.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product Meta */}
                                            <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    Atualizado em {formatCustomDateTime(item.updated_at)}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                {can('products_edit') && (
                                                    <Link 
                                                        href={route('product.edit', { id: item.id })}
                                                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center py-2.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                    >
                                                        <span className="inline-flex items-center justify-center gap-2">
                                                            <Edit className="w-4 h-4" />
                                                            Editar
                                                        </span>
                                                    </Link>
                                                )}
                                                {can('products_delete') && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteClick(item)}
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
                                <Pagination links={meta.links} />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Nenhum produto cadastrado
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Comece criando seu primeiro produto para o sistema.
                            </p>
                            {can('products_create') && (
                                <Link 
                                    href={route('product.create')}
                                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-5 h-5" />
                                    Criar Primeiro Produto
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Floating Action Button */}
                    {can('products_create') && data.length > 0 && (
                        <Link href={route('product.create')}>
                            <button
                                aria-label="Novo produto"
                                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
                            >
                                <Plus className="h-7 w-7 group-hover:scale-110 transition-transform" />
                            </button>
                        </Link>
                    )}
                </div>
            </section>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={(e) => { e.preventDefault(); deleteProduct(); }} className="p-6">
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
                            Tem certeza que deseja deletar "{product?.name}"?
                        </p>
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            Uma vez que o produto é deletado, todos os seus recursos e dados serão permanentemente removidos. Esta ação não pode ser desfeita.
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
        </AuthenticatedLayout>
    )
}