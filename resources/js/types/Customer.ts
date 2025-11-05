export type Customer = {
    id: number;
    user_id: number;
    name: string;
    email?: string;
    phone?: string;
    type?: string;
    doc?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}