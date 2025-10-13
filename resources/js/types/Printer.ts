import { Store } from "./Store";

export type Printer = {
    id: number;
    user_id: number;
    tenant_id: number;
    store_id: number;
    store: Store | null;
    name: string;
    type: 'network' | 'usb' | 'bluetooth';
    vendor_id: string;
    product_id: string;
    product_name: string | null;
    device_path: string | null;
    status: string;
    created_at: string;
    updated_at: string;
};