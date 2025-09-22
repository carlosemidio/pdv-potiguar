import { Addon } from "./Addon";
import { Unit } from "./Unit";

export type VariantAddon = {
    [x: string]: any;
    id?: number;
    sp_variant_id: number | null;
    addon_id: number | null;
    addon: Addon | null;
    quantity: number | null;
    price: number | null;
    created_at?: string;
    updated_at?: string;
}