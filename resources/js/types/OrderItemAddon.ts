import { Addon } from "./Addon";

export type OrderItemAddon = {
    id?: number;
    order_item_id?: number;
    sp_variant_addon_id?: number;
    addon?: Addon | null;
    quantity: number;
    unit_price: string;
    total_price: string;
};