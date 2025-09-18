import { Role } from "./Role";
import { Store } from "./Store";
import { Tenant } from "./Tenant";

export type User = {
    id: number;
    tenant_id: number;
    tenant: Tenant | null;
    uuid: string;
    name: string;
    email: string;
    status: number;
    store: Store | null;
    stores: Store[] | null;
    roles: Role[] | null;
    email_verified_at: string | null;
}