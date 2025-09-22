import { OrderItemAddon } from "@/types/OrderItemAddon"
import { VariantAddon } from "@/types/VariantAddon"
import { PlusCircle, XSquare } from "lucide-react"

interface Props {
  productAddons?: VariantAddon[]
  orderItemAddons: OrderItemAddon[]
  onChange: (newAddons: OrderItemAddon[]) => void
}

export default function OrderItemAddonsForm({ productAddons, orderItemAddons, onChange }: Props) {
  const addAddon = () => {
    const newAddon: OrderItemAddon = {
      variant_addon_id: undefined,
      quantity: 1,
      unit_price: "0",
      total_price: "0",
    }
    onChange([...orderItemAddons, newAddon])
  }

  const removeAddon = (index: number) => {
    const updated = [...orderItemAddons]
    updated.splice(index, 1)
    onChange(updated)
  }

  const handleAddonSelect = (index: number, addonId: number | null) => {
    const selectedAddon = productAddons?.find(pa => pa.id === addonId)
    if (!selectedAddon) return

    const updated = [...orderItemAddons]
    updated[index] = {
      ...updated[index],
      variant_addon_id: selectedAddon.id !== undefined ? selectedAddon.id : undefined,
      unit_price: String(selectedAddon.price ?? "0"),
      total_price: (Number(selectedAddon.price || 0) * updated[index].quantity).toFixed(2),
    }
    onChange(updated)
  }

  const updateAddon = (index: number, changes: Partial<OrderItemAddon>) => {
    const updated = [...orderItemAddons]
    updated[index] = {
      ...updated[index],
      ...changes,
    }

    // Recalculate total_price if quantity or unit_price changed
    if (changes.quantity !== undefined || changes.unit_price !== undefined) {
      const quantity = changes.quantity !== undefined ? changes.quantity : updated[index].quantity
      const unitPrice = changes.unit_price !== undefined ? parseFloat(changes.unit_price) : parseFloat(updated[index].unit_price)
      updated[index].total_price = (quantity * unitPrice).toFixed(2)
    }

    onChange(updated)
  }

  return (
    <div className="mt-2">
      <h4 className="font-bold text-base mb-2 text-gray-900 flex items-center gap-2">
        <span>Complementos</span>
        <span className="bg-blue-100 text-blue-700 px-2 py-0 rounded text-xs font-semibold">
          {orderItemAddons.length}
        </span>
        <span className="bg-blue-700 text-white rounded-full flex items-center justify-center text-xs font-semibold cursor-pointer" onClick={addAddon} title="Adicionar complemento">
          <PlusCircle size={26} />
        </span>
      </h4>
      <div className="space-y-2">
        {orderItemAddons.map((orderItemAddon, index) => (
          <div
            key={index}
            className="border border-gray-200 p-2 rounded-lg bg-white flex flex-col gap-2 relative"
          >
            <div className="flex flex-wrap gap-2 items-center">
              <select
                id={`addon-select-${index}`}
                className="w-[92%] border border-gray-300 rounded px-2 py-1 text-xs bg-gray-50"
                value={orderItemAddon.variant_addon_id || ''}
                onChange={e => {
                  handleAddonSelect(index, e.target.value ? parseInt(e.target.value) : null)
                }}
              >
                <option value="">Selecione...</option>
                {productAddons?.map(productAddon => (
                  productAddon ? (
                    <option key={productAddon.id} value={productAddon.id}>
                      {productAddon.addon ? productAddon.addon.name : ''}
                    </option>
                  ) : null
                ))}
              </select>
              <input
                id={`quantity-input-${index}`}
                type="number"
                min={1}
                max={(() => {
                  const selectedAddon = productAddons?.find(pa => pa.id === orderItemAddon.variant_addon_id);
                  return selectedAddon?.quantity ?? 99;
                })()}
                className="w-16 border border-gray-300 rounded px-2 py-1 text-xs bg-gray-50"
                value={orderItemAddon.quantity}
                onChange={e => {
                  updateAddon(index, { quantity: Number(e.target.value) })
                }}
                placeholder="Qtd"
              />
              <input
                id={`unit-price-input-${index}`}
                type="number"
                min={0}
                step="0.01"
                className="w-20 border border-gray-300 rounded px-2 py-1 text-xs bg-gray-50"
                value={orderItemAddon.unit_price}
                readOnly
                tabIndex={-1}
                placeholder="Custo"
              />
              <span className="text-xs text-gray-900 font-bold bg-gray-100 px-2 py-1 rounded">
                R$ {orderItemAddon.total_price}
              </span>
              <span
                className="bg-red-500 hover:bg-red-600 text-white rounded flex items-center gap-1 text-xs absolute top-2 right-2"
                onClick={() => removeAddon(index)}
              >
                <XSquare size={20} />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        {orderItemAddons.length === 0 && (
          <p className="text-gray-400 text-xs">Nenhum complemento adicionado.</p>
        )}
      </div>
    </div>
  )
}
