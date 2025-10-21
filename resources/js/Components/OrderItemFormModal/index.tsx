import {
  Plus,
  Package,
  Hash,
  Settings,
  FileText,
  ShoppingCart,
  DollarSign,
  X,
} from 'lucide-react';
import Modal from '../Modal';
import { useForm } from '@inertiajs/react';
import { Order } from '@/types/Order';
import { useEffect, useState } from 'react';
import { OrderItem } from '@/types/OrderItem';
import SearchableStoreProductVariantsSelect from '../SearchableStoreProductVariantsSelect';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { VariantAddon } from '@/types/VariantAddon';
import { SelectedAddonGroupOption } from '@/types/SelectedAddonGroupOption';
import { SelectedVariantAddon } from '@/types/SelectedVariantAddon';
import VariantAddonGroupsForm from '../VariantAddonGroupsForm';
import VariantAddonsForm from '../VariantAddonsForm';
import { VariantAddonGroup } from '@/types/VariantAddonGroup';
import { ComboOptionGroup } from '@/types/ComboOptionGroup';
import { SelectedComboOptionItem } from '@/types/SelectedComboOptionItem';
import ComboOptionItemSelectionFormModal from '../ComboOptionItemSelectionFormModal';

interface OrderItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  orderItem?: OrderItem | null;
}

export default function OrderItemFormModal({
  isOpen,
  onClose,
  order,
  orderItem,
}: OrderItemFormModalProps) {
  const { data, setData, post, errors, processing } = useForm({
    order_id: order ? order.id : 0,
    store_product_variant_id: 0,
    quantity: 1,
    options: [] as { id: number; quantity: number }[],
    combo_options: [] as { id: number; quantity: number }[],
    addons: [] as { id: number; quantity: number }[],
    notes: orderItem ? orderItem.notes : '',
  });

  const [storeProductVariant, setStoreProductVariant] =
    useState<StoreProductVariant | null>(null);
  const [addonGroupOptions, setAddonGroupOptions] = useState<VariantAddonGroup[]>([]);
  const [selectedAddonGroupOptions, setSelectedAddonGroupOptions] = useState<SelectedAddonGroupOption[]>([]);
  const [variantAddons, setVariantAddons] = useState<VariantAddon[]>([]);
  const [selectedVariantAddons, setSelectedVariantAddons] = useState<SelectedVariantAddon[]>([]);
  const [comboOptionGroups, setComboOptionGroups] = useState<ComboOptionGroup[]>([]);
  const [selectedComboOptions, setSelectedComboOptions] = useState<SelectedComboOptionItem[]>([]);
  const [isOptionsValid, setIsOptionsValid] = useState(true);
  const [subTotal, setSubtotal] = useState(0.0);

  // Validação e subtotal dinâmico
  useEffect(() => {
    if (storeProductVariant?.variant_addon_groups?.length) {
      setIsOptionsValid(
        storeProductVariant.variant_addon_groups.every((g) => {
          const selectedCount = selectedAddonGroupOptions
            .filter((sa) => sa.option.addon_group_id === g.id)
            .reduce((sum, sa) => sum + sa.qty, 0);
          return (
            !g.is_required ||
            (selectedCount >= (g.min_options || 0) &&
              (g.max_options === null || selectedCount <= g.max_options))
          );
        })
      );
    } else if (comboOptionGroups.length > 0) {
      setIsOptionsValid(
        comboOptionGroups.every((g) => {
          const selectedCount = selectedComboOptions
            .filter((sc) => sc.option.option_group_id === g.id)
            .reduce((sum, sc) => sum + sc.qty, 0);
          return (
            !g.is_required ||
            (selectedCount >= (g.min_options || 0) &&
              (g.max_options === null || selectedCount <= g.max_options))
          );
        })
      );
    } else {
      setIsOptionsValid(true);
    }

    const vPrice = storeProductVariant?.price || 0;
    const optionAdditionalPrice = selectedAddonGroupOptions.reduce(
      (sum, sa) => sum + (sa.option.additional_price * sa.qty || 0),
      0
    );
    const comboOptionsPrice = selectedComboOptions.reduce(
      (sum, sc) => sum + (sc.option.additional_price * sc.qty || 0),
      0
    );
    const vAddonsPrice = selectedVariantAddons.reduce(
      (sum, va) => sum + ((va.variantAddon.price ?? 0) * va.qty),
      0
    );

    setSubtotal(
      (vPrice + optionAdditionalPrice + comboOptionsPrice + vAddonsPrice) *
        (data.quantity || 1)
    );
  }, [
    storeProductVariant,
    selectedAddonGroupOptions,
    selectedComboOptions,
    selectedVariantAddons,
    data.quantity,
  ]);

  const handleQuantityChange = (q: number) => setData({ ...data, quantity: q });

  const handleVariantChange = (variant: StoreProductVariant | null) => {
    setStoreProductVariant(variant);
    setAddonGroupOptions(variant?.variant_addon_groups || []);
    setComboOptionGroups(variant?.combo_option_groups || []);
    setVariantAddons(variant?.variant_addons || []);
    setSelectedAddonGroupOptions([]);
    setSelectedComboOptions([]);
    setSelectedVariantAddons([]);
    setData({
      ...data,
      store_product_variant_id: variant?.id || 0,
      options: [],
      addons: [],
    });
  };

  const submit = () => {
    post(route('orders.items.store', order.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: onClose,
    });
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl h-[90vh] md:max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-4 py-3 md:px-6 md:py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
                  {orderItem ? 'Editar Item' : 'Adicionar Item'}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
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

        {/* Corpo scrollável */}
        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6 space-y-5">
          {/* Produto */}
          <section className="p-4 md:p-6 rounded-lg border border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
            <h4 className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-3 text-base md:text-lg">
              <Package className="w-4 h-4 md:w-5 md:h-5" /> Produto
            </h4>
            <SearchableStoreProductVariantsSelect
              selectedVariant={storeProductVariant}
              setVariant={handleVariantChange}
              isDisabled={processing}
            />
          </section>

          {/* Quantidade */}
          <section className="p-4 md:p-6 rounded-lg border border-purple-100 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
            <h4 className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-3 text-base md:text-lg">
              <Hash className="w-4 h-4 md:w-5 md:h-5" /> Quantidade
            </h4>
            <input
              type="number"
              min={1}
              className="block w-full px-3 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
              value={data.quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
            />
          </section>

          {/* Opções */}
          {addonGroupOptions.length > 0 && (
            <section className="p-4 md:p-6 rounded-lg border border-orange-100 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
              <h4 className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-3 text-base md:text-lg">
                <Settings className="w-4 h-4 md:w-5 md:h-5" /> Opções do Produto
              </h4>
              <VariantAddonGroupsForm
                variantAddonGroups={addonGroupOptions}
                selectedAddonGroupOptions={selectedAddonGroupOptions}
                onChange={setSelectedAddonGroupOptions}
                errors={errors}
              />
            </section>
          )}

          {/* Opções de Combo */}
          {comboOptionGroups.length > 0 && (
            <section className="p-4 md:p-6 rounded-lg border border-pink-100 dark:border-pink-800 bg-pink-50/50 dark:bg-pink-900/10">
              <h4 className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-3 text-base md:text-lg">
                <Settings className="w-4 h-4 md:w-5 md:h-5" /> Opções de Combo
              </h4>
              <ComboOptionItemSelectionFormModal
                comboOptionGroups={comboOptionGroups}
                selectedAddonGroupOptions={selectedComboOptions}
                onChange={setSelectedComboOptions}
                errors={errors}
              />
            </section>
          )}

          {/* Adicionais */}
          {variantAddons.length > 0 && (
            <section className="p-4 md:p-6 rounded-lg border border-teal-100 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-900/10">
              <h4 className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-3 text-base md:text-lg">
                <Plus className="w-4 h-4 md:w-5 md:h-5" /> Adicionais
              </h4>
              <VariantAddonsForm
                variantAddons={variantAddons}
                selectedVariantAddons={selectedVariantAddons}
                setSelectedVariantAddons={setSelectedVariantAddons}
              />
            </section>
          )}

          {/* Observações */}
          <section className="p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30">
            <h4 className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-3 text-base md:text-lg">
              <FileText className="w-4 h-4 md:w-5 md:h-5" /> Observações
            </h4>
            <textarea
              rows={3}
              maxLength={500}
              className="block w-full px-3 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100"
              value={data.notes ?? ''}
              onChange={(e) => setData('notes', e.target.value)}
              placeholder="Observações especiais..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {(data.notes?.length || 0)}/500 caracteres
            </p>
          </section>
        </div>

        {/* Rodapé fixo */}
        <div className="flex-shrink-0 sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 flex flex-col sm:flex-row gap-3 shadow-inner">
          <div className="flex justify-between items-center w-full sm:w-auto sm:flex-1">
            <span className="text-sm font-semibold text-green-800 dark:text-green-300">
              Subtotal
            </span>
            <span className="text-xl font-bold text-green-700 dark:text-green-200">
              R$ {(Number(subTotal) || 0).toFixed(2).replace('.', ',')}
            </span>
          </div>
          <div className="flex sm:justify-end gap-3 sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={submit}
              disabled={!isOptionsValid || processing}
              className="flex-1 sm:flex-none px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium shadow-md disabled:bg-gray-400"
            >
              {processing
                ? 'Salvando...'
                : orderItem
                ? 'Atualizar'
                : 'Adicionar'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
