import { Button } from "@headlessui/react";
import { X, Plus, Package, DollarSign, Hash, Save } from "lucide-react";
import Modal from "../Modal";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { StoreProductVariant } from "@/types/StoreProductVariant";
import SearchableStoreProductVariantsSelect from "../SearchableStoreProductVariantsSelect";

interface ComboOptionItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    option_group_id: number;
}

export default function ComboOptionItemFormModal({
    isOpen,
    onClose,
    option_group_id
}: ComboOptionItemFormModalProps) {
    const { data, setData, post, processing } = useForm({
        option_group_id: option_group_id,
        sp_variant_id: 0,
        additional_price: '',
        quantity: ''
    });

    const [variant, setVariant] = useState<StoreProductVariant | null>(null);

    const handleVariantChange = (value: StoreProductVariant | null) => {
        setVariant(value);
        setData("sp_variant_id", value ? value.id : 0);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('combo-option-items.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData({
                    option_group_id: option_group_id,
                    sp_variant_id: 0,
                    additional_price: '',
                    quantity: '',
                });
                onClose();
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full mx-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Adicionar Item da Opção
                                </h3>
                                <p className="text-indigo-100 text-sm">
                                    Configure um item para este grupo de opções
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
                                <Package className="h-5 w-5 text-indigo-600" />
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Produto
                                </h4>
                            </div>
                            <SearchableStoreProductVariantsSelect
                                selectedVariant={variant}
                                setVariant={handleVariantChange}
                                isDisabled={processing}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Preço Adicional */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-3">
                                    <DollarSign className="h-5 w-5 text-indigo-600" />
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Ex: 2.50"
                                    required
                                    disabled={processing}
                                />
                            </div>

                            {/* Quantidade */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Hash className="h-5 w-5 text-indigo-600" />
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        Quantidade
                                    </h4>
                                </div>
                                <input
                                    type="number"
                                    id="quantity"
                                    min={1}
                                    step={1}
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Ex: 1"
                                    required
                                    disabled={processing}
                                />
                            </div>
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
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
