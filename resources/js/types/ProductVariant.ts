import { Image } from "./image";
import { Product } from "./Product";
import { Variant } from "./Variant";

export type ProductVariant = {
    id: number;
    product_id: number;
    product: Product;
    name: string;
    slug?: string;
    sku?: string;
    price: number;
    stock_quantity: number;
    image?: Image | null;
    images?: Image[] | null;
    attributes?: Variant[];
};
