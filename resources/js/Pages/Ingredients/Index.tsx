import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus } from 'lucide-react';
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
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Ingredientes
                </h2>
            }
        >
            <Head title="Ingredientes" />

            <section className='text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-2">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3'>
                        {
                            ingredients?.data?.map((ingredient) => (
                                <Card key={ingredient.id} className="relative p-3 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className='font-semibold text-base truncate'>{ingredient.name}</p>
                                    </div>

                                    <div className='mt-1 text-sm text-gray-700 dark:text-gray-300'>
                                        Estoque: {ingredient.stock_quantity ?? '0'}{ingredient.unit ? ingredient.unit.symbol : ''}
                                    </div>

                                    <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                                        Criado em: {ingredient.created_at ? new Date(ingredient.created_at).toLocaleDateString('pt-BR') : '-'}
                                    </div>

                                    <div className='flex gap-1.5 mt-2 justify-end'>
                                        {(can('ingredients_delete') && (ingredient.user_id != null)) && (
                                            <DangerButton size='sm'
                                                onClick={() => confirmIngredientDeletion(ingredient.id)}
                                                title="Deletar ingrediente"
                                            >
                                                <Trash className='w-4 h-4' />
                                            </DangerButton>
                                        )}
                                        {(can('ingredients_edit') &&  (ingredient.user_id != null)) && (
                                            <SecondaryButton size='sm' title="Editar ingrediente" onClick={() => handleOpenModalForEdit(ingredient)}>
                                                <Edit className='w-4 h-4' />
                                            </SecondaryButton>
                                        )}
                                    </div>
                                </Card>
                            ))
                        }
                    </div>
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
                        className="fixed bottom-14 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
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
