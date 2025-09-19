import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash, Plus } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import Pagination from '@/Components/Pagination/Pagination';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import Image from '@/Components/Image';

export default function Index({
    auth,
    storeProductVariants,
}: PageProps<{ storeProductVariants: PaginatedData<StoreProductVariant> }>) {
    const { delete: destroy, processing: processingDelete, reset, clearErrors } = useForm();

    const [showModal, setShowModal] = useState(false);
    const [variant, setVariant] = useState<StoreProductVariant | null>(null);

    const handleDeleteClick = (variant: StoreProductVariant) => {
        setVariant(variant);
        setShowModal(true);
    };

    const deleteVariant = () => {
        destroy(route('store-product-variant.destroy', { id: variant?.id }), {
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

    const { data, meta } = storeProductVariants;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Variantes de Produto da Loja
                </h2>
            }
        >
            <Head title="Variantes de Produto da Loja" />

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-2">

                    {can('store-product-variants_create') && (
                        <Link href={route('store-product-variant.create')}>
                            <button
                                aria-label="Nova variante da loja"
                                className="fixed bottom-14 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </Link>
                    )}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3'>
                        {
                            data.map((item) => (
                                <div key={item.id} className='relative flex flex-col justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-sm'>
                                    {!!item?.featured && (
                                        <span className='absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200'>Destaque</span>
                                    )}

                                    <Image src={item?.product_variant?.image?.file_url} alt={item?.product_variant?.name || 'Variante'} className='w-full h-64 object-cover rounded-md mb-2' />

                                    <p className='font-semibold text-base truncate'>{item?.product_variant?.name || '—'}</p>

                                    <div className='mt-1'>
                                        <p className='text-sm text-gray-700 dark:text-gray-300'>
                                            <span className='text-gray-600 dark:text-gray-400'>SKU: </span>{item?.product_variant?.sku || '—'}
                                        </p>

                                        <div className='mt-1 flex items-center gap-2 text-sm'>
                                            <span className='inline-flex items-center rounded-md bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 px-2 py-0.5 text-xs border border-green-200 dark:border-green-800'>
                                                {Number.isFinite(Number((item as any)?.price))
                                                    ? Number((item as any).price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                    : '—'}
                                            </span>
                                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs border ${(item?.stock_quantity ?? 0) > 0 ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800' : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800'}`}>
                                                Estoque: {item?.stock_quantity ?? 0}
                                            </span>
                                        </div>

                                        <p className='text-[11px] text-gray-500 dark:text-gray-400 mt-2'>
                                            Criado: { formatCustomDateTime(item.created_at) }
                                        </p>
                                        <p className='text-[11px] text-gray-500 dark:text-gray-400'>
                                            Atualizado: { formatCustomDateTime(item.updated_at)}
                                        </p>
                                    </div>

                                    <div className='flex gap-1.5 mt-2 justify-end'>
                                        {can('store-product-variants_delete') && (
                                            <DangerButton onClick={() => handleDeleteClick(item)} disabled={processingDelete} size="sm" title="Deletar variante da loja">
                                                <Trash className='w-4 h-4' />
                                            </DangerButton>
                                        )}
                                        {can('store-product-variants_edit') && (
                                            <Link href={route('store-product-variant.edit', { id: item.id })}>
                                                <SecondaryButton size="sm" title="Editar variante da loja">
                                                    <Edit className='w-4 h-4' />
                                                </SecondaryButton>
                                            </Link>
                                        )}
                                        {can('store-product-variants_view') && (
                                            <Link href={route('store-product-variant.show', { id: item.id })}>
                                                <PrimaryButton size="sm" title="Visualizar variante da loja">
                                                    <Eye className='w-4 h-4' />
                                                </PrimaryButton>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                        }

                        {data.length === 0 && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400 col-span-full">
                                Nenhuma variante cadastrada.
                            </div>
                        )}
                    </div>

                    <Pagination links={meta.links} />
                </div>
            </section>
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={(e) => { e.preventDefault(); deleteVariant(); }} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Tem certeza que deseja deletar {variant?.product_variant?.name ?? 'esta variante'}?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Uma vez que a variante é deletada, todos os seus recursos e dados serão permanentemente deletados.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processingDelete}>
                            Deletar variante
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    )
}
