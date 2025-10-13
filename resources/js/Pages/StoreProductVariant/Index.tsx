import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash, Plus, Store, Layers, Package, Star, DollarSign, Archive, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import Pagination from '@/Components/Pagination/Pagination';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import Image from '@/Components/Image';

export default function Index({
    auth,
    storeProductVariants,
}: PageProps<{ storeProductVariants: PaginatedData<StoreProductVariant> }>) {
    const { delete: destroy, processing: processingDelete, reset, clearErrors } = useForm();

    const [showModal, setShowModal] = useState(false);
    const [variant, setVariant] = useState<StoreProductVariant | null>(null);

    const handleDeleteClick = (variant: StoreProductVariant) => {
        setVariant(variant);
        setShowModal(true);
    };

    const deleteVariant = () => {
        destroy(route('store-product-variant.destroy', { id: variant?.id }), {
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

    const { data, meta } = storeProductVariants;

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Variantes da Loja
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Gerencie as variantes específicas para sua loja
                            </p>
                        </div>
                    </div>
                    {can('store-product-variants_create') && (
                        <Link href={route('store-product-variant.create')}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200">
                                <Plus className="w-4 h-4" />
                                Nova Variante
                            </button>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Variantes de Produto da Loja" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-6 max-w-7xl">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200 uppercase tracking-wide">Total de Variantes</p>
                                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                                        {storeProductVariants.meta.total}
                                    </p>
                                </div>
                                <div className="p-3 bg-indigo-500 rounded-lg">
                                    <Layers className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200 uppercase tracking-wide">Em Destaque</p>
                                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">
                                        {data.filter(v => v.featured).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-500 rounded-lg">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-900 dark:text-green-200 uppercase tracking-wide">Com Preço</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                                        {data.filter(v => Number.isFinite(Number((v as any)?.price))).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-500 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200 uppercase tracking-wide">Em Estoque</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                                        {data.filter(v => !v.is_produced && (v.stock_quantity ?? 0) > 0).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-500 rounded-lg">
                                    <Archive className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Variants Grid */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Store className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Variantes da Loja
                                    </h3>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {storeProductVariants.meta.total} variantes configuradas
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {data.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data.map((item) => (
                                        <div key={item.id} className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    {item?.product_variant?.image ? (
                                                        <Image 
                                                            src={item.product_variant.image.file_url} 
                                                            alt={item.product_variant.name || 'Variante'} 
                                                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0" 
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                                                                {item?.product_variant?.name || '—'}
                                                            </h4>
                                                            {item.featured && (
                                                                <div className="flex-shrink-0">
                                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            SKU: {item?.product_variant?.sku || '—'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {can('store-product-variants_view') && (
                                                        <Link
                                                            href={route('store-product-variant.show', { id: item.id })}
                                                            className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-800 text-green-600 dark:text-green-400 transition-colors"
                                                            title="Ver detalhes"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    )}
                                                    {can('store-product-variants_edit') && (
                                                        <Link
                                                            href={route('store-product-variant.edit', { id: item.id })}
                                                            className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 transition-colors"
                                                            title="Editar variante"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    )}
                                                    {can('store-product-variants_delete') && (
                                                        <button
                                                            onClick={() => handleDeleteClick(item)}
                                                            className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition-colors"
                                                            title="Excluir variante"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Variant Information */}
                                            <div className="space-y-3">
                                                {/* Price and Stock */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                            <span className="text-xs font-medium text-green-700 dark:text-green-300">Preço</span>
                                                        </div>
                                                        <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                                                            {Number.isFinite(Number((item as any)?.price))
                                                                ? Number((item as any).price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                                : '—'}
                                                        </p>
                                                    </div>
                                                    
                                                    {!item.is_produced && (
                                                        <div className={`rounded-lg p-3 ${(item?.stock_quantity ?? 0) > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Archive className={`w-4 h-4 ${(item?.stock_quantity ?? 0) > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`} />
                                                                <span className={`text-xs font-medium ${(item?.stock_quantity ?? 0) > 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>Estoque</span>
                                                            </div>
                                                            <p className={`text-sm font-semibold ${(item?.stock_quantity ?? 0) > 0 ? 'text-blue-900 dark:text-blue-100' : 'text-red-900 dark:text-red-100'}`}>
                                                                {item?.stock_quantity ?? 0}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                                                    Atualizado em {formatCustomDateTime(item.updated_at ?? '')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <Store className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                Nenhuma variante encontrada
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                Configure suas primeiras variantes de produto para a loja.
                                            </p>
                                        </div>
                                        {can('store-product-variants_create') && (
                                            <Link href={route('store-product-variant.create')}>
                                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200">
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
                        {data.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-center">
                                    <nav className="flex items-center gap-2">
                                        {meta.links?.map((link, index) => {
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
                                            
                                            if (index === meta.links.length - 1) {
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
                                                            ? 'border-indigo-500 bg-indigo-500 text-white' 
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

            {can('store-product-variants_create') && (
                <Link href={route('store-product-variant.create')}>
                    <button
                        aria-label="Nova variante da loja"
                        className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg h-14 w-14 transition-all duration-200 hover:shadow-xl"
                    >
                        <Plus className="h-6 w-6" />
                    </button>
                </Link>
            )}

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={(e) => { e.preventDefault(); deleteVariant(); }} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Tem certeza que deseja deletar {variant?.product_variant?.name ?? 'esta variante'}?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Uma vez que a variante é deletada, todos os seus recursos e dados serão permanentemente deletados.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processingDelete}>
                            Deletar variante
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    )
}