export type Brand = {
    id: number;
    user_id: number;
    name: string;
    status: number; // 1 for active, 0 for inactive
    created_at: string;
}