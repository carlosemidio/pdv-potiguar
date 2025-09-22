import { Addon } from "./Addon";
import { VariantAddonGroup } from "./VariantAddonGroup";

export type AddonGroupOption = {
    id: number;
    addon_group_id: number;
    addon_id: number;
    addon_group: VariantAddonGroup | null;
    addon: Addon | null;
    quantity: number;
    additional_price: number;
};
