import { Attribute } from "./Attribute";
import { Image } from "./image";
import { Product } from "./Product";

export type ProductVariant = {
    id: number;
    tenant_id: number;
    product_id: number;
    product: Product;
    attributes?: Attribute[];
    name: string;
    slug?: string;
    sku?: string;
    image?: Image | null;
    images?: Image[] | null;
    created_at: string;
    updated_at: string;
};
