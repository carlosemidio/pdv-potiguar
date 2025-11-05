import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, Users, Phone, Mail, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { Customer } from '@/types/Customer';
import Pagination from '@/Components/Pagination/Pagination';
import CustomerFormModal from '@/Components/CustomerFormModal';
import CustomersFilterBar from '@/Components/CustomersFilterBar';

export default function Index({
    auth,
    customers,
    filters
}: PageProps<{ customers: PaginatedData<Customer>, filters: {field?: string; search?: string;} }>) {

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

    const { meta: { links } } = customers;

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Clientes
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Gerencie seus clientes e contatos
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => openCustomerFormModal(null)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Cliente
                    </button>
                </div>
            }
        >
            <Head title="Clientes" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container px-4 py-6 max-w-7xl">
                    {/* Filter Section */}
                    <div className="mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Filtros de Busca
                            </h3>
                            <CustomersFilterBar filters={filters} />
                        </div>
                    </div>

                    {/* Customers Grid */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Lista de Clientes
                                    </h3>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {customers.meta.total} clientes cadastrados
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {customers?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {customers.data.map((costumer) => (
                                        <div
                                            key={costumer.id}
                                            className={`relative rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200
                                                ${costumer.deleted_at
                                                    ? 'bg-gray-100 dark:bg-gray-900 opacity-60'
                                                    : 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750'}
                                            `}
                                        >
                                            {/* Tag Deletado */}
                                            {costumer.deleted_at && (
                                                <div className="absolute top-3 left-3 z-50 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow">
                                                    Deletado
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {costumer.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                                            {costumer.name}
                                                        </h4>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            costumer.type === 'pj' 
                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' 
                                                                : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                                                        }`}>
                                                            {costumer.type === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {(!costumer.deleted_at && can('customers_edit')) && (
                                                        <button
                                                            onClick={() => openCustomerFormModal(costumer)}
                                                            className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 transition-colors"
                                                            title="Editar cliente"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {(!costumer.deleted_at && can('customers_delete')) && (
                                                        <button
                                                            onClick={() => confirmCustomerDeletion(costumer.id)}
                                                            className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition-colors"
                                                            title="Excluir cliente"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    {(costumer.deleted_at && can('customers_delete')) && (
                                                        <button
                                                            onClick={() => router.put(route('customers.restore', { id: costumer.id }), {
                                                                preserveScroll: true
                                                            })}
                                                            className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-800 text-green-600 dark:text-green-400 transition-colors"
                                                            title="Restaurar cliente"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Customer Information */}
                                            <div className="space-y-3 mt-4">
                                                {costumer.doc && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="font-medium">Doc:</span>
                                                        <span>{costumer.doc}</span>
                                                    </div>
                                                )}
                                                
                                                {costumer.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{costumer.phone}</span>
                                                    </div>
                                                )}
                                                
                                                {costumer.email && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <Mail className="w-4 h-4" />
                                                        <span className="truncate">{costumer.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <Users className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                Nenhum cliente encontrado
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                Comece adicionando seu primeiro cliente.
                                            </p>
                                        </div>
                                        {can('customers_create') && (
                                            <button
                                                onClick={() => openCustomerFormModal(null)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Adicionar Cliente
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <Pagination links={links} />
                    </div>
                </div>
            </div>

            <CustomerFormModal
                isOpen={isOpen}
                onClose={closeCustomerFormModal}
                customer={customerToEdit}
            />

            {can('customers_create') && (
                <button
                    aria-label="Novo cliente"
                    className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg h-14 w-14 transition-all duration-200 hover:shadow-xl"
                    onClick={() => openCustomerFormModal(null)}
                >
                    <Plus className="h-6 w-6" />
                </button>
            )}

            {costumerToDelete && (
                <Modal show={confirmingCustomerDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteCustomer(); }} className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
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
