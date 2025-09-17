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
import { Customer } from '@/types/Customer';
import Pagination from '@/Components/Pagination/Pagination';

export default function Index({
    auth,
    customers,
}: PageProps<{ customers: PaginatedData<Customer> }>) {

    const [confirmingCustomerDeletion, setConfirmingCustomerDeletion] = useState(false);
    const [costumerIdToDelete, setCustomerIdToDelete] = useState<number | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const confirmCustomerDeletion = (id: number) => {
        setCustomerIdToDelete(id);
        setConfirmingCustomerDeletion(true);
    };

    const deleteCustomer = () => {
        destroy(route('customers.destroy', { id: costumerIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingCustomerDeletion(false);
        setCustomerIdToDelete(null);
        clearErrors();
        reset();
    };

    const costumerToDelete = customers?.data?.find
        ? customers.data.find(costumer => costumer.id === costumerIdToDelete)
        : null;

    const {
        meta: { links },
    } = customers;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    Clientes
                </h2>
            }
        >
            <Head title="Clientes" />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 min-h-screen'>
                <div className="mx-auto max-w-7xl lg:px-8">

                    <div className='flex justify-end mb-6'>
                        {can('customers_create') && (
                            <Link href={route('customers.create')}>
                                <PrimaryButton className="flex items-center gap-2 shadow-md hover:scale-105 transition-transform">
                                    <span className="font-semibold">+ Adicionar cliente</span>
                                </PrimaryButton>
                            </Link>
                        )}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            customers?.data?.map((costumer) => (
                                <Card key={costumer.id} className="p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className='font-bold text-lg'>{costumer.name}</p>
                                        {costumer.type === 'pj' ? (
                                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-800 dark:text-blue-100">PJ</span>
                                        ) : (
                                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-800 dark:text-green-100">PF</span>
                                        )}
                                    </div>
                                    <div className='flex gap-2 mt-4 justify-end'>
                                        {can('customers_delete') && (
                                            <DangerButton
                                                onClick={() => confirmCustomerDeletion(costumer.id)}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                title="Deletar cliente"
                                            >
                                                <Trash className='w-5 h-5' />
                                            </DangerButton>
                                        )}
                                        {can('customers_edit') && (
                                            <Link href={route('customers.edit', { id: costumer.id })}>
                                                <SecondaryButton
                                                    className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                    title="Editar cliente"
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
                    
                    {customers?.data?.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Nenhum cliente cadastrado.
                        </div>
                    )}
                </div>
            </section>

            {costumerToDelete && (
                <Modal show={confirmingCustomerDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteCustomer(); }} className="p-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Tem certeza que deseja deletar o cliente <span className="font-bold">{costumerToDelete.name}</span>?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Uma vez que o cliente é deletado, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar Cliente
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}
