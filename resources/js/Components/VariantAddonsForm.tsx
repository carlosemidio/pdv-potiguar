import { Plus, Minus, CheckCircle } from "lucide-react";
import { useCallback } from "react";
import { SelectedVariantAddon } from "@/types/SelectedVariantAddon";
import { VariantAddon } from "@/types/VariantAddon";

export default function VariantAddonsForm({
  variantAddons,
  selectedVariantAddons,
  setSelectedVariantAddons,
}: {
  variantAddons: VariantAddon[];
  selectedVariantAddons: SelectedVariantAddon[];
  setSelectedVariantAddons: (selectedAddons: SelectedVariantAddon[]) => void;
}) {
  const handleUpdateAddon = useCallback(
    (addon: VariantAddon, delta: number) => {
      const prev = selectedVariantAddons;
      const existing = prev.find((a) => a.variantAddon.id === addon.id);
      const currentQty = existing?.qty ?? 0;
      const max = addon.quantity ?? 0;
      let newQty = Math.max(0, currentQty + delta);

      let updated: SelectedVariantAddon[];

      if (max === 1) {
        // Radio behavior
        updated = [];
        if (newQty > 0) updated.push({ variantAddon: addon, qty: 1 });
      } else {
        if (existing) {
          if (newQty === 0) {
            updated = prev.filter((a) => a.variantAddon.id !== addon.id);
          } else {
            updated = prev.map((a) =>
              a.variantAddon.id === addon.id ? { ...a, qty: newQty } : a
            );
          }
        } else {
          updated = [...prev, { variantAddon: addon, qty: newQty }];
        }
      }

      setSelectedVariantAddons(updated);
    },
    [selectedVariantAddons, setSelectedVariantAddons]
  );

  return (
    <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 px-4">
      {variantAddons.map((variantAddon) => {
        const selectedAddon = selectedVariantAddons.find(
          (a) => a.variantAddon.id === variantAddon.id
        );
        const quantity = selectedAddon?.qty || 0;
        const maxQuantity = variantAddon.quantity ?? 0;
        const hasSelection = quantity > 0;

        return (
          <div
            key={variantAddon.id}
            className="flex items-center justify-between py-2 px-1 text-sm text-gray-900 dark:text-gray-100"
          >
            <div className="flex justify-start items-center gap-2 flex-1">
              <span className="truncate">{variantAddon.addon?.name}</span>
              <span className="ml-1 text-sm text-emerald-600 dark:text-emerald-400">
                + R$ {variantAddon.price}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {hasSelection && (
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-red-500 transition"
                  onClick={() => handleUpdateAddon(variantAddon, -1)}
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-3 h-3" />
                </button>
              )}

              <span className="min-w-[1.5rem] text-center text-gray-700 dark:text-gray-300">
                {quantity}
              </span>

              <button
                type="button"
                className="w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-teal-600 transition"
                onClick={() => handleUpdateAddon(variantAddon, +1)}
                disabled={maxQuantity > 0 && quantity >= maxQuantity}
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
