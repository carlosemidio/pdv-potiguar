import { Product } from "./Product";
import { ProductVariant } from "./ProductVariant";
import { Store } from "./Store";
import { VariantAddon } from "./VariantAddon";
import { VariantAddonGroup } from "./VariantAddonGroup";
import { VariantIngredient } from "./VariantIngredient";

export type StoreProductVariant = {
    id: number;
    tenant_id: number;
    store_id: number;
    product_variant_id: number;
    store: Store | null;
    product: Product | null;
    product_variant: ProductVariant | null;
    variant_ingredients?: VariantIngredient[] | null;
    variant_addons?: VariantAddon[] | null;
    variant_addon_groups?: VariantAddonGroup[] | null;
    cost_price: number | null;
    price: number | null;
    stock_quantity: number | null;
    featured: boolean | null;
    is_produced: boolean | null;
    manage_stock: boolean | null;
    is_published: boolean | null;
    created_at: string | null;
    updated_at: string | null;
};
