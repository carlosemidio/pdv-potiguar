import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Unit } from "@/types/Unit";
import { Addon } from "@/types/Addon";
import { VariantAddon } from "@/types/VariantAddon";
import SearchableAddonsSelect from "../SearchableAddonsSelect";

interface VariantAddonFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    sp_variant_id: number;
    units: Unit[];
    variantAddon?: VariantAddon | null;
}

export default function VariantAddonFormModal({
    isOpen,
    onClose,
    sp_variant_id,
    variantAddon,
}: VariantAddonFormModalProps) {
    const { data, setData, post, processing } = useForm({
        sp_variant_id: sp_variant_id,
        addon_id: '' as string | number,
        quantity: '',
        price: '',
    });

    const isEdit = !!variantAddon;
    const [addon, setAddon] = useState<Addon | null>(null);

    const handleAddonChange = (ad: Addon | null) => {
        setAddon(ad);
        setData('addon_id', ad ? ad.id : '');
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('variant-addons.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => onClose()
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">{isEdit ? `Editar` : 'Adicionar'} addon da variante</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="addon_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Addon
                                </label>
                                <SearchableAddonsSelect
                                    selectedAddon={addon}
                                    setAddon={handleAddonChange}
                                    isDisabled={processing}
                                />
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Quantidade (Máxima)
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    min={0.01}
                                    step={0.01}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Preço (opcional)
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    min={0}
                                    step={0.01}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    disabled={processing}
                                />
                            </div>
                            <div className="mt-3 flex justify-end items-center gap-2">
                                <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                                <PrimaryButton onClick={submit}>{isEdit ? 'Salvar' : 'Iniciar'}</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
