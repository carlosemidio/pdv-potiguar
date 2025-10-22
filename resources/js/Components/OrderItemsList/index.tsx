import { OrderItem } from "@/types/OrderItem";
import { useForm } from "@inertiajs/react";
import { DeleteIcon, X } from "lucide-react";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Swal from "sweetalert2";

export default function OrderItemsList({ items }: { items: OrderItem[] }) {
  const { delete: destroy } = useForm();
  const [openItems, setOpenItems] = useState<number[]>([]);
  const allIds = items.map((i) => i.id);
  const allExpanded = openItems.length === allIds.length;

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setOpenItems((prev) => (prev.length === items.length ? [] : allIds));
  };

  const calcExtras = (item: OrderItem): number => {
    let total = 0;
    item.order_item_options?.forEach((o) => {
      total += (o.addon_group_option?.additional_price || 0) * o.quantity;
    });
    item.combo_option_items?.forEach((c) => {
      total += (c.unit_price || 0) * c.quantity;
    });
    return total;
  };

  const handleDeleteItem = (item: OrderItem) => {
      Swal.fire({
          title: 'Tem certeza?',
          text: `Deseja realmente remover "${item.store_product_variant?.product_variant?.name || 'este item'}" do pedido?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sim, remover!',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              destroy(route('orders.items.destroy', item.id), {
                  onSuccess: () => {
                      Swal.fire(
                          'Removido!',
                          'O item foi removido do pedido.',
                          'success'
                      );
                  }
              });
          }
      });
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Itens do Pedido</h3>
        <button
          onClick={toggleAll}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          {allExpanded ? (
            <>
              <FiChevronUp className="w-3 h-3" /> Recolher todos
            </>
          ) : (
            <>
              <FiChevronDown className="w-3 h-3" /> Expandir todos
            </>
          )}
        </button>
      </div>

      {/* Lista */}
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        const hasOptions =
          (item.order_item_options?.length ?? 0) > 0 ||
          (item.combo_option_items?.length ?? 0) > 0;
        const hasCombo =
          (item.store_product_variant?.combo_items?.length ?? 0) > 0;
        const hasExtras = hasOptions || hasCombo || item.notes;

        const extrasTotal = calcExtras(item);

        return (
          <div key={item.id} className="border-b border-gray-100 relative">
            <div className="absolute top-2 right-2">
              <button
                onClick={() => handleDeleteItem(item)}
                className="text-red-600 hover:text-red-800"
              >
                <X size={16} />
              </button>
            </div>

            <button
              onClick={() => toggleItem(item.id)}
              disabled={!hasExtras}
              className={`w-full flex justify-between items-center px-3 py-2 text-left transition ${
                hasExtras
                  ? "hover:bg-gray-50 cursor-pointer"
                  : "cursor-default opacity-80"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">
                  {item.store_product_variant?.product_variant?.name}
                </span>
                {hasExtras && (
                  <span className="text-xs text-gray-500">
                    {[
                      hasOptions ? "opções personalizadas" : null,
                      hasCombo ? "combo" : null,
                      item.notes ? "observações" : null,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-800 block">
                    R$ {Number(item.total_price).toFixed(2)}
                  </span>
                  {extrasTotal > 0 && (
                    <span className="text-xs text-green-600">
                      +{extrasTotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  )}
                </div>
                {hasExtras && (
                  <>
                    {isOpen ? (
                      <FiChevronUp className="w-4 h-4 text-gray-400 mt-6" />
                    ) : (
                      <FiChevronDown className="w-4 h-4 text-gray-400 mt-6" />
                    )}
                  </>
                )}
              </div>
            </button>

            {/* Detalhes */}
            {hasExtras && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-screen p-3 pt-0" : "max-h-0 p-0"
                }`}
              >
                <div className="text-sm text-gray-600 space-y-2 border-t border-gray-100 mt-1 pt-2">
                  {item.order_item_options?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Personalizações:
                      </p>
                      {item.order_item_options.map((opt) => (
                        <div
                          key={opt.id}
                          className="flex justify-between text-xs text-gray-700"
                        >
                          <span>
                            {opt.quantity}×{" "}
                            {opt.addon_group_option?.addon?.name || "N/A"}
                          </span>
                          {opt.addon_group_option?.additional_price > 0 && (
                            <span className="text-green-600">
                              +
                              {opt.addon_group_option.additional_price.toLocaleString(
                                "pt-BR",
                                { style: "currency", currency: "BRL" }
                              )}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {(item.store_product_variant?.combo_items?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Itens fixos do Combo:</p>
                      {item.store_product_variant?.combo_items?.map((ci) => (
                        <div
                          key={ci.id}
                          className="text-xs text-gray-700 flex justify-between"
                        >
                          <span>
                            {ci.quantity}×{" "}
                            {ci.item_variant?.product_variant?.name || "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.combo_option_items?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Itens selecionados:
                      </p>
                      {item.combo_option_items.map((coi) => (
                        <div
                          key={coi.id}
                          className="flex justify-between text-xs text-gray-700"
                        >
                          <span>
                            {coi.quantity}×{" "}
                            {coi.combo_option_item?.store_product_variant
                              ?.product_variant?.name || "N/A"}
                          </span>
                          {coi.unit_price > 0 && (
                            <span className="text-green-600">
                              +
                              {Number(coi.unit_price).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {item.order_item_addons && item.order_item_addons.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Adicionais:</p>
                      {item.order_item_addons.map((oia) => (
                        <div
                          key={oia.id}
                          className="flex justify-between text-xs text-gray-700"
                        >
                          <span>
                            {oia.quantity}× {oia.variant_addon?.addon?.name || "N/A"}
                          </span>
                          {Number(oia.total_price) > 0 && (
                            <span className="text-green-600">
                              +
                              {Number(oia.unit_price).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {item.notes && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Observações:</p>
                      <p className="text-xs text-gray-700 italic">
                        “{item.notes}”
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
