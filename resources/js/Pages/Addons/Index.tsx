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
import { Addon } from '@/types/Addon';
import Pagination from '@/Components/Pagination/Pagination';

export default function Index({
    auth,
    addons,
}: PageProps<{ addons: PaginatedData<Addon> }>) {

    const [confirmingAddonDeletion, setConfirmingAddonDeletion] = useState(false);
    const [addonIdToDelete, setAddonIdToDelete] = useState<number | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const confirmAddonDeletion = (id: number) => {
        setAddonIdToDelete(id);
        setConfirmingAddonDeletion(true);
    };

    const deleteAddon = () => {
        destroy(route('addons.destroy', { id: addonIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingAddonDeletion(false);
        setAddonIdToDelete(null);
        clearErrors();
        reset();
    };

    const addonToDelete = addons?.data?.find
        ? addons.data.find(addon => addon.id === addonIdToDelete)
        : null;

    const {
        meta: { links },
    } = addons;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    Complementos
                </h2>
            }
        >
            <Head title="Complementos" />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 min-h-screen'>
                <div className="mx-auto max-w-7xl lg:px-8">

                    <div className='flex justify-end mb-6'>
                        {can('addons_create') && (
                            <Link href={route('addons.create')}>
                                <PrimaryButton className="flex items-center gap-2 shadow-md hover:scale-105 transition-transform">
                                    <span className="font-semibold">+ Adicionar complemento</span>
                                </PrimaryButton>
                            </Link>
                        )}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            addons?.data?.map((addon) => (
                                <Card key={addon.id} className="p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className='font-bold text-lg'>{addon.name}</p>
                                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium">
                                            R$ {addon.price}
                                        </span>
                                    </div>
                                    <div className='mt-2'>
                                        <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Descrição</p>
                                        <span className="block bg-gray-100 rounded-lg p-2 text-sm dark:bg-gray-800 dark:text-gray-200 min-h-[40px]">
                                            {addon.description || <span className="italic text-gray-400">Sem descrição</span>}
                                        </span>
                                    </div>
                                    <div className='flex gap-2 mt-4 justify-end'>
                                        {(can('addons_delete') && (addon.user_id != null)) && (
                                            <DangerButton
                                                onClick={() => confirmAddonDeletion(addon.id)}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                title="Deletar complemento"
                                            >
                                                <Trash className='w-5 h-5' />
                                            </DangerButton>
                                        )}
                                        {(can('addons_edit') && (addon.user_id != null)) && (
                                            <Link href={route('addons.edit', { id: addon.id })}>
                                                <SecondaryButton
                                                    className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                    title="Editar complemento"
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
                    
                    {addons?.data?.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhum complemento cadastrado.
                        </div>
                    )}
                </div>
            </section>

            {addonToDelete && (
                <Modal show={confirmingAddonDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteAddon(); }} className="p-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Tem certeza que deseja deletar o complemento <span className="font-bold">{addonToDelete.name}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Uma vez que o complemento é deletado, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar Complemento
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}