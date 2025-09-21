import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { useEffect } from "react";
import { Table } from "@/types/Table";

interface TableFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    table?: Table | null;
}

export default function TableFormModal({ isOpen, onClose, table }: TableFormModalProps) {
    const { data, setData, patch, post, processing } = useForm({
        name: table?.name ?? '',
    });

    useEffect(() => {
        setData({
            name: table?.name ?? '',
        });
    }, [table]);

    const isEdit = !!table;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('tables.update', table!.id), {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => onClose()
            });
        } else {
            post(route('tables.store'), {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => onClose()
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">{isEdit ? `Editar` : 'Adicionar'} mesa</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nome da Mesa
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
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
