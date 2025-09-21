import { Addon } from "./Addon";

export type AddonGroupOption = {
    id: number;
    addon_group_id: number;
    addon_id: number;
    addon: Addon | null;
    quantity: number;
    additional_price: number;
};
