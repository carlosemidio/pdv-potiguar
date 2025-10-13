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
import { ArrowLeft, Shield, Key, Save, Plus } from 'lucide-react';

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
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {isEdit ? `Editar Permissão` : 'Nova Permissão'}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {isEdit ? `Modificar dados da permissão "${permission.data.display_name}"` : 'Criar uma nova permissão no sistema'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={isEdit ? 'Editar Permissão' : 'Criar Permissão'} />

            <div className="space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Botão Voltar */}
                <div className="flex justify-start">
                    <Link href={route('permission.index')}>
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 shadow-sm hover:shadow-md">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar para Lista
                        </button>
                    </Link>
                </div>

                {/* Formulário */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 px-6 sm:px-8 py-6 border-b border-purple-100 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                                {isEdit ? <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" /> : <Plus className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {isEdit ? 'Editar Permissão' : 'Criar Nova Permissão'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {isEdit ? 'Modifique os dados da permissão' : 'Preencha os dados para criar a permissão'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-8">
                            {/* Campo Código */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <InputLabel htmlFor="name" value="Código da Permissão" className="text-base font-semibold" />
                                </div>
                                
                                <div className="relative">
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full pl-4 pr-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        isFocused
                                        autoComplete="name"
                                        placeholder="ex: users_create, orders_edit, etc."
                                    />
                                </div>

                                <InputError className="mt-2 text-sm" message={errors.name} />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Use snake_case (ex: users_create, products_edit)
                                </p>
                            </div>

                            {/* Campo Nome de Exibição */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <InputLabel htmlFor="display_name" value="Nome de Exibição" className="text-base font-semibold" />
                                </div>
                                
                                <div className="relative">
                                    <TextInput
                                        id="display_name"
                                        className="mt-1 block w-full pl-4 pr-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        value={data.display_name}
                                        onChange={(e) => setData('display_name', e.target.value)}
                                        required
                                        autoComplete="display_name"
                                        placeholder="ex: Criar Usuários, Editar Pedidos, etc."
                                    />
                                </div>

                                <InputError className="mt-2 text-sm" message={errors.display_name} />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Nome amigável que será exibido na interface
                                </p>
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-100 dark:border-gray-600">
                                <Link href={route('permission.index')}>
                                    <SecondaryButton className="w-full sm:w-auto">
                                        Cancelar
                                    </SecondaryButton>
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            {isEdit ? 'Salvando...' : 'Criando...'}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            {isEdit ? 'Salvar Alterações' : 'Criar Permissão'}
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Mensagem de Sucesso */}
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out duration-300"
                                enterFrom="opacity-0 transform translate-y-2"
                                enterTo="opacity-100 transform translate-y-0"
                                leave="transition ease-in-out duration-300"
                                leaveTo="opacity-0 transform translate-y-2"
                            >
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                                    <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        {isEdit ? 'Permissão editada com sucesso!' : 'Permissão criada com sucesso!'}
                                    </p>
                                </div>
                            </Transition>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}