import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Store } from '@/types/Store';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash, Plus, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import Image from '@/Components/Image';

export default function Index({
    auth,
    stores,
}: PageProps<{ stores: { data: Store[]} }>) {
    const {
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm();

    const [showModal, setShowModal] = useState(false);
    const [store, setStore] = useState<Store | null>(null);

    const handleDeleteClick = (store: Store) => {
        setStore(store);
        setShowModal(true);
    };

    const deleteUser = () => {
        destroy(route('store.destroy', { id: store?.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                setStore(null);
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setShowModal(false);
        clearErrors();
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Lojas
                </h2>
            }
        >
            <Head title="Lojas" />

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="max-w-5xl">
                    <ul className='mt-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1'>
                        {stores.data.map((item) => (
                            <li key={item.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
                                <div className="flex items-center justify-between gap-2 relative p-2">
                                    {can('stores_view') ? (
                                        <Link href={route('store.show', { id: item.id })} className="flex items-start gap-3 flex-1 min-w-0 rounded-md -m-1 p-1 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <Image src={item?.image?.file_url} alt={item.name} className='w-10 h-10 object-cover rounded-md bg-gray-100 dark:bg-gray-800 flex-shrink-0' />
                                            <div className='min-w-0 flex-1'>
                                                <div className="flex items-center gap-2">
                                                    <p className='font-semibold text-sm truncate'>{item.name}</p>
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${item.status ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}>
                                                        {item.status ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </div>
                                                <div className='mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                    {item?.user?.name && (
                                                        <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px]'>
                                                            {item.user.name}
                                                        </span>
                                                    )}
                                                    {item?.city?.name && (
                                                        <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px]'>
                                                            {item.city.name}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">
                                                        {formatCustomDateTime(item.updated_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <Image src={item?.image?.file_url} alt={item.name} className='w-10 h-10 object-cover rounded-md bg-gray-100 dark:bg-gray-800 flex-shrink-0' />
                                            <div className='min-w-0 flex-1'>
                                                <div className="flex items-center gap-2">
                                                    <p className='font-semibold text-sm truncate'>{item.name}</p>
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${item.status ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}>
                                                        {item.status ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </div>
                                                <div className='mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                    {item?.user?.name && (
                                                        <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px]'>
                                                            {item.user.name}
                                                        </span>
                                                    )}
                                                    {item?.city?.name && (
                                                        <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px]'>
                                                            {item.city.name}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">
                                                        {formatCustomDateTime(item.updated_at)}
                                                    </span>
                                                </div>
                                                {item.description && (
                                                    <div className='mt-1 text-[11px] text-gray-600 dark:text-gray-400 truncate'>
                                                        {item.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div className='flex flex-col gap-1 absolute top-1 right-1'>
                                        {(can('stores_view') || can('stores_edit') || can('stores_delete')) && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <SecondaryButton size='sm' className='!px-2 !py-1' title='Ações'>
                                                        <MoreVertical className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align='right' width='48'>
                                                    {can('stores_view') && (
                                                        <Dropdown.Link href={route('store.show', { id: item.id })}>
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Eye className='w-4 h-4' /> Ver detalhes
                                                            </span>
                                                        </Dropdown.Link>
                                                    )}
                                                    {can('stores_edit') && (
                                                        <Dropdown.Link href={route('store.edit', { id: item.id })}>
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Edit className='w-4 h-4' /> Editar
                                                            </span>
                                                        </Dropdown.Link>
                                                    )}
                                                    {can('stores_delete') && (
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

                    {stores.data.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhuma loja cadastrada.
                        </div>
                    )}

                    {can('stores_create') && (
                        <Link href={route('store.create')}>
                            <button
                                aria-label="Nova loja"
                                className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                            >
                                <Plus className='w-6 h-6' />
                            </button>
                        </Link>
                    )}
                </div>
            </section>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={(e) => { e.preventDefault(); deleteUser(); }} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Tem certeza que deseja deletar {store?.name}?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Uma vez que a loja é deletada, todos os seus recursos e dados serão permanentemente deletados.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Deletar loja
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    )
}