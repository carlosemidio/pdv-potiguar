import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import Pagination from '@/Components/Pagination/Pagination';
import { StoreProductVariant } from '@/types/StoreProductVariant';

export default function Index({
    auth,
    storeProductVariants,
}: PageProps<{ storeProductVariants: PaginatedData<StoreProductVariant> }>) {
    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

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

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-8">

                    <div className='flex justify-end'>
                        {can('store-product-variants_create') && (
                            <Link href={route('store-product-variant.create')}>
                                <PrimaryButton>
                                    Nova variante
                                </PrimaryButton>
                            </Link>
                        )}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4'>
                        {
                            data.map((item) => (
                                <Card key={item.id} className='relative flex flex-col justify-between'>
                                    {item?.product_variant?.image && (
                                        <img src={item?.product_variant?.image?.file_url} alt={item.product_variant.name} className='w-full h-32 object-contain rounded-t-lg' />
                                    )}

                                    <p className='font-semibold'>{item.product_variant.name}</p>

                                    <div className='flex-1'>
                                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                                            {item.product_variant.product.description}
                                        </p>

                                        <p className='text-xs text-gray-500 dark:text-gray-300 mt-2'>
                                            Criado em: { formatCustomDateTime(item.created_at) }
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-gray-300'>
                                            Atualizado em: { formatCustomDateTime(item.updated_at)}
                                        </p>
                                    </div>

                                    <div className='flex gap-2 mt-2 justify-end'>
                                        {can('store-product-variants_delete') && (
                                            <DangerButton onClick={() => handleDeleteClick(item)} disabled={processing}>
                                                <Trash className='w-5 h-5' />
                                            </DangerButton>
                                        )}
                                        {can('store-product-variants_edit') && (
                                            <Link href={route('store-product-variant.edit', { id: item.id })}>
                                                <SecondaryButton>
                                                    <Edit className='w-5 h-5' />
                                                </SecondaryButton>
                                            </Link>
                                        )}
                                        {can('store-product-variants_view') && (
                                            <Link href={route('store-product-variant.show', { id: item.id })}>
                                                <PrimaryButton>
                                                    <Eye className='w-5 h-5' />
                                                </PrimaryButton>
                                            </Link>
                                        )}
                                    </div>

                                    <Modal show={showModal} onClose={closeModal}>
                                        <form onSubmit={(e) => { e.preventDefault(); deleteVariant(); }} className="p-6">
                                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                Tem certeza que deseja deletar {variant?.product_variant.name}?
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                Uma vez que a variante é deletada, todos os seus recursos e
                                                dados serão permanentemente deletados.
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
                                </Card>
                            ))
                        }

                        {data.length === 0 && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400 col-span-full">
                                Nenhuma variante cadastrada.
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <Pagination links={meta.links} />
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}
