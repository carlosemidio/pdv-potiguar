import { Order } from "./Order";
import { OrderItemAddon } from "./OrderItemAddon";
import { Product } from "./Product";
import { ProductVariant } from "./ProductVariant";

export type OrderItem = {
    id: number;
    user_id: number;
    order: Order;
    product: Product;
    variant: ProductVariant | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    item_addons: OrderItemAddon[];
    created_at: string; // ou Date
    updated_at: string; // ou Date
};