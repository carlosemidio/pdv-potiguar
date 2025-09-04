import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Switch, Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MdCheckBox, MdDelete } from "react-icons/md";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { FilePondFile } from 'filepond'
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Product } from '@/types/Product';
import { Category } from '@/types/Category';
import { Brand } from '@/types/Brand';
import SearchableCategoriesSelect from '@/Components/SearchableCategoriesSelect';
import SearchableBrandsSelect from '@/Components/SearchableBrandsSelect';
import ProductVariantForm from '@/Components/ProductVariantForm';
registerPlugin(FilePondPluginImagePreview);

export default function Edit({
    auth,
    product
}: PageProps<{ product: { data: Product} }>) {

    const isEdit = !!product;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: product ? 'patch' : 'post',
            category_id: product ? product.data.category_id : null,
            brand_id: product ? product.data.brand_id : null,
            name: product ? product.data.name : '',
            short_description: product ? product.data.short_description : '',
            description: product ? product.data.description : '',
            sku: product ? product.data.sku : '',
            price: product ? product.data.price : 0,
            stock_quantity: product ? product.data.stock_quantity : null,
            status: product ? product.data.status : 1, // Default to active
            featured: product ? product.data.featured : 0,
            variants: product ? product.data.variants : [],
            files: Array<File>(),
        });

    const [category, setCategory] = useState<Category | null>(product ? product.data.category : null);
    const [brand, setBrand] = useState<Brand | null>(product ? product.data.brand : null);
    const [files, setFiles] = useState<File[]>([]);

    const [selectedTab, setSelectedTab] = useState<string>('Geral');

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

        // Prepare files for upload
        data.files = files;

        if (isEdit) {
            post(route('product.update', product.data.id), {
                preserveScroll: true,
                onSuccess: () => setData({
                    _method: product ? 'patch' : 'post',
                    name: '',
                    short_description: '',
                    description: '',
                    sku: '',
                    price: 0,
                    stock_quantity: null,
                    status: 1,
                    featured: 0,
                    category_id: null,
                    brand_id: null,
                    variants: [],
                    files: [],
                }),
            });
        } else {
            post(route('product.store'));
        }
    };

    const handleDeleteFile = (fileId: number) => {
        data._method = 'delete';
        post(route('file.destroy', fileId));
    }

    const handleSetFileAsDefault = (fileId: number) => {
        data._method = 'post';
        post(route('file.setAsDefault', fileId));
    }

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
            header={
                <h2 className="">
                    {isEdit ? `Editar produto: ${product.data.name}` : 'Criar produto'}
                </h2>
            }
        >
            <Head title={isEdit ? 'Editar produto' : 'Criar produto'} />
            
            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto">

                    <div className="mb-4">
                        <Link href={route('product.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white border p-3 rounded dark:border-gray-600 dark:bg-slate-800'>
                        <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">                            
                            <div className="w-full col-span-1 md:col-span-2 lg:col-span-3">
                                {/* Tabs */}
                                <div className="mb-6">
                                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                                        {['Geral', 'Variantes', 'Imagens'].map((tab) => (
                                            <button
                                                key={tab}
                                                type="button"
                                                className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors duration-200
                                                    ${selectedTab === tab
                                                        ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                                        : 'border-transparent text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                                                    }`}
                                                onClick={() => setSelectedTab(tab)}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tab Content */}
                                {selectedTab === 'Geral' && (
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

                                        <div className="w-full">
                                            <InputLabel htmlFor="status" value="Status" />

                                            <Switch
                                                checked={data.status === 1}
                                                onChange={(checked) => setData('status', checked ? 1 : 0)}
                                                className="mt-2 group inline-flex h-6 w-11 items-center rounded-full bg-gray-100 dark:bg-gray-600 transition data-[checked]:bg-green-600">
                                                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                                            </Switch>
                                            <InputError className="mt-2" message={errors.status} />
                                        </div>


                                        <div className='col-span-1 md:col-span-2 lg:col-span-3'>
                                            <InputLabel htmlFor="short_description" value="Descrição curta (Cards)" />

                                            <textarea
                                                id="short_description"
                                                className="mt-1 block w-full rounded border-gray-300 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-200"
                                                value={data.short_description}
                                                onChange={(e) => setData('short_description', e.target.value)}
                                                required
                                                autoComplete="short_description"
                                                rows={4}
                                                maxLength={255}
                                            />

                                            <div className="text-xs text-gray-500 dark:text-gray-400 text-left">
                                                {data.short_description.length}/255
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

                                        <div className='w-full'>
                                            <InputLabel htmlFor="sku" value="SKU" />

                                            <TextInput
                                                id="sku"
                                                className="mt-1 block w-full"
                                                value={data.sku ?? ''}
                                                onChange={(e) => setData('sku', e.target.value)}
                                                autoComplete="sku"
                                            />

                                            <InputError className="mt-2" message={errors.sku} />
                                        </div>

                                        <div className='w-full'>
                                            <InputLabel htmlFor="price" value="Preço" />

                                            <TextInput
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="mt-1 block w-full"
                                                value={data.price ?? ''}
                                                onChange={(e) => setData('price', parseFloat(e.target.value))}
                                                autoComplete="price"
                                            />

                                            <InputError className="mt-2" message={errors.price} />
                                        </div>

                                        <div className='w-full'>
                                            <InputLabel htmlFor="stock_quantity" value="Quantidade em estoque" />

                                            <TextInput
                                                id="stock_quantity"
                                                type="number"
                                                className="mt-1 block w-full"
                                                value={data.stock_quantity ?? ''}
                                                onChange={(e) => setData('stock_quantity', e.target.value ? parseInt(e.target.value) : null)}
                                                autoComplete="stock_quantity"
                                            />

                                            <InputError className="mt-2" message={errors.stock_quantity} />
                                        </div>

                                        <div className='w-full'>
                                            <InputLabel htmlFor="featured" value="Destaque" />

                                            <Switch
                                                checked={data.featured === 1}
                                                onChange={(checked) => setData('featured', checked ? 1 : 0)}
                                                className="mt-2 group inline-flex h-6 w-11 items-center rounded-full bg-gray-100 dark:bg-gray-600 transition data-[checked]:bg-green-600">
                                                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                                            </Switch>
                                            <InputError className="mt-2" message={errors.featured} />
                                        </div>
                                    </div>                         
                                )}

                                {selectedTab === 'Variantes' && (
                                    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <div className="w-full col-span-1 md:col-span-2 lg:col-span-3">
                                            <ProductVariantForm
                                                variants={data.variants ?? []}
                                                onChange={newVariants => setData('variants', newVariants)}
                                            />
                                            <InputError className="mt-2" message={errors.variants} />
                                        </div>
                                    </div>
                                )}

                                {selectedTab === 'Imagens' && (
                                    <div className="w-full col-span-1 md:col-span-2 lg:col-span-3">
                                        <label className="block font-medium text-xl text-gray-700 mt-10">Imagem principal (Card da listagem)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {product?.data?.image && (
                                                <div className="w-1/4 h-24 bg-gray-200 rounded-lg flex justify-center items-center relative mr-2">
                                                    <img src={product?.data?.image?.file_url} alt={product?.data?.image?.name} className="h-24 w-full object-cover rounded-lg" />
                                                    <span
                                                        onClick={() => {
                                                            if (product?.data?.image?.id !== undefined) {
                                                                handleDeleteFile(product.data.image.id);
                                                            }
                                                        }}
                                                        className="w-9 h-9 transition-all duration-200 flex justify-center items-center rounded-bl-2xl hover:text-red-600 text-gray-800 bg-slate-300/50 absolute top-0 right-0">
                                                        <MdDelete />
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <label className="block font-medium text-xl text-gray-700 mt-10">Galeria</label>
                                        <div className="flex flex-wrap gap-2 mb-10">
                                            {product?.data?.images && product?.data?.images.map((image, index) => (
                                                <div key={index} className="w-1/4 h-24 bg-gray-200 rounded-lg flex justify-center items-center relative mr-2">
                                                    <img src={image?.file_url} alt={image?.name} className="h-24 w-full object-cover rounded-lg" />
                                                    <span
                                                        onClick={() => handleDeleteFile(image?.id)}
                                                        className="w-9 h-9 transition-all duration-200 flex justify-center items-center rounded-bl-2xl hover:text-red-600 text-gray-800 bg-slate-300/50 absolute top-0 right-0">
                                                        <MdDelete />
                                                    </span>

                                                    <span className="w-9 h-9 transition-all duration-200 flex justify-center items-center rounded-bl-2xl hover:text-red-600 text-gray-800 bg-slate-300/50 absolute top-0 left-0"
                                                        onClick={() => handleSetFileAsDefault(image?.id)}>
                                                        <MdCheckBox />
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <FilePond
                                            files={files}
                                            onupdatefiles={(fileItems: FilePondFile[]) => {
                                                setFiles(fileItems.map(fileItem => fileItem.file) as File[]);
                                            }}
                                            allowMultiple={true}
                                            maxFiles={10}
                                            labelIdle='Arraste e solte arquivos ou <span class="filepond--label-action">Selecione</span>'
                                        />
                                    </div>
                                )}
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