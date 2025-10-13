import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Search, Eraser, Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import Pagination from '@/Components/Pagination/Pagination';
import { StockMovement } from '@/types/StockMovement'; // Troque para o tipo correto
import SearchableProductVariantsSelect from '@/Components/SearchableProductVariantsSelect';
import { Ingredient } from '@/types/Ingredient';
import { ProductVariant } from '@/types/ProductVariant';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SearchableIngredientsSelect from '@/Components/SearchableIngredientsSelect';
import TextInput from '@/Components/Form/TextInput';

export default function Index({
    auth,
    stockMovements, // Renomeie para refletir movimentações de estoque
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Movimentação de Estoque
                </h2>
            }
        >
            <Head title="Movimentação de Estoque" />

            <section className='py-2 px-3 text-gray-800 dark:text-gray-200'>
                <div className="max-w-5xl">
                    <div className="mb-2">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-3 border border-gray-200 dark:border-gray-700">
                            <form className="space-y-3" onSubmit={submit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <InputLabel htmlFor="stockable_type" value="Tipo" className="text-xs font-medium" />
                                        <select
                                            id="stockable_type"
                                            className="mt-1 block w-full text-sm rounded border-gray-300 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-200 focus:ring focus:ring-blue-400"
                                            value={data.stockable_type}
                                            onChange={(e) => setData('stockable_type', e.target.value)}
                                            required
                                        >
                                            <option value="variant">Produtos prontos</option>
                                            <option value="ingredient">Ingredientes</option>
                                        </select>
                                        <InputError className="mt-1" message={errors.stockable_type} />
                                    </div>

                                    {data.stockable_type === 'variant' && (
                                        <div>
                                            <InputLabel htmlFor="stockable_id" value="Variante" className="text-xs font-medium" />
                                            <SearchableProductVariantsSelect
                                                selectedVariant={variant}
                                                setVariant={(v) => {
                                                    setVariant(v);
                                                    setData('stockable_id', v ? v.id : null);
                                                }}
                                                isDisabled={processing}
                                            />
                                            <InputError className="mt-1" message={errors.stockable_id} />
                                        </div>
                                    )}

                                    {data.stockable_type === 'ingredient' && (
                                        <div>
                                            <InputLabel htmlFor="ingredient_id" value="Ingrediente" className="text-xs font-medium" />
                                            <div id='ingredient_id'>
                                                <SearchableIngredientsSelect
                                                    selectedIngredient={ingredient}
                                                    setIngredient={(i) => {
                                                        setIngredient(i);
                                                        setData('stockable_id', i ? i.id : null);
                                                    }}
                                                    isDisabled={processing}
                                                />
                                            </div>
                                            <InputError className="mt-1" message={errors.stockable_id} />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <InputLabel htmlFor="date_from" value="Data de" className="text-xs font-medium" />
                                        <TextInput
                                            id="date_from"
                                            type="date"
                                            className="mt-1 w-full text-sm"
                                            value={data.date_from}
                                            onChange={e => setData('date_from', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="date_to" value="até" className="text-xs font-medium" />
                                        <TextInput
                                            id="date_to"
                                            type="date"
                                            className="mt-1 w-full text-sm"
                                            value={data.date_to}
                                            onChange={e => setData('date_to', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <PrimaryButton
                                        type="submit"
                                        size="sm"
                                        className="inline-flex items-center gap-2 flex-1">
                                        <Search className="w-4 h-4" />
                                        Filtrar
                                    </PrimaryButton>
                                    <SecondaryButton
                                        type="button"
                                        size="sm"
                                        onClick={() => { window.location.href = route('stock-movement.index'); }}
                                        className="inline-flex items-center gap-2 flex-1"
                                    >
                                        <Eraser className="w-4 h-4" />
                                        Limpar
                                    </SecondaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    {can('stock-movements_create') && (
                        <Link href={route('stock-movement.create')} className="fixed bottom-16 right-6 z-10">
                            <PrimaryButton className="rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-lg">
                                <Plus className="w-6 h-6" />
                            </PrimaryButton>
                        </Link>
                    )}
                    
                    <div className="mt-2">
                        {items.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                {items.map((item) => (
                                    <div key={item.id} className="relative p-3 pl-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                        <span className={`absolute left-0 top-0 h-full w-1 ${item.type === 1 ? 'bg-green-500' : 'bg-red-500'}`} />

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {data.stockable_type === 'variant' ? item?.store_product_variant?.product_variant?.name : item?.ingredient?.name || 'N/A'}
                                                </h3>
                                                <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                                                    <span className={`px-2 py-0.5 rounded-full font-medium ${item.type === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                        {item.type === 1 ? 'Entrada' : 'Saída'}
                                                    </span>
                                                    {item.subtype && (
                                                        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                                            {item.subtype}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatCustomDateTime(item.created_at)}
                                            </p>
                                        </div>

                                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
                                            {item.store && (
                                                <p>
                                                    <span className="font-medium">Loja:</span> {item.store.name}
                                                </p>
                                            )}
                                            {item.user && (
                                                <p>
                                                    <span className="font-medium">Usuário:</span> {item.user.name}
                                                </p>
                                            )}
                                            {item.tenant && (
                                                <p>
                                                    <span className="font-medium">Empresa:</span> {item.tenant.name}
                                                </p>
                                            )}
                                            {item.document_number && (
                                                <p>
                                                    <span className="font-medium">Documento:</span> {item.document_number}
                                                </p>
                                            )}
                                            <p>
                                                <span className="font-medium">Custo:</span> R$ { item.cost_price }
                                            </p>
                                            <p>
                                                {(item.type === 1) ? (
                                                    <span className="font-medium">Custo unitário: R$ {item.cost_price && item.quantity ? (item.cost_price / item.quantity).toFixed(2) : '0.00'}</span>
                                                ) : (
                                                    <span className="font-medium">Custo unitário: R$ {item.cost_price}</span>
                                                )}
                                            </p>
                                            <p>
                                                <span className="font-medium">Quantidade:</span> {item.quantity} {item.ingredient ? item.ingredient.unit.symbol : 'un'}
                                            </p>
                                            {item.reason && (
                                                <p className="sm:col-span-2">
                                                    <span className="font-medium">Motivo:</span> {item.reason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                Nenhuma movimentação cadastrada.
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <Pagination links={meta.links} />
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}
