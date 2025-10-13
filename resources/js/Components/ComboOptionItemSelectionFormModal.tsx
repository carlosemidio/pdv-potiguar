import { ComboOptionGroup } from "@/types/ComboOptionGroup";
import { SelectedComboOptionItem } from "@/types/SelectedComboOptionItem";
import { Plus, Minus, CheckCircle, XCircle, AlertCircle, Package, Crown } from 'lucide-react';

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
        <div className="space-y-4">
            {comboOptionGroupList.map((group) => {
                const currentSelections = selectedAddonGroupOptions.filter(sa => sa.option.option_group_id === group.id);
                const currentCount = currentSelections.reduce((sum, sa) => sum + sa.qty, 0);
                const isValid = currentCount >= (group.min_options || 0) && (group.max_options === null || currentCount <= group.max_options);
                const hasSelections = currentCount > 0;

                return (
                    <div 
                        key={group.id} 
                        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                            hasSelections 
                                ? isValid 
                                    ? 'border-emerald-300 dark:border-emerald-600 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20' 
                                    : 'border-red-300 dark:border-red-600 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20'
                                : 'border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-700/50'
                        }`}
                    >
                        {/* Header do Grupo */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                                        hasSelections 
                                            ? isValid 
                                                ? 'bg-emerald-500 text-white' 
                                                : 'bg-red-500 text-white'
                                            : 'bg-gray-400 text-white'
                                    }`}>
                                        {hasSelections ? (
                                            isValid ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />
                                        ) : (
                                            <Package className="w-5 h-5" />
                                        )}
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                            {group.name}
                                            {group.is_required && (
                                                <Crown className="w-4 h-4 text-amber-500" />
                                            )}
                                        </h3>
                                        
                                        {group.is_required && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Mínimo: {group.min_options} • Máximo: {group.max_options ?? 'ilimitado'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Contador de Seleções */}
                                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    hasSelections 
                                        ? isValid 
                                            ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200' 
                                            : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}>
                                    {currentCount} / {group.max_options ?? '∞'}
                                </div>
                            </div>

                            {/* Mensagem de Erro */}
                            {group.errorMessage && (
                                <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                                        <XCircle className="w-4 h-4" />
                                        {group.errorMessage}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Lista de Opções */}
                        <div className="p-4">
                            <div className="space-y-3">
                                {group.combo_option_items?.map((comboOptionItem) => {
                                    const selected = selectedAddonGroupOptions.find(
                                        (sa) => sa.option.id === comboOptionItem.id
                                    );
                                    const quantity = selected?.qty || 0;

                                    return (
                                        <div 
                                            key={comboOptionItem.id} 
                                            className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
                                                quantity > 0 
                                                    ? 'border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 shadow-md' 
                                                    : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                {/* Info do Produto */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {comboOptionItem.store_product_variant?.product_variant?.name}
                                                        </h4>
                                                    </div>
                                                    
                                                    {comboOptionItem.additional_price > 0 && (
                                                        <div className="mt-1 flex items-center gap-1">
                                                            <Plus className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                                R$ {comboOptionItem.additional_price}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Controles de Quantidade */}
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => handleAddonChange(group.id!, comboOptionItem.id, quantity - 1)}
                                                        disabled={quantity <= 0}
                                                        aria-label="Diminuir quantidade"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    
                                                    <div className="w-12 h-8 flex items-center justify-center bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200 dark:border-emerald-700 rounded-lg">
                                                        <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                                                            {quantity}
                                                        </span>
                                                    </div>
                                                    
                                                    <button
                                                        type="button"
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200"
                                                        onClick={() => handleAddonChange(group.id!, comboOptionItem.id, quantity + 1)}
                                                        aria-label="Aumentar quantidade"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Indicador de Seleção */}
                                            {quantity > 0 && (
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}