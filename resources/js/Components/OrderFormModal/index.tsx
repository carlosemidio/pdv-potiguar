import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { Order } from "@/types/Order";
import { FormEventHandler, useEffect, useState } from "react";
import { Table } from "@/types/Table";
import { Customer } from "@/types/Customer";
import SearchableCustomersSelect from "../SearchableCustomersSelect";

interface OrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    tables: Table[];
    order: Order | null;
}

export default function OrderFormModal({ isOpen, onClose, tables, order }: OrderFormModalProps) {
    const { data, setData, patch, post, processing } = useForm({
        table_id: order?.table_id ?? '',
        customer_id: order?.customer_id ?? ''
    });

    const isEdit = !!order;
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(order?.customer ?? null);

    // Keep local state and form data in sync when opening for edit or switching orders
    useEffect(() => {
        setSelectedCustomer(order?.customer ?? null);
        setData((prevData) => ({...prevData, customer_id: order?.customer_id ?? '', table_id: order?.table_id ?? ''})); 
    }, [order]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('orders.update', order!.id));
        } else {
            post(route('orders.store'));
        }
    };

    return <>
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">{ isEdit ? `Editar Pedido - ${order!.number}` : 'Novo Pedido' }</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3"> 
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            {tables.length > 0 && (
                                <div>
                                    <label htmlFor="table_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Mesa
                                    </label>
                                    <select
                                        id="table_id"
                                        className="mt-1 block w-full rounded border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                                        value={data.table_id}
                                        onChange={(e) => setData('table_id', Number(e.target.value))}
                                    >
                                        <option value="">Selecione uma mesa</option>
                                        {tables.map(table => (
                                            <option key={table.id} value={table.id}>
                                                {table.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <SearchableCustomersSelect
                                    selectedCustomer={selectedCustomer}
                                    setCustomer={(customer) => {
                                        setSelectedCustomer(customer);
                                        setData('customer_id', customer.id);
                                    }}
                                    isDisabled={processing}
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
    </>
}