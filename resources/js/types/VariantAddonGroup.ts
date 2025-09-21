import { AddonGroupOption } from "./AddonGroupOption";

export type VariantAddonGroup = {
    id?: number;
    sp_variant_id: number | null;
    name: string;
    is_required: boolean;
    min_options: number | null;
    max_options: number | null;
    addon_group_options: AddonGroupOption[];
    created_at?: string;
    updated_at?: string;
}