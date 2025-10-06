import { SelectedVariantAddon } from "@/types/SelectedVariantAddon";
import { VariantAddon } from "@/types/VariantAddon";

export default function VariantAddonGroupsForm({
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
        <div className="flex flex-col mt-2">
            <h3 className="text-sm font-semibold mb-1">Complementos (extras)</h3>
            {variantAddons.map((variantAddon) => (
                <div key={variantAddon.id} className="flex items-center py-1 mr-2 justify-between">
                    {variantAddon.addon?.name && (
                        <span className="text-md italic">{variantAddon.addon.name} + R$ {Number(variantAddon.price || 0).toFixed(2)}</span>
                    )}
                    <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-lg">
                        <button
                            className="h-4 w-4 flex items-center justify-center rounded-md bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition"
                            onClick={() => handleDecrementVariantAddons(variantAddon)}
                            aria-label="Diminuir"
                        >-</button>
                        <span className="text-xs text-neutral-500 italic mr-2 ml-2">{selectedVariantAddons.find(a => a.variantAddon.id === variantAddon.id)?.qty || 0}</span>
                        <button
                            className="h-4 w-4 flex items-center justify-center rounded-md bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition"
                            onClick={() => handleIncrementVariantAddons(variantAddon)}
                            aria-label="Aumentar"
                        >+</button>
                    </div>
                </div>
            ))}
        </div>
    );
}