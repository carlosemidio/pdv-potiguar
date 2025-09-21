import { Ingredient } from "./Ingredient";
import { Unit } from "./Unit";

export type VariantIngredient = {
    id?: number;
    sp_variant_id: number | null;
    ingredient_id: number | null;
    ingredient: Ingredient | null;
    unit_id: number | null;
    unit: Unit | null;
    quantity: number | null;
    created_at?: string;
    updated_at?: string;
}