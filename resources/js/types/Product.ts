import { Brand } from "./Brand";
import { Category } from "./Category";
import { Image } from "./image";
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

    image: Image | null;
    images: Image[] | null;

    name: string;
    slug: string;
    description: string;
    short_description: string;

    status: number;
    featured: boolean;

    // Essas propriedades agora são apenas auxiliares (por exemplo, no admin)
    // Se o produto tiver variantes, use os dados delas
    price: number | null;
    sku: string | null;
    stock_quantity: number | null;

    variants: Variant[] | null;

    product_addons?: ProductAddon[] | null;

    created_at: string;
    updated_at: string;
};
