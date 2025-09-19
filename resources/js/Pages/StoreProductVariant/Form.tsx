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

export default function Edit({ auth, storeProductVariant }: PageProps<{ storeProductVariant?: { data: StoreProductVariant } }>) {
    const isEdit = !!storeProductVariant;
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        _method: isEdit ? 'patch' : 'post',
        store_id: storeProductVariant ? storeProductVariant.data.store_id : null,
        product_variant_id: storeProductVariant ? storeProductVariant.data.product_variant_id : null,
        cost_price: storeProductVariant ? storeProductVariant.data.cost_price : 0,
        price: storeProductVariant ? storeProductVariant.data.price : 0,
        stock_quantity: storeProductVariant ? storeProductVariant.data.stock_quantity : 0,
        featured: storeProductVariant ? storeProductVariant.data.featured : false,
    });

    const [variant, setVariant] = useState<ProductVariant | null>(
        storeProductVariant ? storeProductVariant.data.product_variant : null
    );

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('store-product-variant.update', storeProductVariant!.data.id), {
                preserveScroll: true,
                onSuccess: () => setData({
                    _method: 'patch',
                    store_id: null,
                    product_variant_id: null,
                    cost_price: 0,
                    price: 0,
                    stock_quantity: 0,
                    featured: false,
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

                    <div className="mb-4">
                        <Link href={route('store-product-variant.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white border p-3 rounded dark:border-gray-600 dark:bg-slate-800'>
                        <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="w-full col-span-1 md:col-span-2 lg:col-span-3">
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className='w-full'>
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

                                    <div className='w-full'>
                                        <InputLabel htmlFor="cost_price" value="Preço de custo" />
                                        <TextInput
                                            id="cost_price"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 w-full"
                                            value={data.cost_price}
                                            onChange={(e) => setData('cost_price', Number(e.target.value))}
                                            autoComplete="off"
                                        />
                                        <InputError className="mt-2" message={errors.cost_price} />
                                    </div>

                                    <div className='w-full'>
                                        <InputLabel htmlFor="price" value="Preço" />
                                        <TextInput
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 w-full"
                                            value={data.price}
                                            onChange={(e) => setData('price', Number(e.target.value))}
                                            required
                                            autoComplete="off"
                                        />
                                        <InputError className="mt-2" message={errors.price} />
                                    </div>

                                    <div className='w-full opacity-60'>
                                        <InputLabel htmlFor="stock_quantity" value="Estoque (desabilitado)" />
                                        <TextInput
                                            id="stock_quantity"
                                            type="number"
                                            className="mt-1 w-full"
                                            value={data.stock_quantity}
                                            readOnly
                                            disabled
                                            autoComplete="off"
                                        />
                                        <InputError className="mt-2" message={errors.stock_quantity} />
                                    </div>

                                    <div className='w-full flex items-end'>
                                        <label className="inline-flex items-center">
                                            <Checkbox
                                                checked={data.featured}
                                                onChange={(e: any) => setData('featured', e.target.checked)}
                                            />
                                            <span className="ml-2">Destaque</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-start col-span-1 md:col-span-2 lg:col-span-3'>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {isEdit ? 'Salvar' : 'Cadastrar variante da loja'}
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
                                    {isEdit ? 'Variante atualizada com sucesso' : 'Variante cadastrada com sucesso!'}
                                </p>
                            </Transition>

                        </form>
                    </div>

                </div>
            </section>

        </AuthenticatedLayout>
    )
}