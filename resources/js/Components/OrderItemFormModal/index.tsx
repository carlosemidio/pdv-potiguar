import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import InputLabel from "../InputLabel";
import { useForm } from "@inertiajs/react";
import { Order } from "@/types/Order";
import SearchableProductsSelect from "../SearchableProductsSelect";
import { useState } from "react";
import { Product } from "@/types/Product";
import { Variant } from "@/types/Variant";
import { OrderItem } from "@/types/OrderItem";
import { ProductAddon } from "@/types/ProductAddon";
import OrderItemAddonsForm from "../OrderItemAddonsForm";

interface OrderItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    orderItem?: OrderItem | null;
}

export default function OrderItemFormModal({ isOpen, onClose, order, orderItem }: OrderItemFormModalProps) {
    const { data, setData, patch, post, errors, processing } = useForm({
        order_id: order ? order.id : null,
        product_id: orderItem?.product.id || null,
        product_variant_id: orderItem?.variant?.id || null,
        quantity: orderItem?.quantity || 1,
        unit_price: orderItem?.unit_price || 0,
        total_price: orderItem?.total_price || 0,
        addons: orderItem?.item_addons || [],
    });

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(orderItem?.product || null);
    const [variants, setVariants] = useState<Variant[]>(orderItem?.product?.variants || []);
    const [productAddons, setProductAddons] = useState<ProductAddon[]>(orderItem?.product?.product_addons || []);

    const handleProductChange = (product: Product) => {
        setSelectedProduct(product);
        const productVariants = product.variants || [];
        let variantId = null;
        let unitPrice = 0;
        let totalPrice = 0;
        if (productVariants.length === 1) {
            variantId = productVariants[0].id;
            unitPrice = parseFloat(String(productVariants[0].price)) || 0;
            totalPrice = unitPrice * (data.quantity || 1);
        }
        setData({
            ...data,
            product_id: product.id,
            product_variant_id: variantId,
            unit_price: unitPrice,
            total_price: totalPrice,
        });

        setVariants(productVariants);
        setProductAddons(product.product_addons || []);
    }

    const handleVariantChange = (variantId: string) => {
        const variant = variants.find(v => v.id === parseInt(variantId));
        let price = data.unit_price || 0;

        if (variant) {
            price = parseFloat(String(variant.price)) || 0;
        }

        const totalPrice = price * (data.quantity || 1);

        if (variant) {
            setData({...data, product_variant_id: variant.id, unit_price: price, total_price: totalPrice });
        } else {
            setData({...data, product_variant_id: 0, unit_price: 0, total_price: 0 });
        }
    }

    const handleQuantityChange = (quantity: number) => {
        setData({...data, quantity: quantity, total_price: data.unit_price * quantity });
    }

    const closeModal = () => {
        setData({
            order_id: order ? order.id : null,
            product_id: null,
            product_variant_id: null,
            quantity: 1,
            unit_price: 0,
            total_price: 0,
            addons: [],
        });
        
        onClose();
    }

    const submit = () => {
        // Torna obrigatório selecionar uma variação
        if (!data.product_variant_id) {
            alert('Selecione uma variação do produto.');
            return;
        }
        let addons = data.addons || [];
        addons = addons.map(addon => ({
            addon_id: addon.addon_id,
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
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">Adicionar Item ao Pedido #{order?.id}</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3"> 
                    <div className="space-y-3">
                        <div>
                            <SearchableProductsSelect
                                selectedProduct={selectedProduct}
                                setProduct={handleProductChange}
                                isDisabled={false}
                            />
                        </div>

                        {variants.length > 0 && (
                            <div>
                                <InputLabel htmlFor="product_variant_id" value="Variação do Produto" />
                                <select
                                    id="product_variant_id"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={String(data.product_variant_id)}
                                    onChange={(e) => handleVariantChange(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione uma variação *</option>
                                    {variants.map((variant) => (
                                        <option key={variant.id} value={String(variant.id)}>
                                            {variant.name}
                                        </option>
                                    ))}
                                </select>
                                {(!data.product_variant_id) && <p className="text-red-600 text-sm mt-1">Selecione uma variação do produto.</p>}
                            </div>
                        )}

                        {productAddons.length > 0 && (
                            <div>
                                <OrderItemAddonsForm
                                    orderItemAddons={data.addons}
                                    productAddons={productAddons}
                                    onChange={(newAddons) => setData('addons', newAddons)}
                                />
                            </div>
                        )}

                        <div>
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

                        <div>
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

                        <div>
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