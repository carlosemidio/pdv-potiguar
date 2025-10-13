import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Product } from '@/types/Product';
import { Category } from '@/types/Category';
import { Brand } from '@/types/Brand';
import SearchableCategoriesSelect from '@/Components/SearchableCategoriesSelect';
import SearchableBrandsSelect from '@/Components/SearchableBrandsSelect';

export default function Edit({
    auth,
    product
}: PageProps<{ product: { data: Product} }>) {
    const isEdit = !!product;
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        _method: product ? 'patch' : 'post',
        category_id: product ? product.data.category_id : null,
        brand_id: product ? product.data.brand_id : null,
        name: product ? product.data.name : '',
        short_description: product ? product.data.short_description : '',
        description: product ? product.data.description : '',
    });

    const [category, setCategory] = useState<Category | null>(product ? product.data.category : null);
    const [brand, setBrand] = useState<Brand | null>(product ? product.data.brand : null);

    const handleCategoryChange = (selectedCategory: Category | null) => {
        setCategory(selectedCategory);
        setData('category_id', selectedCategory ? selectedCategory.id : null);
    };

    const handleBrandChange = (selectedBrand: Brand | null) => {
        setBrand(selectedBrand);
        setData('brand_id', selectedBrand ? selectedBrand.id : null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('product.update', product.data.id), {
                preserveScroll: true,
                onSuccess: () => setData({
                    _method: product ? 'patch' : 'post',
                    name: '',
                    short_description: '',
                    description: '',
                    category_id: null,
                    brand_id: null,
                }),
            });
        } else {
            post(route('product.store'));
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'size': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['blockquote', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
        ],
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="">
                    {isEdit ? `Editar produto` : 'Criar produto'}
                </h2>
            }
        >
            <Head title={isEdit ? 'Editar produto' : 'Criar produto'} />
            
            <section className='px-2 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto">

                    <div className="mb-4">
                        <Link href={route('product.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white border p-3 rounded dark:border-gray-600 dark:bg-slate-800'>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">                            
                            <div className="w-full col-span-1 md:col-span-2 lg:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className='w-full'>
                                        <InputLabel htmlFor="name" value="Nome" />

                                        <TextInput
                                            id="name"
                                            className="mt-1 w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            isFocused
                                            autoComplete="name"
                                        />

                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    <div className='w-full'>
                                        <InputLabel htmlFor="category_id" value="Categoria" />

                                        <SearchableCategoriesSelect selectedCategory={category} setCategory={handleCategoryChange} isDisabled={processing} />

                                        <InputError className="mt-2" message={errors.category_id} />
                                    </div>

                                    <div className='w-full'>
                                        <InputLabel htmlFor="brand_id" value="Marca" />

                                        <SearchableBrandsSelect selectedBrand={brand} setBrand={handleBrandChange} isDisabled={processing} />

                                        <InputError className="mt-2" message={errors.brand_id} />
                                    </div>

                                    <div className='col-span-1 md:col-span-2 lg:col-span-3'>
                                        <InputLabel htmlFor="short_description" value="Descrição curta (Cards)" />

                                        <textarea
                                            id="short_description"
                                            className="mt-1 block w-full rounded border-gray-300 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-200"
                                            value={data.short_description}
                                            onChange={(e) => setData('short_description', e.target.value)}
                                            autoComplete="short_description"
                                            rows={4}
                                            maxLength={255}
                                        />

                                        <div className="text-xs text-gray-500 dark:text-gray-400 text-left">
                                            {data?.short_description?.length ? data.short_description.length : 0}/255
                                        </div>

                                        <InputError className="mt-2" message={errors.short_description} />
                                    </div>

                                    <div className="w-full col-span-1 md:col-span-2 lg:col-span-3 min-h-[200px]">
                                        <label htmlFor="largeText" className="block font-medium text-sm text-gray-700">
                                            Descrição completa (Detalhes)
                                        </label>
                                        <ReactQuill
                                            theme="snow"
                                            defaultValue={data.description}
                                            onChange={(value) => setData('description', value)}
                                            modules={modules}
                                            style={{ height: "auto" }}
                                            className="bg-white break-all text-black shadow-md rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-start col-span-1 md:col-span-2 lg:col-span-3'>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {isEdit ? 'Salvar' : 'Cadastrar produto'}
                                </PrimaryButton>
                            </div>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {isEdit ? 'Produto atualizado com sucesso' : 'Produto cadastrado com sucesso!'}
                                </p>
                            </Transition>

                        </form>
                    </div>

                </div>
            </section>

        </AuthenticatedLayout>
    )
}