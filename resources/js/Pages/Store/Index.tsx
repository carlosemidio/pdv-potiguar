import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Store } from '@/types/Store';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash, Plus } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import Image from '@/Components/Image';
import SimpleSearchBar from '@/Components/SimpleSearchBar';

export default function Index({
    auth,
    stores,
    search
}: PageProps<{ stores: { data: Store[]}, search?: string }>) {
    const {
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm();

    const [showModal, setShowModal] = useState(false);
    const [store, setStore] = useState<Store | null>(null);

    const handleDeleteClick = (store: Store) => {
        setStore(store);
        setShowModal(true);
    };

    const deleteUser = () => {
        destroy(route('store.destroy', { id: store?.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                setStore(null);
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
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Lojas
                    </h1>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        {stores.data.length} {stores.data.length === 1 ? 'loja' : 'lojas'}
                    </div>
                </div>
            }
        >
            <Head title="Lojas" />

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

                    {/* Stores Grid */}
                    {stores.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {stores.data.map((item) => (
                                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                    {/* Store Image */}
                                    <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 relative overflow-hidden">
                                        {item?.image?.file_url ? (
                                            <Image 
                                                src={item.image.file_url} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
                                                    <svg className="w-8 h-8 text-orange-500 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}>
                                                {item.status ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Store Content */}
                                    <div className="p-6">
                                        {/* Store Name & Description */}
                                        <div className="mb-4">
                                            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                                                {item.name}
                                            </h3>
                                            {item.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Store Details */}
                                        <div className="space-y-3 mb-6">
                                            {item?.user?.name && (
                                                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                                                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                        Proprietário: {item.user.name}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {item?.city?.name && (
                                                <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-lg">
                                                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                                                        Localização: {item.city.name}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    Atualizado em {formatCustomDateTime(item.updated_at)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                                            {can('stores_view') && (
                                                <Link 
                                                    href={route('store.show', { id: item.id })}
                                                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center py-2.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                >
                                                    <span className="inline-flex items-center justify-center gap-2">
                                                        <Eye className="w-4 h-4" />
                                                    </span>
                                                </Link>
                                            )}
                                            {can('stores_edit') && (
                                                <Link 
                                                    href={route('store.edit', { id: item.id })}
                                                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-center py-2.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                >
                                                    <span className="inline-flex items-center justify-center gap-2">
                                                        <Edit className="w-4 h-4" />
                                                    </span>
                                                </Link>
                                            )}
                                            {can('stores_delete') && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(item)}
                                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                >
                                                    <span className="inline-flex items-center justify-center gap-2">
                                                        <Trash className="w-4 h-4" />
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Nenhuma loja cadastrada
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Comece criando sua primeira loja para gerenciar o sistema.
                            </p>
                            {can('stores_create') && (
                                <Link 
                                    href={route('store.create')}
                                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-5 h-5" />
                                    Criar Primeira Loja
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Floating Action Button */}
                    {can('stores_create') && stores.data.length > 0 && (
                        <Link href={route('store.create')}>
                            <button
                                aria-label="Nova loja"
                                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
                            >
                                <Plus className="h-7 w-7 group-hover:scale-110 transition-transform" />
                            </button>
                        </Link>
                    )}
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={(e) => { e.preventDefault(); deleteUser(); }} className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Confirmar Exclusão da Loja
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Esta ação não pode ser desfeita
                            </p>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                        <p className="text-red-800 dark:text-red-200 font-medium">
                            Tem certeza que deseja deletar a loja "{store?.name}"?
                        </p>
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            Uma vez que a loja é deletada, todos os seus recursos, produtos, pedidos e dados serão permanentemente removidos. Esta ação não pode ser desfeita.
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