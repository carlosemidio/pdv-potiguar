import { Brand } from "./Brand";
import { Category } from "./Category";
import { Store } from "./Store";
import { User } from "./User";

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

    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
};
