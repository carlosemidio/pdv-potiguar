import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Product } from '@/types/Product';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash, Plus } from 'lucide-react';
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
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Produtos
                </h2>
            }
        >
            <Head title="Produtos" />

            <section className=' px-3 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-2">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3'>
                        {
                            products.data.map((item) => (
                                <Card key={item.id} className='relative flex flex-col justify-between p-3 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'>
                                    <p className='font-semibold text-base truncate'>{item.name}</p>

                                    <div className='mt-1 text-sm text-gray-700 dark:text-gray-300'>
                                        <span className='text-gray-600 dark:text-gray-400'>Marca: </span>
                                        {item.brand?.name || '—'}
                                    </div>
                                    <div className='text-sm text-gray-700 dark:text-gray-300'>
                                        <span className='text-gray-600 dark:text-gray-400'>Categoria: </span>
                                        {item.category?.name}
                                    </div>
                                    <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                                        Criado em: { formatCustomDateTime(item.created_at) }
                                    </div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                                        Atualizado em: { formatCustomDateTime(item.updated_at)}
                                    </div>

                                    <div className='flex gap-1.5 mt-2 justify-end'>
                                        {can('products_delete') && (
                                            <DangerButton size='sm' onClick={() => handleDeleteClick(item)} disabled={processing} title='Excluir produto'>
                                                <Trash className='w-4 h-4' />
                                            </DangerButton>
                                        )}
                                        {can('products_edit') && (
                                            <Link href={route('product.edit', { id: item.id })}>
                                                <SecondaryButton size='sm' title='Editar produto'>
                                                    <Edit className='w-4 h-4' />
                                                </SecondaryButton>
                                            </Link>
                                        )}
                                        {can('products_view') && (
                                            <Link href={route('product.show', { id: item.id })}>
                                                <PrimaryButton size='sm' title='Ver produto'>
                                                    <Eye className='w-4 h-4' />
                                                </PrimaryButton>
                                            </Link>
                                        )}
                                    </div>
                                </Card>
                            ))
                        }
                    </div>

                    <Pagination links={meta.links} />

                    {products.data.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhum produto cadastrado.
                        </div>
                    )}

                    {can('products_create') && (
                        <Link href={route('product.create')}>
                            <button
                                aria-label="Novo produto"
                                className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                            >
                                <Plus className='w-6 h-6' />
                            </button>
                        </Link>
                    )}
                </div>
            </section>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={(e) => { e.preventDefault(); deleteProduct(); }} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Tem certeza que deseja deletar {product?.name}?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Uma vez que o produto é deletado, todos os seus recursos e dados serão permanentemente deletados.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Deletar produto
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    )
}