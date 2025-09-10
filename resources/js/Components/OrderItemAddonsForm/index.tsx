import PrimaryButton from "../PrimaryButton"
import { MdDelete } from "react-icons/md"
import { Addon } from "@/types/Addon"
import { ProductAddon } from "@/types/ProductAddon"

interface OrderItemAddon {
  addon_id: number | null
  addon?: Addon
  quantity: number
  unit_price: string
  total_price: string
}

interface Props {
  productAddons?: ProductAddon[]
  orderItemAddons: OrderItemAddon[]
  onChange: (newAddons: OrderItemAddon[]) => void
}

export default function OrderItemAddonsForm({ productAddons, orderItemAddons, onChange }: Props) {
  const addAddon = () => {
    const newAddon: OrderItemAddon = {
      addon_id: null,
      addon: undefined,
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
    const selectedAddon = productAddons?.find(pa => pa.addon?.id === addonId)
    if (!selectedAddon) return

    const updated = [...orderItemAddons]
    updated[index] = {
      ...updated[index],
      addon_id: selectedAddon.addon?.id || null,
      unit_price: selectedAddon.price || "0",
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
    <div className="mt-8">
      <h4 className="font-bold text-2xl mb-8 text-gray-900 flex items-center gap-2">
        <span>Complementos</span>
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
          {orderItemAddons.length}
        </span>
      </h4>
      <div className="space-y-8">
        {orderItemAddons.map((orderItemAddon, index) => (
          <div
            key={index}
            className="border border-gray-200 shadow-sm p-6 rounded-2xl bg-white transition hover:shadow-lg flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 gap-6">
              {/* First row: Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2" htmlFor={`addon-select-${index}`}>Complemento</label>
                <select
                  id={`addon-select-${index}`}
                  className="w-full min-w-[180px] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  value={orderItemAddon.addon_id || ''}
                  onChange={e => {
                    handleAddonSelect(index, e.target.value ? parseInt(e.target.value) : null)
                  }}
                >
                  <option value="">Selecione...</option>
                  {productAddons?.map(productAddon => (
                    productAddon.addon ? (
                      <option key={productAddon.addon.id} value={productAddon.addon.id}>
                        {productAddon.addon.name}
                      </option>
                    ) : null
                  ))}
                </select>
              </div>
              {/* Second row: Quantity, Unit Price, Total, Remove Button */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2" htmlFor={`quantity-input-${index}`}>Qtd</label>
                  <input
                    id={`quantity-input-${index}`}
                    type="number"
                    min={1}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    value={orderItemAddon.quantity}
                    onChange={e => {
                      updateAddon(index, { quantity: Number(e.target.value) })
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2" htmlFor={`unit-price-input-${index}`}>Unitário</label>
                  <input
                    id={`unit-price-input-${index}`}
                    type="number"
                    min={0}
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    value={orderItemAddon.unit_price}
                    onChange={e => {
                      updateAddon(index, { unit_price: e.target.value })
                    }}
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Total</label>
                  <span className="text-base text-gray-900 font-bold bg-gray-100 px-3 py-2 rounded-lg">
                  R$ {orderItemAddon.total_price}
                  </span>
                </div>
                <div className="flex justify-end items-center h-full">
                  <PrimaryButton
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
                    onClick={() => removeAddon(index)}
                    title="Remover complemento"
                  >
                    <MdDelete />
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-10">
        <PrimaryButton
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition flex items-center gap-2"
          onClick={addAddon}
        >
          <span className="text-lg font-bold">+</span>
          <span>Complemento</span>
        </PrimaryButton>
        {orderItemAddons.length === 0 && (
          <p className="text-gray-400 text-sm">Nenhum complemento adicionado.</p>
        )}
      </div>
    </div>
  )
}
