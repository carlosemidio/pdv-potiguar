import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import { Category } from "@/types/Category";
import SearchableCategoriesSelect from "../SearchableCategoriesSelect";

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
}

export default function CategoryFormModal({ isOpen, onClose, category }: CategoryFormModalProps) {
    const { data, setData, patch, post, processing } = useForm({
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

        console.log('Selected Category:', selectedCategory);

        setData('parent_id', selectedCategory ? selectedCategory.id : null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            patch(route('categories.update', category!.id),
                {
                    preserveScroll: true,
                    preserveState: false,
                }
            );
        } else {
            post(route('categories.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    return <>
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-3">
                <div className="flex justify-between">
                    <p className="text-lg">{ isEdit ? `Editar Categoria` : 'Nova Categoria' }</p>
                    <Button onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
                <div className="mt-3"> 
                    <div className="space-y-3">
                        <form onSubmit={submit} className="space-y-4">
                            <SearchableCategoriesSelect
                                selectedCategory={parentCategory || null}
                                setCategory={handleCategoryChange}
                                isDisabled={processing}
                            />

                            <div className="mt-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nome da Categoria
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

                            <div className="mt-2">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.status}
                                    onChange={(e) => setData('status', Number(e.target.value))}
                                    required
                                    disabled={processing}
                                >
                                    <option value={1}>Ativo</option>
                                    <option value={0}>Inativo</option>
                                </select>
                            </div>

                            <div className="mt-3 flex justify-end items-center gap-2">
                                <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                                <PrimaryButton onClick={submit}>{isEdit ? 'Salvar' : 'Criar'}</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    </>
}