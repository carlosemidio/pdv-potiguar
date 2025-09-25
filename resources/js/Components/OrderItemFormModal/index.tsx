import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import InputLabel from "../InputLabel";
import { useForm } from "@inertiajs/react";
import { Order } from "@/types/Order";
import { useState } from "react";
import { OrderItem } from "@/types/OrderItem";
import OrderItemAddonsForm from "../OrderItemAddonsForm";
import SearchableStoreProductVariantsSelect from "../SearchableStoreProductVariantsSelect";
import { StoreProductVariant } from "@/types/StoreProductVariant";
import { VariantAddon } from "@/types/VariantAddon";
import Swal from "sweetalert2";

interface OrderItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    orderItem?: OrderItem | null;
}

export default function OrderItemFormModal({ isOpen, onClose, order, orderItem }: OrderItemFormModalProps) {
    const { data, setData, post, errors, processing } = useForm({
        order_id: order ? order.id : 0,
        store_product_variant_id: orderItem?.store_product_variant_id || 0,
        quantity: orderItem?.quantity || 1,
        unit_price: orderItem?.unit_price || 0,
        total_price: orderItem?.total_price || 0,
        addons: orderItem?.order_item_addons || [],
        addonGroupOptionQuantities: {}, // { [`${group.id}_${option.id}`]: quantidade }
    });

    const [addons, setAddons] = useState<VariantAddon[]>([]);
    const [storeProductVariant, setStoreProductVariant] = useState<StoreProductVariant | null>(null);

    const handleQuantityChange = (quantity: number) => {
        setData({...data, quantity: quantity, total_price: data.unit_price * quantity });
    }

    const handleVariantChange = (storeProductVariant: StoreProductVariant | null) => {
        setStoreProductVariant(storeProductVariant);
        setAddons(storeProductVariant ? storeProductVariant.variant_addons ?? [] : []);
        const newUnitPrice = Number(storeProductVariant?.price ?? 0);
        const newQuantity = Number(data.quantity ?? 1);
        setData({
            ...data,
            store_product_variant_id: storeProductVariant ? storeProductVariant.id : 0,
            unit_price: newUnitPrice,
            total_price: newUnitPrice * newQuantity
        });
    };

    const closeModal = () => {
        setData({
            order_id: order ? order.id : 0,
            store_product_variant_id: 0,
            quantity: 1,
            unit_price: 0,
            total_price: 0,
            addons: [],
            addonGroupOptionQuantities: {},
        });
        onClose();
    }

    const submit = () => {
        const dataToSubmit = {
            ...data,
        };
        post(route('orders.items.store', order.id), {
            data: dataToSubmit,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => closeModal(),
        })
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

                            <div className="flex-1">
                                <InputLabel htmlFor="unit_price" value="Preço Unitário" />
                                <input
                                    type="number"
                                    id="unit_price"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.unit_price}
                                    min={0}
                                    step="0.01"
                                    disabled
                                />
                                {errors.unit_price && <p className="text-red-600 text-sm mt-1">{errors.unit_price}</p>}
                            </div>

                            <div className="flex-1">
                                <InputLabel htmlFor="total_price" value="Preço Total" />
                                <input
                                    type="number"
                                    id="total_price"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.total_price}
                                    min={0}
                                    step="0.01"
                                    disabled
                                    readOnly
                                />
                                {errors.total_price && <p className="text-red-600 text-sm mt-1">{errors.total_price}</p>}
                            </div>
                        </div>

                        {/* Estilo iFood para grupos de opções */}
                        {storeProductVariant?.variant_addon_groups && storeProductVariant.variant_addon_groups.length > 0 && (
                            <div className="space-y-4">
                                {storeProductVariant.variant_addon_groups.map((group, groupIdx) => {
                                    const quantities = data.addonGroupOptionQuantities as Record<string, number>;
                                    const groupKeys = Object.keys(quantities).filter(k => k.startsWith(`${group.id}_`));
                                    const totalSelected = groupKeys.reduce((sum, k) => sum + (quantities[k] || 0), 0);
                                    const max = Number(group.max_options) || 0;
                                    const min = Number(group.min_options) || 0;
                                    const limiteAtingido = max > 0 && totalSelected >= max;
                                    let groupError: string | undefined = undefined;
                                    const addonGroupErrors = errors?.addonGroupOptionQuantities;
                                    if (addonGroupErrors) {
                                        if (typeof addonGroupErrors === 'string') {
                                            groupError = addonGroupErrors;
                                        } else if (typeof addonGroupErrors === 'object') {
                                            groupError = (addonGroupErrors as Record<string, string | undefined>)[String(group.id)];
                                        }
                                    }
                                    return (
                                        <div key={groupIdx} className={`border-2 rounded-xl p-3 bg-white dark:bg-gray-900 shadow-sm ${limiteAtingido ? 'border-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                                <span className="font-semibold text-base text-blue-700 dark:text-blue-300">{group.name} {group.is_required ? <span className="text-red-500">*</span> : null}</span>
                                                <span className="text-xs text-gray-500 mt-1 sm:mt-0">(Escolha {min}{max > min ? ` até ${max}` : ''})</span>
                                                {errors && (group.id && (errors as any)['addonGroupOptionQuantities.'+group.id]) && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {(errors as any)['addonGroupOptionQuantities.'+group.id]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {group.addon_group_options && group.addon_group_options.length > 0 ? (
                                                    group.addon_group_options.map((option, optionIdx) => {
                                                        const currentGroupKey = `${group.id}_${option.id}`;
                                                        const value = quantities[currentGroupKey] ?? 0;
                                                        return (
                                                            <div key={optionIdx} className={`flex items-center gap-2 p-2 rounded transition-all ${value > 0 ? 'bg-blue-50 dark:bg-blue-800' : 'bg-gray-50 dark:bg-gray-900'}`}>
                                                                <span className="flex-1 font-medium text-sm">{option.addon?.name}</span>
                                                                {option.additional_price > 0 && (
                                                                    <span className="text-xs text-green-700 dark:text-green-300 font-semibold">+ R$ {option.additional_price}</span>
                                                                )}
                                                                <input
                                                                    type="number"
                                                                    min={0}
                                                                    max={(() => {
                                                                        // Limite máximo por grupo e por opção
                                                                        const optionMax = option.quantity ?? undefined;
                                                                        if (max > 0 && optionMax !== undefined) {
                                                                            return Math.min(max, optionMax);
                                                                        }
                                                                        if (optionMax !== undefined) {
                                                                            return optionMax;
                                                                        }
                                                                        return max > 0 ? max : undefined;
                                                                    })()}
                                                                    className="w-14 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs text-center focus:ring-blue-500 focus:border-blue-500"
                                                                    value={value}
                                                                    onChange={e => {
                                                                        let qty = Math.max(0, parseInt(e.target.value) || 0);
                                                                        // Soma total de opções já selecionadas neste grupo (excluindo a atual)
                                                                        const totalOther = groupKeys.reduce((sum, k) => k === currentGroupKey ? sum : sum + (quantities[k] || 0), 0);
                                                                        // Limite do grupo
                                                                        if (max > 0 && (totalOther + qty) > max) {
                                                                            qty = Math.max(0, max - totalOther);
                                                                        }
                                                                        // Limite da opção
                                                                        if (option.quantity !== undefined && qty > option.quantity) {
                                                                            qty = option.quantity;
                                                                        }
                                                                        setData({
                                                                            ...data,
                                                                            addonGroupOptionQuantities: {
                                                                                ...quantities,
                                                                                [currentGroupKey]: qty
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-xs text-gray-500">Nenhuma opção disponível.</span>
                                                )}
                                            </div>
                                            {groupError && (
                                                <div className="mt-2 text-xs text-red-600 font-semibold">{groupError}</div>
                                            )}
                                            {limiteAtingido && (
                                                <div className="mt-2 text-xs text-blue-600 font-semibold">Limite máximo de opções atingido!</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {/* Addons avulsos */}
                        {addons.length > 0 && (
                            <div>
                                <OrderItemAddonsForm
                                    orderItemAddons={data.addons}
                                    productAddons={addons as any}
                                    onChange={(newAddons) => setData('addons', newAddons)}
                                />
                            </div>
                        )}

                        <div className="mt-3 flex justify-end items-center gap-2">
                            <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                            <PrimaryButton onClick={submit}>Salvar</PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </>
}