import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { Printer } from "@/types/Printer";
import Swal from 'sweetalert2';
import { FormEventHandler, useState } from "react";
import SearchablePrintersSelect from "../SearchablePrintersSelect";
import { Order } from "@/types/Order";
import { useForm } from "@inertiajs/react";

interface PrintOrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
}

export default function PrintOrderFormModal({ isOpen, onClose, order }: PrintOrderFormModalProps) {
    const { data, setData, patch, post, processing, errors, reset } = useForm({
        printer_id: '',
        order_id: order.id,
    });

    const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!selectedPrinter) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Selecione uma impressora para continuar.',
            });
            return;
        }

        post(route('order.print', { orderId: order.id, printerId: selectedPrinter.id }), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso',
                    text: 'Pedido enviado para impressão.',
                });
                setData({ printer_id: '', order_id: order.id });
                setSelectedPrinter(null);
                onClose();
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Houve um erro ao enviar o pedido para impressão.',
                });
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">Imprimir Pedido #{order?.id}</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="space-y-3">
                        <form className="space-y-4" onSubmit={submit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Selecionar Impressora
                                </label>
                                <div className="mt-1">
                                    <SearchablePrintersSelect
                                        selectedPrinter={selectedPrinter}
                                        setPrinter={(printer) => {
                                            setSelectedPrinter(printer);
                                            setData('printer_id', printer ? String(printer.id) : '');
                                        }}
                                        isDisabled={false}
                                    />
                                </div>
                            </div>
                            <div className="mt-3 flex justify-end items-center gap-2">
                                <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing}>Imprimir</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
