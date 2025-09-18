import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Tenant } from '@/types/Tenant';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Edit({
    auth,
    tenant,
}: PageProps<{ tenant?: { data: Tenant } }>) {
    const isEdit = !!tenant;

    const { data, setData, patch, post, errors, processing } = useForm({
        name: tenant ? tenant.data.name : '',
        domain: tenant ? tenant.data.domain : '',
        status: tenant ? tenant.data.status : 1,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('tenant.update', tenant!.data.id));
        } else {
            post(route('tenant.store'));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    { isEdit ? `Editar Inquilino - ${tenant!.data.name}` : 'Novo Inquilino' }
                </h2>
            }
        >
            <Head title={ isEdit ? 'Editar Inquilino' : 'Criar Inquilino' } />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link href={ route('tenant.index') }>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white dark:bg-gray-800 rounded p-3'>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Nome do Inquilino" />
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
                                <InputLabel htmlFor="domain" value="Domínio" />
                                <TextInput
                                    id="domain"
                                    className="mt-1 block w-full"
                                    value={data.domain}
                                    onChange={(e) => setData('domain', e.target.value)}
                                    required
                                    autoComplete="domain"
                                />
                                <InputError className="mt-2" message={errors.domain} />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Status" />
                                <select
                                    id="status"
                                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.status}
                                    onChange={(e) => setData('status', Number(e.target.value))}
                                    required
                                >
                                    <option value={1}>Ativo</option>
                                    <option value={0}>Inativo</option>
                                </select>
                                <InputError className="mt-2" message={errors.status} />
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
