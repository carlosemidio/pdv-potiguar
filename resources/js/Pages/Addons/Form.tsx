import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Addon } from '@/types/Addon';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Edit({
    auth,
    addon,
}: PageProps<{ addon?: { data: Addon } }>) {
    const isEdit = !!addon;

    const { data, setData, patch, post, errors, processing, recentlySuccessful } =
        useForm({
            name: addon ? addon.data.name : '',
            price: addon ? addon.data.price : '',
            description: addon ? addon.data.description : '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('addons.update', addon!.data.id));
        } else {
            post(route('addons.store'));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    { isEdit ? `Editar Complemento - ${addon!.data.name}` : 'Novo Complemento' }
                </h2>
            }
        >
            <Head title={ isEdit ? 'Editar Complemento' : 'Criar Complemento' } />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link href={ route('addons.index') }>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white dark:bg-gray-800 rounded p-3'>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Nome do Complemento" />
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
                                <InputLabel htmlFor="price" value="Preço" />
                                <TextInput
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    className="mt-1 block w-full"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                    autoComplete="price"
                                />
                                <InputError className="mt-2" message={errors.price} />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Descrição" />
                                <textarea
                                    id="description"
                                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    autoComplete="description"
                                    rows={4}
                                />
                                <InputError className="mt-2" message={errors.description} />
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