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
import { Addon } from '@/types/Addon';
import Pagination from '@/Components/Pagination/Pagination';
import AddonFormModal from '@/Components/AddonFormModal';

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
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Complementos
                </h2>
            }
        >
            <Head title="Complementos" />

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="max-w-5xl">
                    <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1'>
                        {addons?.data?.map((addon) => (
                            <li key={addon.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
                                <div className="flex items-center justify-between gap-2 relative p-2">
                                    {can('addons_view') ? (
                                        <Link href={route('addons.show', { id: addon.id })} className="flex items-center gap-3 flex-1 min-w-0 rounded-md -m-1 p-1 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <div className='min-w-0 flex-1'>
                                                <p className='font-semibold text-sm truncate'>{addon.name}</p>
                                                <div className='mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                    {addon.addon_ingredients && addon.addon_ingredients.length > 0 ? (
                                                        <>
                                                            {addon.addon_ingredients.slice(0, 2).map((addonIngredient) => (
                                                                <span key={addonIngredient.id} className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px]'>
                                                                    {addonIngredient.ingredient?.name || '—'}
                                                                </span>
                                                            ))}
                                                            {addon.addon_ingredients.length > 2 && (
                                                                <span className='text-[10px] text-gray-500'>+{addon.addon_ingredients.length - 2} mais</span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'>Sem ingredientes</span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className='min-w-0 flex-1'>
                                                <p className='font-semibold text-sm truncate'>{addon.name}</p>
                                                <div className='mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                    {addon.addon_ingredients && addon.addon_ingredients.length > 0 ? (
                                                        <>
                                                            {addon.addon_ingredients.slice(0, 2).map((addonIngredient) => (
                                                                <span key={addonIngredient.id} className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px]'>
                                                                    {addonIngredient.ingredient?.name || '—'}
                                                                </span>
                                                            ))}
                                                            {addon.addon_ingredients.length > 2 && (
                                                                <span className='text-[10px] text-gray-500'>+{addon.addon_ingredients.length - 2} mais</span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'>Sem ingredientes</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className='flex flex-col gap-1 absolute top-1 right-1'>
                                        {(can('addons_view') || (can('addons_edit') && addon.user_id != null) || (can('addons_delete') && addon.user_id != null && typeof addon.id === 'number')) && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <SecondaryButton size='sm' className='!px-2 !py-1' title='Ações'>
                                                        <MoreVertical className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align='right' width='48'>
                                                    {can('addons_view') && (
                                                        <Dropdown.Link href={route('addons.show', { id: addon.id })}>
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Eye className='w-4 h-4' /> Ver detalhes
                                                            </span>
                                                        </Dropdown.Link>
                                                    )}
                                                    {(can('addons_edit') && addon.user_id != null) && (
                                                        <button
                                                            type='button'
                                                            onClick={() => openModal(addon)}
                                                            className='block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none'
                                                        >
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Edit className='w-4 h-4' /> Editar
                                                            </span>
                                                        </button>
                                                    )}
                                                    {(can('addons_delete') && addon.user_id != null && typeof addon.id === 'number') && (
                                                        <button
                                                            type='button'
                                                            onClick={() => confirmAddonDeletion(addon.id!)}
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
                    className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
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
