import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { ProductVariant } from '@/types/ProductVariant';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import Pagination from '@/Components/Pagination/Pagination';
import Image from '@/Components/Image';

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
                    Variantes
                </h2>
            }
        >
            <Head title="Variantes de Produtos" />

            <section className='px-3 text-gray-800 dark:text-gray-200 max-w-5xl'>
                <div className="mx-auto lg:px-2">
                    <ul className='grid grid-cols-1 lg:grid-cols-2 gap-1 mt-2'>
                        {data.map((item) => (
                            <li key={item.id} className="p-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
                                <div className="flex items-center justify-between gap-2 relative">
                                    {can('product-variants_view') ? (
                                        <Link href={route('product-variant.show', { id: item.id })} className="flex items-center gap-3 flex-1 min-w-0 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                                            {item?.image && <Image src={item?.image?.file_url} alt={item.name} className='w-10 h-10 object-cover rounded-md bg-gray-100 dark:bg-gray-800 flex-shrink-0' />}
                                            <div className='min-w-0 flex-1'>
                                                <p className='font-semibold text-sm truncate'>{item.name}</p>
                                                <div className='mt-1 flex flex-wrap items-end gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                    {item.product?.name && (
                                                        <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800'>{item.product.name}</span>
                                                    )}
                                                    <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800'>SKU: {item.sku || '—'}</span>
                                                    <button
                                                        type="button"
                                                        title="Copiar SKU"
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); item.sku && navigator.clipboard.writeText(item.sku); }}
                                                        className='px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] hover:bg-gray-200 dark:hover:bg-gray-700'
                                                    >
                                                        copiar
                                                    </button>
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">{formatCustomDateTime(item.updated_at)}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {item?.image && <Image src={item?.image?.file_url} alt={item.name} className='w-10 h-10 object-cover rounded-md bg-gray-100 dark:bg-gray-800 flex-shrink-0' />}
                                            <div className='min-w-0 flex-1'>
                                                <p className='font-semibold text-sm truncate'>{item.name}</p>
                                                <div className='mt-1 flex flex-wrap items-end gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                    {item.product?.name && (
                                                        <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800'>{item.product.name}</span>
                                                    )}
                                                    <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800'>SKU: {item.sku || '—'}</span>
                                                    <button
                                                        type="button"
                                                        title="Copiar SKU"
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); item.sku && navigator.clipboard.writeText(item.sku); }}
                                                        className='px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] hover:bg-gray-200 dark:hover:bg-gray-700'
                                                    >
                                                        copiar
                                                    </button>
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">{formatCustomDateTime(item.updated_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className='flex flex-col gap-1 absolute top-0 right-0'>
                                        {(can('product-variants_edit') || can('product-variants_delete')) && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <SecondaryButton size='sm' className='!px-2 !py-1' title='Ações'>
                                                        <MoreVertical className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align='right' width='48'>
                                                    {can('product-variants_edit') && (
                                                        <Dropdown.Link href={route('product-variant.edit', { id: item.id })}>
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Edit className='w-4 h-4' /> Editar
                                                            </span>
                                                        </Dropdown.Link>
                                                    )}
                                                    {can('product-variants_delete') && (
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

                    {can('product-variants_create') && (
                        <Link href={route('product-variant.create')}>
                            <button
                                aria-label="Nova variante"
                                className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
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
