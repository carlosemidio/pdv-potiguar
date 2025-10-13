import { Button } from "@headlessui/react";
import { X, Plus, Package, Hash, Save } from "lucide-react";
import Modal from "../Modal";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import SearchableStoreProductVariantsSelect from "../SearchableStoreProductVariantsSelect";
import { StoreProductVariant } from "@/types/StoreProductVariant";

interface ComboItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    sp_variant_id: number;
    item_variant_id?: number;
    quantity?: number;
}

export default function ComboItemFormModal({
    isOpen,
    onClose,
    sp_variant_id,
    item_variant_id,
    quantity
}: ComboItemFormModalProps) {
    const { data, setData, post, processing } = useForm({
        sp_variant_id: sp_variant_id,
        item_variant_id: item_variant_id ?? 0,
        quantity: quantity
    });

    const [variant, setVariant] = useState<StoreProductVariant | null>(null);

    const handleVariantChange = (value: StoreProductVariant | null) => {
        setVariant(value);
        setData("item_variant_id", value ? value.id : 0);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('combo-items.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData({
                    sp_variant_id: sp_variant_id,
                    item_variant_id: item_variant_id ?? 0,
                    quantity: quantity
                });
                onClose();
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full mx-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Adicionar Opção Fixa
                                </h3>
                                <p className="text-blue-100 text-sm">
                                    Configure um item fixo para o combo
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
                        {/* Seleção do Produto */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <Package className="h-5 w-5 text-blue-600" />
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Produto
                                </h4>
                            </div>
                            <SearchableStoreProductVariantsSelect
                                selectedVariant={variant}
                                setVariant={handleVariantChange}
                            />
                        </div>

                        {/* Quantidade */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <Hash className="h-5 w-5 text-blue-600" />
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Quantidade
                                </h4>
                            </div>
                            <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ex: 2"
                                min={1}
                                required
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
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
