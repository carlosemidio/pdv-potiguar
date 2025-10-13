import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Lock, Shield, AlertCircle } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-red-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Confirm Password" />

            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Confirmar senha</h2>
                    <p className="mt-2 text-sm text-gray-300">
                        Área protegida - confirme sua senha para continuar
                    </p>
                </div>

                {/* Confirm Form */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="mb-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-amber-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-amber-800">
                                        Esta é uma área segura do sistema. Confirme sua senha antes de continuar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Password Field */}
                        <div>
                            <InputLabel 
                                htmlFor="password" 
                                value="Sua senha atual" 
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
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 transition-colors"
                                    isFocused={true}
                                    placeholder="Digite sua senha"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-red-300 group-hover:text-red-200" />
                                </span>
                                {processing ? 'Confirmando...' : 'Confirmar'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Security Notice */}
                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        Mantenha sua senha segura e não a compartilhe com ninguém
                    </p>
                </div>
            </div>
        </div>
    );
}
