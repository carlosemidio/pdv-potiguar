import { Order } from "./Order";
import { OrderItemAddon } from "./OrderItemAddon";
import { OrderItemComboOption } from "./OrderItemComboOption";
import { OrderItemOption } from "./OrderItemOption";
import { StoreProductVariant } from "./StoreProductVariant";

export type OrderItem = {
    id: number;
    user_id: number;
    order_id: number;
    store_product_variant_id: number | null;
    order: Order;
    store_product_variant: StoreProductVariant | null;
    order_item_options: OrderItemOption[];
    combo_option_items: OrderItemComboOption[];
    order_item_addons: OrderItemAddon[];
    quantity: number;
    unit_price: number;
    total_price: number;
    status: string;
    notes: string | null;
    created_at: string; // ou Date
    updated_at: string; // ou Date
};