import { Addon } from "./Addon";
import MenuDay from "./MenuDay";
import MenuSchedule from "./MenuSchedule";
import { StoreProductVariant } from "./StoreProductVariant";

interface Menu {
    id: number;
    name: string;
    store_product_variants: StoreProductVariant[];
    addons: Addon[];
    schedules: MenuSchedule[];
    days: MenuDay[];
    is_permanent: number;
    created_at: string;
    updated_at: string;
}

export default Menu;