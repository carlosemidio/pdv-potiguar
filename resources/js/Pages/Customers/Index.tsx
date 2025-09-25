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

            <section className='px-3 text-gray-800 dark:text-gray-200'>
                <div className="max-w-5xl">
                    <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                        {customers?.data?.map((costumer) => (
                            <li key={costumer.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
                                <div className="flex items-center justify-between gap-2 relative p-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className='min-w-0 flex-1'>
                                            <div className="flex items-center gap-2">
                                                <p className='font-semibold text-sm truncate'>{costumer.name}</p>
                                                {costumer.type === 'pj' ? (
                                                    <span className='px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'>
                                                        PJ
                                                    </span>
                                                ) : (
                                                    <span className='px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'>
                                                        PF
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 absolute top-1 right-1'>
                                        {(can('customers_edit') || can('customers_delete')) && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <SecondaryButton size='sm' className='!px-2 !py-1' title='Ações'>
                                                        <MoreVertical className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align='right' width='48'>
                                                    {can('customers_edit') && (
                                                        <button
                                                            type='button'
                                                            onClick={() => openCustomerFormModal(costumer)}
                                                            className='block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 focus:outline-none'
                                                        >
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Edit className='w-4 h-4' /> Editar
                                                            </span>
                                                        </button>
                                                    )}
                                                    {can('customers_delete') && (
                                                        <button
                                                            type='button'
                                                            onClick={() => confirmCustomerDeletion(costumer.id)}
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
