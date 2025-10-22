import ComboOptionGroupDeleteFormModal from '@/Components/ComboOptionGroupDeleteFormModal ';
import ComboOptionGroupFormModal from '@/Components/ComboOptionGroupFormModal';
import ComboOptionItemDeleteFormModal from '@/Components/ComboOptionItemDeleteFormModal';
import ComboOptionItemFormModal from '@/Components/ComboOptionItemFormModal';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { Wrench, ListPlus, Plus, Package, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProductVariantComboOptionsProps {
  variant: StoreProductVariant;
}

export default function ProductVariantComboOptions({ variant }: ProductVariantComboOptionsProps) {
    const [isComboOptionGroupModalOpen, setIsComboOptionGroupModalOpen] = useState(false);
    const [isComboOptionGroupDeleteModalOpen, setIsComboOptionGroupDeleteModalOpen] = useState(false);

    const [isComboOptionItemModalOpen, setIsComboOptionItemModalOpen] = useState(false);
    const [isComboOptionItemDeleteModalOpen, setIsComboOptionItemDeleteModalOpen] = useState(false);

    const [comboOptionGroupId, setComboOptionGroupId] = useState<number>(0);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-l-4 border-teal-500">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-teal-100 dark:bg-teal-800 p-2 rounded-lg">
                            <Wrench className="w-6 h-6 text-teal-600 dark:text-teal-300" />
                        </div>
                        <div>
                            <h3 className='text-xl font-bold text-teal-700 dark:text-teal-300'>
                                Opções Variáveis do Combo
                            </h3>
                            <p className="text-sm text-teal-600 dark:text-teal-400">
                                Configure grupos de opções que o cliente pode escolher
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsComboOptionGroupModalOpen(true)}
                        className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Novo Grupo</span>
                    </button>
                </div>
        {variant?.combo_option_groups && variant.combo_option_groups.length > 0 ? (
            <div className="space-y-4">
                {variant.combo_option_groups.map((optionGroup, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                        {/* Group Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-teal-100 dark:bg-teal-800 p-2 rounded-lg">
                                    <ListPlus className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                        {optionGroup.name || 'Grupo sem nome'}
                                    </h4>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="flex items-center space-x-1">
                                            <span className="font-medium">Mín:</span>
                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                {optionGroup.min_options}
                                            </span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <span className="font-medium">Máx:</span>
                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                {optionGroup.max_options}
                                            </span>
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            optionGroup.is_required 
                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                            {optionGroup.is_required ? 'Obrigatório' : 'Opcional'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Group Items */}
                        {optionGroup.combo_option_items && optionGroup.combo_option_items.length > 0 ? (
                            <div className="space-y-2 mb-4">
                                {optionGroup.combo_option_items.map((option, optionIdx) => (
                                    <div key={optionIdx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-white dark:bg-gray-600 p-2 rounded-lg">
                                                <Package className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {option.store_product_variant?.product_variant?.name || 'Item sem nome'}
                                                </span>
                                                {option.additional_price && option.additional_price > 0 && (
                                                    <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                                                        +R$ {parseFloat(String(option.additional_price)).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="bg-white dark:bg-gray-600 px-2 py-1 rounded">
                                                Qtd: {option.quantity}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">Nenhum item neste grupo ainda</p>
                                <p className="text-xs">Adicione itens para que os clientes possam escolher</p>
                            </div>
                        )}

                        {/* Group Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => (setIsComboOptionItemModalOpen(true), setComboOptionGroupId(optionGroup.id))}
                                    className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Adicionar Item</span>
                                </button>
                                
                                {optionGroup.combo_option_items && optionGroup.combo_option_items.length > 0 && (
                                    <button
                                        onClick={() => (setIsComboOptionItemDeleteModalOpen(true), setComboOptionGroupId(optionGroup.id))}
                                        className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Remover Item</span>
                                    </button>
                                )}
                            </div>
                            
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {optionGroup.combo_option_items?.length || 0} item(ns)
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <Wrench className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Nenhum grupo configurado
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Crie grupos de opções para que seus clientes possam personalizar o combo
                    </p>
                    <button
                        onClick={() => setIsComboOptionGroupModalOpen(true)}
                        className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Criar Primeiro Grupo</span>
                    </button>
                </div>
            </div>
        )}

        {/* Global Actions */}
        {variant?.combo_option_groups && variant.combo_option_groups.length > 0 && (
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setIsComboOptionGroupDeleteModalOpen(true)}
                    className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Remover Grupos</span>
                </button>
            </div>
        )}
            </div>

            {/* Modals */}
            <ComboOptionGroupFormModal
                isOpen={isComboOptionGroupModalOpen}
                sp_variant_id={variant?.id ?? 0}
                onClose={() => setIsComboOptionGroupModalOpen(false)}
            />

            <ComboOptionGroupDeleteFormModal
                isOpen={isComboOptionGroupDeleteModalOpen}
                onClose={() => setIsComboOptionGroupDeleteModalOpen(false)}
                comboOptionGroups={variant?.combo_option_groups}
            />

            {comboOptionGroupId !== 0 && (
                <>
                    <ComboOptionItemFormModal
                        isOpen={isComboOptionItemModalOpen}
                        onClose={() => setIsComboOptionItemModalOpen(false)}
                        option_group_id={comboOptionGroupId}
                    />

                    <ComboOptionItemDeleteFormModal
                        isOpen={isComboOptionItemDeleteModalOpen}
                        onClose={() => setIsComboOptionItemDeleteModalOpen(false)}
                        comboOptionItems={(variant?.combo_option_groups ?? [])
                            .find(group => group.id === comboOptionGroupId)
                            ?.combo_option_items || []}
                    />
                </>
            )}
        </div>
    );
}
