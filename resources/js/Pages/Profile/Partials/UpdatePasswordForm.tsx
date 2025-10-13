import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Lock, Key, Shield, CheckCircle, Save, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-8">
                {/* Senha Atual */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <InputLabel
                            htmlFor="current_password"
                            value="Senha Atual"
                            className="text-base font-semibold"
                        />
                    </div>

                    <div className="relative">
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            type={showCurrentPassword ? 'text' : 'password'}
                            className="mt-1 block w-full pl-4 pr-12 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500 dark:focus:ring-amber-400"
                            autoComplete="current-password"
                            placeholder="Digite sua senha atual"
                        />
                        
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <InputError
                        message={errors.current_password}
                        className="mt-2 text-sm"
                    />
                </div>

                {/* Nova Senha */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <Key className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <InputLabel htmlFor="password" value="Nova Senha" className="text-base font-semibold" />
                    </div>

                    <div className="relative">
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            className="mt-1 block w-full pl-4 pr-12 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500 dark:focus:ring-green-400"
                            autoComplete="new-password"
                            placeholder="Digite uma nova senha segura"
                        />
                        
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2 text-sm" />
                    
                    {/* Indicador de força da senha */}
                    {data.password && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    Força da senha
                                </span>
                            </div>
                            <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                                <div className={`flex items-center gap-1 ${data.password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${data.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    Pelo menos 8 caracteres
                                </div>
                                <div className={`flex items-center gap-1 ${/[A-Z]/.test(data.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(data.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    Letra maiúscula
                                </div>
                                <div className={`flex items-center gap-1 ${/[a-z]/.test(data.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(data.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    Letra minúscula
                                </div>
                                <div className={`flex items-center gap-1 ${/\d/.test(data.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(data.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    Número
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirmar Nova Senha"
                            className="text-base font-semibold"
                        />
                    </div>

                    <div className="relative">
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            className="mt-1 block w-full pl-4 pr-12 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                            autoComplete="new-password"
                            placeholder="Confirme sua nova senha"
                        />
                        
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            {showPasswordConfirmation ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-sm"
                    />
                    
                    {/* Verificação de correspondência */}
                    {data.password && data.password_confirmation && (
                        <div className={`mt-2 p-2 rounded-lg ${
                            data.password === data.password_confirmation 
                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        }`}>
                            <div className="flex items-center gap-2">
                                <CheckCircle className={`w-4 h-4 ${
                                    data.password === data.password_confirmation 
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                }`} />
                                <span className={`text-sm font-medium ${
                                    data.password === data.password_confirmation 
                                        ? 'text-green-800 dark:text-green-200'
                                        : 'text-red-800 dark:text-red-200'
                                }`}>
                                    {data.password === data.password_confirmation 
                                        ? 'As senhas coincidem'
                                        : 'As senhas não coincidem'
                                    }
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Atualizando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Atualizar Senha
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
                                Senha atualizada com sucesso!
                            </p>
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
