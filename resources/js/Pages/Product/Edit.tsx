import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
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
import { Package, Save, ArrowLeft, Tag, Building, FileText, Edit3 } from 'lucide-react';

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
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {isEdit ? 'Editar Produto' : 'Criar Produto'}
                    </h2>
                </div>
            }
        >
            <Head title={isEdit ? 'Editar produto' : 'Criar produto'} />
            
            <section className='px-2 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto space-y-6">
                    {/* Botão Voltar */}
                    <div className="flex items-center">
                        <Link href={route('product.index')}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                                <ArrowLeft className="w-4 h-4" />
                                Voltar
                            </button>
                        </Link>
                    </div>

                    {/* Card Principal */}
                    <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-2xl shadow-lg'>
                        <form onSubmit={submit} className="space-y-6">                            
                            {/* Campos Principais */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Nome do Produto */}
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <InputLabel htmlFor="name" value="Nome do Produto" className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-3">
                                        <Tag className="w-4 h-4" />
                                        Nome do Produto
                                    </InputLabel>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <TextInput
                                            id="name"
                                            className="pl-11 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            isFocused
                                            autoComplete="name"
                                            placeholder="Digite o nome do produto"
                                        />
                                    </div>
                                    <InputError className="mt-2" message={errors.name} />
                                </div>

                                {/* Categoria */}
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <InputLabel htmlFor="category_id" value="Categoria" className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-3">
                                        <Package className="w-4 h-4" />
                                        Categoria
                                    </InputLabel>
                                    <SearchableCategoriesSelect 
                                        selectedCategory={category} 
                                        setCategory={handleCategoryChange} 
                                        isDisabled={processing} 
                                    />
                                    <InputError className="mt-2" message={errors.category_id} />
                                </div>

                                {/* Marca */}
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <InputLabel htmlFor="brand_id" value="Marca" className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-3">
                                        <Building className="w-4 h-4" />
                                        Marca
                                    </InputLabel>
                                    <SearchableBrandsSelect 
                                        selectedBrand={brand} 
                                        setBrand={handleBrandChange} 
                                        isDisabled={processing} 
                                    />
                                    <InputError className="mt-2" message={errors.brand_id} />
                                </div>
                            </div>

                            {/* Descrição Curta */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                <InputLabel htmlFor="short_description" value="Descrição Curta" className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-3">
                                    <FileText className="w-4 h-4" />
                                    Descrição Curta (Cards)
                                </InputLabel>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <textarea
                                        id="short_description"
                                        className="pl-11 block w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 bg-white text-gray-900 transition-colors duration-200 resize-none"
                                        value={data.short_description}
                                        onChange={(e) => setData('short_description', e.target.value)}
                                        autoComplete="short_description"
                                        rows={4}
                                        maxLength={255}
                                        placeholder="Descrição que aparecerá nos cards de produto..."
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <InputError message={errors.short_description} />
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {(data?.short_description?.length || 0)}/255 caracteres
                                    </div>
                                </div>
                            </div>

                            {/* Descrição Completa */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                <InputLabel htmlFor="description" className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-3">
                                    <Edit3 className="w-4 h-4" />
                                    Descrição Completa (Detalhes)
                                </InputLabel>
                                <div className="min-h-[200px]">
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

                            {/* Botão de Submissão */}
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            {isEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
                                        </>
                                    )}
                                </button>

                                {/* Mensagem de Sucesso */}
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out duration-300"
                                    enterFrom="opacity-0 transform translate-x-4"
                                    enterTo="opacity-100 transform translate-x-0"
                                    leave="transition ease-in-out duration-300"
                                    leaveTo="opacity-0 transform translate-x-4"
                                >
                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <p className="text-sm font-medium">
                                            {isEdit ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!'}
                                        </p>
                                    </div>
                                </Transition>
                            </div>

                        </form>
                    </div>

                </div>
            </section>

        </AuthenticatedLayout>
    )
}