import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { Category } from '@/types/Category';
import Pagination from '@/Components/Pagination/Pagination';
import CategoryFormModal from '@/Components/CategoryFormModal';

export default function Index({
    auth,
    categories,
}: PageProps<{ categories: PaginatedData<Category> }>) {

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
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Categorias
                </h2>
            }
        >
            <Head title="Categorias" />

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="max-w-5xl">
                    <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1'>
                        {categories?.data?.map((category) => (
                            <li key={category.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
                                <div className="flex items-center justify-between gap-2 relative p-2">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className='min-w-0 flex-1'>
                                            <div className="flex items-center gap-2">
                                                <p className='font-semibold text-sm truncate'>{category.name}</p>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${category.status === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}>
                                                    {category.status === 1 ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </div>
                                            <div className='mt-1 flex flex-wrap items-end gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                {category.parent && typeof category.parent === 'object' && 'name' in category.parent ? (
                                                    <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px]'>
                                                        Pai: {(category.parent as any).name}
                                                    </span>
                                                ) : (
                                                    <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px]'>
                                                        Categoria raiz
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">
                                                    {category.created_at ? new Date(category.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 absolute top-1 right-1'>
                                        {((can('categories_edit') && category.user_id != null) || (can('categories_delete') && category.user_id != null)) && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <SecondaryButton size='sm' className='!px-2 !py-1' title='Ações'>
                                                        <MoreVertical className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align='right' width='48'>
                                                    {(can('categories_edit') && category.user_id != null) && (
                                                        <button
                                                            type='button'
                                                            onClick={() => handleOpenModalForEdit(category)}
                                                            className='block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none'
                                                        >
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Edit className='w-4 h-4' /> Editar
                                                            </span>
                                                        </button>
                                                    )}
                                                    {(can('categories_delete') && category.user_id != null) && (
                                                        <button
                                                            type='button'
                                                            onClick={() => confirmCategoryDeletion(category.id)}
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
                    {categories?.data?.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhuma categoria cadastrada.
                        </div>
                    )}
                </div>
            </section>

            {can('categories_create') && (
                <>
                    <CategoryFormModal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        category={categoryToEdit}
                    />

                    <button
                        aria-label="Nova categoria"
                        className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                        onClick={handleOpenModalForCreate}
                    >
                        <Plus className='w-6 h-6' />
                    </button>
                </>
            )}

            {categoryToDelete && (
                <Modal show={confirmingCategoryDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteCategory(); }} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar a categoria <span className="font-bold">{categoryToDelete.name}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Uma vez que a categoria é deletada, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar Categoria
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}
