import { Order } from "./Order";
import { OrderItemAddon } from "./OrderItemAddon";
import { Product } from "./Product";
import { ProductVariant } from "./ProductVariant";
import { StoreProductVariant } from "./StoreProductVariant";

export type OrderItem = {
    id: number;
    user_id: number;
    store_product_variant_id: number | null;
    order: Order;
    store_product_variant: StoreProductVariant | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    item_addons: OrderItemAddon[];
    created_at: string; // ou Date
    updated_at: string; // ou Date
};