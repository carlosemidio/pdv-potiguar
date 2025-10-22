import { User } from "./User";

export type CashMovement = {
    id: number;
    user_id: number;
    cash_register_id: number;
    user?: User | null;
    type: 'opening' | 'closing' | 'sale' | 'refund' | 'addition' | 'removal';
    amount: number;
    description: string | null;
    created_at: string;
    updated_at: string;
}