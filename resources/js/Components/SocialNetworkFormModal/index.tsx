import { X, Palette, Globe } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { useEffect } from "react";
import InputError from "../InputError";
import SocialNetwork from "@/types/SocialNetwork";
import NetworkSelect from "./NetworkSelect";
import { networksIcons } from "@/utils/networksIcons";

interface SocialNetworkFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SocialNetworkFormModal({ isOpen, onClose }: SocialNetworkFormModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        url: '',
    });

    useEffect(() => {
        setData({
            ...data,
            url: networksIcons.find((network) => network.slug === data.name)?.baseUrl || '',
        });
    }, [data.name]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('social-networks.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="bg-white dark:bg-gray-800 shadow-xl w-full rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Palette className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    Cadastro de rede social
                                </h3>
                                <p className="text-amber-100 text-sm">
                                    Adicione uma nova rede social para sua loja
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={submit} className="p-6 space-y-6">
                    {/* Nome da rede social - select */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Globe className="w-4 h-4" />
                            Rede Social
                        </label>

                        <NetworkSelect
                            value={data.name}
                            onChange={(value) => setData('name', value)}
                            disabled={processing}
                        />

                        <InputError className="mt-1" message={errors.name} />
                    </div>

                    {/* Url da rede social */}
                    <div className="space-y-2">
                        <label htmlFor="url" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Globe className="w-4 h-4" />
                            Url da Rede Social
                        </label>
                        <input
                            type="text"
                            id="url"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            value={data.url}
                            onChange={(e) => setData('url', e.target.value)}
                            required
                            placeholder="Ex: https://www.facebook.com/sualoja"
                            disabled={processing}
                        />
                        <InputError className="mt-1" message={errors.url} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <SecondaryButton 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5"
                        >
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton 
                            type="submit" 
                            disabled={processing}
                            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 focus:ring-amber-500"
                        >
                            {processing ? 'Salvando...' : 'Cadastrar'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
