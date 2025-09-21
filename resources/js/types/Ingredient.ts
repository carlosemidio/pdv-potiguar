import { Unit } from "./Unit";

export type Ingredient = {
    id: number;
    user_id: number;
    tenant_id: number;
    store_id: number;
    unit_id: number;
    unit: Unit;
    name: string;
    cost_price: number;
    stock_quantity: number;
    created_at: string;
    updated_at: string;
}