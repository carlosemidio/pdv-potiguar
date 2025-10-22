import { Button } from "@headlessui/react";
import { X, Plus, DollarSign, Save, Package } from "lucide-react";
import Modal from "../Modal";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Addon } from "@/types/Addon";
import SearchableAddonsSelect from "../SearchableAddonsSelect";

interface AddonGroupOptionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    addon_group_id: number;
}

export default function AddonGroupOptionFormModal({
    isOpen,
    onClose,
    addon_group_id
}: AddonGroupOptionFormModalProps) {
    const { data, setData, post, processing } = useForm({
        addon_group_id: addon_group_id,
        addon_id: 0,
        additional_price: '',
    });

    const [addon, setAddon] = useState<Addon | null>(null);

    const handleAddonChange = (selectedAddon: Addon | null) => {
        setAddon(selectedAddon);
        setData('addon_id', selectedAddon ? selectedAddon.id : 0);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('addon-group-options.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData({
                    addon_group_id: 0,
                    addon_id: 0,
                    additional_price: '',
                });
                onClose();
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Adicionar Opção
                                </h3>
                                <p className="text-purple-100 text-sm">
                                    Configure uma nova opção para o grupo
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={onClose}
                            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-white" />
                        </Button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Seleção do Complemento */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <Package className="h-5 w-5 text-purple-600" />
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Complemento
                                </h4>
                            </div>
                            <SearchableAddonsSelect
                                selectedAddon={addon}
                                setAddon={handleAddonChange}
                                isDisabled={processing}
                            />
                        </div>

                        {/* Preço Adicional */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <DollarSign className="h-5 w-5 text-purple-600" />
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Preço Adicional
                                </h4>
                            </div>
                            <input
                                type="number"
                                id="additional_price"
                                min={0}
                                step={0.01}
                                value={data.additional_price}
                                onChange={(e) => setData('additional_price', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Ex: 2.50"
                                required
                                disabled={processing}
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {processing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        <span>Salvar</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}
