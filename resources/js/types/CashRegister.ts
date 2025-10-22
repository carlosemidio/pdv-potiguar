import { CashMovement } from "./CashMovement";
import { Store } from "./Store";
import { User } from "./User";

export default interface CashRegister {
    id: number;
    tenant_id: number;
    user_id: number;
    store_id: number;
    closed_by: number | null;
    user: User;
    store: Store;
    closer: User | null;
    opening_amount: number;
    closing_amount: number | null;
    system_balance: number | null;
    difference: number | null;
    status: number;
    opened_at: string;
    closed_at: string | null;
    movements: CashMovement[];
    created_at: string;
    updated_at: string;
}