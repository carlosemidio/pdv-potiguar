import { ComboOptionItem } from "./ComboOptionItem";

export type OrderItemComboOption = {
    id: number;
    order_item_id: number;
    combo_option_item_id: number;
    combo_option_item: ComboOptionItem;
    quantity: number;
    unit_price: number;
    created_at: string; // ou Date
    updated_at: string; // ou Date
};