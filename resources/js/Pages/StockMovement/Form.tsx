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
import SearchableIngredientsSelect from '@/Components/SearchableIngredientsSelect';
import { Ingredient } from '@/types/Ingredient';
import { Unit } from '@/types/Unit';
import SearchableStoreProductVariantsSelect from '@/Components/SearchableStoreProductVariantsSelect';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { Package, ArrowUpDown, ArrowLeft, Save, FileText, DollarSign, Hash, MessageSquare, Scale, Package2, Beaker } from 'lucide-react';

type SubtypeOption = { value: string; label: string };

export default function Create({ auth, subtypes, units }: PageProps<{ subtypes: SubtypeOption[], units: { data: Unit[] } }>) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        store_id: auth.user.store?.id ?? null,
        stockable_type: 'variant',
        stockable_id: null as number | null,
        quantity: '',
        subtype: '',
        cost_price: '' as number | string,
        reason: '' as string,
        document_number: '' as string,
        unit_id: null as number | null,
    });

    const [variant, setVariant] = useState<StoreProductVariant | null>(null);
    const [ingredient, setIngredient] = useState<Ingredient | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('stock-movement.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <ArrowUpDown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Movimentação de Estoque
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Registrar entrada ou saída de produtos/ingredientes
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={'Nova movimentação de estoque'} />
            
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Navegação */}
                    <div className="mb-8">
                        <Link href={route('stock-movement.index')}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors duration-200">
                                <ArrowLeft className="w-4 h-4" />
                                Voltar
                            </button>
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        {/* Seção: Tipo e Item */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <Package className="w-5 h-5 text-white" />
                                    <h3 className="text-lg font-semibold text-white">Item e Tipo</h3>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Tipo */}
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="stockable_type" value="Tipo de Item" className="text-base font-semibold flex items-center gap-2">
                                            <Package2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            Tipo
                                        </InputLabel>
                                        <select
                                            id="stockable_type"
                                            className="w-full px-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800"
                                            value={data.stockable_type}
                                            onChange={(e) => setData('stockable_type', e.target.value)}
                                            required
                                        >
                                            <option value="variant">Produto Pronto</option>
                                            <option value="ingredient">Ingrediente</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.stockable_type} />
                                    </div>

                                    {/* Subtipo */}
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="subtype" value="Subtipo da Movimentação" className="text-base font-semibold flex items-center gap-2">
                                            <ArrowUpDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            Subtipo
                                        </InputLabel>
                                        <select
                                            id="subtype"
                                            className="w-full px-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-800"
                                            value={data.subtype}
                                            onChange={(e) => setData('subtype', e.target.value)}
                                            required
                                        >
                                            <option value="">Selecione o subtipo...</option>
                                            {subtypes.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                        <InputError className="mt-2" message={errors.subtype} />
                                    </div>
                                </div>

                                {/* Seleção do Item */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {data.stockable_type === 'variant' && (
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="stockable_id" value="Produto/Variante" className="text-base font-semibold flex items-center gap-2">
                                                <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                Variante
                                            </InputLabel>
                                            <SearchableStoreProductVariantsSelect
                                                selectedVariant={variant}
                                                setVariant={(v) => {
                                                    setVariant(v);
                                                    setData('stockable_id', v ? v.id : null);
                                                }}
                                                isDisabled={processing}
                                            />
                                            <InputError className="mt-2" message={errors.stockable_id} />
                                        </div>
                                    )}

                                    {data.stockable_type === 'ingredient' && (
                                        <>
                                            <div className="space-y-2">
                                                <InputLabel htmlFor="ingredient_id" value="Ingrediente" className="text-base font-semibold flex items-center gap-2">
                                                    <Beaker className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                                    Ingrediente
                                                </InputLabel>
                                                <SearchableIngredientsSelect
                                                    selectedIngredient={ingredient}
                                                    setIngredient={(i) => {
                                                        setIngredient(i);
                                                        setData('stockable_id', i ? i.id : null);
                                                    }}
                                                    isDisabled={processing}
                                                />
                                                <InputError className="mt-2" message={errors.stockable_id} />
                                            </div>

                                            <div className="space-y-2">
                                                <InputLabel htmlFor="unit_id" value="Unidade de Medida" className="text-base font-semibold flex items-center gap-2">
                                                    <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                    Unidade
                                                </InputLabel>
                                                <select
                                                    id="unit_id"
                                                    className="w-full px-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800"
                                                    value={data.unit_id ?? ''}
                                                    onChange={(e) => setData('unit_id', e.target.value ? Number(e.target.value) : null)}
                                                >
                                                    <option value="">Selecione a unidade...</option>
                                                    {units?.data?.map(u => (
                                                        <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                                                    ))}
                                                </select>
                                                <InputError className="mt-2" message={errors.unit_id} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Seção: Quantidade e Valores */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <Hash className="w-5 h-5 text-white" />
                                    <h3 className="text-lg font-semibold text-white">Quantidade e Valores</h3>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Quantidade */}
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="quantity" value="Quantidade" className="text-base font-semibold flex items-center gap-2">
                                            <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            Quantidade
                                        </InputLabel>
                                        <TextInput
                                            id="quantity"
                                            type="number"
                                            step="0.01"
                                            className="w-full px-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', e.target.value)}
                                            placeholder="Ex: 10.5"
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.quantity} />
                                    </div>

                                    {/* Preço de Custo */}
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="cost_price" value="Preço de Custo" className="text-base font-semibold flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            Preço (Opcional)
                                        </InputLabel>
                                        <TextInput
                                            id="cost_price"
                                            type="number"
                                            step="0.01"
                                            className="w-full px-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500 dark:focus:ring-green-400"
                                            value={data.cost_price}
                                            onChange={(e) => setData('cost_price', e.target.value)}
                                            placeholder="Ex: 15.90"
                                        />
                                        <InputError className="mt-2" message={errors.cost_price} />
                                    </div>

                                    {/* Número do Documento */}
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="document_number" value="Número do Documento" className="text-base font-semibold flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            Documento (Opcional)
                                        </InputLabel>
                                        <TextInput
                                            id="document_number"
                                            className="w-full px-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400"
                                            value={data.document_number}
                                            onChange={(e) => setData('document_number', e.target.value)}
                                            placeholder="Ex: NF-123456"
                                        />
                                        <InputError className="mt-2" message={errors.document_number} />
                                    </div>
                                </div>

                                {/* Motivo */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="reason" value="Motivo da Movimentação" className="text-base font-semibold flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        Motivo (Opcional)
                                    </InputLabel>
                                    <textarea
                                        id="reason"
                                        className="w-full px-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500 dark:focus:ring-amber-400 bg-white dark:bg-gray-800"
                                        rows={3}
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        placeholder="Descreva o motivo da movimentação..."
                                    />
                                    <InputError className="mt-2" message={errors.reason} />
                                </div>
                            </div>
                        </div>

                        {/* Ações */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Registrando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Registrar Movimentação
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
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <p className="text-sm font-medium">
                                        Movimentação registrada com sucesso!
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