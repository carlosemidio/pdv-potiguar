import { Plus, Minus, CheckCircle, Package } from "lucide-react";
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
  /**
   * Atualiza a quantidade de um addon.
   * - delta pode ser +1 ou -1 (ou outro número).
   * - respeita max quantity (if > 0).
   * - remove o item se qty ficar 0.
   */
  const handleUpdateAddon = useCallback(
    (addon: VariantAddon, delta: number) => {
      // usa o array atual recebido por prop para garantir compatibilidade
      const prev = selectedVariantAddons;
      const existing = prev.find((a) => a.variantAddon.id === addon.id);
      const currentQty = existing?.qty ?? 0;
      const max = addon.quantity ?? 0;
      const newQty = Math.max(0, currentQty + delta);

      // se houver máximo e o novo valor ultrapassar, ignora
      if (max > 0 && newQty > max) return;

      let updated: SelectedVariantAddon[];

      if (existing) {
        if (newQty === 0) {
          // remove
          updated = prev.filter((a) => a.variantAddon.id !== addon.id);
        } else {
          // atualiza qty mantendo ordem (substitui o item)
          updated = prev.map((a) =>
            a.variantAddon.id === addon.id ? { ...a, qty: newQty } : a
          );
        }
      } else {
        // adicionar novo
        updated = [...prev, { variantAddon: addon, qty: newQty }];
      }

      setSelectedVariantAddons(updated);
    },
    [selectedVariantAddons, setSelectedVariantAddons]
  );

  return (
    <div className="flex flex-col gap-3">
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
            className={`relative p-3 sm:p-4 rounded-xl border transition-all duration-200
              ${
                hasSelection
                  ? "border-teal-400/60 bg-white dark:bg-gray-800 shadow-sm"
                  : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600"
              }
            `}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Informações */}
              <div className="flex items-start gap-2">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                  <Package className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-tight truncate">
                    {variantAddon.addon?.name}
                  </h4>
                  <div className="mt-1 flex items-center flex-wrap gap-1 text-sm">
                    <span className="text-teal-600 dark:text-teal-400 font-medium">
                      R${" "}
                      {Number(variantAddon.price ?? 0)
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                    {maxQuantity > 0 && (
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        (máx: {maxQuantity})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Controles */}
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => handleUpdateAddon(variantAddon, -1)}
                  disabled={quantity <= 0}
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="min-w-[2.5rem] text-center text-sm font-bold text-teal-700 dark:text-teal-300 select-none">
                  {quantity}
                </span>

                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => handleUpdateAddon(variantAddon, +1)}
                  disabled={maxQuantity > 0 && quantity >= maxQuantity}
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {hasSelection && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center shadow-sm">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
