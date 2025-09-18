import { Product } from "./Product";
import { ProductVariant } from "./ProductVariant";

export type StoreProductVariant = {
    id: number;
    tenant_id: number;
    store_id: number;
    product_variant_id: number;
    product_variant: ProductVariant;
    product: Product;
    cost_price: number;
    price: number;
    stock_quantity: number;
    featured: boolean;
    created_at: string;
    updated_at: string;
};
