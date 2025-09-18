import PrimaryButton from '@/Components/PrimaryButton';
import SearchableCustomersSelect from '@/Components/SearchableCustomersSelect';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Customer } from '@/types/Customer';
import { Order } from '@/types/Order';
import { Table } from '@/types/Table';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Edit({
    auth,
    order,
    tables
}: PageProps<{ order?: { data: Order }, tables: { data: Table[] } }>) {
    const isEdit = !!order;

    const { data, setData, patch, post, errors, processing } = useForm({
        table_id: order?.data.table?.id ?? '',
        customer_id: order?.data?.customer?.id ?? '',
        status: order?.data.status ?? 'pending',
        service_fee: order?.data.service_fee ?? 0,
        discount: order?.data.discount ?? 0,
        total_amount: order?.data.total_amount ?? 0,
        paid_amount: order?.data.paid_amount ?? 0,
        payment_status: order?.data.payment_status ?? 0
    });

    const [customer, setCustomer] = useState<Customer | null>(order?.data.customer ?? null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('orders.update', order!.data.id));
        } else {
            post(route('orders.store'));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    { isEdit ? `Editar Pedido - ${order!.data.number}` : 'Novo Pedido' }
                </h2>
            }
        >
            <Head title={ isEdit ? 'Editar Pedido' : 'Criar Pedido' } />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link href={ route('orders.index') }>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white dark:bg-gray-800 rounded p-3'>
                        <form onSubmit={submit} className="space-y-4">
                            {tables.data.length > 0 && (
                                <div>
                                    <label htmlFor="table_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Mesa
                                    </label>
                                    <select
                                        id="table_id"
                                        className="mt-1 block w-full rounded border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                                        value={data.table_id}
                                        onChange={(e) => setData('table_id', Number(e.target.value))}
                                    >
                                        <option value="">Selecione uma mesa</option>
                                        {tables.data.map(table => (
                                            <option key={table.id} value={table.id}>
                                                {table.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <SearchableCustomersSelect
                                    selectedCustomer={customer}
                                    setCustomer={(customer) => {
                                        setCustomer(customer);
                                        setData('customer_id', customer.id);
                                    }}
                                    isDisabled={processing}
                                />
                            </div>

                            <div className='flex justify-end'>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {isEdit ? 'Salvar' : 'Criar'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}
