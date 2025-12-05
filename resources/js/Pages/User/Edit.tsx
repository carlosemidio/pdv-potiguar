import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Role } from '@/types/Role';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { User } from '@/types/User';
import SearchableTenantsSelect from '@/Components/SearchableTenantsSelect';
import { can } from '@/utils/authorization';
import { Store } from '@/types/Store';
import { ArrowLeft, User as UserIcon, Mail, Lock, Shield, Store as StoreIcon, Save, UserPlus } from 'lucide-react';

export default function Page({ auth }: PageProps) {
    const { user, roles, stores } = usePage<PageProps<{ user: { data: User }, roles: Role[], stores: Store[] }>>().props;
    const isEdit = !!user;

    const [tenant, setTenant] = useState(user ? user.data.tenant : null);

    const { data, setData, post, patch, errors, processing, recentlySuccessful } = useForm({
        tenant_id: user ? user.data.tenant_id : auth.user.tenant_id,
        name: user ? user.data.name : '',
        email: user ? user.data.email : '',
        password: '',
        password_confirmation: '',
        roles: user ? user.data.roles?.map((role: Role) => role.id) : [] as number[],
        stores: user ? user.data.stores?.map((store: Store) => store.id) : [] as number[],
    });

    const handleRoleSelection = ( selectedOptions: MultiValue<{ label: any; value: number; }> ) => {
        const selectedRoleIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setData('roles', selectedRoleIds);
    };

    const handleStoreSelection = ( selectedOptions: MultiValue<{ label: any; value: number; }> ) => {
        const selectedStoreIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setData('stores', selectedStoreIds);
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
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                            {isEdit ? <UserIcon className="w-6 h-6 text-white" /> : <UserPlus className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {isEdit ? `Editar Usuário` : 'Novo Usuário'}
                            </h1>
                            {isEdit && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                                    {user.data.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <UserIcon className="w-4 h-4" />
                        Gerenciamento de usuários
                    </div>
                </div>
            }>
            <Head title={isEdit ? 'Editar Usuário' : 'Criar Usuário'} />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-6 max-w-4xl">
                    {/* Botão Voltar */}
                    <div className="mb-6">
                        <Link href={'/usuarios'}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-300 dark:border-gray-600 font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para usuários
                            </button>
                        </Link>
                    </div>

                    {/* Formulário Principal */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Header do Formulário */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    {isEdit ? <UserIcon className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {isEdit ? 'Editar Usuário' : 'Criar Novo Usuário'}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        {isEdit ? 'Atualize as informações do usuário' : 'Preencha os dados para criar um novo usuário'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Corpo do Formulário */}
                        <div className="p-8">
                            <form onSubmit={submit} className="space-y-8">
                                {/* Seção de Tenant - só se tiver permissão */}
                                {can('tenants_show') && (
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl p-6 border-l-4 border-gray-400">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                            <StoreIcon className="w-5 h-5" />
                                            Organização (Tenant)
                                        </h3>
                                        <InputLabel htmlFor="tenant_id" value="Selecione a organização" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                                        <SearchableTenantsSelect
                                            selectedTenant={tenant}
                                            setTenant={t => {
                                                setTenant(t);
                                                setData('tenant_id', t ? t.id : 0);
                                            }}
                                            isDisabled={processing}
                                            placeholder="Buscar organização..."
                                        />
                                        <InputError message={errors.tenant_id} className="mt-2" />
                                    </div>
                                )}

                                {/* Seção de Lojas */}
                                {can('stores_view') && (
                                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-l-4 border-purple-500">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                            <StoreIcon className="w-5 h-5" />
                                            Lojas Associadas
                                        </h3>
                                        <InputLabel htmlFor="stores" value="Selecione as lojas" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                                        <Select
                                            options={stores?.map((store: Store) => ({
                                                label: store.name,
                                                value: store.id,
                                            })) || []}
                                            value={data?.stores?.map((storeId: number) => ({
                                                label: stores.find((store: Store) => store.id === storeId)?.name || '',
                                                value: storeId,
                                            }))}
                                            onChange={handleStoreSelection}
                                            isMulti
                                            className="mt-1"
                                            classNamePrefix="react-select"
                                            placeholder="Selecione uma ou mais lojas..."
                                        />
                                        <InputError message={errors.stores} className="mt-2" />
                                    </div>
                                )}

                                {/* Seção de Funções */}
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border-l-4 border-amber-500">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Funções e Permissões
                                    </h3>
                                    <InputLabel htmlFor="roles" value="Selecione as funções" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
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
                                        placeholder="Selecione uma ou mais funções..."
                                    />
                                    <InputError message={errors.roles} className="mt-2" />
                                </div>

                                {/* Seção de Dados Pessoais */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-l-4 border-green-500">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                                        <UserIcon className="w-5 h-5" />
                                        Dados Pessoais
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="name" value="Nome Completo" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                                            <div className="relative">
                                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <TextInput
                                                    id="name"
                                                    name="name"
                                                    value={data.name}
                                                    className="pl-11 mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-green-500 focus:ring-green-500"
                                                    autoComplete="name"
                                                    isFocused={true}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Digite o nome completo"
                                                />
                                            </div>
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="E-mail" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={data.email}
                                                    className="pl-11 mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-green-500 focus:ring-green-500"
                                                    autoComplete="username"
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="Digite o e-mail"
                                                />
                                            </div>
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Seção de Senha */}
                                <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-6 border-l-4 border-red-500">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        {isEdit ? 'Alterar Senha (opcional)' : 'Definir Senha'}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="password" value="Senha" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <TextInput
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    value={data.password}
                                                    className="pl-11 mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-red-500 focus:ring-red-500"
                                                    autoComplete="new-password"
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder={isEdit ? "Deixe em branco para manter a senha atual" : "Digite a senha"}
                                                />
                                            </div>
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="password_confirmation" value="Confirmar Senha" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <TextInput
                                                    id="password_confirmation"
                                                    type="password"
                                                    name="password_confirmation"
                                                    value={data.password_confirmation}
                                                    className="pl-11 mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-red-500 focus:ring-red-500"
                                                    autoComplete="new-password"
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    placeholder="Confirme a senha"
                                                />
                                            </div>
                                            <InputError message={errors.password_confirmation} className="mt-2" />
                                        </div>
                                    </div>
                                    
                                    {isEdit && (
                                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                💡 <strong>Dica:</strong> Deixe os campos de senha em branco para manter a senha atual do usuário.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Link href={'/usuarios'} className="order-2 sm:order-1">
                                        <button
                                            type="button"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Cancelar
                                        </button>
                                    </Link>
                                    
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                {isEdit ? 'Salvando...' : 'Criando...'}
                                            </>
                                        ) : (
                                            <>
                                                {isEdit ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                                {isEdit ? 'Salvar Alterações' : 'Criar Usuário'}
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Feedback de Sucesso */}
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                        <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <strong>✅ {isEdit ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!'}</strong>
                                        </p>
                                    </div>
                                </Transition>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}