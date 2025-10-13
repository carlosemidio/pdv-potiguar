import { Button } from "@headlessui/react";
import { X, Plus, Hash, DollarSign, Save, Package } from "lucide-react";
import Modal from "../Modal";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Unit } from "@/types/Unit";
import { Addon } from "@/types/Addon";
import { VariantAddon } from "@/types/VariantAddon";
import SearchableAddonsSelect from "../SearchableAddonsSelect";

interface VariantAddonFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    sp_variant_id: number;
    units: Unit[];
    variantAddon?: VariantAddon | null;
}

export default function VariantAddonFormModal({
    isOpen,
    onClose,
    sp_variant_id,
}: VariantAddonFormModalProps) {
    const { data, setData, post, processing, errors } = useForm({
        sp_variant_id: sp_variant_id,
        addon_id: '' as string | number,
        quantity: '',
        price: '',
    });

    const [addon, setAddon] = useState<Addon | null>(null);

    const handleAddonChange = (ad: Addon | null) => {
        setAddon(ad);
        setData('addon_id', ad ? ad.id : '');
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('variant-addons.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => onClose()
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full mx-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Adicionar Complemento
                                </h3>
                                <p className="text-orange-100 text-sm">
                                    Configure o complemento para esta variante
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
                    {/* Seleção do Complemento */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <Package className="h-5 w-5 text-amber-600" />
                            <h4 className="text-sm font-semibold text-gray-900">
                                Complemento
                            </h4>
                        </div>
                        <SearchableAddonsSelect
                            selectedAddon={addon}
                            setAddon={handleAddonChange}
                            isDisabled={processing}
                        />
                        {errors.addon_id && (
                            <p className="text-red-500 text-xs mt-1">{errors.addon_id}</p>
                        )}
                    </div>

                    {/* Quantidade */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <Hash className="h-5 w-5 text-amber-600" />
                            <h4 className="text-sm font-semibold text-gray-900">
                                Quantidade
                            </h4>
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.quantity}
                            onChange={(e) => setData('quantity', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="Ex: 1.5"
                        />
                        {errors.quantity && (
                            <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                        )}
                    </div>

                    {/* Preço Adicional */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <DollarSign className="h-5 w-5 text-amber-600" />
                            <h4 className="text-sm font-semibold text-gray-900">
                                Preço
                            </h4>
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="Ex: 2.50"
                        />
                        {errors.price && (
                            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                        )}
                    </div>
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
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {processing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        <span>Adicionar</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}
