import { Permission } from "./Permission";

export type Role = {
    id: number;
    name: string;
    slug: string;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}