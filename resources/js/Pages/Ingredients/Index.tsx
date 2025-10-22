import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, Search, Package } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { Ingredient } from '@/types/Ingredient';
import Pagination from '@/Components/Pagination/Pagination';
import IngredientFormModal from '@/Components/IngredientFormModal';
import { Unit } from '@/types/Unit';
import SimpleSearchBar from '@/Components/SimpleSearchBar';

export default function Index({
    auth,
    ingredients,
    units,
    search
}: PageProps<{ ingredients: PaginatedData<Ingredient>, units: { data: Unit[] }, search?: string }>) {

    const [confirmingIngredientDeletion, setConfirmingIngredientDeletion] = useState(false);
    const [ingredientIdToDelete, setIngredientIdToDelete] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [ingredientToEdit, setIngredientToEdit] = useState<Ingredient | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const confirmIngredientDeletion = (id: number) => {
        setIngredientIdToDelete(id);
        setConfirmingIngredientDeletion(true);
    };

    const deleteIngredient = () => {
        destroy(route('ingredients.destroy', { id: ingredientIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingIngredientDeletion(false);
        setIngredientIdToDelete(null);
        clearErrors();
        reset();
    };

    const handleOpenModalForCreate = () => {
        setIngredientToEdit(null);
        setIsOpen(true);
    };

    const handleOpenModalForEdit = (ingredient: Ingredient) => {
        setIngredientToEdit(ingredient);
        setIsOpen(true);
    };

    const ingredientToDelete = ingredients?.data?.find
        ? ingredients.data.find(ingredient => ingredient.id === ingredientIdToDelete)
        : null;

    const {
        meta: { links },
    } = ingredients;

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            Ingredientes
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Gerencie ingredientes, controle de estoque e custos
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Ingredientes" />

            <div className="space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Lista de Ingredientes */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 px-6 sm:px-8 py-6 border-b border-green-100 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    Lista de Ingredientes
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    {ingredients?.data?.length || 0} ingredientes encontrados
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
                        {ingredients?.data?.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Nenhum ingrediente cadastrado
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Comece criando seu primeiro ingrediente para o sistema.
                                </p>
                                {can('ingredients_create') && (
                                    <button
                                        onClick={handleOpenModalForCreate}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Criar Primeiro Ingrediente
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {ingredients?.data?.map((ingredient) => (
                                        <div
                                            key={ingredient.id}
                                            className="group relative bg-gradient-to-br from-white via-gray-50 to-green-50 dark:from-gray-800 dark:via-gray-750 dark:to-gray-700 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:-translate-y-2 hover:rotate-1 overflow-hidden"
                                        >
                                            {/* Decoração de fundo */}
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full transform translate-x-6 -translate-y-6"></div>
                                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-400/10 to-green-400/10 rounded-full transform -translate-x-4 translate-y-4"></div>
                                            
                                            <div className="p-6 relative">
                                                {/* Header do Ingrediente */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                <Package className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 line-clamp-2">
                                                                    {ingredient.name}
                                                                </h4>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                                    ID: #{ingredient.id}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Informações de Estoque */}
                                                <div className="space-y-3 mb-4">
                                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border-l-4 border-blue-500">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                                                <Package className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-medium text-blue-700 dark:text-blue-300 block">Estoque Atual</span>
                                                                <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
                                                                    {ingredient.stock_quantity ? `${ingredient.stock_quantity} ${ingredient.unit?.symbol || ingredient.unit?.name || ''}` : 'Não informado'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-800/20 rounded-xl border-l-4 border-emerald-500">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">R$</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 block">Custo Unitário</span>
                                                                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                                                                    R$ {ingredient.cost_price ? Number(ingredient.cost_price).toFixed(2).replace('.', ',') : '0,00'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {ingredient.unit?.name && (
                                                        <div className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-800 dark:text-purple-200 text-xs font-medium rounded-lg border border-purple-200 dark:border-purple-700">
                                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                                            {ingredient.unit.name} ({ingredient.unit.symbol})
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-800/30 text-amber-800 dark:text-amber-200 text-xs font-medium rounded-lg border border-amber-200 dark:border-amber-700">
                                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                                        Ingrediente
                                                    </div>
                                                </div>

                                                {/* Data de criação */}
                                                <div className="pt-3 border-t border-gray-100 dark:border-gray-600">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Criado em {ingredient.created_at ? new Date(ingredient.created_at).toLocaleDateString('pt-BR', { 
                                                            day: '2-digit', 
                                                            month: '2-digit', 
                                                            year: 'numeric' 
                                                        }) : '—'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Botões de Ação - Sempre Visíveis */}
                                            {((can('ingredients_edit') && ingredient.user_id != null) || (can('ingredients_delete') && ingredient.user_id != null)) && (
                                                <div className="absolute top-3 right-3 flex gap-1 z-50">
                                                    {/* Botão Editar */}
                                                    {(can('ingredients_edit') && ingredient.user_id != null) && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOpenModalForEdit(ingredient);
                                                            }}
                                                            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95"
                                                            title="Editar ingrediente"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    
                                                    {/* Botão Excluir */}
                                                    {(can('ingredients_delete') && ingredient.user_id != null) && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                confirmIngredientDeletion(ingredient.id);
                                                            }}
                                                            className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95"
                                                            title="Excluir ingrediente"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Paginação */}
                                <div className="mt-8">
                                    <Pagination links={links} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>            {/* Floating Action Button */}
            {can('ingredients_create') && (
                <>
                    <IngredientFormModal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        ingredient={ingredientToEdit}
                        units={units.data}
                    />

                    <button
                        aria-label="Novo ingrediente"
                        className="fixed bottom-16 right-6 z-50 group inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-2xl h-14 w-14 transition-all duration-300 hover:scale-110 active:scale-95"
                        onClick={handleOpenModalForCreate}
                    >
                        <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                    </button>
                </>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {ingredientToDelete && (
                <Modal show={confirmingIngredientDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteIngredient(); }} className="p-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                                <Trash className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Confirmar Exclusão
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Tem certeza que deseja deletar o ingrediente <span className="font-bold text-red-600">{ingredientToDelete?.name}</span>?
                            </p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                ⚠️ Uma vez que o ingrediente é deletado, todos os seus recursos e dados serão permanentemente removidos.
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
                                {processing ? 'Deletando...' : 'Deletar Ingrediente'}
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}
