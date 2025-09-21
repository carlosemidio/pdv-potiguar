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
import { Brand } from '@/types/Brand';
import Pagination from '@/Components/Pagination/Pagination';
import BrandFormModal from '@/Components/BrandFormModal';

export default function Index({
    auth,
    brands,
}: PageProps<{ brands: PaginatedData<Brand> }>) {

    const [confirmingBrandDeletion, setConfirmingBrandDeletion] = useState(false);
    const [brandIdToDelete, setBrandIdToDelete] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);

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

    const openModal = (brand: Brand | null) => {
        setBrandToEdit(brand);
        setIsOpen(true);
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Marcas
                </h2>
            }
        >
            <Head title="Marcas" />

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-2">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3'>
                        {
                            brands?.data?.map((brand) => (
                                <Card key={brand.id} className="relative p-3 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                    <p className='font-semibold text-base truncate'>{brand.name}</p>
                                    <div className='flex justify-end absolute top-2 right-2'>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${brand.status == 1 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                            {brand.status == 1 ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <div className='flex gap-1.5 mt-2 justify-end'>
                                        {(can('brands_delete') && (brand.user_id != null)) && (
                                            <DangerButton size='sm' onClick={() => confirmBrandDeletion(brand.id)} title="Deletar marca">
                                                <Trash className='w-4 h-4' />
                                            </DangerButton>
                                        )}
                                        {(can('brands_edit') && (brand.user_id != null)) && (
                                            <SecondaryButton size='sm' title="Editar marca" onClick={() => openModal(brand)}>
                                                <Edit className='w-4 h-4' />
                                            </SecondaryButton>
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

            <BrandFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} brand={brandToEdit} />

            {can('brands_create') && (
                <button
                    aria-label="Nova marca"
                    className="fixed bottom-14 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                    onClick={() => openModal(null)}
                >
                    <Plus className='w-6 h-6' />
                </button>
            )}

            {brandToDelete && (
                <Modal show={confirmingBrandDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteBrand(); }} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar a marca <span className="font-bold">{brandToDelete.name}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
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
