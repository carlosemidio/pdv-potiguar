import { Attribute } from "./Attribute";
import { Image } from "./image";

export type Variant = {
    id: number;
    product_id: number;

    sku: string;
    price: number;
    stock_quantity: number;

    image: Image | null;
    images: Image[];

    files?: File[];

    attributes?: Attribute[];

    created_at: string;
    updated_at: string;
};
