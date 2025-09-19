import { Permission } from "./Permission";

export type Role = {
    id: number;
    name: string;
    display_name: string;
    created_at: string;
    permissions: Permission[];
}