import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash, Plus, MoreVertical } from 'lucide-react';
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

            <section className='px-3 text-gray-800 dark:text-gray-200 max-w-5xl'>
                <div className="mx-auto lg:px-2">
                    <ul className='grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3'>
                        {data.map((item) => (
                            <li key={item.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
                                <div className="flex items-center justify-between gap-2 relative p-2">
                                    {can('store-product-variants_view') ? (
                                        <Link href={route('store-product-variant.show', { id: item.id })} className="flex items-center gap-3 flex-1 min-w-0 rounded-md -m-1 p-1 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <Image src={item?.product_variant?.image?.file_url} alt={item?.product_variant?.name || 'Variante'} className='w-10 h-10 object-cover rounded-md bg-gray-100 dark:bg-gray-800 flex-shrink-0' />
                                            <div className='min-w-0 flex-1'>
                                                <div className="flex items-center gap-2">
                                                    <p className='font-semibold text-sm truncate'>{item?.product_variant?.name || '—'}</p>
                                                    {!!item?.featured && (
                                                        <span className='text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'>Destaque</span>
                                                    )}
                                                </div>
                                                <div className='mt-1 flex flex-wrap items-end gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                    <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800'>SKU: {item?.product_variant?.sku || '—'}</span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${Number.isFinite(Number((item as any)?.price)) ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                                                        {Number.isFinite(Number((item as any)?.price))
                                                            ? Number((item as any).price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                            : '—'}
                                                    </span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${(item?.stock_quantity ?? 0) > 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}>
                                                        Estoque: {item?.stock_quantity ?? 0}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">{formatCustomDateTime(item.updated_at ?? '')}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <Image src={item?.product_variant?.image?.file_url} alt={item?.product_variant?.name || 'Variante'} className='w-10 h-10 object-cover rounded-md bg-gray-100 dark:bg-gray-800 flex-shrink-0' />
                                            <div className='min-w-0 flex-1'>
                                                <div className="flex items-center gap-2">
                                                    <p className='font-semibold text-sm truncate'>{item?.product_variant?.name || '—'}</p>
                                                    {!!item?.featured && (
                                                        <span className='text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'>Destaque</span>
                                                    )}
                                                </div>
                                                <div className='mt-1 flex flex-wrap items-end gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                    <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800'>SKU: {item?.product_variant?.sku || '—'}</span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${Number.isFinite(Number((item as any)?.price)) ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                                                        {Number.isFinite(Number((item as any)?.price))
                                                            ? Number((item as any).price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                            : '—'}
                                                    </span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${(item?.stock_quantity ?? 0) > 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}>
                                                        Estoque: {item?.stock_quantity ?? 0}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">{formatCustomDateTime(item.updated_at ?? '')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className='flex flex-col gap-1 absolute top-1 right-1'>
                                        {(can('store-product-variants_view') || can('store-product-variants_edit') || can('store-product-variants_delete')) && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <SecondaryButton size='sm' className='!px-2 !py-1' title='Ações'>
                                                        <MoreVertical className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align='right' width='48'>
                                                    {can('store-product-variants_view') && (
                                                        <Dropdown.Link href={route('store-product-variant.show', { id: item.id })}>
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Eye className='w-4 h-4' /> Ver detalhes
                                                            </span>
                                                        </Dropdown.Link>
                                                    )}
                                                    {can('store-product-variants_edit') && (
                                                        <Dropdown.Link href={route('store-product-variant.edit', { id: item.id })}>
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Edit className='w-4 h-4' /> Editar
                                                            </span>
                                                        </Dropdown.Link>
                                                    )}
                                                    {can('store-product-variants_delete') && (
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

                    {data.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhuma variante cadastrada.
                        </div>
                    )}

                    {can('store-product-variants_create') && (
                        <Link href={route('store-product-variant.create')}>
                            <button
                                aria-label="Nova variante da loja"
                                className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </Link>
                    )}
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
