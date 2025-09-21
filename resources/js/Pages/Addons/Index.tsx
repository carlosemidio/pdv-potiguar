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
import { Addon } from '@/types/Addon'; // Troque para o tipo correto
import Pagination from '@/Components/Pagination/Pagination';
import AddonFormModal from '@/Components/AddonFormModal'; // Troque para o componente correto
import { CgProductHunt } from 'react-icons/cg';
import { add } from 'lodash';

export default function Index({
    auth,
    addons,
}: PageProps<{ addons: PaginatedData<Addon> }>) {

    const [confirmingAddonDeletion, setConfirmingAddonDeletion] = useState(false);
    const [addonIdToDelete, setAddonIdToDelete] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [addonToEdit, setAddonToEdit] = useState<Addon | null>(null);

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

    const openModal = (addon: Addon | null) => {
        setAddonToEdit(addon);
        setIsOpen(true);
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Complementos
                </h2>
            }
        >
            <Head title="Complementos" />

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-2">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3'>
                        {
                            addons?.data?.map((addon) => (
                                <Card key={addon.id} className="relative p-3 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                    <p className='font-semibold text-base truncate'>{addon.name}</p>

                                    <p className='mt-1 text-sm text-gray-700 dark:text-gray-300'>
                                        Ingredientes:
                                    </p>

                                    <ul className='list-disc list-inside text-sm text-gray-700 dark:text-gray-300'>
                                        {addon.addon_ingredients && addon.addon_ingredients.length > 0 ? (
                                            addon.addon_ingredients.map((addonIngredient) => (
                                                <li key={addonIngredient.id} className='truncate'>
                                                    {addonIngredient.ingredient ? addonIngredient.ingredient.name : '—'}
                                                </li>
                                            ))
                                        ) : (
                                            <li className='text-gray-500 dark:text-gray-400'>Nenhum ingrediente associado.</li>
                                        )}
                                    </ul>

                                    <div className='flex gap-1.5 mt-2 justify-end'>
                                        {(can('addons_delete') && (addon.user_id != null) && typeof addon.id === 'number') && (
                                            <DangerButton size='sm' onClick={() => confirmAddonDeletion(addon.id!)} title="Deletar complemento">
                                                <Trash className='w-4 h-4' />
                                            </DangerButton>
                                        )}
                                        {(can('addons_edit') && (addon.user_id != null)) && (
                                            <SecondaryButton size='sm' title="Editar complemento" onClick={() => openModal(addon)}>
                                                <Edit className='w-4 h-4' />
                                            </SecondaryButton>
                                        )}

                                        {!can('addons_show') && (
                                            <Link href={route('addons.show', { id: addon.id })}>
                                                <SecondaryButton size='sm' title="Ver detalhes do complemento">
                                                    <CgProductHunt className='w-4 h-4' />
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

            <AddonFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} addon={addonToEdit} />

            {can('addons_create') && (
                <button
                    aria-label="Novo complemento"
                    className="fixed bottom-14 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                    onClick={() => openModal(null)}
                >
                    <Plus className='w-6 h-6' />
                </button>
            )}

            {addonToDelete && (
                <Modal show={confirmingAddonDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteAddon(); }} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar o complemento <span className="font-bold">{addonToDelete.name}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
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
