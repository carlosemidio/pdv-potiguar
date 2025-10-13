import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Trash2, AlertTriangle, Lock, X, Eye, EyeOff } from 'lucide-react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            {/* Botão para iniciar exclusão */}
            <div className="flex items-start gap-4 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                </div>
                
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                        Zona de Perigo
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4 leading-relaxed">
                        Uma vez que sua conta for excluída, todos os seus recursos e dados serão permanentemente deletados. 
                        Antes de excluir sua conta, faça o download de qualquer dado ou informação que deseja manter.
                    </p>
                    
                    <button
                        onClick={confirmUserDeletion}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                        <Trash2 className="w-4 h-4" />
                        Excluir Conta
                    </button>
                </div>
            </div>

            {/* Modal de confirmação */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="p-8">
                    {/* Cabeçalho do modal */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Tem certeza que deseja excluir sua conta?
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos 
                                de nossos servidores.
                            </p>
                        </div>
                        
                        <button
                            onClick={closeModal}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={deleteUser} className="space-y-6">
                        {/* Campo de senha */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-3">
                                <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
                                <InputLabel
                                    htmlFor="password"
                                    value="Confirme sua senha para continuar"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                />
                            </div>

                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="block w-full pl-4 pr-12 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                                    isFocused
                                    placeholder="Digite sua senha atual"
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

                            <InputError
                                message={errors.password}
                                className="mt-2 text-sm"
                            />
                        </div>

                        {/* Alerta final */}
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                                        Atenção: Esta ação é irreversível
                                    </h4>
                                    <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                                        <li>• Todos os seus dados pessoais serão removidos</li>
                                        <li>• Seu acesso ao sistema será revogado</li>
                                        <li>• Histórico de pedidos e transações serão perdidos</li>
                                        <li>• Não será possível recuperar a conta após a exclusão</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Botões de ação */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors duration-200 order-2 sm:order-1"
                            >
                                <X className="w-4 h-4" />
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed order-1 sm:order-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Excluindo...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Excluir Conta Permanentemente
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    );
}
