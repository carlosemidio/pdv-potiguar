import { X, CalendarDays } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import InputError from "../InputError";
import MenuDay from "@/types/MenuDay";

interface MenuDayFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    menuId: number;
    day?: MenuDay;
}

export default function MenuDayFormModal({
    isOpen,
    onClose,
    menuId,
    day,
}: MenuDayFormModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        menu_id: menuId,
        weekday: day?.weekday ?? 1,
        opens_at: day?.opens_at ?? "",
        closes_at: day?.closes_at ?? "",
    });

    const isEdit = !!day;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('menu.days.store', menuId), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="bg-white dark:bg-gray-800 shadow-xl w-full rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <CalendarDays className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                {isEdit ? "Editar Dia" : "Novo Dia"}
                            </h3>
                            <p className="text-amber-100 text-sm">
                                Configure o dia e os horários fixos de funcionamento
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-6">
                    {/* Dia da semana */}
                    <div className="space-y-2">
                        <label
                            htmlFor="weekday"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Dia da semana
                        </label>
                        <select
                            id="weekday"
                            value={data.weekday}
                            onChange={(e) => setData("weekday", Number(e.target.value))}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                            disabled={processing}
                        >
                            <option value={1}>Segunda-feira</option>
                            <option value={2}>Terça-feira</option>
                            <option value={3}>Quarta-feira</option>
                            <option value={4}>Quinta-feira</option>
                            <option value={5}>Sexta-feira</option>
                            <option value={6}>Sábado</option>
                            <option value={0}>Domingo</option>
                        </select>
                        <InputError message={errors.weekday} />
                    </div>

                    {/* Horários */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="opens_at"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Abertura
                            </label>
                            <input
                                type="time"
                                id="opens_at"
                                value={data.opens_at}
                                onChange={(e) => setData("opens_at", e.target.value)}
                                required
                                disabled={processing}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                            <InputError message={errors.opens_at} />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="closes_at"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Fechamento
                            </label>
                            <input
                                type="time"
                                id="closes_at"
                                value={data.closes_at}
                                onChange={(e) => setData("closes_at", e.target.value)}
                                required
                                disabled={processing}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                            <InputError message={errors.closes_at} />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <SecondaryButton type="button" onClick={onClose}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-amber-600 to-orange-600"
                        >
                            {processing
                                ? "Salvando..."
                                : isEdit
                                ? "Atualizar"
                                : "Cadastrar"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
