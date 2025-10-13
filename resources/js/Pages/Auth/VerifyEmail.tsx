import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, Shield, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-cyan-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Email Verification" />

            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Verifique seu email</h2>
                    <p className="mt-2 text-sm text-gray-300">
                        Confirme seu endereço de email para continuar
                    </p>
                </div>

                {/* Status Message */}
                {status === 'verification-link-sent' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                    Um novo link de verificação foi enviado para seu email!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Verification Form */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="text-center mb-6">
                        <div className="mx-auto h-12 w-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                            <Mail className="h-6 w-6 text-cyan-600" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Obrigado por se registrar! Antes de começar, você poderia verificar seu endereço de email clicando no link que acabamos de enviar? Se você não recebeu o email, ficaremos felizes em enviar outro.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Resend Button */}
                        <form onSubmit={submit}>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {processing ? (
                                        <RefreshCw className="h-5 w-5 text-cyan-300 animate-spin" />
                                    ) : (
                                        <Mail className="h-5 w-5 text-cyan-300 group-hover:text-cyan-200" />
                                    )}
                                </span>
                                {processing ? 'Reenviando...' : 'Reenviar email de verificação'}
                            </button>
                        </form>

                        {/* Logout Link */}
                        <div className="text-center">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-500 font-medium transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Sair da conta
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        Verifique sua caixa de spam se não encontrar o email
                    </p>
                </div>
            </div>
        </div>
    );
}
