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
import { Addon } from "@/types/Addon";

interface OrderItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    orderItem?: OrderItem | null;
}

export default function OrderItemFormModal({ isOpen, onClose, order, orderItem }: OrderItemFormModalProps) {
    const { data, setData, patch, post, errors, processing } = useForm({
        order_id: order ? order.id : null,
        store_product_variant_id: orderItem?.store_product_variant_id || null,
        quantity: orderItem?.quantity || 1,
        unit_price: orderItem?.unit_price || 0,
        total_price: orderItem?.total_price || 0,
        addons: orderItem?.item_addons || [],
    });

    const [addons, setAddons] = useState<Addon[]>([]);
    const [storeProductVariant, setStoreProductVariant] = useState<StoreProductVariant | null>(null);

    const handleQuantityChange = (quantity: number) => {
        setData({...data, quantity: quantity, total_price: data.unit_price * quantity });
    }

    const handleVariantChange = (storeProductVariant: StoreProductVariant | null) => {
        setStoreProductVariant(storeProductVariant);
        setAddons(storeProductVariant ? storeProductVariant.addons ?? [] : []);
        setData({
            ...data,
            store_product_variant_id: storeProductVariant ? storeProductVariant.id : null,
            unit_price: storeProductVariant ? storeProductVariant.price : 0,
            total_price: (storeProductVariant ? storeProductVariant.price : 0) * data.quantity
        });
    };

    const closeModal = () => {
        setData({
            order_id: order ? order.id : null,
            store_product_variant_id: null,
            quantity: 1,
            unit_price: 0,
            total_price: 0,
            addons: [],
        });
        
        onClose();
    }

    const submit = () => {
        // Torna obrigatório selecionar uma variação
        let addons = data.addons || [];
        addons = addons.map(addon => ({
            sp_variant_addon_id: addon.sp_variant_addon_id,
            quantity: addon.quantity,
            unit_price: addon.unit_price,
            total_price: addon.total_price,
        }));

        const dataToSubmit = {
            ...data,
            addons: addons,
        };

        post(route('orders.items.store', order.id), {
            data: dataToSubmit,
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => closeModal(),
        });

        onClose();
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

                        {addons.length > 0 && (
                            <div>
                                <OrderItemAddonsForm
                                    orderItemAddons={data.addons}
                                    productAddons={addons}
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