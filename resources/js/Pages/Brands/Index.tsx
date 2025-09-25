import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, MoreVertical } from 'lucide-react';
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
                <div className="max-w-5xl">
                    <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1'>
                        {brands?.data?.map((brand) => (
                            <li key={brand.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
                                <div className="flex items-center justify-between gap-2 relative p-2">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className='min-w-0 flex-1'>
                                            <div className="flex items-center gap-2">
                                                <p className='font-semibold text-sm truncate'>{brand.name}</p>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${brand.status == 1 ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}>
                                                    {brand.status == 1 ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 absolute top-1 right-1'>
                                        {((can('brands_edit') && brand.user_id != null) || (can('brands_delete') && brand.user_id != null)) && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <SecondaryButton size='sm' className='!px-2 !py-1' title='Ações'>
                                                        <MoreVertical className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align='right' width='48'>
                                                    {(can('brands_edit') && brand.user_id != null) && (
                                                        <button
                                                            type='button'
                                                            onClick={() => openModal(brand)}
                                                            className='block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none'
                                                        >
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Edit className='w-4 h-4' /> Editar
                                                            </span>
                                                        </button>
                                                    )}
                                                    {(can('brands_delete') && brand.user_id != null) && (
                                                        <button
                                                            type='button'
                                                            onClick={() => confirmBrandDeletion(brand.id)}
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
                    </ul>                    <Pagination links={links} />
                    
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
                    className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
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
