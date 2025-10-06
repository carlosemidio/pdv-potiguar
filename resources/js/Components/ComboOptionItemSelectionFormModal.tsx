import { ComboOptionGroup } from "@/types/ComboOptionGroup";
import { SelectedComboOptionItem } from "@/types/SelectedComboOptionItem";

type ComboOptionItemSelectionFormModalProps = {
    comboOptionGroups: ComboOptionGroup[];
    selectedAddonGroupOptions: SelectedComboOptionItem[];
    onChange: (selected: SelectedComboOptionItem[]) => void;
    errors?: Record<string, string>;
};

export default function ComboOptionItemSelectionFormModal({
    comboOptionGroups,
    selectedAddonGroupOptions,
    onChange,
    errors = {},
}: ComboOptionItemSelectionFormModalProps) {
    function handleAddonChange(groupId: number, optionId: number, qty: number) {
        const existingIndex = selectedAddonGroupOptions.findIndex(
            (sa) => sa.option.id === optionId && sa.option.option_group_id === groupId
        );

        let updatedSelections = [...selectedAddonGroupOptions];

        if (existingIndex >= 0) {
            if (qty <= 0) {
                // Remove if qty is zero or less
                updatedSelections.splice(existingIndex, 1);
            } else {
                const group = comboOptionGroups.find((g) => g.id === groupId);

                const currentCount = updatedSelections
                    .filter(sa => sa.option.option_group_id === groupId)
                    .reduce((sum, sa) => sum + sa.qty, 0);

                if (group && group.max_options !== null && (currentCount - updatedSelections[existingIndex].qty + qty) > group.max_options) {
                    return; // Exceeds max options, do not update
                }

                // Update quantity
                updatedSelections[existingIndex].qty = qty;
            }
        } else {
            if (qty > 0) {
                // Add new selection
                const group = comboOptionGroups.find((g) => g.id === groupId);

                if (!group) return;

                const currentCount = updatedSelections
                        .filter(sa => sa.option.option_group_id === groupId)
                        .reduce((sum, sa) => sum + sa.qty, 0);

                if (group.max_options !== null && (currentCount + qty) > group.max_options) {
                    return; // Exceeds max options, do not add
                }

                const option = (group?.combo_option_items ?? []).find((o) => o.id === optionId);
                if (option) {
                    updatedSelections.push({ option, qty });
                }
            }
        }

        onChange(updatedSelections);
    }

    const comboOptionGroupList = comboOptionGroups.map(group => {
        const errorMessage = errors[`comboOptionGroupQuantities.${group.id}`] ? errors[`comboOptionGroupQuantities.${group.id}`] : '';

        return {
            ...group,
            errorMessage
        };
    })

    return (
        <div className="mt-3">
            {comboOptionGroupList.map((group) => (
                <div key={group.id} className={`mb-2 border border-gray-200 p-2 rounded-lg ${(selectedAddonGroupOptions
                    .filter(sa => sa.option.option_group_id === group.id).length < 1) ? '' : (selectedAddonGroupOptions
                    .filter(sa => sa.option.option_group_id === group.id).reduce((sum, sa) => sum + sa.qty, 0) < (group.min_options || 0)) ? 'border-red-500' : 'border-green-500'}`}>

                    <div className="flex items-center justify-between">
                        {group.errorMessage && (
                            <span className="text-sm text-red-500">{group.errorMessage}</span>
                        )}
                    </div>

                    <h3 className="text-lg font-semibold mb-1">{group.name}:
                        {group.is_required && (
                            <span className="text-sm font-normal"> * Mínimo {group.min_options}, máximo {group.max_options ?? 'ilimitado'}</span>
                        )}
                    </h3>
                    
                    <div className="space-y-1">
                        {group.combo_option_items?.map((comboOptionItem) => {
                            const selected = selectedAddonGroupOptions.find(
                                (sa) => sa.option.id === comboOptionItem.id
                            );

                            return (
                                <div key={comboOptionItem.id} className="flex items-center justify-between">
                                    <div>
                                        <span className="font-medium">{comboOptionItem.store_product_variant?.product_variant?.name}</span>
                                        {comboOptionItem.additional_price > 0 && (
                                            <span className="text-sm text-gray-500"> (+ R$ {comboOptionItem.additional_price})</span>
                                        )}
                                    </div>

                                    <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-lg">
                                        <button
                                            className="h-4 w-4 flex items-center justify-center rounded-md bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition"
                                            onClick={() => handleAddonChange(group.id!, comboOptionItem.id, (selected?.qty || 0) - 1)}
                                            aria-label="Diminuir"
                                        >-</button>
                                        <span className="text-xs text-neutral-500 italic mr-2 ml-2">{selected?.qty || 0}</span>
                                        <button
                                            className="h-4 w-4 flex items-center justify-center rounded-md bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition"
                                            onClick={() => handleAddonChange(group.id!, comboOptionItem.id, (selected?.qty || 0) + 1)}
                                            aria-label="Aumentar"
                                        >+</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}