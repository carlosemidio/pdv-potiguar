import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SearchableCategoriesSelect from '@/Components/SearchableCategoriesSelect';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Category } from '@/types/Category';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Edit({
    auth,
    category
}: PageProps<{ category?: { data: Category }, parentCategories?: Category[] }>) {
    const isEdit = !!category;

    const { data, setData, patch, post, errors, processing } = useForm({
        name: category ? category.data.name : '',
        parent_id: category ? category.data.parent_id ?? '' : '',
        status: category ? category.data.status ?? '1' : '1',
    });

    const [parent, setParent] = useState<Category | null>(
        category && category.data.parent
            ? category.data.parent
            : null
    );

    const handleParentChange = (selectedCategory: Category | null) => {
        setParent(selectedCategory);
        setData('parent_id', selectedCategory ? selectedCategory.id : '');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('categories.update', category!.data.id));
        } else {
            post(route('categories.store'));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    { isEdit ? `Editar Categoria - ${category!.data.name}` : 'Nova Categoria' }
                </h2>
            }
        >
            <Head title={ isEdit ? 'Editar Categoria' : 'Criar Categoria' } />

            <section className='px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto sm:px-2 lg:px-2">
                    <div className="mb-4">
                        <Link href={ route('categories.index') }>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white dark:bg-gray-800 rounded p-3'>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Nome da Categoria" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    isFocused
                                    autoComplete="name"
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className='w-full'>
                                <InputLabel htmlFor="parent_id" value="Categoria Pai (opcional)" />
                                <SearchableCategoriesSelect selectedCategory={parent} setCategory={handleParentChange} isDisabled={processing} />

                                <InputError className="mt-2" message={errors.parent_id} />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Status" />
                                <select
                                    id="status"
                                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    required
                                >
                                    <option value="1">Ativo</option>
                                    <option value="0">Inativo</option>
                                </select>
                                <InputError className="mt-2" message={errors.status} />
                            </div>

                            <div className='flex justify-end'>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {isEdit ? 'Salvar' : 'Criar'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}