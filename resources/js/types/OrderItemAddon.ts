import { Addon } from "./Addon";

export type OrderItemAddon = {
    id?: number;
    order_item_id?: number;
    addon_id: number | null;
    addon?: Addon;
    quantity: number;
    unit_price: string;
    total_price: string;
};