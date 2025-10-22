import { Plus, Package, Hash, Settings, FileText, ShoppingCart, DollarSign, X } from 'lucide-react';
import Modal from "../Modal";
import { useForm } from "@inertiajs/react";
import { Order } from "@/types/Order";
import { useEffect, useState } from "react";
import { OrderItem } from "@/types/OrderItem";
import SearchableStoreProductVariantsSelect from "../SearchableStoreProductVariantsSelect";
import { StoreProductVariant } from "@/types/StoreProductVariant";
import { VariantAddon } from "@/types/VariantAddon";
import { SelectedAddonGroupOption } from "@/types/SelectedAddonGroupOption";
import { SelectedVariantAddon } from "@/types/SelectedVariantAddon";
import VariantAddonGroupsForm from "../VariantAddonGroupsForm";
import VariantAddonsForm from "../VariantAddonsForm";
import { VariantAddonGroup } from "@/types/VariantAddonGroup";
import { ComboOptionGroup } from "@/types/ComboOptionGroup";
import { SelectedComboOptionItem } from "@/types/SelectedComboOptionItem";
import ComboOptionItemSelectionFormModal from "../ComboOptionItemSelectionFormModal";

interface OrderItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    orderItem?: OrderItem | null;
}

export default function OrderItemFormModal({ isOpen, onClose, order, orderItem }: OrderItemFormModalProps) {
    const { data, setData, post, errors, processing } = useForm({
        order_id: order ? order.id : 0,
        store_product_variant_id: 0,
        quantity: 1,
        options: [] as { id: number, quantity: number }[],
        combo_options: [] as { id: number, quantity: number }[],
        addons: [] as { id: number, quantity: number }[],
        notes: orderItem ? orderItem.notes : '',
    });

    const [storeProductVariant, setStoreProductVariant] = useState<StoreProductVariant | null>(null);

    const [addonGroupOptions, setAddonGroupOptions] = useState<VariantAddonGroup[]>([]);
    const [selectedAddonGroupOptions, setSelectedAddonGroupOptions] = useState<SelectedAddonGroupOption[]>([]);
    const [variantAddons, setVariantAddons] = useState<VariantAddon[]>([]);
    const [selectedVariantAddons, setSelectedVariantAddons] = useState<SelectedVariantAddon[]>([]);
    const [comboOptionGroups, setComboOptionGroups] = useState<ComboOptionGroup[]>([]);
    const [selectedComboOptions, setSelectedComboOptions] = useState<SelectedComboOptionItem[]>([]);
    const [isOptionsValid, setIsOptionsValid] = useState(true);
    const [subTotal, setSubtotal] = useState(0.0);

    useEffect(() => {
        if (storeProductVariant?.variant_addon_groups && (storeProductVariant.variant_addon_groups.length > 0)) {
            setIsOptionsValid(storeProductVariant.variant_addon_groups.every(g => {
                const selectedCount = selectedAddonGroupOptions
                    .filter(sa => sa.option.addon_group_id === g.id)
                    .reduce((sum, sa) => sum + sa.qty, 0);
                return (!g.is_required || (selectedCount >= (g.min_options || 0) && (g.max_options === null || selectedCount <= g.max_options)));
            }));
        } else if (comboOptionGroups.length > 0) {
            setIsOptionsValid(comboOptionGroups.every(g => {
                const selectedCount = selectedComboOptions
                    .filter(sc => sc.option.option_group_id === g.id)
                    .reduce((sum, sc) => sum + sc.qty, 0);
                return (!g.is_required || (selectedCount >= (g.min_options || 0) && (g.max_options === null || selectedCount <= g.max_options)));
            }));
        } else {
            setIsOptionsValid(true);
        }

        // Recalcula subtotal
        let vPrice = storeProductVariant?.price || 0;
        let optionAdditionalPrice = selectedAddonGroupOptions.filter(sa => (sa.option.additional_price > 0)).reduce((sum, sa) => sum + (sa.option.additional_price * sa.qty), 0);
        let comboOptionsPrice = selectedComboOptions.filter(sc => (sc.option.additional_price > 0)).reduce((sum, sc) => sum + (sc.option.additional_price * sc.qty), 0);
        let vAddonsPrice = selectedVariantAddons.filter(va => (va.variantAddon.price && va.variantAddon.price > 0)).reduce((sum, va) => sum + ((va.variantAddon.price ?? 0) * va.qty), 0);
        let newSubtotal = (Number(vPrice) + Number(optionAdditionalPrice) + Number(comboOptionsPrice) + Number(vAddonsPrice));

        setSubtotal(newSubtotal * (data.quantity || 1));
    }, [storeProductVariant, selectedAddonGroupOptions, selectedComboOptions, selectedVariantAddons, data.quantity]);

    const handleQuantityChange = (quantity: number) => {
        setData({...data, quantity: quantity });
    }

    const handleAddonGroupOptionsChange = (selectedOptions: SelectedAddonGroupOption[]) => {
        setSelectedAddonGroupOptions(selectedOptions);
        setData('options', selectedOptions.map(sa => ({ id: sa.option.id, quantity: sa.qty })));
    }

    const handleComboOptionsChange = (selectedOptions: SelectedComboOptionItem[]) => {
        setSelectedComboOptions(selectedOptions);
        setData('combo_options', selectedOptions.map(sc => ({ id: sc.option.id, quantity: sc.qty })));
    }

    const handleVariantAddonsChange = (selectedAddons: SelectedVariantAddon[]) => {
        setSelectedVariantAddons(selectedAddons);
        setData('addons', selectedAddons.map(va => ({ id: va.variantAddon.id, quantity: va.qty })));
    }

    const handleVariantChange = (storeProductVariant: StoreProductVariant | null) => {
        setStoreProductVariant(storeProductVariant);
        setAddonGroupOptions(storeProductVariant?.variant_addon_groups ? storeProductVariant.variant_addon_groups : []);
        setComboOptionGroups(storeProductVariant?.combo_option_groups ? storeProductVariant.combo_option_groups : []);
        setVariantAddons(storeProductVariant ? storeProductVariant.variant_addons ?? [] : []);
        setSelectedAddonGroupOptions([]);
        setSelectedComboOptions([]);
        setSelectedVariantAddons([]);

        const newQuantity = Number(data.quantity ?? 1);
        setData({
            ...data,
            store_product_variant_id: storeProductVariant ? storeProductVariant.id : 0,
            quantity: newQuantity,
            options: [],
            addons: []
        });
    };

    const closeModal = () => {
        setData({
            order_id: order ? order.id : 0,
            store_product_variant_id: 0,
            quantity: 1,
            options: [],
            combo_options: [],
            addons: [],
            notes: orderItem ? orderItem.notes : '',
        });
        onClose();
    }

    const submit = () => {
        setTimeout(() => {
            post(route('orders.items.store', order.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => closeModal(),
            });
        }, 300);
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="w-6 h-6 text-green-500" />
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                                {orderItem ? 'Editar Item' : 'Adicionar Item'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pedido #{order?.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Produto + Quantidade */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Produto</label>
                            <SearchableStoreProductVariantsSelect
                                selectedVariant={storeProductVariant}
                                setVariant={handleVariantChange}
                                isDisabled={processing}
                            />
                            {errors.store_product_variant_id && (
                                <p className="text-xs text-red-600 mt-1">{errors.store_product_variant_id}</p>
                            )}
                        </div>

                        <div className="rounded-xl p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Quantidade</label>
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(Math.max(1, data.quantity - 1))}
                                    className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                                >-</button>
                                <input
                                    type="number"
                                    className="w-full text-center bg-transparent py-2 focus:outline-none"
                                    value={data.quantity}
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                                    min={1}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(data.quantity + 1)}
                                    className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                                >+</button>
                            </div>
                            {errors.quantity && (
                                <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
                            )}
                        </div>
                    </div>

                    {/* Addons, Combos, Observações */}
                    <div className="space-y-4">
                        {addonGroupOptions.length > 0 && (
                            <div className="rounded-xl p-4 border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                                    <Settings className="w-4 h-4" /> Opções do Produto
                                </label>
                                <VariantAddonGroupsForm
                                    variantAddonGroups={addonGroupOptions}
                                    selectedAddonGroupOptions={selectedAddonGroupOptions}
                                    onChange={handleAddonGroupOptionsChange}
                                    errors={errors}
                                />
                            </div>
                        )}

                        {comboOptionGroups.length > 0 && (
                            <div className="rounded-xl p-4 border border-pink-300 dark:border-pink-700 bg-pink-50 dark:bg-pink-900/10">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                                    <Settings className="w-4 h-4" /> Opções de Combo
                                </label>
                                <ComboOptionItemSelectionFormModal
                                    comboOptionGroups={comboOptionGroups}
                                    selectedAddonGroupOptions={selectedComboOptions}
                                    onChange={handleComboOptionsChange}
                                    errors={errors}
                                />
                            </div>
                        )}

                        {variantAddons.length > 0 && (
                            <div className="rounded-xl p-4 border border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/10">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Adicionais
                                </label>
                                <VariantAddonsForm
                                    variantAddons={variantAddons}
                                    selectedVariantAddons={selectedVariantAddons}
                                    setSelectedVariantAddons={handleVariantAddonsChange}
                                />
                            </div>
                        )}

                        <div className="rounded-xl p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Observações
                            </label>
                            <textarea
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:ring-1 focus:ring-gray-400 dark:bg-gray-800 dark:text-gray-100"
                                value={data.notes || ''}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={3}
                                placeholder="Observações para este item"
                            />
                            <p className="text-xs text-gray-400 mt-1">{(data.notes?.length || 0)}/500</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Subtotal */}
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Subtotal: <span className="text-green-600 dark:text-green-400">R$ {(Number(subTotal) || 0).toFixed(2).replace('.', ',')}</span>
                    </div>

                    {/* Botões */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={!isOptionsValid || processing}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
                        >
                            {processing ? 'Processando...' : orderItem ? 'Atualizar Item' : 'Adicionar ao Pedido'}
                        </button>
                    </div>
                </div>

                {/* Validação */}
                {!isOptionsValid && (
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 text-center">
                        Complete todas as opções obrigatórias antes de continuar.
                    </div>
                )}
            </div>
        </Modal>
    );
}