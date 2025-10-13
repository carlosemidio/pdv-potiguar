import { SelectedVariantAddon } from "@/types/SelectedVariantAddon";
import { VariantAddon } from "@/types/VariantAddon";
import { Plus, Minus, CheckCircle, Package } from 'lucide-react';

export default function VariantAddonsForm({
    variantAddons,
    selectedVariantAddons,
    setSelectedVariantAddons,
}: {
    variantAddons: VariantAddon[],
    selectedVariantAddons: SelectedVariantAddon[],
    setSelectedVariantAddons: (selectedAddons: SelectedVariantAddon[]) => void,
}) {
    const handleIncrementVariantAddons = (newAddon: VariantAddon) => {
        const existing = selectedVariantAddons.find((a) => a.variantAddon.id === newAddon.id);

        if (existing && existing.qty >= (newAddon.quantity ?? 0)) {
            return;
        }

        let updatedAddons = selectedVariantAddons.map((a) => 
            a.variantAddon.id === newAddon.id 
                ? { ...a, qty: a.qty + 1 } 
                : a
        );

        if (!existing) {
            updatedAddons = [...updatedAddons, { variantAddon: newAddon, qty: 1 }];
        }

        setSelectedVariantAddons(updatedAddons);
    }

    const handleDecrementVariantAddons = (newAddon: VariantAddon) => {
        const existing = selectedVariantAddons.find((a) => a.variantAddon.id === newAddon.id);

        if (!existing) return;

        let updatedAddons = selectedVariantAddons.map((a) => 
            a.variantAddon.id === newAddon.id 
                ? { ...a, qty: Math.max(a.qty - 1, 0) } 
                : a
        ).filter(a => a.qty > 0);

        setSelectedVariantAddons(updatedAddons);
    }

    return (
        <div className="space-y-3">
            {variantAddons.map((variantAddon) => {
                const selectedAddon = selectedVariantAddons.find(a => a.variantAddon.id === variantAddon.id);
                const quantity = selectedAddon?.qty || 0;
                const maxQuantity = variantAddon.quantity ?? 0;
                const hasSelection = quantity > 0;

                return (
                    <div 
                        key={variantAddon.id} 
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
                            hasSelection 
                                ? 'border-teal-200 dark:border-teal-700 bg-white dark:bg-gray-800 shadow-md' 
                                : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            {/* Info do Addon */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                        {variantAddon.addon?.name}
                                    </h4>
                                </div>
                                
                                <div className="mt-1 flex items-center gap-1">
                                    <Plus className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                                    <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
                                        R$ {Number(variantAddon.price || 0).toFixed(2).replace('.', ',')}
                                    </span>
                                    {maxQuantity > 0 && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                            (máx: {maxQuantity})
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Controles de Quantidade */}
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => handleDecrementVariantAddons(variantAddon)}
                                    disabled={quantity <= 0}
                                    aria-label="Diminuir quantidade"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                
                                <div className="w-12 h-8 flex items-center justify-center bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 border border-teal-200 dark:border-teal-700 rounded-lg">
                                    <span className="text-sm font-bold text-teal-800 dark:text-teal-200">
                                        {quantity}
                                    </span>
                                </div>
                                
                                <button
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-teal-300 dark:hover:border-teal-600 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => handleIncrementVariantAddons(variantAddon)}
                                    disabled={maxQuantity > 0 && quantity >= maxQuantity}
                                    aria-label="Aumentar quantidade"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Indicador de Seleção */}
                        {hasSelection && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}