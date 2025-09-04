import Card from '@/Components/Card';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Store } from '@/types/Store';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';

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

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-8">

                    <div className='flex justify-end'>
                        {can('stores_create') && (
                            <Link href={route('store.create')}>
                                <PrimaryButton>
                                    Nova loja
                                </PrimaryButton>
                            </Link>
                        )}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-4'>
                        {
                            stores.data.map((item) => (
                                <Card key={item.id} className='relative flex flex-col justify-between'>
                                    {item.image && (
                                        <img src={item.image.file_url} alt={item.name} className='w-full h-32 object-cover rounded-t-lg' />
                                    )}

                                    <p className='font-semibold'>{item.name}</p>
                                    <div className='mt-4 flex justify-end absolute top-0 right-2'>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
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


                                    <div className='flex gap-2 mt-2 justify-end'>
                                        {can('stores_delete') && (
                                            <DangerButton onClick={() => handleDeleteClick(item)} disabled={processing}>
                                                <Trash className='w-5 h-5' />
                                            </DangerButton>
                                        )}
                                        {can('stores_edit') && (
                                            <Link href={route('store.edit', { id: item.id })}>
                                                <SecondaryButton>
                                                    <Edit className='w-5 h-5' />
                                                </SecondaryButton>
                                            </Link>
                                        )}
                                        {can('stores_view') && (
                                            <Link href={route('store.show', { id: item.id })}>
                                                <PrimaryButton>
                                                    <Eye className='w-5 h-5' />
                                                </PrimaryButton>
                                            </Link>
                                        )}
                                    </div>

                                    <Modal show={showModal} onClose={closeModal}>
                                        <form onSubmit={(e) => { e.preventDefault(); deleteUser(); }} className="p-6">
                                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                Tem certeza que deseja deletar {store?.name}?
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                Uma vez que a loja é deletada, todos os seus recursos e
                                                dados serão permanentemente deletados.
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
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}