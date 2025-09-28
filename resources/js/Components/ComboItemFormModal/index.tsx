import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import SearchableStoreProductVariantsSelect from "../SearchableStoreProductVariantsSelect";
import { StoreProductVariant } from "@/types/StoreProductVariant";

interface ComboItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    sp_variant_id: number;
    item_variant_id?: number;
    quantity?: number;
}

export default function ComboItemFormModal({
    isOpen,
    onClose,
    sp_variant_id,
    item_variant_id,
    quantity
}: ComboItemFormModalProps) {
    const { data, setData, post, processing } = useForm({
        sp_variant_id: sp_variant_id,
        item_variant_id: item_variant_id ?? 0,
        quantity: quantity
    });

    const [variant, setVariant] = useState<StoreProductVariant | null>(null);

    const handleVariantChange = (value: StoreProductVariant | null) => {
        setVariant(value);
        setData("item_variant_id", value ? value.id : 0);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('combo-items.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData({
                    sp_variant_id: sp_variant_id,
                    item_variant_id: item_variant_id ?? 0,
                    quantity: quantity
                });
                onClose();
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">Adicionar Opção Fixa</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Produto
                                </label>
                                <SearchableStoreProductVariantsSelect
                                    selectedVariant={variant}
                                    setVariant={handleVariantChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Quantidade
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    id="quantity"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', parseInt(e.target.value))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                                    min={1}
                                    required
                                />
                            </div>

                            <div className="mt-3 flex justify-end items-center gap-2">
                                <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                                <PrimaryButton onClick={submit}>Salvar</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
