export type Payment = {
    id: number;
    order_id: number;
    method: string;
    amount: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}