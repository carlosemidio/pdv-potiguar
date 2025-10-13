import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { User } from '@/types/User';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, User as UserIcon, CheckCircle, AlertCircle, Save } from 'lucide-react';

export default function UpdateProfileInformation({
    user,
    mustVerifyEmail,
    status,
    className = '',
}: {
    user: User;
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-8">
                {/* Campo Nome */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <InputLabel htmlFor="name" value="Nome Completo" className="text-base font-semibold" />
                    </div>
                    
                    <TextInput
                        id="name"
                        className="mt-1 block w-full pl-4 pr-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                        placeholder="Digite seu nome completo"
                    />

                    <InputError className="mt-2 text-sm" message={errors.name} />
                </div>

                {/* Campo Email */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <InputLabel htmlFor="email" value="Endereço de Email" className="text-base font-semibold" />
                    </div>
                    
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full pl-4 pr-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500 dark:focus:ring-green-400"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="seu@email.com"
                    />

                    <InputError className="mt-2 text-sm" message={errors.email} />
                </div>

                {/* Verificação de Email */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                                    Email não verificado
                                </h4>
                                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                                    Seu endereço de email ainda não foi verificado. Clique no botão abaixo para reenviar o email de verificação.
                                </p>
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700 text-amber-800 dark:text-amber-200 rounded-lg text-sm font-medium transition-colors duration-200"
                                >
                                    <Mail className="w-4 h-4" />
                                    Reenviar email de verificação
                                </Link>
                            </div>
                        </div>

                        {status === 'verification-link-sent' && (
                            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                        Um novo link de verificação foi enviado para seu email.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Salvar Alterações
                            </>
                        )}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 transform translate-x-2"
                        enterTo="opacity-100 transform translate-x-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0 transform translate-x-2"
                    >
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            <p className="text-sm font-medium">
                                Informações salvas com sucesso!
                            </p>
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
