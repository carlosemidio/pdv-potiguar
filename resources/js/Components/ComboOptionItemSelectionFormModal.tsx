import { ComboOptionGroup } from "@/types/ComboOptionGroup";
import { SelectedComboOptionItem } from "@/types/SelectedComboOptionItem";
import { Plus, Minus, AlertCircle, Crown } from "lucide-react";

type Props = {
  comboOptionGroups: ComboOptionGroup[];
  selectedAddonGroupOptions: SelectedComboOptionItem[];
  onChange: (selected: SelectedComboOptionItem[]) => void;
  errors?: Record<string, string>;
};

export default function ComboOptionItemSelectionCompact({
  comboOptionGroups,
  selectedAddonGroupOptions,
  onChange,
  errors = {},
}: Props) {
  function handleAddonChange(groupId: number, optionId: number, qty: number) {
    const existingIndex = selectedAddonGroupOptions.findIndex(
      (s) => s.option.id === optionId && s.option.option_group_id === groupId
    );

    let updated = [...selectedAddonGroupOptions];
    const group = comboOptionGroups.find((g) => g.id === groupId);
    if (!group) return;

    if (existingIndex >= 0) {
      if (qty <= 0) updated.splice(existingIndex, 1);
      else {
        const currentCount = updated
          .filter((s) => s.option.option_group_id === groupId)
          .reduce((sum, s) => sum + s.qty, 0);

        if (
          group.max_options !== null &&
          currentCount - updated[existingIndex].qty + qty > group.max_options
        )
          return;

        updated[existingIndex].qty = qty;
      }
    } else if (qty > 0) {
      const currentCount = updated
        .filter((s) => s.option.option_group_id === groupId)
        .reduce((sum, s) => sum + s.qty, 0);

      if (group.max_options !== null && currentCount + qty > group.max_options)
        return;

      const option = group.combo_option_items?.find((o) => o.id === optionId);
      if (option) updated.push({ option, qty });
    }

    onChange(updated);
  }

  return (
    <div className="space-y-8">
      {comboOptionGroups.map((group) => {
        const currentSelections = selectedAddonGroupOptions.filter(
          (s) => s.option.option_group_id === group.id
        );
        const currentCount = currentSelections.reduce(
          (sum, s) => sum + s.qty,
          0
        );
        const isValid =
          currentCount >= (group.min_options || 0) &&
          (group.max_options === null || currentCount <= group.max_options);
        const remaining = (group.min_options || 0) - currentCount;
        const error = errors[`comboOptionGroupQuantities.${group.id}`];

        return (
          <div key={group.id} className="space-y-3">
            {/* Cabeçalho do grupo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {group.name}
                </h3>
                {group.is_required && (
                  <Crown className="w-4 h-4 text-amber-500" />
                )}
              </div>

              <div
                className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                  isValid
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300"
                }`}
              >
                {currentCount} / {group.max_options ?? "∞"}
              </div>
            </div>

            {/* Texto auxiliar */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Mínimo {group.min_options} • Máximo{" "}
              {group.max_options ?? "ilimitado"}
              {remaining > 0 && (
                <span className="ml-2 text-amber-600 dark:text-amber-400">
                  faltam {remaining}
                </span>
              )}
            </p>

            {/* Lista compacta */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700 border rounded-lg border-gray-200 dark:border-gray-700 overflow-hidden">
              {group.combo_option_items?.map((item) => {
                const selected = selectedAddonGroupOptions.find(
                  (s) => s.option.id === item.id
                );
                const qty = selected?.qty || 0;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {item.store_product_variant?.product_variant?.name}
                      </p>
                      {item.additional_price > 0 && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          + R$ {item.additional_price}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() =>
                          handleAddonChange(group.id!, item.id, qty - 1)
                        }
                        disabled={qty <= 0}
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {qty}
                      </span>
                      <button
                        onClick={() =>
                          handleAddonChange(group.id!, item.id, qty + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
