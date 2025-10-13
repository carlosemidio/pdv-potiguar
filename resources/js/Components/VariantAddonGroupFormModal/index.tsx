import { Button } from "@headlessui/react";
import { X, Plus, Tag, CheckSquare, Hash, Save } from "lucide-react";
import Modal from "../Modal";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface VariantAddonGroupFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    sp_variant_id: number;
}

export default function VariantAddonGroupFormModal({
    isOpen,
    onClose,
    sp_variant_id
}: VariantAddonGroupFormModalProps) {
    const { data, setData, post, processing } = useForm({
        sp_variant_id: sp_variant_id,
        name: '',
        is_required: false,
        min_options: 0,
        max_options: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('variant-addon-groups.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData({
                    sp_variant_id: sp_variant_id,
                    name: '',
                    is_required: false,
                    min_options: 0,
                    max_options: 0,
                });
                onClose();
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full mx-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Adicionar Grupo de Complementos
                                </h3>
                                <p className="text-pink-100 text-sm">
                                    Configure um novo grupo de complementos
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={onClose}
                            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-white" />
                        </Button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Nome do Grupo */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <Tag className="h-5 w-5 text-pink-600" />
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Nome do Grupo
                                </h4>
                            </div>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="Ex: Molhos, Extras"
                                required
                                disabled={processing}
                            />
                        </div>

                        {/* Configurações de Seleção */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <CheckSquare className="h-5 w-5 text-pink-600" />
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Configurações de Seleção
                                </h4>
                            </div>

                            {/* Seleção Obrigatória */}
                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                                <input
                                    type="checkbox"
                                    id="is_required"
                                    checked={data.is_required}
                                    onChange={(e) => setData('is_required', e.target.checked)}
                                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                    disabled={processing}
                                />
                                <label htmlFor="is_required" className="text-sm font-medium text-gray-700">
                                    Seleção obrigatória
                                </label>
                            </div>

                            {/* Limites de Seleção */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Hash className="h-4 w-4 text-pink-600" />
                                        <label htmlFor="min_options" className="text-sm font-medium text-gray-700">
                                            Mínimo de opções
                                        </label>
                                    </div>
                                    <input
                                        type="number"
                                        id="min_options"
                                        min={0}
                                        value={data.min_options}
                                        onChange={(e) => setData('min_options', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="0"
                                        required
                                        disabled={processing}
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Hash className="h-4 w-4 text-pink-600" />
                                        <label htmlFor="max_options" className="text-sm font-medium text-gray-700">
                                            Máximo de opções
                                        </label>
                                    </div>
                                    <input
                                        type="number"
                                        id="max_options"
                                        min={0}
                                        value={data.max_options}
                                        onChange={(e) => setData('max_options', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="0"
                                        required
                                        disabled={processing}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {processing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        <span>Salvar</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}
