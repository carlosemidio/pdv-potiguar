import { StoreProductVariant } from "./StoreProductVariant";

export type ComboItem = {
    id: number;
    sp_variant_id: number;
    item_variant_id: number;
    quantity: number;
    item_variant?: StoreProductVariant;
    created_at?: string;
    updated_at?: string;
}