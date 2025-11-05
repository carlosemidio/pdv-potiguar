import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { ProductVariant } from '@/types/ProductVariant';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, Package, Tag, Copy, ChevronLeft, ChevronRight, Layers, Palette } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import Image from '@/Components/Image';
import { Category } from '@/types/Category';
import ProductsFilterBar from '@/Components/ProductsFilterBar';
import Pagination from '@/Components/Pagination/Pagination';

export default function Index({
    auth,
    productVariants,
    categories,
    filters
}: PageProps<{ productVariants: PaginatedData<ProductVariant>, filters: { category?: string; field?: string; search?: string }, categories: { data: Category[] } }>) {
    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const [showModal, setShowModal] = useState(false);
    const [variant, setVariant] = useState<ProductVariant | null>(null);

    const handleDeleteClick = (variant: ProductVariant) => {
        setVariant(variant);
        setShowModal(true);
    };

    const deleteVariant = () => {
        destroy(route('product-variant.destroy', { id: variant?.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                setVariant(null);
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setShowModal(false);
        clearErrors();
        reset();
    };

    const { data, meta } = productVariants;

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                            <Layers className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Variantes de Produtos
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Gerencie as variações de produtos e seus atributos
                            </p>
                        </div>
                    </div>
                    {can('product-variants_create') && (
                        <Link href={route('product-variant.create')}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200">
                                <Plus className="w-4 h-4" />
                                Nova Variante
                            </button>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Variantes de Produtos" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container px-4 py-6 max-w-7xl">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-900 dark:text-purple-200 uppercase tracking-wide">Total de Variantes</p>
                                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                                        {productVariants.meta.total}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-500 rounded-lg">
                                    <Layers className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200 uppercase tracking-wide">Com Imagem</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                                        {data.filter(v => v.image).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-500 rounded-lg">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-900 dark:text-green-200 uppercase tracking-wide">Com SKU</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                                        {data.filter(v => v.sku).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-500 rounded-lg">
                                    <Tag className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Variants Grid */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Lista de Variantes
                                    </h3>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {productVariants.meta.total} variantes cadastradas
                                </div>
                            </div>

                            {/* Filter Section */}
                            <div className="mt-4">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Filtros de Busca
                                    </h3>
                                    <ProductsFilterBar filters={filters} categories={categories.data} />
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {data.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`relative rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200
                                                ${item.deleted_at
                                                    ? 'bg-gray-100 dark:bg-gray-900 opacity-60'
                                                    : 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750'}
                                            `}
                                        >
                                            {/* Tag Deletada */}
                                            {item.deleted_at && (
                                                <div className="absolute top-3 left-3 z-50 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow">
                                                    Deletada
                                                </div>
                                            )}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    {item?.image ? (
                                                        <Image 
                                                            src={item.image.file_url} 
                                                            alt={item.name} 
                                                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0" 
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                                                            {item.name}
                                                        </h4>
                                                        {item.product?.name && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                                                {item.product.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {(!item.deleted_at && can('product-variants_edit')) && (
                                                        <Link
                                                            href={route('product-variant.edit', { id: item.id })}
                                                            className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 transition-colors"
                                                            title="Editar variante"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    )}
                                                    {(!item.deleted_at && can('product-variants_delete')) && (
                                                        <button
                                                            onClick={() => handleDeleteClick(item)}
                                                            className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition-colors"
                                                            title="Excluir variante"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    {(item.deleted_at && can('product-variants_delete')) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => router.put(route('product-variant.restore', { id: item.id }), { preserveScroll: true } )}
                                                            className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-800 text-green-600 dark:text-green-400 transition-colors"
                                                            title="Restaurar variante"
                                                        >
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V7z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Variant Information */}
                                            <div className="space-y-3">
                                                {item.sku && (
                                                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                                        <div className="flex items-center gap-2">
                                                            <Tag className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SKU:</span>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.sku}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            title="Copiar SKU"
                                                            onClick={(e) => { 
                                                                e.preventDefault(); 
                                                                e.stopPropagation(); 
                                                                item.sku && navigator.clipboard.writeText(item.sku); 
                                                            }}
                                                            className="p-1.5 text-xs bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                                                    Atualizado em {formatCustomDateTime(item.updated_at)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <Layers className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                Nenhuma variante encontrada
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                Comece criando sua primeira variante de produto.
                                            </p>
                                        </div>
                                        {can('product-variants_create') && (
                                            <Link href={route('product-variant.create')}>
                                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200">
                                                    <Plus className="w-4 h-4" />
                                                    Criar Variante
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <Pagination links={productVariants.meta.links} />
                    </div>
                </div>
            </div>

            {can('product-variants_create') && (
                <Link href={route('product-variant.create')}>
                    <button
                        aria-label="Nova variante"
                        className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg h-14 w-14 transition-all duration-200 hover:shadow-xl"
                    >
                        <Plus className="h-6 w-6" />
                    </button>
                </Link>
            )}

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={(e) => { e.preventDefault(); deleteVariant(); }} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Tem certeza que deseja deletar {variant?.name}?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Uma vez que a variante é deletada, todos os seus recursos e dados serão permanentemente deletados.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Deletar variante
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    )
}
