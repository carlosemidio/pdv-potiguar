import { Button } from "@headlessui/react";
import { X, Tag, Folder, ToggleLeft, ToggleRight } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { FormEventHandler, useEffect, useState } from "react";
import { Category } from "@/types/Category";
import SearchableCategoriesSelect from "../SearchableCategoriesSelect";

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
}

export default function CategoryFormModal({ isOpen, onClose, category }: CategoryFormModalProps) {
    const { data, setData, patch, post, processing, errors, reset } = useForm({
        parent_id: category?.parent?.id ?? null,
        name: category?.name ?? '',
        status: category?.status ?? 1,
    });

    const isEdit = !!category;
    const [parentCategory, setParentCategory] = useState<Category | null>(category?.parent ?? null);

    // Sincroniza dados do formulário e parentCategory ao mudar a categoria
    useEffect(() => {
        setData({
            parent_id: category?.parent?.id ?? null,
            name: category?.name ?? '',
            status: category?.status ?? 1,
        });
        setParentCategory(category?.parent ?? null);
    }, [category]);

    const handleCategoryChange = (selectedCategory: Category | null) => {
        setParentCategory(selectedCategory);
        setData('parent_id', selectedCategory ? selectedCategory.id : null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            patch(route('categories.update', category!.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        } else {
            post(route('categories.store'), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="bg-white dark:bg-gray-800 shadow-xl w-full rounded-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Tag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {isEdit ? 'Editar Categoria' : 'Nova Categoria'}
                                </h3>
                                <p className="text-purple-100 text-sm">
                                    {isEdit ? 'Atualize as informações da categoria' : 'Adicione uma nova categoria ao sistema'}
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
                </div>

                {/* Form Content */}
                <form onSubmit={submit} className="p-6 space-y-6">
                    {/* Categoria Pai */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Folder className="w-4 h-4" />
                            Categoria Pai (Opcional)
                        </label>
                        <SearchableCategoriesSelect
                            selectedCategory={parentCategory || null}
                            setCategory={handleCategoryChange}
                            isDisabled={processing}
                        />
                        <InputError className="mt-1" message={errors.parent_id} />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Deixe vazio para criar uma categoria principal
                        </p>
                    </div>

                    {/* Nome da Categoria */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Tag className="w-4 h-4" />
                            Nome da Categoria
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Ex: Bebidas, Pizzas, Sobremesas..."
                            disabled={processing}
                        />
                        <InputError className="mt-1" message={errors.name} />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label htmlFor="status" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {data.status === 1 ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            Status da Categoria
                        </label>
                        <select
                            id="status"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            value={data.status}
                            onChange={(e) => setData('status', Number(e.target.value))}
                            required
                            disabled={processing}
                        >
                            <option value={1}>🟢 Ativo - Visível no sistema</option>
                            <option value={0}>🔴 Inativo - Oculto do sistema</option>
                        </select>
                        <InputError className="mt-1" message={errors.status} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <SecondaryButton 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5"
                        >
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton 
                            type="submit" 
                            disabled={processing}
                            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500"
                        >
                            {processing ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar Categoria')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}