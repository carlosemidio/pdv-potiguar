import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { User } from '@/types/User';
import { Textarea, Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler, useEffect } from 'react';
import Select, { MultiValue } from 'react-select';

export default function Edit({
    auth,
    users,
}:PageProps<{ users: { data: User[] } }>)
{
    const [selectedusers, setSelectedusers] = React.useState<User[]>([]);
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            title: '',
            content: '',
            users_uuids: [] as string[],
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('notification.store'));
    };

    const handleUserChange = (selectedOptions: MultiValue<{ label: string; value: string }>) => {
        const selectedUsersIds = selectedOptions.map(option => option.value);
        setData('users_uuids', selectedUsersIds);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="">
                    Emitir Notificação
                </h2>
            }
        >
            <Head title={'Emitir Notificação'} />
            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-8">
                    <div className="mb-4">
                        <Link href={route('notification.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white border p-3 rounded dark:border-gray-600 dark:bg-slate-800'>
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="title" value="Títutlo" />

                                <TextInput
                                    id="title"
                                    className="mt-1 block w-full max-w-md"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    isFocused
                                    autoComplete="title"
                                />

                                <InputError className="mt-2" message={errors.title} />
                            </div>

                            <div>
                                <InputLabel htmlFor="content" value="Conteudo" />

                                <Textarea
                                    id='content'
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    required
                                    autoComplete="content"
                                    className={'w-full max-w-md min-h-32 border rounded border-gray-300'}
                                >

                                </Textarea>

                                <InputError className="mt-2" message={errors.content} />                               
                            </div>

                            <div>
                                <InputLabel htmlFor="users_uuidss" value="Usuários" />

                                <Select
                                    options={users.data.map((user: User) => ({ label: user.name, value: user.uuid }))}
                                    isMulti
                                    isSearchable
                                    // value={selectedusers.map((user: User) => ({ label: user.name, value: user.id }))}
                                    onChange={handleUserChange}
                                    placeholder={"Selecione o(s) Usuário(s)"}
                                />

                                <InputError className="mt-2" message={errors.users_uuids} />
                            </div>

                            <div className='flex justify-end'>
                                <PrimaryButton type="submit" disabled={processing}>
                                    Emitir
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
                                    Notificação emitida com sucesso!
                                </p>
                            </Transition>
                        </form>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}