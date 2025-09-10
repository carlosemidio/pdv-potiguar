import { Store } from "./Store";

export type Table = {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    store_id: number;
    store: Store | null;
    status: string;
    status_name: string;
    created_at: string;
    updated_at: string;
};