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
import { ProductVariant } from '@/types/ProductVariant';
import SearchableProductVariantsSelect from '@/Components/SearchableProductVariantsSelect';
import SearchableIngredientsSelect from '@/Components/SearchableIngredientsSelect';
import { Ingredient } from '@/types/Ingredient';
import { Unit } from '@/types/Unit';

type SubtypeOption = { value: string; label: string };

export default function Create({ auth, subtypes, units }: PageProps<{ subtypes: SubtypeOption[], units: { data: Unit[] } }>) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        store_id: auth.user.store?.id ?? null,
        stockable_type: 'variant',
        stockable_id: null as number | null,
        quantity: 0,
        subtype: '',
        cost_price: '' as number | string,
        reason: '' as string,
        document_number: '' as string,
        unit_id: null as number | null,
    });

    const [variant, setVariant] = useState<ProductVariant | null>(null);
    const [ingredient, setIngredient] = useState<Ingredient | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('stock-movement.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="">Nova movimentação de estoque</h2>}
        >
            <Head title={'Nova movimentação de estoque'} />
            
            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto">

                    <div className="mb-4">
                        <Link href={route('stock-movement.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white border p-3 rounded dark:border-gray-600 dark:bg-slate-800'>
                        <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="w-full col-span-1 md:col-span-2 lg:col-span-3">
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className='w-full'>
                                        <InputLabel htmlFor="stockable_type" value="Tipo" />
                                        <select
                                            id="stockable_type"
                                            className="mt-1 block w-full rounded border-gray-300 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-200"
                                            value={data.stockable_type}
                                            onChange={(e) => setData('stockable_type', e.target.value)}
                                            required
                                        >
                                            <option value="variant">Produto pronto</option>
                                            <option value="ingredient">Ingrediente</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.stockable_type} />
                                    </div>

                                    {data.stockable_type === 'variant' && (
                                        <div className='w-full'>
                                            <InputLabel htmlFor="stockable_id" value="Variante" />
                                            <SearchableProductVariantsSelect
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
                                            <div className='w-full'>
                                                <InputLabel htmlFor="ingredient_id" value="Ingrediente" />
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

                                            <div className='w-full'>
                                                <InputLabel htmlFor="unit_id" value="Unidade de medida" />
                                                <select
                                                    id="unit_id"
                                                    className="mt-1 block w-full rounded border-gray-300 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-200"
                                                    value={data.unit_id ?? ''}
                                                    onChange={(e) => setData('unit_id', e.target.value ? Number(e.target.value) : null)}
                                                >
                                                    <option value="">Selecione...</option>
                                                    {units?.data?.map(u => (
                                                        <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                                                    ))}
                                                </select>
                                                <InputError className="mt-2" message={errors.unit_id} />
                                            </div>
                                       </>
                                    )}

                                    <div className='w-full'>
                                        <InputLabel htmlFor="subtype" value="Subtipo" />
                                        <select
                                            id="subtype"
                                            className="mt-1 block w-full rounded border-gray-300 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-200"
                                            value={data.subtype}
                                            onChange={(e) => setData('subtype', e.target.value)}
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            {subtypes.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                        <InputError className="mt-2" message={errors.subtype} />
                                    </div>

                                    <div className='w-full'>
                                        <InputLabel htmlFor="quantity" value="Quantidade" />
                                        <TextInput
                                            id="quantity"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 w-full"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', Number(e.target.value))}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.quantity} />
                                    </div>

                                    <div className='w-full'>
                                        <InputLabel htmlFor="cost_price" value="Preço de custo (opcional)" />
                                        <TextInput
                                            id="cost_price"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 w-full"
                                            value={data.cost_price}
                                            onChange={(e) => setData('cost_price', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.cost_price} />
                                    </div>

                                    <div className='w-full'>
                                        <InputLabel htmlFor="document_number" value="Documento (opcional)" />
                                        <TextInput
                                            id="document_number"
                                            className="mt-1 w-full"
                                            value={data.document_number}
                                            onChange={(e) => setData('document_number', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.document_number} />
                                    </div>

                                    <div className='w-full col-span-1 md:col-span-2 lg:col-span-3'>
                                        <InputLabel htmlFor="reason" value="Motivo (opcional)" />
                                        <textarea
                                            id="reason"
                                            className="mt-1 block w-full rounded border-gray-300 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-200"
                                            rows={3}
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.reason} />
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-start col-span-1 md:col-span-2 lg:col-span-3'>
                                <PrimaryButton type="submit" disabled={processing}>
                                    Registrar movimentação
                                </PrimaryButton>
                            </div>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-400">Movimentação registrada com sucesso!</p>
                            </Transition>

                        </form>
                    </div>

                </div>
            </section>

        </AuthenticatedLayout>
    )
}