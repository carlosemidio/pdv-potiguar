import { Image } from "./image";
import { Product } from "./Product";
import { Store } from "./Store";
import { Variant } from "./Variant";

export type ProductVariant = {
    id: number;
    product_id: number;
    store_id: number;
    product: Product;
    store?: Store;
    name: string;
    slug?: string;
    sku?: string;
    cost_price: number;
    price: number;
    stock_quantity: number;
    featured: boolean;
    image?: Image | null;
    images?: Image[] | null;
    attributes?: Variant[];
};
