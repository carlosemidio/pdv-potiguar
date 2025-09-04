import Card from '@/Components/Card';
import SecondaryButton from '@/Components/SecondaryButton';
import VariantsList from '@/Components/VariantsList';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Product } from '@/types/Product';
import { Head, Link } from '@inertiajs/react';

export default function Index({
    auth,
    product,
}: PageProps<{ product: { data: Product } }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Produto: {product?.data?.name}
                </h2>
            }
        >
            <Head title="Produtos" />

            {/* Botão de voltar */}

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link href={route('product.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>
                    <div className='grid grid-cols-1 gap-3 mt-4'>
                        <Card key={product?.data?.slug} className='p-4 relative'>
                            {product?.data?.image && (
                                <>
                                    <label className="block font-medium text-xl text-gray-700 mt-10">Imagem principal (Card da listagem)</label>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="w-1/4 h-24 bg-gray-200 rounded-lg flex justify-center items-center relative mr-2">
                                            <img src={product?.data?.image?.file_url} alt={product?.data?.image?.name} className="h-24 w-full object-cover rounded-lg" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {product?.data?.images && product?.data?.images.length > 0 && (
                                <>
                                    <label className="block font-medium text-xl text-gray-700 mt-10">Galeria</label>
                                    <div className="flex flex-wrap gap-2 mb-10">
                                        {product.data.images.map((file, index) => (
                                            <Card key={index} className="w-1/4 h-24 p-1 bg-gray-200 rounded-lg flex justify-center items-center relative mr-2 mb-4">
                                                <img src={file?.file_url} alt={file?.name} className="h-24 w-full object-cover rounded-lg" />
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}

                            <p className='font-semibold'>{product?.data?.name}</p>
                            <div className='mt-4 flex justify-end absolute top-0 right-2'>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product?.data?.status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {product?.data?.status ? 'Ativa' : 'Inativa'}
                                </span>
                            </div>

                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                Proprietário: {product?.data?.user?.name || 'N/A'}
                            </p>

                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                Loja: {product?.data?.store?.name || 'N/A'}
                            </p>

                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                Categoria: {product?.data?.category?.name || 'N/A'}
                            </p>

                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                Marca: {product?.data?.brand?.name || 'N/A'}
                            </p>

                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                Preço: {product?.data?.price ? `R$ ${product?.data?.price}` : 'N/A'}
                            </p>

                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                SKU: {product?.data?.sku || 'N/A'}
                            </p>

                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                Quantidade em estoque: {product?.data?.stock_quantity !== null ? product?.data?.stock_quantity : 'N/A'}
                            </p>

                            <div className='w-full mt-4'>
                                {product?.data?.variants && product.data.variants.length > 0 && (
                                    <VariantsList
                                        variants={product.data.variants}
                                    />
                                )}
                            </div>

                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                Criado em: {new Date(product?.data?.created_at).toLocaleDateString('pt-BR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>

                            <div className='flex gap-2 mt-2 justify-end' dangerouslySetInnerHTML={{ __html: product?.data?.description }}></div>

                            {/* <div className='mt-4'>
                                <Map
                                    lat={Number(product?.data?.latitude)}
                                    lng={Number(product?.data?.longitude)}
                                    zoom={15}
                                    markerText={product?.data?.name}
                                />
                            </div> */}
                        </Card>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}