import { Plus, Package, Hash, Settings, FileText, ShoppingCart, DollarSign, X } from 'lucide-react';
import Modal from "../Modal";
import { useForm } from "@inertiajs/react";
import { Order } from "@/types/Order";
import { useEffect, useState } from "react";
import { OrderItem } from "@/types/OrderItem";
import SearchableStoreProductVariantsSelect from "../SearchableStoreProductVariantsSelect";
import { StoreProductVariant } from "@/types/StoreProductVariant";
import { VariantAddon } from "@/types/VariantAddon";
import { SelectedAddonGroupOption } from "@/types/SelectedAddonGroupOption";
import { SelectedVariantAddon } from "@/types/SelectedVariantAddon";
import VariantAddonGroupsForm from "../VariantAddonGroupsForm";
import VariantAddonsForm from "../VariantAddonsForm";
import { VariantAddonGroup } from "@/types/VariantAddonGroup";
import { ComboOptionGroup } from "@/types/ComboOptionGroup";
import { SelectedComboOptionItem } from "@/types/SelectedComboOptionItem";
import ComboOptionItemSelectionFormModal from "../ComboOptionItemSelectionFormModal";

interface OrderItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    orderItem?: OrderItem | null;
}

export default function OrderItemFormModal({ isOpen, onClose, order, orderItem }: OrderItemFormModalProps) {
    const { data, setData, post, errors, processing } = useForm({
        order_id: order ? order.id : 0,
        store_product_variant_id: 0,
        quantity: 1,
        options: [] as { id: number, quantity: number }[],
        combo_options: [] as { id: number, quantity: number }[],
        addons: [] as { id: number, quantity: number }[],
        notes: orderItem ? orderItem.notes : '',
    });

    const [storeProductVariant, setStoreProductVariant] = useState<StoreProductVariant | null>(null);

    const [addonGroupOptions, setAddonGroupOptions] = useState<VariantAddonGroup[]>([]);
    const [selectedAddonGroupOptions, setSelectedAddonGroupOptions] = useState<SelectedAddonGroupOption[]>([]);
    const [variantAddons, setVariantAddons] = useState<VariantAddon[]>([]);
    const [selectedVariantAddons, setSelectedVariantAddons] = useState<SelectedVariantAddon[]>([]);
    const [comboOptionGroups, setComboOptionGroups] = useState<ComboOptionGroup[]>([]);
    const [selectedComboOptions, setSelectedComboOptions] = useState<SelectedComboOptionItem[]>([]);
    const [isOptionsValid, setIsOptionsValid] = useState(true);
    const [subTotal, setSubtotal] = useState(0.0);

    useEffect(() => {
        if (storeProductVariant?.variant_addon_groups && (storeProductVariant.variant_addon_groups.length > 0)) {
            setIsOptionsValid(storeProductVariant.variant_addon_groups.every(g => {
                const selectedCount = selectedAddonGroupOptions
                    .filter(sa => sa.option.addon_group_id === g.id)
                    .reduce((sum, sa) => sum + sa.qty, 0);
                return (!g.is_required || (selectedCount >= (g.min_options || 0) && (g.max_options === null || selectedCount <= g.max_options)));
            }));
        } else if (comboOptionGroups.length > 0) {
            setIsOptionsValid(comboOptionGroups.every(g => {
                const selectedCount = selectedComboOptions
                    .filter(sc => sc.option.option_group_id === g.id)
                    .reduce((sum, sc) => sum + sc.qty, 0);
                return (!g.is_required || (selectedCount >= (g.min_options || 0) && (g.max_options === null || selectedCount <= g.max_options)));
            }));
        } else {
            setIsOptionsValid(true);
        }

        // Recalcula subtotal
        let vPrice = storeProductVariant?.price || 0;
        let optionAdditionalPrice = selectedAddonGroupOptions.filter(sa => (sa.option.additional_price > 0)).reduce((sum, sa) => sum + (sa.option.additional_price * sa.qty), 0);
        let comboOptionsPrice = selectedComboOptions.filter(sc => (sc.option.additional_price > 0)).reduce((sum, sc) => sum + (sc.option.additional_price * sc.qty), 0);
        let vAddonsPrice = selectedVariantAddons.filter(va => (va.variantAddon.price && va.variantAddon.price > 0)).reduce((sum, va) => sum + ((va.variantAddon.price ?? 0) * va.qty), 0);
        let newSubtotal = (Number(vPrice) + Number(optionAdditionalPrice) + Number(comboOptionsPrice) + Number(vAddonsPrice));

        setSubtotal(newSubtotal * (data.quantity || 1));
    }, [storeProductVariant, selectedAddonGroupOptions, selectedComboOptions, selectedVariantAddons, data.quantity]);

    const handleQuantityChange = (quantity: number) => {
        setData({...data, quantity: quantity });
    }

    const handleAddonGroupOptionsChange = (selectedOptions: SelectedAddonGroupOption[]) => {
        setSelectedAddonGroupOptions(selectedOptions);
        setData('options', selectedOptions.map(sa => ({ id: sa.option.id, quantity: sa.qty })));
    }

    const handleComboOptionsChange = (selectedOptions: SelectedComboOptionItem[]) => {
        setSelectedComboOptions(selectedOptions);
        setData('combo_options', selectedOptions.map(sc => ({ id: sc.option.id, quantity: sc.qty })));
    }

    const handleVariantAddonsChange = (selectedAddons: SelectedVariantAddon[]) => {
        setSelectedVariantAddons(selectedAddons);
        setData('addons', selectedAddons.map(va => ({ id: va.variantAddon.id, quantity: va.qty })));
    }

    const handleVariantChange = (storeProductVariant: StoreProductVariant | null) => {
        setStoreProductVariant(storeProductVariant);
        setAddonGroupOptions(storeProductVariant?.variant_addon_groups ? storeProductVariant.variant_addon_groups : []);
        setComboOptionGroups(storeProductVariant?.combo_option_groups ? storeProductVariant.combo_option_groups : []);
        setVariantAddons(storeProductVariant ? storeProductVariant.variant_addons ?? [] : []);
        setSelectedAddonGroupOptions([]);
        setSelectedComboOptions([]);
        setSelectedVariantAddons([]);

        const newQuantity = Number(data.quantity ?? 1);
        setData({
            ...data,
            store_product_variant_id: storeProductVariant ? storeProductVariant.id : 0,
            quantity: newQuantity,
            options: [],
            addons: []
        });
    };

    const closeModal = () => {
        setData({
            order_id: order ? order.id : 0,
            store_product_variant_id: 0,
            quantity: 1,
            options: [],
            combo_options: [],
            addons: [],
            notes: orderItem ? orderItem.notes : '',
        });
        onClose();
    }

    const submit = () => {
        setTimeout(() => {
            post(route('orders.items.store', order.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => closeModal(),
            });
        }, 300);
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-4xl w-full max-h-[95vh] flex flex-col">

              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                              <ShoppingCart className="w-5 h-5 text-white" />
                          </div>
                          <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  {orderItem ? 'Editar Item' : 'Adicionar Item'}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Pedido #{order?.id}
                              </p>
                          </div>
                      </div>
                      <button
                          onClick={onClose}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg flex items-center justify-center"
                      >
                          <X className="w-4 h-4" />
                      </button>
                  </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* Produto */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-l-4 border-blue-500">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                              <Package className="w-5 h-5" />
                              Produto
                          </h4>
                          <SearchableStoreProductVariantsSelect
                              selectedVariant={storeProductVariant}
                              setVariant={handleVariantChange}
                              isDisabled={processing}
                          />
                          {errors.store_product_variant_id && (
                              <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                                  {errors.store_product_variant_id}
                              </p>
                          )}
                      </div>

                      {/* Quantidade */}
                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-6 border-l-4 border-purple-500">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                              <Hash className="w-5 h-5" />
                              Quantidade
                          </h4>
                          <div className="relative">
                              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                  type="number"
                                  id="quantity"
                                  className="block w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 bg-white text-gray-900"
                                  value={data.quantity}
                                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                                  min={1}
                                  placeholder="Digite a quantidade"
                              />
                          </div>
                          {errors.quantity && (
                              <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                                  {errors.quantity}
                              </p>
                          )}
                      </div>

                  </div>

                  {/* Opções e Observações */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* Grupos de Addons */}
                      {addonGroupOptions.length > 0 && (
                          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border-l-4 border-orange-500">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                  <Settings className="w-5 h-5" />
                                  Opções do Produto
                              </h4>
                              <VariantAddonGroupsForm
                                  variantAddonGroups={addonGroupOptions}
                                  selectedAddonGroupOptions={selectedAddonGroupOptions}
                                  onChange={handleAddonGroupOptionsChange}
                                  errors={errors}
                              />
                          </div>
                      )}

                      {/* Observações */}
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-slate-600/50 rounded-xl p-6 border-l-4 border-gray-400">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                              <FileText className="w-5 h-5" />
                              Observações
                          </h4>
                          <div className="relative">
                              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                              <textarea
                                  id="notes"
                                  className="block w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 bg-white text-gray-900 resize-none"
                                  value={data.notes ?? ''}
                                  onChange={(e) => setData('notes', e.target.value)}
                                  rows={3}
                                  maxLength={500}
                                  placeholder="Observações especiais para este item..."
                              />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {(data.notes?.length || 0)}/500 caracteres
                          </p>
                          {errors.notes && (
                              <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                                  {errors.notes}
                              </p>
                          )}
                      </div>

                  </div>

                  {/* Combo Items e Addons */}
                  <div className="space-y-6">
                      {/* Itens inclusos do combo */}
                      {storeProductVariant?.combo_items && (storeProductVariant?.combo_items?.length > 0) && (
                          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 border-l-4 border-cyan-500">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                  <Package className="w-5 h-5" />
                                  Itens Inclusos
                              </h4>
                              <div className="space-y-2">
                                  {storeProductVariant.combo_items.map(ci => (
                                      <div key={ci.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                                              <span className="text-white font-bold text-sm">{ci.quantity}</span>
                                          </div>
                                          <span className="text-gray-900 dark:text-gray-100 font-medium">
                                              {ci.item_variant?.product_variant?.name}
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      {/* Opções de Combo */}
                      {comboOptionGroups.length > 0 && (
                          <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-6 border-l-4 border-pink-500">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                  <Settings className="w-5 h-5" />
                                  Opções de Combo
                              </h4>
                              <ComboOptionItemSelectionFormModal
                                  comboOptionGroups={comboOptionGroups}
                                  selectedAddonGroupOptions={selectedComboOptions}
                                  onChange={handleComboOptionsChange}
                                  errors={errors}
                              />
                          </div>
                      )}

                      {/* Adicionais */}
                      {variantAddons.length > 0 && (
                          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-l-4 border-teal-500">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                  <Plus className="w-5 h-5" />
                                  Adicionais
                              </h4>
                              <VariantAddonsForm
                                  variantAddons={variantAddons}
                                  selectedVariantAddons={selectedVariantAddons}
                                  setSelectedVariantAddons={handleVariantAddonsChange}
                              />
                          </div>
                      )}
                  </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  
                  {/* Subtotal */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-lg font-semibold text-green-800 dark:text-green-200">
                              Subtotal
                          </span>
                      </div>
                      <span className="text-2xl font-bold text-green-900 dark:text-green-100">
                          R$ {(Number(subTotal) || 0).toFixed(2).replace('.', ',')}
                      </span>
                  </div>

                  {/* Botões */}
                  <div className="flex flex-col sm:flex-row gap-3">
                      <button
                          type="button"
                          onClick={onClose}
                          className="order-2 sm:order-1 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium shadow-sm hover:shadow-md"
                      >
                          Cancelar
                      </button>

                      <button
                          type="button"
                          onClick={submit}
                          disabled={!isOptionsValid || processing}
                          className="order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                      >
                          {processing ? (
                              <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  Processando...
                              </>
                          ) : (
                              <>
                                  {orderItem ? <Settings className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                  {orderItem ? 'Atualizar Item' : 'Adicionar ao Pedido'}
                              </>
                          )}
                      </button>
                  </div>

                  {/* Validação de opções */}
                  {!isOptionsValid && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                              <X className="w-4 h-4" />
                              Complete todas as opções obrigatórias antes de continuar.
                          </p>
                      </div>
                  )}
              </div>
          </div>
      </Modal>
    );
}