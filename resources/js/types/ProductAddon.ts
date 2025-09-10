import { Addon } from "./Addon";
import { Product } from "./Product";

export type ProductAddon = {
    id?: number | null;
    product_id?: number | null;
    product?: Product;
    addon_id?: number | null;
    addon?: Addon;
    price?: string;
}