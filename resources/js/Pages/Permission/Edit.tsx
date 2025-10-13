import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Permission } from '@/types/Permission';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Edit({
    auth,
    permission,
}: PageProps<{ permission: { data: Permission } }>) {
    const isEdit = !!permission;

    const { data, setData, patch, post, errors, processing, recentlySuccessful } =
        useForm({
            name: permission ? permission.data.name : '',
            display_name: permission ? permission.data.display_name : '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('permission.update', permission.data.id));
        } else {
            post(route('permission.store'));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    { isEdit ? `Editar Permissão - ${permission.data.display_name}` : 'Nova Permissão' }
                </h2>
            }
        >
            <Head title={ isEdit ? 'Editar Permissão' : 'Criar Permissão' } />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                         href={ route('permission.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white dark:bg-gray-800 rounded p-3'>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Código da Permissão" />

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
                                <InputLabel htmlFor="display_name" value="Nome da Permissão" />

                                <TextInput
                                    id="display_name"
                                    className="mt-1 block w-full"
                                    value={data.display_name}
                                    onChange={(e) => setData('display_name', e.target.value)}
                                    required
                                    isFocused
                                    autoComplete="display_name"
                                />

                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className='flex justify-end'>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {isEdit ? 'Salvar' : 'Criar'}
                                </PrimaryButton>
                            </div>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {isEdit ? 'Permissão editada com sucesso.' : 'Permissão criada com sucesso.'}
                                </p>
                            </Transition>
                        </form>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}