import { SelectedAddonGroupOption } from "@/types/SelectedAddonGroupOption";
import { VariantAddonGroup } from "@/types/VariantAddonGroup";
import { Plus, Minus, AlertCircle } from "lucide-react";

type VariantAddonGroupsFormProps = {
  variantAddonGroups: VariantAddonGroup[];
  selectedAddonGroupOptions: SelectedAddonGroupOption[];
  onChange: (selected: SelectedAddonGroupOption[]) => void;
  errors?: Record<string, string>;
};

export default function VariantAddonGroupsForm({
  variantAddonGroups,
  selectedAddonGroupOptions,
  onChange,
  errors = {},
}: VariantAddonGroupsFormProps) {
  function handleAddonChange(groupId: number, optionId: number, qty: number) {
    const group = variantAddonGroups.find((g) => g.id === groupId);
    if (!group) return;

    const existingIndex = selectedAddonGroupOptions.findIndex(
      (sa) => sa.option.id === optionId && sa.option.addon_group_id === groupId
    );

    let updated = [...selectedAddonGroupOptions];

    const currentCount = updated
      .filter((sa) => sa.option.addon_group_id === groupId)
      .reduce((sum, sa) => sum + sa.qty, 0);

    // Limites de máximo
    if (
      group.max_options !== null &&
      qty > 0 &&
      currentCount - (existingIndex >= 0 ? updated[existingIndex].qty : 0) + qty >
        group.max_options
    ) {
      return; // ignora se ultrapassar o limite
    }

    if (existingIndex >= 0) {
      if (qty <= 0) {
        updated.splice(existingIndex, 1);
      } else {
        updated[existingIndex].qty = qty;
      }
    } else if (qty > 0) {
      const option = group.addon_group_options.find((o) => o.id === optionId);
      if (option) updated.push({ option, qty });
    }

    onChange(updated);
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {variantAddonGroups.map((group) => {
        const currentSelections = selectedAddonGroupOptions.filter(
          (sa) => sa.option.addon_group_id === group.id
        );
        const currentCount = currentSelections.reduce(
          (sum, sa) => sum + sa.qty,
          0
        );
        const errorMessage =
          errors[`addonGroupOptionQuantities.${group.id}`] || "";

        const minReached = currentCount >= (group.min_options || 0);
        const maxReached =
          group.max_options !== null && currentCount >= group.max_options;

        const groupValid =
          minReached && (!group.max_options || currentCount <= group.max_options);

        return (
          <div
            key={group.id}
            className={`rounded-lg border bg-white dark:bg-gray-800 transition-colors ${
              groupValid
                ? "border-gray-200 dark:border-gray-700"
                : "border-red-400 dark:border-red-600"
            }`}
          >
            {/* Cabeçalho */}
            <div className="flex items-start justify-between p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {group.name}
                  {group.is_required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Mín: {group.min_options ?? 0} • Máx:{" "}
                  {group.max_options ?? "∞"}
                </p>
              </div>
              <span
                className={`text-sm ${
                  groupValid
                    ? "text-gray-600 dark:text-gray-300"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {currentCount}/{group.max_options ?? "∞"}
              </span>
            </div>

            {/* Lista de opções */}
            <div className="p-3 sm:p-4 space-y-2">
              {group.addon_group_options?.map((opt) => {
                const selected = selectedAddonGroupOptions.find(
                  (sa) => sa.option.id === opt.id
                );
                const qty = selected?.qty || 0;
                const disabled =
                  group.max_options !== null &&
                  !qty &&
                  currentCount >= group.max_options;

                return (
                  <div
                    key={opt.id}
                    className={`flex items-center justify-between rounded-md border px-3 py-2 transition-all ${
                      qty > 0
                        ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {opt.addon?.name}
                      </span>
                      {opt.additional_price > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                          + R$ {opt.additional_price}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleAddonChange(group.id!, opt.id, qty - 1)
                        }
                        disabled={qty <= 0}
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:text-red-500 hover:border-red-400 transition disabled:opacity-40"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-6 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleAddonChange(group.id!, opt.id, qty + 1)
                        }
                        disabled={disabled}
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:text-emerald-600 hover:border-emerald-400 transition disabled:opacity-40"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Erros */}
            {!groupValid && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage ||
                    `Selecione entre ${group.min_options} e ${
                      group.max_options ?? "∞"
                    } opção(ões).`}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
