import { X, Printer as PrinterIcon, Tag, Monitor, Hash, HardDrive } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { useEffect } from "react";
import { Printer } from "@/types/Printer"; // Certifique-se de ter esse tipo
import InputError from "../InputError";
import { MdPrint } from "react-icons/md";

interface PrinterFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    printer?: Printer | null;
}

export default function PrinterFormModal({ isOpen, onClose, printer }: PrinterFormModalProps) {
    const { data, setData, patch, post, processing, errors, reset } = useForm({
        name: printer?.name ?? '',
        type: printer?.type ?? 'usb',
        product_name: printer?.product_name ?? '',
        vendor_id: printer?.vendor_id ?? '',
        product_id: printer?.product_id ?? '',
        device_path: printer?.device_path ?? '',
        host: printer?.host ?? '',
        port: printer?.port ?? 9100,
    });

    useEffect(() => {
        setData({
            name: printer?.name ?? '',
            type: printer?.type ?? 'usb',
            product_name: printer?.product_name ?? '',
            vendor_id: printer?.vendor_id ?? '',
            product_id: printer?.product_id ?? '',
            device_path: printer?.device_path ?? '',
            host: printer?.host ?? '',
            port: printer?.port ?? 9100,
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
                },
                onError: (errors) => {
                    console.log(errors);
                }
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <MdPrint className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {isEdit ? 'Editar Impressora' : 'Nova Impressora'}
                                </h3>
                                <p className="text-gray-200 text-sm">
                                    {isEdit ? 'Atualize as configurações da impressora' : 'Configure uma nova impressora no sistema'}
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
                    {/* Nome e Tipo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Tag className="w-4 h-4" />
                                Nome da estação de Impressão
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="Ex: Impressora Cozinha, Balcão..."
                                disabled={processing}
                            />
                            <InputError className="mt-1" message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="type" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Monitor className="w-4 h-4" />
                                Tipo de Conexão
                            </label>
                            <select
                                id="type"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                required
                                disabled={processing}
                            >
                                <option value="usb">🔌 USB</option>
                                <option value="network">🌐 Rede (Cabo ou WiFi)</option>
                                {/* <option value="wifi">📶 WiFi</option> */}
                                {/* <option value="bluetooth">📡 Bluetooth</option>
                                <option value="serial">🔗 Serial</option> */}
                            </select>
                            <InputError className="mt-1" message={errors.type} />
                        </div>
                    </div>

                    {/* Nome da Impressora */}
                    <div className="space-y-2">
                        <label htmlFor="product_name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <PrinterIcon className="w-4 h-4" />
                            Nome da Impressora
                        </label>
                        <input
                            type="text"
                            id="product_name"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                            value={data.product_name}
                            onChange={(e) => setData('product_name', e.target.value)}
                            required
                            placeholder="Ex: Epson TM-T20II, Bematech MP-4200..."
                            disabled={processing}
                        />
                        <InputError className="mt-1" message={errors.product_name} />
                    </div>

                    {/* Configurações USB */}
                    {data.type === 'usb' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="vendor_id" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Hash className="w-4 h-4" />
                                    Vendor ID
                                </label>
                                <input
                                    type="text"
                                    id="vendor_id"
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    value={data.vendor_id}
                                    onChange={(e) => setData('vendor_id', e.target.value)}
                                    required
                                    placeholder="Ex: 04b8"
                                    disabled={processing}
                                />
                                <InputError className="mt-1" message={errors.vendor_id} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="product_id" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <HardDrive className="w-4 h-4" />
                                    Product ID
                                </label>
                                <input
                                    type="text"
                                    id="product_id"
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    value={data.product_id}
                                    onChange={(e) => setData('product_id', e.target.value)}
                                    required
                                    placeholder="Ex: 0e15"
                                    disabled={processing}
                                />
                                <InputError className="mt-1" message={errors.product_id} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="device_path" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Monitor className="w-4 h-4" />
                                    Caminho do Dispositivo
                                </label>
                                <input
                                    type="text"
                                    id="device_path"
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    value={data.device_path}
                                    onChange={(e) => setData('device_path', e.target.value)}
                                    required
                                    placeholder="Ex: /dev/usb/lp0"
                                    disabled={processing}
                                />
                                <InputError className="mt-1" message={errors.device_path} />
                            </div>
                        </div>
                    )}

                    {/* Configurações Network */}
                    {data.type === 'network' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="host" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Monitor className="w-4 h-4" />
                                    Endereço IP / Hostname
                                </label>
                                <input
                                    type="text"
                                    id="host"
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    value={data.host || ''}
                                    onChange={(e) => setData('host', e.target.value)}
                                    required
                                    placeholder="Ex: 192.168.1.100"
                                    disabled={processing}
                                />
                                <InputError className="mt-1" message={errors.host} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="port" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Monitor className="w-4 h-4" />
                                    Porta
                                </label>
                                <input
                                    type="number"
                                    id="port"
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    value={data.port || ''}
                                    onChange={(e) => setData('port', e.target.value ? parseInt(e.target.value) : 9100)}
                                    required
                                    placeholder="Ex: 9100"
                                    disabled={processing}
                                />
                                <InputError className="mt-1" message={errors.port} />
                            </div>
                        </div>
                    )}

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
                            className="px-6 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 focus:ring-gray-600"
                        >
                            {processing ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Cadastrar Impressora')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
