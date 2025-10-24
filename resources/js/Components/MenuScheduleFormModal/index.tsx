import { X, Clock } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import InputError from "../InputError";
import MenuSchedule from "@/types/MenuSchedule";

interface MenuScheduleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    menuId: number;
    schedule?: MenuSchedule;
}

export default function MenuScheduleFormModal({
    isOpen,
    onClose,
    menuId,
    schedule,
}: MenuScheduleFormModalProps) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        menu_id: menuId,
        start_at: schedule?.start_at ?? "",
        end_at: schedule?.end_at ?? "",
    });

    const isEdit = !!schedule;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('menu.schedules.store', menuId), {
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
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                {isEdit ? "Editar Horário" : "Novo Horário"}
                            </h3>
                            <p className="text-indigo-100 text-sm">
                                Defina o dia e o intervalo de funcionamento deste menu
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="start_at"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Início
                            </label>
                            <input
                                type="datetime-local"
                                id="start_at"
                                value={data.start_at}
                                onChange={(e) => setData("start_at", e.target.value)}
                                required
                                disabled={processing}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <InputError message={errors.start_at} />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="end_at"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Fim
                            </label>
                            <input
                                type="datetime-local"
                                id="end_at"
                                value={data.end_at}
                                onChange={(e) => setData("end_at", e.target.value)}
                                required
                                disabled={processing}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <InputError message={errors.end_at} />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <SecondaryButton type="button" onClick={onClose}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-indigo-600 to-blue-600"
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
