import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Addon } from "@/types/Addon";
import SearchableAddonsSelect from "../SearchableAddonsSelect";

interface AddonGroupOptionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    addon_group_id: number;
}

export default function AddonGroupOptionFormModal({
    isOpen,
    onClose,
    addon_group_id
}: AddonGroupOptionFormModalProps) {
    const { data, setData, post, processing } = useForm({
        addon_group_id: addon_group_id,
        addon_id: 0,
        additional_price: '',
    });

    const [addon, setAddon] = useState<Addon | null>(null);

    const handleAddonChange = (selectedAddon: Addon | null) => {
        setAddon(selectedAddon);
        setData('addon_id', selectedAddon ? selectedAddon.id : 0);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('addon-group-options.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData({
                    addon_group_id: 0,
                    addon_id: 0,
                    additional_price: '',
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
                            <SearchableAddonsSelect
                                selectedAddon={addon}
                                setAddon={handleAddonChange}
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
