import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Edit({
    auth,
    customer,
}: PageProps<{ customer?: { data: { id: number; name: string; email: string; phone: string; type: string; doc: string } } }>) {
    const isEdit = !!customer;

    const { data, setData, patch, post, errors, processing } = useForm({
        name: customer ? customer.data.name : '',
        email: customer ? customer.data.email : '',
        phone: customer ? customer.data.phone : '',
        type: customer ? customer.data.type : 'pf',
        doc: customer ? customer.data.doc : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('customers.update', customer!.data.id));
        } else {
            post(route('customers.store'));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    { isEdit ? `Editar Cliente - ${customer!.data.name}` : 'Novo Cliente' }
                </h2>
            }
        >
            <Head title={ isEdit ? 'Editar Cliente' : 'Criar Cliente' } />

            <section className='px-2 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link href={ route('customers.index') }>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white dark:bg-gray-800 rounded p-3'>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Nome" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    isFocused
                                    autoComplete="name"
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="email"
                                />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Telefone" />
                                <TextInput
                                    id="phone"
                                    className="mt-1 block w-full"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    autoComplete="phone"
                                />
                                <InputError className="mt-2" message={errors.phone} />
                            </div>

                            <div>
                                <InputLabel htmlFor="type" value="Tipo" />
                                <select
                                    id="type"
                                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    required
                                >
                                    <option value="pf">Pessoa Física</option>
                                    <option value="pj">Pessoa Jurídica</option>
                                </select>
                                <InputError className="mt-2" message={errors.type} />
                            </div>

                            <div>
                                <InputLabel htmlFor="doc" value="Documento" />
                                <TextInput
                                    id="doc"
                                    className="mt-1 block w-full"
                                    value={data.doc}
                                    onChange={(e) => setData('doc', e.target.value)}
                                    autoComplete="doc"
                                />
                                <InputError className="mt-2" message={errors.doc} />
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
