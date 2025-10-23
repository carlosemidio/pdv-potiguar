import { Plus, Minus, AlertCircle } from "lucide-react";
import { ComboOptionGroup } from "@/types/ComboOptionGroup";
import { SelectedComboOptionItem } from "@/types/SelectedComboOptionItem";

type Props = {
  comboOptionGroups: ComboOptionGroup[];
  selectedItems: SelectedComboOptionItem[];
  onChange: (selected: SelectedComboOptionItem[]) => void;
  errors?: Record<string, string>;
};

export default function ComboOptionItemSelectionCompact({
  comboOptionGroups,
  selectedItems,
  onChange,
  errors = {},
}: Props) {
  function handleChange(group: ComboOptionGroup, itemId: number, qty: number, max: number | null) {
    const existingIndex = selectedItems.findIndex(
      (s) => s.option.id === itemId && s.option.option_group_id === group.id
    );

    let updated = [...selectedItems];

    if (max === 1) {
      // radio behavior: mantém apenas o selecionado
      const selectedItem = group.combo_option_items?.find((item) => item.id === itemId);
      updated = qty > 0 && selectedItem
        ? [{ option: selectedItem, qty: 1 }]
        : [];
    } else if (existingIndex >= 0) {
      if (qty <= 0) updated.splice(existingIndex, 1);
      else updated[existingIndex].qty = qty;
    } else if (qty > 0) {
      const selectedItem = group.combo_option_items?.find((item) => item.id === itemId);
      if (selectedItem) {
        updated.push({ option: selectedItem, qty });
      }
    }

    onChange(updated);
  }

  return (
    <div className="flex flex-col">
      {comboOptionGroups.map((group) => {
        const groupItems = group.combo_option_items || [];
        const max = group.max_options;

        const currentCount = selectedItems
          .filter((s) => s.option.option_group_id === group.id)
          .reduce((sum, s) => sum + s.qty, 0);

        const errorMessage = errors[`comboOptionGroupQuantities.${group.id}`];

        return (
          <div key={group.id} className="space-y-1 py-1">
            {/* Cabeçalho do grupo */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-md p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {group.name} {group.is_required ? <span className="text-red-500">*</span> : null}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {currentCount} / {max ?? "∞"}
              </span>
            </div>

            {/* Lista compacta */}
            <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 px-4">
              {groupItems.map((item) => {
                const selected = selectedItems.find(
                  (s) => s.option.id === item.id
                );
                const qty = selected?.qty || 0;

                return (
                  <label
                    key={item.id}
                    className="flex items-center justify-between py-4 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex justify-start items-center gap-2 flex-1">
                      <span className="truncate">
                        {item.store_product_variant?.product_variant?.name}
                      </span>
                      {item.additional_price > 0 && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">
                          + R$ {item.additional_price}
                        </span>
                      )}
                    </div>

                    {max === 1 ? (
                      <input
                        type="radio"
                        name={`group-${group.id}`}
                        checked={qty > 0}
                        onChange={() => handleChange(group, item.id, 1, max)}
                        className="w-4 h-4 text-teal-500 border-gray-300 dark:border-gray-600"
                      />
                    ) : (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {qty > 0 && (
                          <button
                            onClick={() => handleChange(group, item.id, qty - 1, max)}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-red-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        )}
                        <span className="w-5 text-center">{qty}</span>
                        <button
                          onClick={() => handleChange(group, item.id, qty + 1, max)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-teal-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>

            {/* Mensagem de erro */}
            {errorMessage && (
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errorMessage}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
