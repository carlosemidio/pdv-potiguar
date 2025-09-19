import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Store } from '@/types/Store';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash, Plus } from 'lucide-react';
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
                <div className="mx-auto lg:px-2">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3'>
                        {
                            stores.data.map((item) => (
                                <Card key={item.id} className='relative flex flex-col justify-between p-3 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'>
                                    <Image src={item?.image?.file_url} alt={item.name} className='w-full h-64 object-cover rounded-md mb-2' />

                                    <p className='font-semibold text-base truncate mt-2'>{item.name}</p>
                                    <div className='flex justify-end absolute top-2 right-2'>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                            {item.status ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>

                                    <div className='flex-1'>
                                        <p className='text-sm text-gray-700 dark:text-gray-300'>
                                            {item?.user?.name} - {item?.city?.name}
                                        </p>


                                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                                            {item.description || 'Sem descrição'}
                                        </p>

                                        <p className='text-xs text-gray-500 dark:text-gray-300 mt-2'>
                                            Criado em: { formatCustomDateTime(item.created_at) }
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-gray-300'>
                                            Atualizado em: { formatCustomDateTime(item.updated_at)}
                                        </p>
                                    </div>


                                    <div className='flex gap-1.5 mt-2 justify-end'>
                                        {can('stores_delete') && (
                                            <DangerButton size='sm' onClick={() => handleDeleteClick(item)} disabled={processing} title='Excluir loja'>
                                                <Trash className='w-4 h-4' />
                                            </DangerButton>
                                        )}
                                        {can('stores_edit') && (
                                            <Link href={route('store.edit', { id: item.id })}>
                                                <SecondaryButton size='sm' title='Editar loja'>
                                                    <Edit className='w-4 h-4' />
                                                </SecondaryButton>
                                            </Link>
                                        )}
                                        {can('stores_view') && (
                                            <Link href={route('store.show', { id: item.id })}>
                                                <PrimaryButton size='sm' title='Ver loja'>
                                                    <Eye className='w-4 h-4' />
                                                </PrimaryButton>
                                            </Link>
                                        )}
                                    </div>
                                </Card>
                            ))
                        }
                    </div>

                    {can('stores_create') && (
                        <Link href={route('store.create')}>
                            <button
                                aria-label="Nova loja"
                                className="fixed bottom-14 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
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