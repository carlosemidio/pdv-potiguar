import { Addon } from "./Addon";
import { Product } from "./Product";
import { ProductVariant } from "./ProductVariant";

export type StoreProductVariant = {
    id: number;
    tenant_id: number;
    store_id: number;
    product_variant_id: number;
    product: Product;
    product_variant: ProductVariant;
    addons?: Addon[];
    cost_price: number;
    price: number;
    stock_quantity: number;
    featured: boolean;
    created_at: string;
    updated_at: string;
};
