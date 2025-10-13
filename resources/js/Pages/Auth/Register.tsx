import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { UserPlus, Mail, Lock, User, Shield } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Register" />

            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Criar nova conta</h2>
                    <p className="mt-2 text-sm text-gray-300">
                        Registre-se para começar a usar o sistema
                    </p>
                </div>

                {/* Register Form */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <InputLabel 
                                htmlFor="name" 
                                value="Nome completo" 
                                className="text-gray-700 font-medium"
                            />
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                                    autoComplete="name"
                                    isFocused={true}
                                    placeholder="Seu nome completo"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Email Field */}
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
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                                    autoComplete="username"
                                    placeholder="seu.email@exemplo.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password Field */}
                        <div>
                            <InputLabel 
                                htmlFor="password" 
                                value="Senha" 
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
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                                    autoComplete="new-password"
                                    placeholder="Mínimo 8 caracteres"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Password Confirmation Field */}
                        <div>
                            <InputLabel 
                                htmlFor="password_confirmation" 
                                value="Confirmar senha" 
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
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                                    autoComplete="new-password"
                                    placeholder="Confirme sua senha"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <UserPlus className="h-5 w-5 text-emerald-300 group-hover:text-emerald-200" />
                                </span>
                                {processing ? 'Criando conta...' : 'Criar conta'}
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Já tem uma conta?{' '}
                                <Link
                                    href={route('login')}
                                    className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
                                >
                                    Faça login aqui
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Security Notice */}
                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        Ao se registrar, você concorda com nossos termos de uso
                    </p>
                </div>
            </div>
        </div>
    );
}
