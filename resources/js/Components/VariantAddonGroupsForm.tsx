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

    let updated = [...selectedAddonGroupOptions];

    // Comportamento para radio (max_options = 1)
    if (group.max_options === 1) {
      // Remove apenas as seleções deste grupo
      updated = updated.filter(sa => sa.option.addon_group_id !== groupId);

      if (qty > 0) {
        const option = group.addon_group_options.find((o) => o.id === optionId);
        if (option) updated.push({ option, qty });
      }
    } else {
      const existingIndex = selectedAddonGroupOptions.findIndex(
        (sa) => sa.option.id === optionId && sa.option.addon_group_id === groupId
      );

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
    }

    onChange(updated);
  }

  return (
    <div className="overflow-y-auto pr-2">
      {variantAddonGroups.map((group) => {
        const currentSelections = selectedAddonGroupOptions.filter(
          (sa) => sa.option.addon_group_id === group.id
        );
        const currentCount = currentSelections.reduce((sum, sa) => sum + sa.qty, 0);
        const errorMessage = errors[`addonGroupOptionQuantities.${group.id}`] || "";

        const minReached = currentCount >= (group.min_options || 0);
        const maxReached = group.max_options !== null && currentCount >= group.max_options;

        const groupValid = minReached && (!group.max_options || currentCount <= group.max_options);

        return (
          <div
            key={group.id}
            className="dark:bg-gray-800 rounded-md"
          >
            {/* Cabeçalho do grupo */}
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-md p-4">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {group.name} {group.is_required ? <span className="text-red-500">*</span> : null}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentCount}/{group.max_options ?? "∞"}
              </span>
            </div>

            {/* Lista de opções */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 px-4">
              {group.addon_group_options.map((opt) => {
                const selected = selectedAddonGroupOptions.find(
                  (sa) => sa.option.id === opt.id
                );
                const qty = selected?.qty || 0;

                const disabled =
                  group.max_options !== null &&
                  !qty &&
                  currentCount >= group.max_options;

                // Se max_options === 1 => radio
                if (group.max_options === 1) {
                  return (
                    <li key={opt.id} className="flex justify-between items-center py-2">
                      <label className="flex items-center gap-2 w-full cursor-pointer">
                        <span className="text-gray-900 dark:text-gray-100">
                          {opt.addon?.name}
                        </span>
                        {opt.additional_price > 0 && (
                          <span className="ml-1 text-sm text-emerald-600 dark:text-emerald-400">
                            + R$ {opt.additional_price}
                          </span>
                        )}
                      </label>
                      <input
                        type="radio"
                        name={`addon-group-${group.id}`}
                        checked={qty > 0}
                        onChange={() => handleAddonChange(group.id!, opt.id, 1)}
                        className="accent-emerald-500"
                      />
                    </li>
                  );
                }

                // Caso contrário: quantidade + / -
                return (
                  <li key={opt.id} className="flex justify-between items-center py-2">
                    <div>
                      <span className="text-gray-900 dark:text-gray-100">
                        {opt.addon?.name}
                      </span>
                      {opt.additional_price > 0 && (
                        <span className="ml-1 text-sm text-emerald-600 dark:text-emerald-400">
                          + R$ {opt.additional_price}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {qty > 0 && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleAddonChange(group.id!, opt.id, qty - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-red-500 disabled:opacity-40"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center">{qty}</span>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleAddonChange(group.id!, opt.id, qty + 1)
                        }
                        disabled={disabled}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-emerald-600 disabled:opacity-40"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Erros */}
            {!groupValid && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1 px-4">
                <AlertCircle className="w-4 h-4" />
                {errorMessage ||
                  `Selecione entre ${group.min_options} e ${
                    group.max_options ?? "∞"
                  } opção(ões).`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
