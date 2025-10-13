import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { Ingredient } from '@/types/Ingredient';
import Pagination from '@/Components/Pagination/Pagination';
import IngredientFormModal from '@/Components/IngredientFormModal';
import { Unit } from '@/types/Unit';

export default function Index({
    auth,
    ingredients,
    units
}: PageProps<{ ingredients: PaginatedData<Ingredient>, units: { data: Unit[] } }>) {

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
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Ingredientes
                </h2>
            }
        >
            <Head title="Ingredientes" />

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="max-w-5xl">
                    <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1'>
                        {ingredients?.data?.map((ingredient) => (
                            <li key={ingredient.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
                                <div className="flex items-center justify-between gap-2 relative p-2">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className='min-w-0 flex-1'>
                                            <p className='font-semibold text-sm truncate'>{ingredient.name}</p>
                                            <div className='mt-1 flex flex-wrap items-end gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] ${(ingredient.stock_quantity ?? 0) > 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}>
                                                    Estoque: {ingredient.stock_quantity ?? '0'}{ingredient.unit?.symbol || ''}
                                                </span>
                                                {ingredient.cost_price && (
                                                    <span className='px-1.5 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 text-[10px]'>
                                                        {ingredient.cost_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">
                                                    {ingredient.created_at ? new Date(ingredient.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 absolute top-1 right-1'>
                                        {((can('ingredients_edit') && ingredient.user_id != null) || (can('ingredients_delete') && ingredient.user_id != null)) && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <SecondaryButton size='sm' className='!px-2 !py-1' title='Ações'>
                                                        <MoreVertical className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align='right' width='48'>
                                                    {(can('ingredients_edit') && ingredient.user_id != null) && (
                                                        <button
                                                            type='button'
                                                            onClick={() => handleOpenModalForEdit(ingredient)}
                                                            className='block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none'
                                                        >
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Edit className='w-4 h-4' /> Editar
                                                            </span>
                                                        </button>
                                                    )}
                                                    {(can('ingredients_delete') && ingredient.user_id != null) && (
                                                        <button
                                                            type='button'
                                                            onClick={() => confirmIngredientDeletion(ingredient.id)}
                                                            className='block w-full px-4 py-2 text-start text-sm leading-5 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 focus:outline-none'
                                                        >
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Trash className='w-4 h-4' /> Excluir
                                                            </span>
                                                        </button>
                                                    )}
                                                </Dropdown.Content>
                                            </Dropdown>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Pagination links={links} />
                    {ingredients?.data?.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhum ingrediente cadastrado.
                        </div>
                    )}
                </div>
            </section>

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
                        className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                        onClick={handleOpenModalForCreate}
                    >
                        <Plus className='w-6 h-6' />
                    </button>
                </>
            )}

            {ingredientToDelete && (
                <Modal show={confirmingIngredientDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteIngredient(); }} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar o ingrediente <span className="font-bold">{ingredientToDelete.name}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Uma vez que o ingrediente é deletado, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar Ingrediente
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}
