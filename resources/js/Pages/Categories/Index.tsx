import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
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
                <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    Categorias
                </h2>
            }
        >
            <Head title="Categorias" />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 min-h-screen'>
                <div className="mx-auto max-w-7xl lg:px-8">

                    <div className='flex justify-end mb-6'>
                        {can('categories_create') && (
                            <Link href={route('categories.create')}>
                                <PrimaryButton className="flex items-center gap-2 shadow-md hover:scale-105 transition-transform">
                                    <span className="font-semibold">+ Adicionar categoria</span>
                                </PrimaryButton>
                            </Link>
                        )}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            categories?.data?.map((category) => (
                                <Card key={category.id} className="p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className='font-bold text-lg'>{category.name}</p>
                                    </div>
                                    <div className='mt-2'>
                                        <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Categoria Pai</p>
                                        <span className="block bg-gray-100 rounded-lg p-2 text-sm dark:bg-gray-800 dark:text-gray-200 min-h-[40px]">
                                            {category.parent && typeof category.parent === 'object' && 'name' in category.parent
                                                ? (
                                                    <Link
                                                        href={route('categories.edit', { id: category.parent.id })}
                                                        className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
                                                    >
                                                        {category.parent.name || `ID: ${category.parent_id}`}
                                                    </Link>
                                                )
                                                : <span className="italic text-gray-400">Nenhuma</span>
                                            }
                                        </span>
                                    </div>
                                    <div className='mt-2'>
                                        <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Status</p>
                                        <span className="block bg-gray-100 rounded-lg p-2 text-sm dark:bg-gray-800 dark:text-gray-200 min-h-[40px]">
                                            {category.status === 1
                                                ? <span className="text-green-600 dark:text-green-400 font-semibold">Ativo</span>
                                                : <span className="text-red-600 dark:text-red-400 font-semibold">Inativo</span>
                                            }
                                        </span>
                                    </div>
                                    <div className='mt-2'>
                                        <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Criado em</p>
                                        <span className="block bg-gray-100 rounded-lg p-2 text-sm dark:bg-gray-800 dark:text-gray-200 min-h-[40px]">
                                            {category.created_at
                                                ? new Date(category.created_at).toLocaleDateString('pt-BR')
                                                : <span className="italic text-gray-400">-</span>
                                            }
                                        </span>
                                    </div>
                                    <div className='flex gap-2 mt-4 justify-end'>
                                        {(can('categories_delete') && (category.user_id != null)) && (
                                            <DangerButton
                                                onClick={() => confirmCategoryDeletion(category.id)}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                title="Deletar categoria"
                                            >
                                                <Trash className='w-5 h-5' />
                                            </DangerButton>
                                        )}
                                        {(can('categories_edit') &&  (category.user_id != null)) && (
                                            <Link href={route('categories.edit', { id: category.id })}>
                                                <SecondaryButton
                                                    className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                    title="Editar categoria"
                                                >
                                                    <Edit className='w-5 h-5' />
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

            {categoryToDelete && (
                <Modal show={confirmingCategoryDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteCategory(); }} className="p-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Tem certeza que deseja deletar a categoria <span className="font-bold">{categoryToDelete.name}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 mb-6">
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
