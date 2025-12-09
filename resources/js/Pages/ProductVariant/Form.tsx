import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
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
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { FilePondFile } from 'filepond'
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Package, Image, Tag, Plus, Save, ArrowLeft, Trash2, Star, Eye, Settings, Upload } from 'lucide-react';
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
    
    // Inicializa apenas uma vez, não sobrescreve após submit
    const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
    const [attributeName, setAttributeName] = useState<string | null>(null);
    const [product, setProduct] = useState(() => productVariant ? productVariant.data.product : null);
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

    // Remove atributo pelo índice
    const handleRemoveAttribute = (index: number) => {
        const updated = [...data.attributes];
        updated.splice(index, 1);
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
        // Sempre usa setData para garantir que arquivos estejam no form
        setData('files', files);
        if (isEdit) {
            post(route('product-variant.update', productVariant.data.id), {
                preserveScroll: true,
                preserveState: true, // Mantém o state após erro
            });
        } else {
            post(route('product-variant.store'),
            {
                preserveScroll: true,
                preserveState: true, // Mantém o state após erro
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {isEdit ? 'Editar Variante' : 'Nova Variante'}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {isEdit ? `Modificar: ${productVariant.data.sku}` : 'Criar nova variante de produto'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={isEdit ? 'Editar variante' : 'Criar variante'} />
            
            <div className="py-8">
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Navegação */}
                    <div className="mb-8">
                        <Link href={route('product-variant.index')}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors duration-200">
                                <ArrowLeft className="w-4 h-4" />
                                Voltar
                            </button>
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        {/* Seção: Informações Básicas */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Package className="w-5 h-5 text-white" />
                                    <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {/* Produto */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="product" value="Produto Relacionado" className="text-base font-semibold flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        Produto
                                    </InputLabel>
                                    <SearchableProductsSelect
                                        selectedProduct={product}
                                        setProduct={(product) => { setProduct(product); setData('product_id', product ? product.id : null); }}
                                    />
                                    <InputError className="mt-2" message={errors.product_id} />
                                </div>

                                {/* SKU */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="sku" value="SKU (Código Único)" className="text-base font-semibold flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        SKU
                                    </InputLabel>
                                    <TextInput
                                        id="sku"
                                        className="w-full pl-4 pr-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        value={data.sku}
                                        onChange={e => setData('sku', e.target.value)}
                                        placeholder="Ex: PROD-VAR-001"
                                        autoFocus
                                    />
                                    <InputError className="mt-2" message={errors.sku} />
                                </div>
                            </div>
                        </div>

                        {/* Seção: Atributos */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Tag className="w-5 h-5 text-white" />
                                    <h3 className="text-lg font-semibold text-white">Atributos da Variante</h3>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {/* Adicionar Atributo */}
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                                    <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-4">
                                        Adicionar Novo Atributo
                                    </h4>
                                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                                                Selecionar ou Criar Atributo
                                            </label>
                                            <SearchableAttibutesSelect 
                                                selectedAttribute={selectedAttribute} 
                                                setAttribute={setSelectedAttribute} 
                                                setAttributeName={setAttributeName} 
                                                isDisabled={false} 
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddAttribute}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Adicionar
                                        </button>
                                    </div>
                                </div>

                                {/* Lista de Atributos */}
                                {data.attributes && data.attributes.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Atributos Configurados
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {data.attributes.map((attribute: Attribute, attrIndex: number) => (
                                                <div key={attrIndex} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 relative">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {attribute.name}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder={`Valor de ${attribute.name}`}
                                                        value={attribute.value}
                                                        onChange={e => handleAttributeValueChange(attrIndex, e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-800"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAttribute(attrIndex)}
                                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md"
                                                        title="Remover atributo"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Seção: Imagens */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Image className="w-5 h-5 text-white" />
                                    <h3 className="text-lg font-semibold text-white">Galeria de Imagens</h3>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {/* Imagem Principal */}
                                {productVariant?.data?.image && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            Imagem Principal
                                        </h4>
                                        <div className="flex flex-wrap gap-4">
                                            <div className="relative group">
                                                <div className="w-32 h-32 rounded-xl border-2 border-yellow-200 dark:border-yellow-800">
                                                    <img 
                                                        src={productVariant.data.image.file_url} 
                                                        alt={productVariant.data.image.name} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (productVariant?.data?.image?.id !== undefined) {
                                                            handleDeleteFile(productVariant.data.image.id);
                                                        }
                                                    }}
                                                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Galeria */}
                                {productVariant?.data?.images && productVariant.data.images.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-blue-500" />
                                            Galeria de Imagens
                                        </h4>
                                        <div className="flex flex-wrap gap-4">
                                            {productVariant.data.images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <div className="w-32 h-32 rounded-xl border border-gray-200 dark:border-gray-600">
                                                        <img 
                                                            src={image.file_url} 
                                                            alt={image.name} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl flex items-center justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetFileAsDefault(image.id)}
                                                            className="w-8 h-8 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center shadow-lg"
                                                            title="Definir como principal"
                                                        >
                                                            <Star className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteFile(image.id)}
                                                            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg"
                                                            title="Excluir imagem"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload de Novas Imagens */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Upload className="w-4 h-4 text-green-500" />
                                        Adicionar Novas Imagens
                                    </h4>
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4">
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
                                </div>
                            </div>
                        </div>

                        {/* Ações */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Salvar Variante
                                    </>
                                )}
                            </button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out duration-300"
                                enterFrom="opacity-0 transform translate-x-2"
                                enterTo="opacity-100 transform translate-x-0"
                                leave="transition ease-in-out duration-300"
                                leaveTo="opacity-0 transform translate-x-2"
                            >
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <p className="text-sm font-medium">
                                        Variante salva com sucesso!
                                    </p>
                                </div>
                            </Transition>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
