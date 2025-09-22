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
import { Customer } from '@/types/Customer';
import Pagination from '@/Components/Pagination/Pagination';
import CustomerFormModal from '@/Components/CustomerFormModal';

export default function Index({
    auth,
    customers,
}: PageProps<{ customers: PaginatedData<Customer> }>) {

    const [confirmingCustomerDeletion, setConfirmingCustomerDeletion] = useState(false);
    const [costumerIdToDelete, setCustomerIdToDelete] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

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

    const openCustomerFormModal = (customer: Customer | null) => {
        setCustomerToEdit(customer);
        setIsOpen(true);
    };

    const closeCustomerFormModal = () => {
        setCustomerToEdit(null);
        setIsOpen(false);
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

            <section className='px-2 text-gray-800 dark:text-gray-200 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 min-h-screen'>
                <div className="mx-auto lg:px-2">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
                        {
                            customers?.data?.map((costumer) => (
                                <Card key={costumer.id} className="p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className='font-semibold text-base truncate'>{costumer.name}</p>
                                        {costumer.type === 'pj' ? (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-800 dark:text-blue-100">PJ</span>
                                        ) : (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-800 dark:text-green-100">PF</span>
                                        )}
                                    </div>
                                    <div className='flex gap-1.5 mt-2 justify-end'>
                                        {can('customers_delete') && (
                                            <DangerButton size="sm"
                                                onClick={() => confirmCustomerDeletion(costumer.id)}
                                                className="flex items-center gap-1"
                                                title="Deletar cliente"
                                            >
                                                <Trash className='w-4 h-4' />
                                            </DangerButton>
                                        )}
                                        {can('customers_edit') && (
                                            <SecondaryButton size="sm"
                                                className="flex items-center gap-1"
                                                title="Editar cliente"
                                                onClick={() => openCustomerFormModal(costumer)}
                                            >
                                                <Edit className='w-4 h-4' />
                                            </SecondaryButton>
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

                    <CustomerFormModal
                        isOpen={isOpen}
                        onClose={closeCustomerFormModal}
                        customer={customerToEdit}
                    />

                    {can('customers_create') && (
                        <button
                            aria-label="Novo cliente"
                            className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                            onClick={() => openCustomerFormModal(null)}
                        >
                            <Plus className="h-6 w-6" />
                        </button>
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
