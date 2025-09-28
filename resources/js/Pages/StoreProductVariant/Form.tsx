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
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { ProductVariant } from '@/types/ProductVariant';
import SearchableProductVariantsSelect from '@/Components/SearchableProductVariantsSelect';
import Checkbox from '@/Components/Checkbox';
import { Unit } from '@/types/Unit';

export default function Edit({ auth, storeProductVariant, units }: PageProps<{ storeProductVariant?: { data: StoreProductVariant }, units: { data: Unit[] } }>) {
    const isEdit = !!storeProductVariant;
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        _method: isEdit ? 'patch' : 'post',
        store_id: storeProductVariant ? storeProductVariant.data.store_id : null,
        product_variant_id: storeProductVariant ? storeProductVariant.data.product_variant_id : null,
        price: storeProductVariant ? storeProductVariant.data.price : null,
        is_produced: storeProductVariant ? storeProductVariant.data.is_produced : false,
        featured: storeProductVariant ? storeProductVariant.data.featured : false,
        manage_stock: storeProductVariant ? storeProductVariant.data.manage_stock : true,
        is_combo: storeProductVariant ? storeProductVariant.data.is_combo : false,
        is_published: storeProductVariant ? storeProductVariant.data.is_published : false,
    });

    const [variant, setVariant] = useState<ProductVariant | null>(
        storeProductVariant ? storeProductVariant.data.product_variant : null
    );

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('store-product-variant.update', storeProductVariant!.data.id), {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => setData({
                    _method: 'patch',
                    store_id: null,
                    product_variant_id: null,
                    price: null,
                    is_produced: false,
                    featured: false,
                    manage_stock: true,
                    is_combo: false,
                    is_published: false,
                }),
            });
        } else {
            post(route('store-product-variant.store'));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="">
                    {isEdit ? `Editar variante da loja` : 'Cadastrar variante da loja'}
                </h2>
            }
        >
            <Head title={isEdit ? 'Editar produto' : 'Criar produto'} />
            
            <section className='px-2 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto">
                    {/* Sticky header for mobile usability */}
                    <div className="sticky top-0 z-20 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-2 py-2 mb-2">
                        <Link href={route('store-product-variant.index')}>
                            <SecondaryButton size="sm">Voltar</SecondaryButton>
                        </Link>
                        <PrimaryButton type="submit" size="sm" className="ml-2" disabled={processing} onClick={submit}>
                            {isEdit ? 'Salvar' : 'Cadastrar'}
                        </PrimaryButton>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Dados principais */}
                        <div className="bg-white dark:bg-slate-800 border rounded p-4 space-y-4">
                            <div>
                                <InputLabel htmlFor="product_variant_id" value="Variante" />
                                <SearchableProductVariantsSelect
                                    selectedVariant={variant}
                                    setVariant={(v) => {
                                        setVariant(v);
                                        setData('product_variant_id', v ? v.id : null);
                                    }}
                                    isDisabled={processing}
                                />
                                <InputError className="mt-2" message={errors.product_variant_id} />
                            </div>
                            <div>
                                <InputLabel htmlFor="price" value="Preço de venda" />
                                <div className="flex gap-2 items-center">
                                    <TextInput
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        className="mt-1 w-full"
                                        value={data.price ?? ''}
                                        onChange={(e) => setData('price', Number(e.target.value))}
                                        required
                                        autoComplete="off"
                                    />
                                    {data.price !== 0 && (
                                        <button type="button" className="text-xs text-gray-500 hover:text-red-600" onClick={() => setData('price', 0)}>
                                            Limpar
                                        </button>
                                    )}
                                </div>
                                <InputError className="mt-2" message={errors.price} />
                                <span className="text-xs text-gray-500 dark:text-gray-400">Valor de venda ao cliente.</span>
                            </div>

                            <div className='flex items-end'>
                                <label className="inline-flex items-center">
                                    <Checkbox
                                        checked={data.is_produced ?? false}
                                        onChange={(e: any) => setData('is_produced', e.target.checked)}
                                    />
                                    <span className="ml-2">A ser produzido?</span>
                                </label>
                            </div>        

                            <div className='flex items-end'>
                                <label className="inline-flex items-center">
                                    <Checkbox
                                        checked={data.featured ?? false}
                                        onChange={(e: any) => setData('featured', e.target.checked)}
                                    />
                                    <span className="ml-2">Destaque</span>
                                </label>
                            </div>

                            <div className='flex items-end'>
                                <label className="inline-flex items-center">
                                    <Checkbox
                                        checked={data.manage_stock ?? false}
                                        onChange={(e: any) => setData('manage_stock', e.target.checked)}
                                    />
                                    <span className="ml-2">Gerenciar estoque</span>
                                </label>
                            </div>

                            <div className='flex items-end'>
                                <label className="inline-flex items-center">
                                    <Checkbox
                                        checked={data.is_combo ?? false}
                                        onChange={(e: any) => setData('is_combo', e.target.checked)}
                                    />
                                    <span className="ml-2">Combo</span>
                                </label>
                            </div>

                            <div className='flex items-end'>
                                <label className="inline-flex items-center">
                                    <Checkbox
                                        checked={data.is_published ?? false}
                                        onChange={(e: any) => setData('is_published', e.target.checked)}
                                    />
                                    <span className="ml-2">Mostrar no site</span>
                                </label>
                            </div>
                        </div>

                        {/* Feedback de sucesso */}
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-green-600 dark:text-green-400 text-center">
                                {isEdit ? 'Variante atualizada com sucesso' : 'Variante cadastrada com sucesso!'}
                            </p>
                        </Transition>
                    </form>
                </div>
            </section>

        </AuthenticatedLayout>
    )
}