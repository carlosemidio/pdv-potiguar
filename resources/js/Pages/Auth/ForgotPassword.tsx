import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, ArrowLeft, Shield, RefreshCw } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-amber-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Forgot Password" />

            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Esqueceu a senha?</h2>
                    <p className="mt-2 text-sm text-gray-300">
                        Digite seu email e enviaremos um link de redefinição
                    </p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenOdd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{status}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reset Form */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="mb-6 text-center">
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                            <p className="text-sm text-amber-800">
                                Não se preocupe! Acontece com todo mundo. Digite seu email e nós enviaremos um link para redefinir sua senha.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <InputLabel 
                                htmlFor="email" 
                                value="Email cadastrado" 
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
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-colors"
                                    isFocused={true}
                                    placeholder="seu.email@exemplo.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {processing ? (
                                        <RefreshCw className="h-5 w-5 text-amber-300 animate-spin" />
                                    ) : (
                                        <Mail className="h-5 w-5 text-amber-300 group-hover:text-amber-200" />
                                    )}
                                </span>
                                {processing ? 'Enviando...' : 'Enviar link de redefinição'}
                            </button>
                        </div>

                        {/* Back to Login */}
                        <div className="text-center">
                            <Link
                                href={route('login')}
                                className="inline-flex items-center text-sm text-amber-600 hover:text-amber-500 font-medium transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar para o login
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Help Text */}
                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        Não recebeu o email? Verifique sua caixa de spam ou aguarde alguns minutos
                    </p>
                </div>
            </div>
        </div>
    );
}
