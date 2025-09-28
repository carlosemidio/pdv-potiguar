import { StoreProductVariant } from "./StoreProductVariant";

export type ComboOptionItem = {
    id: number;
    option_group_id: number;
    sp_variant_id: number;
    store_product_variant?: StoreProductVariant;
    additional_price: number;
    quantity: number;
    created_at?: string;
    updated_at?: string;
}