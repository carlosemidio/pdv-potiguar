import AddonGroupOptionDeleteFormModal from '@/Components/AddonGroupOptionDeleteFormModal';
import AddonGroupOptionFormModal from '@/Components/AddonGroupOptionFormModal';
import VariantAddonGroupDeleteFormModal from '@/Components/VariantAddonGroupDeleteFormModal';
import VariantAddonGroupFormModal from '@/Components/VariantAddonGroupFormModal';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { ListPlus, Plus, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProductVariantGroupOptionsProps {
    variant: StoreProductVariant;
}

export default function ProductVariantGroupOptions({ variant }: ProductVariantGroupOptionsProps) {
    const [openOptionGroupIdxs, setOpenOptionGroupIdxs] = useState<number[]>([]);
    const [isOptionGroupModalOpen, setIsOptionGroupModalOpen] = useState(false);
    const [isOptionGroupDeleteModalOpen, setIsOptionGroupDeleteModalOpen] = useState(false);
    const [isAddonGroupOptionsModalOpen, setIsAddonGroupOptionsModalOpen] = useState(false);
    const [isAddonGroupOptionsDeleteModalOpen, setIsAddonGroupOptionsDeleteModalOpen] = useState(false);
    const [addonGroupId, setAddonGroupId] = useState<number | null>(null);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-4">
                    <h3 className='text-xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2'>
                        <ListPlus className="w-5 h-5" />
                        Grupos de Opções
                    </h3>
                    <div className="flex gap-2">
                        {variant?.variant_addon_groups && variant.variant_addon_groups.length > 0 && (
                            <button 
                                onClick={() => setIsOptionGroupDeleteModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 rounded-xl font-medium transition-all duration-200"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remover Grupo
                            </button>
                        )}
                        <button 
                            onClick={() => setIsOptionGroupModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Adicionar Grupo
                        </button>
                    </div>
                </div>

                {variant?.variant_addon_groups && variant.variant_addon_groups.length > 0 ? (
                    <div className="space-y-4">
                        {variant.variant_addon_groups.map((variantAddonGroup, idx) => {
                            const isOpen = openOptionGroupIdxs.includes(idx);

                            return (
                                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <button
                                        className="w-full p-4 flex justify-between items-center bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 hover:from-purple-200 hover:to-violet-200 dark:hover:from-purple-800/60 dark:hover:to-violet-800/60 transition-all duration-200"
                                        onClick={() => {
                                            setOpenOptionGroupIdxs(isOpen
                                                ? openOptionGroupIdxs.filter(i => i !== idx)
                                                : [...openOptionGroupIdxs, idx]
                                            );
                                        }}
                                        type="button"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                                <ListPlus className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {variantAddonGroup.name || '-'}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {variantAddonGroup.is_required ? 'Obrigatório' : 'Opcional'} • 
                                                    Min: {variantAddonGroup.min_options} • Max: {variantAddonGroup.max_options}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                                                {variantAddonGroup.addon_group_options?.length || 0} opções
                                            </span>
                                            <span className="text-purple-600 dark:text-purple-400 transform transition-transform duration-200" style={{
                                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                            }}>
                                                ▼
                                            </span>
                                        </div>
                                    </button>
                                    
                                    {isOpen && (
                                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                            {variantAddonGroup.addon_group_options && variantAddonGroup.addon_group_options.length > 0 ? (
                                                <div className="space-y-3">
                                                    {variantAddonGroup.addon_group_options.map((option, optionIdx) => (
                                                        <div key={optionIdx} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                                                                    <Plus className="w-3 h-3 text-white" />
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {option.addon?.name || '-'}
                                                                    </h5>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Máximo: {option.quantity}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                                                    + R$ {Number(option.additional_price || 0).toFixed(2).replace('.', ',')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6">
                                                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-gray-500 dark:text-gray-400">Nenhuma opção cadastrada</p>
                                                </div>
                                            )}

                                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                {variantAddonGroup.addon_group_options && variantAddonGroup.addon_group_options.length > 0 && (
                                                    <button
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium transition-all duration-200"
                                                        onClick={() => {
                                                            setIsAddonGroupOptionsDeleteModalOpen(true);
                                                            setAddonGroupId(variantAddonGroup.id ?? null);
                                                        }}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Remover opção
                                                    </button>
                                                )}

                                                <button
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/40 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium transition-all duration-200"
                                                    onClick={() => {
                                                        setAddonGroupId(0);
                                                        setTimeout(() => {
                                                            setAddonGroupId(variantAddonGroup.id ?? null);
                                                            setIsAddonGroupOptionsModalOpen(true);
                                                        }, 100);
                                                    }}
                                                >
                                                    <PlusCircle className="w-3 h-3" />
                                                    Add opção
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                        <ListPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum grupo de opções cadastrado</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Clique em "Adicionar Grupo" para começar</p>
                    </div>
                )}

                <VariantAddonGroupFormModal
                    sp_variant_id={variant?.id}
                    isOpen={isOptionGroupModalOpen}
                    onClose={() => setIsOptionGroupModalOpen(false)}
                />

                {variant?.variant_addon_groups && (variant.variant_addon_groups.length > 0) && (
                    <VariantAddonGroupDeleteFormModal
                        isOpen={isOptionGroupDeleteModalOpen}
                        onClose={() => setIsOptionGroupDeleteModalOpen(false)}
                        variantAddonGroups={variant.variant_addon_groups}
                    />
                )}

                {addonGroupId && (
                    <AddonGroupOptionFormModal
                        isOpen={isAddonGroupOptionsModalOpen}
                        onClose={() => setIsAddonGroupOptionsModalOpen(false)}
                        addon_group_id={addonGroupId ?? 0}
                    />
                )}

                {variant?.variant_addon_groups && (variant.variant_addon_groups.length > 0) && (addonGroupId !== null) && (
                    <AddonGroupOptionDeleteFormModal
                        isOpen={isAddonGroupOptionsDeleteModalOpen}
                        onClose={() => setIsAddonGroupOptionsDeleteModalOpen(false)}
                        addonGroupOptions={
                            variant.variant_addon_groups
                                .find(group => group.id === addonGroupId)
                                ?.addon_group_options ?? []
                        }
                    />
                )}
            </div>
        </div>
    );
}
