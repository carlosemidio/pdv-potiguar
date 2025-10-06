import { VariantAddon } from "./VariantAddon";

export type OrderItemAddon = {
    id?: number;
    order_item_id?: number;
    variant_addon_id?: number;
    variant_addon?: VariantAddon;
    quantity: number;
    unit_price: string;
    total_price: string;
};