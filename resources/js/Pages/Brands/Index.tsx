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
import { Brand } from '@/types/Brand';
import Pagination from '@/Components/Pagination/Pagination';

export default function Index({
    auth,
    brands,
}: PageProps<{ brands: PaginatedData<Brand> }>) {

    const [confirmingBrandDeletion, setConfirmingBrandDeletion] = useState(false);
    const [brandIdToDelete, setBrandIdToDelete] = useState<number | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const confirmBrandDeletion = (id: number) => {
        setBrandIdToDelete(id);
        setConfirmingBrandDeletion(true);
    };

    const deleteBrand = () => {
        destroy(route('brands.destroy', { id: brandIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingBrandDeletion(false);
        setBrandIdToDelete(null);
        clearErrors();
        reset();
    };

    const brandToDelete = brands?.data?.find
        ? brands.data.find(brand => brand.id === brandIdToDelete)
        : null;

    const {
        meta: { links },
    } = brands;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    Marcas
                </h2>
            }
        >
            <Head title="Marcas" />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 min-h-screen'>
                <div className="mx-auto max-w-7xl lg:px-8">

                    <div className='flex justify-end mb-6'>
                        {can('brands_create') && (
                            <Link href={route('brands.create')}>
                                <PrimaryButton className="flex items-center gap-2 shadow-md hover:scale-105 transition-transform">
                                    <span className="font-semibold">+ Adicionar marca</span>
                                </PrimaryButton>
                            </Link>
                        )}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            brands?.data?.map((brand) => (
                                <Card key={brand.id} className="p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className='font-bold text-lg'>{brand.name}</p>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${brand.status == 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {brand.status == 1 ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <div className='flex gap-2 mt-4 justify-end'>
                                        {(can('brands_delete') && (brand.user_id != null)) && (
                                            <DangerButton
                                                onClick={() => confirmBrandDeletion(brand.id)}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                title="Deletar marca"
                                            >
                                                <Trash className='w-5 h-5' />
                                            </DangerButton>
                                        )}
                                        {(can('brands_edit') && (brand.user_id != null)) && (
                                            <Link href={route('brands.edit', { id: brand.id })}>
                                                <SecondaryButton
                                                    className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                    title="Editar marca"
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
                    
                    {brands?.data?.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhuma marca cadastrada.
                        </div>
                    )}
                </div>
            </section>

            {brandToDelete && (
                <Modal show={confirmingBrandDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteBrand(); }} className="p-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Tem certeza que deseja deletar a marca <span className="font-bold">{brandToDelete.name}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Uma vez que a marca é deletada, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar Marca
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}
