import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import InputLabel from "../InputLabel";
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

    return <>
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-2 w-full scrollbar max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between">
                    <p className="text-xs">Adicionar Item ao Pedido #{order?.id}</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3"> 
                    <div className="space-y-3">
                        <div>
                            <SearchableStoreProductVariantsSelect
                                selectedVariant={storeProductVariant}
                                setVariant={handleVariantChange}
                                isDisabled={processing}
                            />
                            {errors.store_product_variant_id && <p className="text-red-600 text-sm mt-1">{errors.store_product_variant_id}</p>}
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <InputLabel htmlFor="quantity" value="Quantidade" />
                                <input
                                    type="number"
                                    id="quantity"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.quantity}
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                                    min={1}
                                />
                                {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
                            </div>
                        </div>

                        {(addonGroupOptions.length > 0) && (
                            <VariantAddonGroupsForm
                                variantAddonGroups={addonGroupOptions}
                                selectedAddonGroupOptions={selectedAddonGroupOptions}
                                onChange={handleAddonGroupOptionsChange}
                                errors={errors}
                            />
                        )}

                        {(storeProductVariant && storeProductVariant.combo_items && (storeProductVariant.combo_items.length > 0)) && (
                            <div className="mt-3">
                                <div className="font-medium mb-2">Items fixos</div>
                                
                                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                                    {storeProductVariant.combo_items.map(ci => (
                                        <li key={ci.id}>
                                            {ci.quantity}x {ci.item_variant?.product_variant?.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {(comboOptionGroups.length > 0) && (
                            <ComboOptionItemSelectionFormModal
                                comboOptionGroups={comboOptionGroups}
                                selectedAddonGroupOptions={selectedComboOptions}
                                onChange={handleComboOptionsChange}
                                errors={errors}
                            />
                        )}

                        {(variantAddons.length > 0) && (
                            <VariantAddonsForm
                                variantAddons={variantAddons}
                                selectedVariantAddons={selectedVariantAddons}
                                setSelectedVariantAddons={handleVariantAddonsChange}
                            />
                        )}

                        <div>
                            <InputLabel htmlFor="notes" value="Observações" />
                            <textarea
                                id="notes"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={data.notes ?? ''}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={3}
                                maxLength={500}
                            />
                            {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes}</p>}
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-neutral-500 leading-none">Subtotal</div>
                            <div className="text-2xl font-bold text-neutral-800">R$ {(Number(subTotal) || 0).toFixed(2)}</div>
                        </div>

                        <div className="mt-3 flex justify-end items-center gap-2">
                            <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                            <PrimaryButton onClick={submit} disabled={!isOptionsValid}>Adicionar</PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </>
}