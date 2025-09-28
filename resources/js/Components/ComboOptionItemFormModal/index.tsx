import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { StoreProductVariant } from "@/types/StoreProductVariant";
import SearchableStoreProductVariantsSelect from "../SearchableStoreProductVariantsSelect";

interface ComboOptionItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    option_group_id: number;
}

export default function ComboOptionItemFormModal({
    isOpen,
    onClose,
    option_group_id
}: ComboOptionItemFormModalProps) {
    const { data, setData, post, processing } = useForm({
        option_group_id: option_group_id,
        sp_variant_id: 0,
        additional_price: '',
        quantity: ''
    });

    const [variant, setVariant] = useState<StoreProductVariant | null>(null);

    const handleVariantChange = (value: StoreProductVariant | null) => {
        setVariant(value);
        setData("sp_variant_id", value ? value.id : 0);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('combo-option-items.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData({
                    option_group_id: option_group_id,
                    sp_variant_id: 0,
                    additional_price: '',
                    quantity: '',
                });
                onClose();
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">Adicionar Opção</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <SearchableStoreProductVariantsSelect
                                selectedVariant={variant}
                                setVariant={handleVariantChange}
                                isDisabled={processing}
                            />
                            <div>
                                <label htmlFor="additional_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Preço adicional
                                </label>
                                <input
                                    type="number"
                                    id="additional_price"
                                    min={0}
                                    step={0.01}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.additional_price}
                                    onChange={(e) => setData('additional_price', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Quantidade
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    min={1}
                                    step={1}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    required
                                    disabled={processing}
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
