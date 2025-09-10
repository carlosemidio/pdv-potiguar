import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Order } from '@/types/Order';
import { Table } from '@/types/Table';
import { Head, Link, useForm } from '@inertiajs/react';
import { table } from 'console';
import { FormEventHandler } from 'react';

export default function Edit({
    auth,
    order,
    tables
}: PageProps<{ order?: { data: Order }, tables: { data: Table[] } }>) {
    const isEdit = !!order;

    const { data, setData, patch, post, errors, processing } = useForm({
        table_id: order ? order.data.table.id : '',
        customer_name: order ? order.data.customer_name : '',
        status: order ? order.data.status : 'pending',
        service_fee: order ? order.data.service_fee : 10,
        discount: order ? order.data.discount : 0,
        total_amount: order ? order.data.total_amount : 0,
        paid_amount: order ? order.data.paid_amount : 0,
        payment_status: order ? order.data.payment_status : 0
    });

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
                                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nome do Cliente
                                </label>
                                <TextInput
                                    id="customer_name"
                                    className="mt-1 block w-full"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    isFocused
                                    autoComplete="customer_name"
                                />
                                {errors.customer_name && <div className="text-sm text-red-600 mt-1">{errors.customer_name}</div>}
                            </div>

                            <div>
                                <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    className="mt-1 block w-full rounded border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    required
                                >
                                    <option value="pending">Pendente</option>
                                    <option value="in_progress">Em Progresso</option>
                                    <option value="completed">Concluído</option>
                                    <option value="canceled">Cancelado</option>
                                </select>
                                {errors.status && <div className="text-sm text-red-600 mt-1">{errors.status}</div>}
                            </div>

                            <div>
                                <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Taxa de Serviço (%)
                                </label>
                                <TextInput
                                    id="service_fee"
                                    type="number"
                                    step="0.01"
                                    className="mt-1 block w-full"
                                    value={data.service_fee}
                                    onChange={(e) => setData('service_fee', parseFloat(e.target.value))}
                                    required
                                    isFocused
                                    autoComplete="service_fee"
                                />
                                {errors.service_fee && <div className="text-sm text-red-600 mt-1">{errors.service_fee}</div>}
                            </div>

                            <div>
                                <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Valor Total (R$)
                                </label>
                                <TextInput
                                    id="total_amount"
                                    type="number"
                                    step="0.01"
                                    className="mt-1 block w-full"
                                    value={data.total_amount}
                                    onChange={(e) => setData('total_amount', parseFloat(e.target.value))}
                                    required
                                    isFocused
                                    autoComplete="total_amount"
                                />
                                {errors.total_amount && <div className="text-sm text-red-600 mt-1">{errors.total_amount}</div>}
                            </div>

                            <div>
                                <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Desconto (R$)
                                </label>
                                <TextInput
                                    id="discount"
                                    type="number"
                                    step="0.01"
                                    className="mt-1 block w-full"
                                    value={data.discount}
                                    onChange={(e) => setData('discount', parseFloat(e.target.value))}
                                    required
                                    isFocused
                                    autoComplete="discount"
                                />
                                {errors.discount && <div className="text-sm text-red-600 mt-1">{errors.discount}</div>}
                            </div>

                            <div>
                                <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Valor Pago (R$)
                                </label>
                                <TextInput
                                    id="paid_amount"
                                    type="number"
                                    step="0.01"
                                    className="mt-1 block w-full"
                                    value={data.paid_amount}
                                    onChange={(e) => setData('paid_amount', parseFloat(e.target.value))}
                                    required
                                    isFocused
                                    autoComplete="paid_amount"
                                />
                                {errors.paid_amount && <div className="text-sm text-red-600 mt-1">{errors.paid_amount}</div>}
                            </div>

                            <div>
                                <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status do Pagamento
                                </label>
                                <select
                                    id="payment_status"
                                    className="mt-1 block w-full rounded border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                                    value={data.payment_status}
                                    onChange={(e) => setData('payment_status', Number(e.target.value))}
                                    required
                                >
                                    <option value="0">Pendente</option>
                                    <option value="1">Pago</option>
                                </select>
                                {errors.payment_status && <div className="text-sm text-red-600 mt-1">{errors.payment_status}</div>}
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
