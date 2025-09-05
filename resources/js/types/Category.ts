export type Category = {
    id: number;
    user_id: number;
    name: string;
    parent_id: number | null;
    parent?: Category;
    status: number;
    created_at: string;
}