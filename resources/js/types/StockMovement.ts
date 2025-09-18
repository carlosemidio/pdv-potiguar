import { ProductVariant } from "./ProductVariant";
import { Store } from "./Store";
import { StoreProductVariant } from "./StoreProductVariant";
import { Tenant } from "./Tenant";
import { User } from "./User";

export type StockMovement = {
    id: number;
    user_id: number;
    tenant_id: number;
    store_id: number;
    store_product_variant_id: number | null;
    user: User;
    tenant?: Tenant;
    store?: Store;
    store_product_variant?: StoreProductVariant | null;
    type: string; // e.g., 'addition', 'removal'
    subtype: string | null; // e.g., 'purchase', 'sale', 'adjustment'
    quantity: number;
    cost_price: number | null;
    reason: string | null;
    document_number: string | null;
    created_at: string;
    updated_at: string;
}