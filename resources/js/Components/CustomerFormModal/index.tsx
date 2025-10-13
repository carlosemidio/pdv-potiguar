import { Button } from "@headlessui/react";
import { X, User, Mail, Phone, FileText, IdCard } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { useEffect } from "react";
import { Customer } from "@/types/Customer";
import InputError from "../InputError";

interface CustomerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer?: Customer | null;
}

export default function CustomerFormModal({ isOpen, onClose, customer }: CustomerFormModalProps) {
    const { data, setData, patch, post, processing, errors } = useForm({
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
        <Modal show={isOpen} onClose={onClose} maxWidth="xl">
            <div className="bg-white dark:bg-gray-800 shadow-xl w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
                                </h3>
                                <p className="text-blue-100 text-sm">
                                    {isEdit ? 'Atualize as informações do cliente' : 'Cadastre um novo cliente no sistema'}
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
                    {/* Nome */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <User className="w-4 h-4" />
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Ex: João Silva Santos"
                            disabled={processing}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Mail className="w-4 h-4" />
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="cliente@email.com"
                            disabled={processing}
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Telefone */}
                    <div className="space-y-2">
                        <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Phone className="w-4 h-4" />
                            Telefone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={data.phone}
                            onChange={(e) => {
                                // Formatação de telefone brasileiro
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length > 11) value = value.slice(0, 11);
                                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                                setData('phone', value);
                            }}
                            placeholder="(84) 99999-9999"
                            maxLength={15}
                            disabled={processing}
                        />
                        <InputError message={errors.phone} />
                    </div>

                    {/* Grid para Tipo e Documento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tipo */}
                        <div className="space-y-2">
                            <label htmlFor="type" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <FileText className="w-4 h-4" />
                                Tipo
                            </label>
                            <select
                                id="type"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                required
                                disabled={processing}
                            >
                                <option value="pf">👤 Pessoa Física</option>
                                <option value="pj">🏢 Pessoa Jurídica</option>
                            </select>
                            <InputError message={errors.type} />
                        </div>

                        {/* Documento */}
                        <div className="space-y-2">
                            <label htmlFor="doc" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <IdCard className="w-4 h-4" />
                                {data.type === 'pf' ? 'CPF' : 'CNPJ'}
                            </label>
                            <input
                                type="text"
                                id="doc"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={data.doc}
                                onChange={(e) => {
                                    // Formatação básica de CPF/CNPJ
                                    let value = e.target.value.replace(/\D/g, '');
                                    if (data.type === 'pf') {
                                        // CPF: 999.999.999-99
                                        if (value.length > 11) value = value.slice(0, 11);
                                        value = value.replace(/(\d{3})(\d)/, '$1.$2');
                                        value = value.replace(/(\d{3})(\d)/, '$1.$2');
                                        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                                    } else {
                                        // CNPJ: 99.999.999/9999-99
                                        if (value.length > 14) value = value.slice(0, 14);
                                        value = value.replace(/(\d{2})(\d)/, '$1.$2');
                                        value = value.replace(/(\d{3})(\d)/, '$1.$2');
                                        value = value.replace(/(\d{3})(\d)/, '$1/$2');
                                        value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
                                    }
                                    setData('doc', value);
                                }}
                                placeholder={data.type === 'pf' ? '999.999.999-99' : '99.999.999/9999-99'}
                                disabled={processing}
                            />
                            <InputError message={errors.doc} />
                        </div>
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
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500"
                        >
                            {processing ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Cadastrar Cliente')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
