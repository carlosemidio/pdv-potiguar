import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useState } from 'react';
import { ProductVariant } from '@/types/ProductVariant';
import SearchableProductsSelect from '@/Components/SearchableProductsSelect';
import SearchableAttibutesSelect from '@/Components/SearchableAttributesSelect';
import { Attribute } from '@/types/Attribute';
import { MdCheckBox, MdDelete } from 'react-icons/md';
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { FilePondFile } from 'filepond'
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImagePreview);

export default function EditVariant({
    auth,
    productVariant
}: PageProps<{ productVariant?: { data: ProductVariant } }>) {
    const isEdit = !!productVariant;
    // Corrige tipagem: attributes deve ser um array de Attribute
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        _method: productVariant ? 'patch' : 'post',
        product_id: productVariant ? productVariant.data.product_id : null,
        sku: productVariant ? productVariant.data.sku : '',
        image: null,
        images: productVariant ? productVariant.data.images || [] : [],
        attributes: (productVariant && Array.isArray(productVariant.data.attributes))
            ? productVariant.data.attributes.map((attr: any) => ({
                id: attr.id,
                name: attr.name,
                value: attr.value ?? ''
            }))
            : [],
        files: Array<File>(),
    });
    
    const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
    const [attributeName, setAttributeName] = useState<string | null>(null);
    const [product, setProduct] = useState(productVariant ? productVariant.data.product : null);
    const [files, setFiles] = useState<File[]>([]);

    // Funções para manipular atributos
    const handleAddAttribute = () => {
        let attributeToAdd = selectedAttribute;
        if (!attributeToAdd) {
            if (attributeName && attributeName.trim() !== '') {
                attributeToAdd = { id: Date.now(), name: attributeName.trim(), value: '' };
            } else {
                return;
            }
        }
        if (data.attributes.some((attr: Attribute) => attr.name === attributeToAdd!.name)) {
            return; // Já existe atributo com esse nome
        }
        setData('attributes', [...data.attributes, attributeToAdd]);
        setSelectedAttribute(null);
        setAttributeName(null);
    };

    const handleAttributeValueChange = (index: number, value: string) => {
        const updated = [...data.attributes];
        (updated[index] as Attribute).value = value;
        setData('attributes', updated);
    };

    const handleDeleteFile = (fileId: number) => {
        data._method = 'delete';
        post(route('file.destroy', fileId), 
            {
                preserveScroll: true,
                preserveState: false,
            }
        );
    }

    const handleSetFileAsDefault = (fileId: number) => {
        data._method = 'post';
        post(route('file.setAsDefault', fileId), 
            {
                preserveScroll: true,
                preserveState: false,
            }
        );
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Prepare files for upload
        data.files = files;

        if (isEdit) {
            post(route('product-variant.update', productVariant.data.id), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('product-variant.store'));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2>
                    {isEdit ? `Editar variante: ${productVariant.data.sku}` : 'Criar variante'}
                </h2>
            }
        >
            <Head title={isEdit ? 'Editar variante' : 'Criar variante'} />
            <section className='px-2 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto">
                    <div className="mb-4">
                        <Link href={route('product-variant.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>
                    <div className='bg-white border p-3 rounded dark:border-gray-600 dark:bg-slate-800'>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <SearchableProductsSelect
                                    selectedProduct={product}
                                    setProduct={(product) => { setProduct(product); setData('product_id', product ? product.id : null); }}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                <div className="flex flex-col">
                                    <InputLabel htmlFor="sku" value="SKU" />
                                    <TextInput
                                        id="sku"
                                        className="mt-1 block w-full"
                                        value={data.sku}
                                        onChange={e => setData('sku', e.target.value)}
                                        autoFocus
                                    />
                                    <InputError className="mt-2" message={errors.sku} />
                                </div>
                            </div>

                            <div className="mt-6">
                                <h5 className="text-sm font-semibold text-gray-700 mb-3">Adicionar Atributo</h5>
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Novo Atributo</label>
                                        <SearchableAttibutesSelect selectedAttribute={selectedAttribute} setAttribute={setSelectedAttribute} setAttributeName={setAttributeName} isDisabled={false} />
                                    </div>
                                    <PrimaryButton
                                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
                                        onClick={handleAddAttribute}
                                        type="button"
                                    >
                                        Adicionar
                                    </PrimaryButton>
                                </div>
                            </div>

                            {data.attributes && data.attributes.length > 0 && (
                                <div className="mt-6">
                                    <h5 className="text-sm font-semibold text-gray-700 mb-3">Atributos</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {data.attributes.map((attribute: Attribute, attrIndex: number) => (
                                            <div key={attrIndex} className="flex flex-col">
                                                <label className="mb-2 text-xs font-semibold text-gray-700">{attribute.name}</label>
                                                <input
                                                    type="text"
                                                    placeholder={`Valor de ${attribute.name}`}
                                                    value={attribute.value}
                                                    onChange={e => handleAttributeValueChange(attrIndex, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="w-full col-span-1 md:col-span-2 lg:col-span-3">
                                <label className="block font-medium text-xl text-gray-700 mt-10">Imagem principal (Card da listagem)</label>
                                <div className="flex flex-wrap gap-2">
                                    {productVariant?.data?.image && (
                                        <div className="w-1/4 h-24 bg-gray-200 rounded-lg flex justify-center items-center relative mr-2">
                                            <img src={productVariant?.data?.image?.file_url} alt={productVariant?.data?.image?.name} className="h-24 w-full object-cover rounded-lg" />
                                            <span
                                                onClick={() => {
                                                    if (productVariant?.data?.image?.id !== undefined) {
                                                        handleDeleteFile(productVariant.data.image.id);
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
                                    {productVariant?.data?.images && productVariant?.data?.images.map((image, index) => (
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

                            <div className='flex items-center gap-4'>
                                <PrimaryButton disabled={processing}>
                                    Salvar
                                </PrimaryButton>

                                <Transition
                                    show={recentlySuccessful}
                                    enterFrom="opacity-0"
                                    leaveTo="opacity-0"
                                >
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>Salvo.</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}
