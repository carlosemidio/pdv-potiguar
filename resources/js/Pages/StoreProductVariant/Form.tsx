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
import { Addon } from '@/types/Addon';
import { XSquare } from 'lucide-react';
import { GrAdd } from 'react-icons/gr';
import Swal from 'sweetalert2';

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
        addons: storeProductVariant ? storeProductVariant.data.addons : [],
    });

    const [variant, setVariant] = useState<ProductVariant | null>(
        storeProductVariant ? storeProductVariant.data.product_variant : null
    );

    const [addons, setAddons] = useState<Addon[] | undefined>(storeProductVariant ? storeProductVariant.data.addons : []);

    const handleAddAddon = () => {
        let newAddon: Addon = {
            name: '',
            price: '0.00',
            sp_variant_id: storeProductVariant ? storeProductVariant.data.id : 0
        };
        
        const updatedAddons = addons ? [...addons, newAddon] : [newAddon];
        setAddons(updatedAddons);
        setData('addons', updatedAddons);
    }

    const handleRemoveAddon = (addon: Addon) => {
        Swal.fire({
            title: 'Remover complemento?',
            text: 'Tem certeza que deseja remover este complemento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, remover',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedAddons = addons ? addons.filter(a => a.id !== addon.id) : [];
                setAddons(updatedAddons);
                setData('addons', updatedAddons);
            }
        });
    }

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
                    cost_price: 0,
                    price: 0,
                    stock_quantity: 0,
                    featured: false,
                    addons: [],
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
                                <InputLabel htmlFor="cost_price" value="Preço de custo" />
                                <div className="flex gap-2 items-center">
                                    <TextInput
                                        id="cost_price"
                                        type="number"
                                        step="0.01"
                                        className="mt-1 w-full"
                                        value={data.cost_price}
                                        onChange={(e) => setData('cost_price', Number(e.target.value))}
                                        autoComplete="off"
                                    />
                                    {data.cost_price !== 0 && (
                                        <button type="button" className="text-xs text-gray-500 hover:text-red-600" onClick={() => setData('cost_price', 0)}>
                                            Limpar
                                        </button>
                                    )}
                                </div>
                                <InputError className="mt-2" message={errors.cost_price} />
                                <span className="text-xs text-gray-500 dark:text-gray-400">Valor de compra do produto na loja.</span>
                            </div>
                            <div>
                                <InputLabel htmlFor="price" value="Preço de venda" />
                                <div className="flex gap-2 items-center">
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
                                    {data.price !== 0 && (
                                        <button type="button" className="text-xs text-gray-500 hover:text-red-600" onClick={() => setData('price', 0)}>
                                            Limpar
                                        </button>
                                    )}
                                </div>
                                <InputError className="mt-2" message={errors.price} />
                                <span className="text-xs text-gray-500 dark:text-gray-400">Valor de venda ao cliente.</span>
                            </div>
                            <div className='opacity-60'>
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
                            <div className='flex items-end'>
                                <label className="inline-flex items-center">
                                    <Checkbox
                                        checked={data.featured}
                                        onChange={(e: any) => setData('featured', e.target.checked)}
                                    />
                                    <span className="ml-2">Destaque</span>
                                </label>
                            </div>
                        </div>

                        {/* Complementos */}
                        <div className="bg-white dark:bg-slate-800 border rounded p-4 space-y-4">                            
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-base">Complementos</span>
                            </div>
                            {data.addons && data.addons.length > 0 ? (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {data.addons.map((addon, index) => (
                                        <div key={index} className='bg-gray-50 dark:bg-gray-900 rounded p-3 flex flex-col gap-2 border border-gray-200 dark:border-gray-800 relative'>
                                            <div className="flex gap-2 items-center">
                                                <InputLabel htmlFor={`addon_name_${index}`} value="Nome" />
                                                <TextInput
                                                    id={`addon_name_${index}`}
                                                    type="text"
                                                    className="mt-1 w-full"
                                                    value={addon.name}
                                                    onChange={(e) => {
                                                        const updatedAddons = [...(data.addons ?? [])];
                                                        updatedAddons[index].name = e.target.value;
                                                        setData('addons', updatedAddons);
                                                        setAddons(updatedAddons);
                                                    }}
                                                    required
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <InputLabel htmlFor={`addon_price_${index}`} value="Preço" />
                                                <TextInput
                                                    id={`addon_price_${index}`}
                                                    type="number"
                                                    step="0.01"
                                                    className="mt-1 w-full"
                                                    value={addon.price}
                                                    onChange={(e) => {
                                                        const updatedAddons = [...(data.addons ?? [])];
                                                        updatedAddons[index].price = e.target.value;
                                                        setData('addons', updatedAddons);
                                                        setAddons(updatedAddons);
                                                    }}
                                                    required
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="absolute top-0 right-0">
                                                <button
                                                    type="button"
                                                    className="absolute top-0 right-0 text-red-600 hover:underline text-xs"
                                                    onClick={() => handleRemoveAddon(addon)}
                                                >
                                                    <XSquare className='w-5 h-5' />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-gray-500 dark:text-gray-400'>Nenhum complemento adicionado.</div>
                            )}
                            <div className="flex items-center justify-between">
                                <PrimaryButton
                                    type="button"
                                    className="flex items-center gap-2"
                                    onClick={handleAddAddon}
                                >
                                    <GrAdd className="w-4 h-4" />
                                    Adicionar complemento
                                </PrimaryButton>
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