import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Addon } from "@/types/Addon";

interface OrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    addon?: Addon | null;
}

import { useEffect } from "react";

export default function OrderFormModal({ isOpen, onClose, addon }: OrderFormModalProps) {
    const { data, setData, patch, post, processing } = useForm({
        name: addon?.name ?? '',
        price: addon?.price ?? '',
        description: addon?.description ?? ''
    });

    useEffect(() => {
        setData({
            name: addon?.name ?? '',
            price: addon?.price ?? '',
            description: addon?.description ?? ''
        });
    }, [addon]);

    const isEdit = !!addon;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('addons.update', addon!.id), {
                onSuccess: () => onClose()
            });
        } else {
            post(route('addons.store'));
        }
    };

    return <>
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">{ isEdit ? `Editar` : 'Adicionar' } complemento</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3"> 
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nome do Complemento
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Preço
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                    step="0.01"
                                    disabled={processing}
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Descrição
                                </label>
                                <textarea
                                    id="description"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    disabled={processing}
                                />
                            </div>

                            <div className="mt-3 flex justify-end items-center gap-2">
                                <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                                <PrimaryButton onClick={submit}>{isEdit ? 'Salvar' : 'Iniciar'}</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    </>
}