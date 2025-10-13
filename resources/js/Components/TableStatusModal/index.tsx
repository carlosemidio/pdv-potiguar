import { X, CheckCircle, Clock, Users } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Table } from "@/types/Table";

interface TableStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    table: Table;
}

export default function TableStatusModal({ isOpen, onClose, table }: TableStatusModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    
    const { patch, processing } = useForm();

    const getAvailableStatuses = (currentStatus: string) => {
        switch (currentStatus) {
            case 'available':
                return [
                    { value: 'reserved', label: 'Reservada', icon: Clock, color: 'yellow', description: 'Reservar mesa para cliente específico' }
                ];
            case 'reserved':
                return [
                    { value: 'available', label: 'Disponível', icon: CheckCircle, color: 'green', description: 'Liberar reserva e deixar mesa disponível' }
                ];
            case 'occupied':
                return []; // Não permite mudança - ocupada por pedido ativo
            default:
                return [];
        }
    };

    const availableStatuses = getAvailableStatuses(table.status);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedStatus) return;

        patch(route('tables.update-status', table.id), {
            data: { status: selectedStatus },
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                onClose();
                setSelectedStatus('');
            }
        });
    };

    const currentStatusInfo = {
        available: { label: 'Disponível', color: 'green', icon: CheckCircle },
        reserved: { label: 'Reservada', color: 'yellow', icon: Clock },
        occupied: { label: 'Ocupada', color: 'red', icon: Users }
    }[table.status] || { label: table.status_name, color: 'gray', icon: CheckCircle };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="bg-white dark:bg-gray-800 shadow-xl w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <currentStatusInfo.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    Alterar Status - {table.name}
                                </h3>
                                <p className="text-indigo-100 text-sm">
                                    Status atual: <span className="font-medium">{currentStatusInfo.label}</span>
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

                {/* Content */}
                <div className="p-6">
                    {table.status === 'occupied' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Mesa Ocupada
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Esta mesa está ocupada por um pedido ativo e não pode ter seu status alterado manualmente.
                            </p>
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                <p className="text-amber-800 dark:text-amber-200 text-sm">
                                    💡 <strong>Como funciona:</strong><br/>
                                    • Mesa fica <strong>ocupada</strong> automaticamente ao cadastrar um pedido<br/>
                                    • Mesa é <strong>liberada</strong> automaticamente quando o pedido é finalizado<br/>
                                    • Use o toggle apenas para <strong>reservar/liberar</strong> mesas vazias
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                    Selecione o novo status:
                                </h4>
                                <div className="space-y-3">
                                    {availableStatuses.map((status) => {
                                        const Icon = status.icon;
                                        const colorClasses = {
                                            green: 'border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:hover:bg-green-900/30',
                                            yellow: 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30',
                                            red: 'border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30'
                                        }[status.color];

                                        const iconColorClasses = {
                                            green: 'text-green-600 dark:text-green-400',
                                            yellow: 'text-yellow-600 dark:text-yellow-400',
                                            red: 'text-red-600 dark:text-red-400'
                                        }[status.color];

                                        return (
                                            <label
                                                key={status.value}
                                                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                                    selectedStatus === status.value
                                                        ? `${colorClasses} border-opacity-100`
                                                        : `${colorClasses} border-opacity-50`
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value={status.value}
                                                    checked={selectedStatus === status.value}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    selectedStatus === status.value ? 'bg-white dark:bg-gray-700 shadow-lg' : ''
                                                }`}>
                                                    <Icon className={`w-6 h-6 ${iconColorClasses}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-gray-900 dark:text-white">
                                                        {status.label}
                                                    </h5>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {status.description}
                                                    </p>
                                                </div>
                                                <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                                                    selectedStatus === status.value
                                                        ? 'border-indigo-600 bg-indigo-600'
                                                        : 'border-gray-300 dark:border-gray-600'
                                                }`}>
                                                    {selectedStatus === status.value && (
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
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
                                    disabled={processing || !selectedStatus}
                                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500"
                                >
                                    {processing ? 'Alterando...' : 'Alterar Status'}
                                </PrimaryButton>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Modal>
    );
}