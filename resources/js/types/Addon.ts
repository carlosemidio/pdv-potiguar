import { AddonIngredient } from "./AddonIngredient";
import { Ingredient } from "./Ingredient";

export type Addon = {
    id: number;
    user_id?: number;
    tenant_id?: number;
    store_id?: number;
    name: string;
    addon_ingredients?: AddonIngredient[] | null;
    created_at?: string;
    updated_at?: string;
}