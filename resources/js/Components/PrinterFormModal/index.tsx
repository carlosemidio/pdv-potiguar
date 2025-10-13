import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { useEffect } from "react";
import { Printer } from "@/types/Printer"; // Certifique-se de ter esse tipo
import InputError from "../InputError";

// Tipos para impressora
export interface PrinterDevice {
  vendorId: number;
  productId: number;
  productName?: string;
  type?: string;
  devicePath?: string;
}

interface PrinterFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    printer?: Printer | null;
}

export default function PrinterFormModal({ isOpen, onClose, printer }: PrinterFormModalProps) {
    const { data, setData, patch, post, processing, errors, reset } = useForm({
        name: printer?.name ?? '',
        type: printer?.type ?? '',
        product_name: printer?.product_name ?? '',
        vendor_id: printer?.vendor_id ?? '',
        product_id: printer?.product_id ?? '',
        device_path: printer?.device_path ?? '',
    });

    useEffect(() => {
        setData({
            name: printer?.name ?? '',
            type: printer?.type ?? '',
            product_name: printer?.product_name ?? '',
            vendor_id: printer?.vendor_id ?? '',
            product_id: printer?.product_id ?? '',
            device_path: printer?.device_path ?? '',
        });
    }, [printer]);

    const isEdit = !!printer;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('printers.update', printer!.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        } else {
            post(route('printers.store'), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">{isEdit ? `Editar` : 'Adicionar'} impressora</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nome da Impressora
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
                                <InputError className="mt-1" message={errors.name} />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tipo de conexão
                                </label>
                                <input
                                    type="text"
                                    id="type"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                                <InputError className="mt-1" message={errors.type} />
                            </div>
                            <div>
                                <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nome do Produto
                                </label>
                                <input
                                    type="text"
                                    id="product_name"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.product_name}
                                    onChange={(e) => setData('product_name', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                                <InputError className="mt-1" message={errors.product_name} />
                            </div>
                            <div>
                                <label htmlFor="vendor_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Vendor ID
                                </label>
                                <input
                                    type="number"
                                    id="vendor_id"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.vendor_id}
                                    onChange={(e) => setData('vendor_id', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                                <InputError className="mt-1" message={errors.vendor_id} />
                            </div>
                            <div>
                                <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Product ID
                                </label>
                                <input
                                    type="number"
                                    id="product_id"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.product_id}
                                    onChange={(e) => setData('product_id', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                                <InputError className="mt-1" message={errors.product_id} />
                            </div>
                            <div>
                                <label htmlFor="device_path" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Caminho do Dispositivo
                                </label>
                                <input
                                    type="text"
                                    id="device_path"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.device_path}
                                    onChange={(e) => setData('device_path', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                                <InputError className="mt-1" message={errors.device_path} />
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
