import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { Category } from '@/types/Category';
import Pagination from '@/Components/Pagination/Pagination';

export default function Index({
    auth,
    categories,
}: PageProps<{ categories: PaginatedData<Category> }>) {

    const [confirmingCategoryDeletion, setConfirmingCategoryDeletion] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(null);

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

            <section className='text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-2">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3'>
                        {
                            categories?.data?.map((category) => (
                                <Card key={category.id} className="relative p-3 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className='font-semibold text-base truncate'>{category.name}</p>
                                        <div className='flex justify-end'>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${category.status === 1 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                {category.status === 1 ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='mt-1 text-sm text-gray-700 dark:text-gray-300'>
                                        <span className='text-gray-600 dark:text-gray-400'>Pai: </span>
                                        {category.parent && typeof category.parent === 'object' && 'name' in category.parent ? (
                                            <Link
                                                href={route('categories.edit', { id: (category.parent as any).id })}
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {(category.parent as any).name || `ID: ${category.parent_id}`}
                                            </Link>
                                        ) : (
                                            <span className="italic text-gray-400">Nenhuma</span>
                                        )}
                                    </div>

                                    <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                                        Criado em: {category.created_at ? new Date(category.created_at).toLocaleDateString('pt-BR') : '-'}
                                    </div>

                                    <div className='flex gap-1.5 mt-2 justify-end'>
                                        {(can('categories_delete') && (category.user_id != null)) && (
                                            <DangerButton size='sm'
                                                onClick={() => confirmCategoryDeletion(category.id)}
                                                title="Deletar categoria"
                                            >
                                                <Trash className='w-4 h-4' />
                                            </DangerButton>
                                        )}
                                        {(can('categories_edit') &&  (category.user_id != null)) && (
                                            <Link href={route('categories.edit', { id: category.id })}>
                                                <SecondaryButton size='sm' title="Editar categoria">
                                                    <Edit className='w-4 h-4' />
                                                </SecondaryButton>
                                            </Link>
                                        )}
                                    </div>
                                </Card>
                            ))
                        }
                    </div>
                    <Pagination links={links} />
                    {categories?.data?.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhuma categoria cadastrada.
                        </div>
                    )}
                </div>
            </section>

            {can('categories_create') && (
                <Link href={route('categories.create')}>
                    <button
                        aria-label="Nova categoria"
                        className="fixed bottom-14 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                    >
                        <Plus className='w-6 h-6' />
                    </button>
                </Link>
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
