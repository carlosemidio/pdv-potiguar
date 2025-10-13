import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Lock, Mail, RefreshCw, Shield, CheckCircle } from 'lucide-react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Reset Password" />

            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Redefinir senha</h2>
                    <p className="mt-2 text-sm text-gray-300">
                        Crie uma nova senha segura para sua conta
                    </p>
                </div>

                {/* Reset Form */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Email Field (readonly) */}
                        <div>
                            <InputLabel 
                                htmlFor="email" 
                                value="Email" 
                                className="text-gray-700 font-medium"
                            />
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                    autoComplete="username"
                                    readOnly
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password Field */}
                        <div>
                            <InputLabel 
                                htmlFor="password" 
                                value="Nova senha" 
                                className="text-gray-700 font-medium"
                            />
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                    autoComplete="new-password"
                                    isFocused={true}
                                    placeholder="Mínimo 8 caracteres"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Password Confirmation Field */}
                        <div>
                            <InputLabel 
                                htmlFor="password_confirmation" 
                                value="Confirmar nova senha" 
                                className="text-gray-700 font-medium"
                            />
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                    autoComplete="new-password"
                                    placeholder="Confirme sua nova senha"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <h4 className="text-sm font-medium text-indigo-800 mb-2">Requisitos da senha:</h4>
                            <ul className="text-xs text-indigo-700 space-y-1">
                                <li className="flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-2" />
                                    Mínimo de 8 caracteres
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-2" />
                                    Pelo menos uma letra maiúscula
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-2" />
                                    Pelo menos um número
                                </li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {processing ? (
                                        <RefreshCw className="h-5 w-5 text-indigo-300 animate-spin" />
                                    ) : (
                                        <Lock className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" />
                                    )}
                                </span>
                                {processing ? 'Redefinindo...' : 'Redefinir senha'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Security Notice */}
                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        Após redefinir, você será direcionado para a página de login
                    </p>
                </div>
            </div>
        </div>
    );
}
