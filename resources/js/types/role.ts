import { Permission } from "./Permission";

export type Role = {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    permissions: Permission[];
}