import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Search, Eraser, Plus, Package, TrendingUp, TrendingDown, Calendar, Filter, FileText, BarChart3, Archive, AlertTriangle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import Pagination from '@/Components/Pagination/Pagination';
import { StockMovement } from '@/types/StockMovement';
import SearchableProductVariantsSelect from '@/Components/SearchableProductVariantsSelect';
import { Ingredient } from '@/types/Ingredient';
import { ProductVariant } from '@/types/ProductVariant';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SearchableIngredientsSelect from '@/Components/SearchableIngredientsSelect';
import TextInput from '@/Components/Form/TextInput';

export default function Index({
    auth,
    stockMovements,
    filters,
}: PageProps<{
    stockMovements: PaginatedData<StockMovement>,
    filters: {
        stockable_type?: string,
        stockable_id?: string,
        date_from?: string,
        date_to?: string } }>) {
            
    const { data, setData, get, post, errors, processing, recentlySuccessful } = useForm({
        store_id: auth.user.store?.id ?? null,
        stockable_type: filters.stockable_type,
        stockable_id: null as number | null,
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        unit_id: null as number | null,
    });

    const [variant, setVariant] = useState<ProductVariant | null>(null);
    const [ingredient, setIngredient] = useState<Ingredient | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        get(route('stock-movement.index'), { preserveState: true });
    };

    const { data: items, meta } = stockMovements;

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                            <Archive className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Movimentação de Estoque
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Controle e histórico de movimentações
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Movimentação de Estoque" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-6 max-w-7xl">
                    {/* Filters Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
                        <div className="p-6 pb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Filtros de Pesquisa
                                </h3>
                            </div>
                            
                            <form className="space-y-6" onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="relative">
                                        <InputLabel htmlFor="stockable_type" value="Tipo de Item" className="text-gray-700 dark:text-gray-300 font-medium" />
                                        <select
                                            id="stockable_type"
                                            className="mt-2 block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-colors"
                                            value={data.stockable_type}
                                            onChange={(e) => setData('stockable_type', e.target.value)}
                                            required
                                        >
                                            <option value="variant">Produtos Prontos</option>
                                            <option value="ingredient">Ingredientes</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.stockable_type} />
                                    </div>

                                    {data.stockable_type === 'variant' && (
                                        <div className="relative z-10">
                                            <InputLabel htmlFor="stockable_id" value="Produto" className="text-gray-700 dark:text-gray-300 font-medium" />
                                            <div className="mt-2">
                                                <SearchableProductVariantsSelect
                                                    selectedVariant={variant}
                                                    setVariant={(v) => {
                                                        setVariant(v);
                                                        setData('stockable_id', v ? v.id : null);
                                                    }}
                                                    isDisabled={processing}
                                                />
                                            </div>
                                            <InputError className="mt-2" message={errors.stockable_id} />
                                        </div>
                                    )}

                                    {data.stockable_type === 'ingredient' && (
                                        <div className="relative z-10">
                                            <InputLabel htmlFor="ingredient_id" value="Ingrediente" className="text-gray-700 dark:text-gray-300 font-medium" />
                                            <div id='ingredient_id' className="mt-2">
                                                <SearchableIngredientsSelect
                                                    selectedIngredient={ingredient}
                                                    setIngredient={(i) => {
                                                        setIngredient(i);
                                                        setData('stockable_id', i ? i.id : null);
                                                    }}
                                                    isDisabled={processing}
                                                />
                                            </div>
                                            <InputError className="mt-2" message={errors.stockable_id} />
                                        </div>
                                    )}

                                    <div className="relative">
                                        <InputLabel htmlFor="date_from" value="Data Inicial" className="text-gray-700 dark:text-gray-300 font-medium" />
                                        <TextInput
                                            id="date_from"
                                            type="date"
                                            className="mt-2 w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                            value={data.date_from}
                                            onChange={e => setData('date_from', e.target.value)}
                                        />
                                    </div>

                                    <div className="relative">
                                        <InputLabel htmlFor="date_to" value="Data Final" className="text-gray-700 dark:text-gray-300 font-medium" />
                                        <TextInput
                                            id="date_to"
                                            type="date"
                                            className="mt-2 w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                            value={data.date_to}
                                            onChange={e => setData('date_to', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50"
                                    >
                                        <Search className="w-4 h-4" />
                                        {processing ? 'Filtrando...' : 'Filtrar'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { window.location.href = route('stock-movement.index'); }}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-200"
                                    >
                                        <Eraser className="w-4 h-4" />
                                        Limpar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Stock Movements Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Histórico de Movimentações
                                    </h3>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {meta.total} registros encontrados
                                </div>
                            </div>
                        </div>
                        
                        <div className="overflow-hidden">
                            {items.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-3 rounded-lg ${item.type === 1 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                                        {item.type === 1 ? (
                                                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                        ) : (
                                                            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                                                            {data.stockable_type === 'variant' ? item?.store_product_variant?.product_variant?.name : item?.ingredient?.name || 'N/A'}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.type === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'}`}>
                                                                {item.type === 1 ? 'Entrada' : 'Saída'}
                                                            </span>
                                                            {item.subtype && (
                                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                                    {item.subtype}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatCustomDateTime(item.created_at)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-600">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Quantidade</p>
                                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {item.quantity} {item.ingredient ? item.ingredient.unit.symbol : 'un'}
                                                    </p>
                                                </div>
                                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-600">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Custo Total</p>
                                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                        R$ {item.cost_price}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                {item.store && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                        <span className="text-gray-600 dark:text-gray-400">Loja:</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">{item.store.name}</span>
                                                    </div>
                                                )}
                                                {item.user && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                        <span className="text-gray-600 dark:text-gray-400">Usuário:</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">{item.user.name}</span>
                                                    </div>
                                                )}
                                                {item.document_number && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                                        <span className="text-gray-600 dark:text-gray-400">Documento:</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">{item.document_number}</span>
                                                    </div>
                                                )}
                                                {item.reason && (
                                                    <div className="flex items-start gap-2 mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <span className="text-gray-600 dark:text-gray-400 text-xs">Motivo:</span>
                                                            <p className="font-medium text-gray-900 dark:text-white">{item.reason}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Nenhuma movimentação cadastrada</p>
                                <p className="text-sm">Registre a primeira movimentação de estoque</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <Pagination links={meta.links} />
                    </div>
                </div>

                {/* Floating Action Button */}
                {can('stock-movements_create') && (
                    <Link
                        href={route('stock-movement.create')}
                        className="fixed bottom-16 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
                    >
                        <Plus className="w-4 h-4" />
                    </Link>
                )}
                </div>
            </div>
        </AuthenticatedLayout>
    )
}