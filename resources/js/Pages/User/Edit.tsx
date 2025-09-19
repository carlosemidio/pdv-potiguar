import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Role } from '@/types/Role';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import Select, { MultiValue, MultiValueProps } from 'react-select';
import { User } from '@/types/User';
import SearchableTenantsSelect from '@/Components/SearchableTenantsSelect';

export default function Page({ auth }: PageProps) {
    const { user, roles } = usePage<PageProps<{ user: { data: User }, roles: Role[] }>>().props;
    const isEdit = !!user;

    const [tenant, setTenant] = useState(user ? user.data.tenant : null);

    const { data, setData, post, patch, errors, processing, recentlySuccessful } = useForm({
        tenant_id: user ? user.data.tenant_id : auth.user.tenant_id,
        name: user ? user.data.name : '',
        email: user ? user.data.email : '',
        password: '',
        password_confirmation: '',
        roles: user ? user.data.roles?.map((role: Role) => role.id) : [] as number[],
    });

    const handleRoleSelection = (
        selectedOptions: MultiValue<{ label: any; value: number; }>
    ) => {
        const selectedRoleIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setData('roles', selectedRoleIds);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('user.update', user.data.uuid));
        } else {
            post(route('user.store'));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {isEdit ? `Editar Usuário - ${user.data.name}` : 'Novo Usuário'}
                </h2>
            }>
            <Head title={isEdit ? 'Editar Usuário' : 'Criar Usuário'} />
            <section className='px-2 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-2">
                    <div className="mb-4">
                        <Link href={'/usuarios'}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white dark:bg-slate-800 p-4 rounded'>
                        <form onSubmit={submit} className="space-y-6">
                            <SearchableTenantsSelect
                                selectedTenant={tenant}
                                setTenant={t => {
                                    setTenant(t);
                                    setData('tenant_id', t ? t.id : 0);
                                }}
                                isDisabled={processing}
                            />

                            <div>
                                <InputLabel htmlFor="roles" value="Funções" />
                                <Select
                                    options={roles?.map((role: Role) => ({
                                        label: role.name,
                                        value: role.id,
                                    })) || []}
                                    value={data?.roles?.map((roleId: number) => ({
                                        label: roles.find((role: Role) => role.id === roleId)?.name || '',
                                        value: roleId,
                                    }))}
                                    onChange={handleRoleSelection}
                                    isMulti
                                    className="mt-1"
                                    classNamePrefix="react-select"
                                />
                                <InputError message={errors.roles} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password_confirmation"
                                    value="Confirm Password"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                />
                                <InputError message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            <div className='flex justify-end'>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {isEdit ? 'Salvar' : 'Criar Usuário'}
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
                                    {isEdit ? 'Usuário Atualizado' : 'Usuário Criado'}
                                </p>
                            </Transition>
                        </form>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}