import PrimaryButton from "../PrimaryButton"
import { MdDelete } from "react-icons/md"
import { ProductAddon } from "@/types/ProductAddon"
import SearchableAddonsSelect from "../SearchableAddonsSelect"

interface Props {
  productAddons: ProductAddon[]
  onChange: (newAddons: ProductAddon[]) => void
}

export default function ProductAddonsForm({ productAddons, onChange }: Props) {
  const addAddon = () => {
    onChange([
      ...productAddons,
      {
        id: null,
        addon_id: null,
        addon: undefined,
        price: "0",
      }
    ])
  }

  const removeAddon = (index: number) => {
    const updated = [...productAddons]
    updated.splice(index, 1)
    onChange(updated)
  }

  return (
    <div className="mt-8">
      <h4 className="font-bold text-xl mb-6 text-gray-900">Complementos</h4>
      <div className="space-y-6">
        {productAddons.map((productAddon, index) => (
          <div
            key={index}
            className="border border-gray-300 shadow p-5 rounded-xl bg-white transition hover:shadow-lg flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor={`addon-select-${index}`}>Complemento:</label>
                {productAddon.id != null ? (
                  <span className="text-base text-gray-800">{productAddon.addon?.name || 'N/A'}</span>
                ) : (
                  <SearchableAddonsSelect
                    selectedAddon={productAddon.addon || null}
                    setAddon={(addon) => {
                      const updated = [...productAddons]
                      updated[index] = {
                        ...updated[index],
                        addon_id: addon.id,
                        addon: addon,
                        price: addon.price || "0",
                      }
                      onChange(updated)
                    }}
                    isDisabled={false}
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor={`price-input-${index}`}>Preço:</label>
                {productAddon.id != null ? (
                  <span className="text-base text-gray-800">R$ {productAddon.price}</span>
                ) : (
                  <input
                    id={`price-input-${index}`}
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={productAddon.price}
                    onChange={e => {
                      const updated = [...productAddons]
                      updated[index] = {
                        ...updated[index],
                        price: e.target.value,
                      }
                      onChange(updated)
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <PrimaryButton
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
                onClick={() => removeAddon(index)}
              >
                <MdDelete />
                Remover
              </PrimaryButton>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-8">
        <PrimaryButton
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
          onClick={addAddon}
        >
          Adicionar Complemento
        </PrimaryButton>
        {productAddons.length === 0 && (
          <p className="text-gray-400 text-sm">Nenhum complemento adicionado.</p>
        )}
      </div>
    </div>
  )
}
