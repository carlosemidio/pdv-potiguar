import { AddonGroupOption } from "./AddonGroupOption";

export type OrderItemOption = {
    id: number;
    order_item_id: number;
    addon_group_option_id: number;
    addon_group_option: AddonGroupOption;
    quantity: number;
    unit_price: number;
    created_at: string; // ou Date
    updated_at: string; // ou Date
};