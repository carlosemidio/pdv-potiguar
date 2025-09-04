import { Role } from "./Role";
import { Store } from "./Store";

export type User = {
    id: number;
    uuid: string;
    name: string;
    email: string;
    status: number;
    store: Store | null;
    stores: Store[] | null;
    roles: Role[] | null;
    email_verified_at: string | null;
}