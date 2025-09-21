import { Addon } from "./Addon";
import { Ingredient } from "./Ingredient";
import { Unit } from "./Unit";

export type AddonIngredient = {
    id: number;
    addon_id: number;
    ingredient_id: number;
    unit_id: number;
    quantity: number;
    addon?: Addon;
    ingredient?: Ingredient;
    unit?: Unit;
    created_at?: string;
    updated_at?: string;
}