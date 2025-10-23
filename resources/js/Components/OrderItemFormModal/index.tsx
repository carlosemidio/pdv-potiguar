import { Plus, ShoppingCart, X, MessageCircleMore } from 'lucide-react';
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
import QuantityInput from './QuantityInput';
import { formatCurrency } from '@/utils/helpers';

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

    const handleQuantityChange = (quantity: number) => setData({ ...data, quantity });
    const handleAddonGroupOptionsChange = (selectedOptions: SelectedAddonGroupOption[]) => {
        setSelectedAddonGroupOptions(selectedOptions);
        setData('options', selectedOptions.map(sa => ({ id: sa.option.id, quantity: sa.qty })));
    };
    const handleComboOptionsChange = (selectedOptions: SelectedComboOptionItem[]) => {
        setSelectedComboOptions(selectedOptions);
        setData('combo_options', selectedOptions.map(sc => ({ id: sc.option.id, quantity: sc.qty })));
    };
    const handleVariantAddonsChange = (selectedAddons: SelectedVariantAddon[]) => {
        setSelectedVariantAddons(selectedAddons);
        setData('addons', selectedAddons.map(va => ({ id: va.variantAddon.id, quantity: va.qty })));
    };
    const handleVariantChange = (variant: StoreProductVariant | null) => {
        setStoreProductVariant(variant);
        setAddonGroupOptions(variant?.variant_addon_groups ?? []);
        setComboOptionGroups(variant?.combo_option_groups ?? []);
        setVariantAddons(variant?.variant_addons ?? []);
        setSelectedAddonGroupOptions([]);
        setSelectedComboOptions([]);
        setSelectedVariantAddons([]);
        setData({
            ...data,
            store_product_variant_id: variant?.id ?? 0,
            quantity: data.quantity || 1,
            options: [],
            addons: [],
            combo_options: [],
        });
    };
    const closeModal = () => {
        setData({
            order_id: order?.id ?? 0,
            store_product_variant_id: 0,
            quantity: 1,
            options: [],
            combo_options: [],
            addons: [],
            notes: orderItem?.notes ?? '',
        });
        onClose();
    };
    const submit = () => post(route('orders.items.store', order.id), { preserveScroll: true, preserveState: true, onSuccess: closeModal });

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-white dark:bg-gray-800 shadow-lg max-w-3xl w-full flex flex-col sm:h-[80vh] h-full rounded-t-2xl sm:rounded-2xl mt-4 sm:mt-0 rounded-b-0 sm:rounded-b-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 rounded-t-2xl">
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

                {/* Body rolável */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {/* Produto + Quantidade */}
                    <div className="w-full p-4">
                        <SearchableStoreProductVariantsSelect
                            selectedVariant={storeProductVariant}
                            setVariant={handleVariantChange}
                            isDisabled={processing}
                        />
                        {errors.store_product_variant_id && (
                            <p className="text-xs text-red-600 mt-1">{errors.store_product_variant_id}</p>
                        )}
                    </div>

                    {/* Addons, Combos, Observações */}
                    <div className="space-y-4">
                        {addonGroupOptions.length > 0 && (
                            <VariantAddonGroupsForm
                                variantAddonGroups={addonGroupOptions}
                                selectedAddonGroupOptions={selectedAddonGroupOptions}
                                onChange={handleAddonGroupOptionsChange}
                                errors={errors}
                            />
                        )}
                        {comboOptionGroups.length > 0 && (
                            <ComboOptionItemSelectionFormModal
                                comboOptionGroups={comboOptionGroups}
                                selectedItems={selectedComboOptions}
                                onChange={handleComboOptionsChange}
                                errors={errors}
                            />
                        )}
                        {variantAddons.length > 0 && (
                            <div className="rounded-xl border-t border-gray-200 dark:border-gray-700">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                                    <Plus className="w-4 h-4" /> Adicionais
                                </label>
                                <VariantAddonsForm
                                    variantAddons={variantAddons}
                                    selectedVariantAddons={selectedVariantAddons}
                                    setSelectedVariantAddons={handleVariantAddonsChange}
                                />
                            </div>
                        )}
                        {storeProductVariant && (
                            <div className="rounded-xl p-4">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex justify-between items-center">
                                    <div className='flex items-center gap-2'>
                                        <MessageCircleMore className="w-4 h-4" /> Observações
                                    </div>
                                    {(data.notes?.length || 0)}/255
                                </label>
                                <textarea
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:ring-1 focus:ring-gray-400 dark:bg-gray-800 dark:text-gray-100"
                                    value={data.notes || ''}
                                    onChange={(e) => { (data.notes?.length ?? 0) <= 255 && setData('notes', e.target.value); }}
                                    rows={3}
                                    placeholder="Observações para este item?"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Validação */}
                {!isOptionsValid && (
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 text-center">
                        Complete todas as opções obrigatórias antes de continuar.
                    </div>
                )}

                {/* Footer fixo */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-900 sticky bottom-0 rounded-b-0 sm:rounded-b-2xl">
                    <div className="flex items-center gap-3">
                        {(storeProductVariant && !storeProductVariant.is_produced) ? (
                            <QuantityInput
                                value={data.quantity}
                                onChange={handleQuantityChange}
                                error={errors.quantity}
                                min={1}
                                max={storeProductVariant?.stock_quantity ?? undefined}
                            />
                        ) : (
                            <QuantityInput
                                value={data.quantity}
                                onChange={handleQuantityChange}
                                error={errors.quantity}
                                min={1}
                            />
                        )}
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                        <span className="text-green-600 dark:text-green-400">{formatCurrency(subTotal)}</span>
                    </div>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={!isOptionsValid || processing}
                        className={`px-5 py-2 rounded-lg font-medium text-white shadow-sm transition-all duration-200 ${
                            processing
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-700"
                        } ${!isOptionsValid ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {processing ? "Processando..." : "Adicionar"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
