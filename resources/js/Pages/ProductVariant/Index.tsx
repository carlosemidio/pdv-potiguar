import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { ProductVariant } from '@/types/ProductVariant';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash, Plus } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import Pagination from '@/Components/Pagination/Pagination';

export default function Index({
    auth,
    productVariants,
}: PageProps<{ productVariants: PaginatedData<ProductVariant> }>) {
    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const [showModal, setShowModal] = useState(false);
    const [variant, setVariant] = useState<ProductVariant | null>(null);

    const handleDeleteClick = (variant: ProductVariant) => {
        setVariant(variant);
        setShowModal(true);
    };

    const deleteVariant = () => {
        destroy(route('product-variant.destroy', { id: variant?.id }), {
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

    const { data, meta } = productVariants;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Variantes de Produtos
                </h2>
            }
        >
            <Head title="Variantes de Produtos" />

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-2">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3'>
                        {
                            data.map((item) => (
                                <Card key={item.id} className='relative flex flex-col justify-between p-3 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'>
                                    {item?.image && (
                                        <img src={item?.image?.file_url} alt={item.name} className='w-full h-80 object-cover rounded-md mb-2' />
                                    )}

                                    <p className='font-semibold text-base truncate'>{item.name}</p>

                                    <div className='mt-1'>
                                        <p className='text-sm text-gray-700 dark:text-gray-300'>
                                            <span className='text-gray-600 dark:text-gray-400'>SKU: </span>
                                            {item.sku || '—'}
                                        </p>

                                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                            Criado em: { formatCustomDateTime(item.created_at) }
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                            Atualizado em: { formatCustomDateTime(item.updated_at)}
                                        </p>
                                    </div>

                                    <div className='flex gap-1.5 mt-2 justify-end'>
                                        {can('product-variants_delete') && (
                                            <DangerButton size='sm' onClick={() => handleDeleteClick(item)} disabled={processing} title='Excluir variante'>
                                                <Trash className='w-4 h-4' />
                                            </DangerButton>
                                        )}
                                        {can('product-variants_edit') && (
                                            <Link href={route('product-variant.edit', { id: item.id })}>
                                                <SecondaryButton size='sm' title='Editar variante'>
                                                    <Edit className='w-4 h-4' />
                                                </SecondaryButton>
                                            </Link>
                                        )}
                                        {can('product-variants_view') && (
                                            <Link href={route('product-variant.show', { id: item.id })}>
                                                <PrimaryButton size='sm' title='Ver variante'>
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

                    {data.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhuma variante cadastrada.
                        </div>
                    )}

                    {can('product-variants_create') && (
                        <Link href={route('product-variant.create')}>
                            <button
                                aria-label="Nova variante"
                                className="fixed bottom-14 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                            >
                                <Plus className='w-6 h-6' />
                            </button>
                        </Link>
                    )}
                </div>
            </section>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={(e) => { e.preventDefault(); deleteVariant(); }} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Tem certeza que deseja deletar {variant?.name}?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Uma vez que a variante é deletada, todos os seus recursos e dados serão permanentemente deletados.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Deletar variante
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    )
}
