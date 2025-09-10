import { Store } from "./Store";
import { Table } from "./Table";
import { OrderItem } from "./OrderItem";

export type Order = {
    id: number;
    user_id: number;
    store: Store;
    table: Table;
    number: number;
    customer_name: string;
    status: string;
    status_name: string;
    total_amount: number;
    discount: number;
    service_fee: number;
    paid_amount: number;
    payment_status: number;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
};