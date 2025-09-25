import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Product } from '@/types/Product';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, MoreVertical } from 'lucide-react';
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

            <section className=' px-3 text-gray-800 dark:text-gray-200 max-w-5xl'>
                <div className="mx-auto lg:px-2">
                    <ul className='grid grid-cols-1 lg:grid-cols-2 gap-1 mt-2'>
                        {products.data.map((item) => (
                            <li key={item.id} className='bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800'>
                                <div className="flex items-start justify-between gap-2 relative p-2">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className='font-semibold text-sm truncate'>{item.name}</p>
                                            </div>
                                            <div className='mt-1 flex flex-wrap items-end gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800'>{item.brand?.name || 'Sem marca'}</span>
                                                {item.category?.name && (
                                                    <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800'>{item.category?.name}</span>
                                                )}
                                                <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">{formatCustomDateTime(item.updated_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 absolute top-1 right-1'>
                                        {(can('products_view') || can('products_edit') || can('products_delete')) && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <SecondaryButton size='sm' className='!px-2 !py-1' title='Ações'>
                                                        <MoreVertical className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align='right' width='48'>
                                                    {can('products_edit') && (
                                                        <Dropdown.Link href={route('product.edit', { id: item.id })}>
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Edit className='w-4 h-4' /> Editar
                                                            </span>
                                                        </Dropdown.Link>
                                                    )}
                                                    {can('products_delete') && (
                                                        <button
                                                            type='button'
                                                            onClick={() => handleDeleteClick(item)}
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