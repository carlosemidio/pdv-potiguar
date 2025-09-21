import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { useEffect } from "react";
import { Customer } from "@/types/Customer";

interface CustomerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer?: Customer | null;
}

export default function CustomerFormModal({ isOpen, onClose, customer }: CustomerFormModalProps) {
    const { data, setData, patch, post, processing } = useForm({
        name: customer?.name ?? '',
        email: customer?.email ?? '',
        phone: customer?.phone ?? '',
        type: customer?.type ?? 'pf',
        doc: customer?.doc ?? '',
    });

    useEffect(() => {
        setData({
            name: customer?.name ?? '',
            email: customer?.email ?? '',
            phone: customer?.phone ?? '',
            type: customer?.type ?? 'pf',
            doc: customer?.doc ?? '',
        });
    }, [customer]);

    const isEdit = !!customer;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('customers.update', customer!.id), {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => onClose()
            });
        } else {
            post(route('customers.store'), {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => onClose()
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">{isEdit ? `Editar` : 'Adicionar'} cliente</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nome
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
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Telefone
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tipo
                                </label>
                                <select
                                    id="type"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    required
                                    disabled={processing}
                                >
                                    <option value="pf">Pessoa Física</option>
                                    <option value="pj">Pessoa Jurídica</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="doc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Documento
                                </label>
                                <input
                                    type="text"
                                    id="doc"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.doc}
                                    onChange={(e) => setData('doc', e.target.value)}
                                    required
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
    );
}
