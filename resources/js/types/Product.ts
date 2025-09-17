import { Brand } from "./Brand";
import { Category } from "./Category";
import { ProductAddon } from "./ProductAddon";
import { Store } from "./Store";
import { User } from "./user";
import { Variant } from "./Variant";

export type Product = {
    id: number;
    user_id: number;
    store_id: number;
    category_id: number;
    brand_id: number | null;

    user: User;
    store: Store;
    category: Category;
    brand: Brand | null;

    name: string;
    slug: string;
    description: string;
    short_description: string;

    variants: Variant[] | null;

    product_addons?: ProductAddon[] | null;

    created_at: string;
    updated_at: string;
};
