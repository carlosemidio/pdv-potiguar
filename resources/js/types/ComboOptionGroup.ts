import { ComboOptionItem } from "./ComboOptionItem";
import { StoreProductVariant } from "./StoreProductVariant";

export type ComboOptionGroup = {
    id: number;
    sp_variant_id: number;
    store_product_variant?: StoreProductVariant;
    name: string;
    min_options: number;
    max_options: number;
    is_required: boolean;
    combo_option_items?: ComboOptionItem[] | null;
    created_at?: string;
    updated_at?: string;
}