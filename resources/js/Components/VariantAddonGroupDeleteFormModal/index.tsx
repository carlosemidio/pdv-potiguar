import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { VariantAddonGroup } from "@/types/VariantAddonGroup";
import Swal from "sweetalert2";

interface VariantAddonGroupDeleteFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    variantAddonGroups?: VariantAddonGroup[] | null;
}

export default function VariantAddonGroupDeleteFormModal({
    isOpen,
    onClose,
    variantAddonGroups,
}: VariantAddonGroupDeleteFormModalProps) {
    const { data, setData, post, processing } = useForm({
        _method: 'delete',
        id: 0,
    });

    const handleAddonGroupChange = (id: number) => {
        setData('id', id);
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.id) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Por favor, selecione um grupo de adicionais para remover.',
            });
            return;
        }

        post(route('variant-addon-groups.destroy', data.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData('id', 0);
                onClose();
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">Remover grupo de adicionais</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="addon_group_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Grupo de adicionais
                                </label>
                                <select
                                    id="addon_group_id"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.id}
                                    onChange={(e) => handleAddonGroupChange(Number(e.target.value))}
                                    required
                                    disabled={processing}
                                >
                                    <option value="">Selecione...</option>
                                    {variantAddonGroups?.map(variantAddonGroup => (
                                        <option key={variantAddonGroup.id} value={variantAddonGroup.id}>
                                            {variantAddonGroup.name
                                                ? `${variantAddonGroup.name}`
                                                : `Grupo desconhecido`
                                            }
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-3 flex justify-end items-center gap-2">
                                <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                                <PrimaryButton onClick={submit}>Excluir</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
