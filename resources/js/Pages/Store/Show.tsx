import Card from '@/Components/Card';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Store } from '@/types/Store';
import { Head, Link } from '@inertiajs/react';

export default function Index({
    auth,
    store,
}: PageProps<{ store: { data: Store } }>) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Loja: {store?.data?.name}
                </h2>
            }
        >
            <Head title="Lojas" />

            {/* Botão de voltar */}

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link href={route('store.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>
                    <div className='grid grid-cols-1 gap-3 mt-4'>
                        <Card key={store?.data?.slug} className='p-4 relative'>
                            <label className="block font-medium text-xl text-gray-700 mt-10">Imagem principal (Card da listagem)</label>
                            <div className="flex flex-wrap gap-2">
                                {store?.data?.image && (
                                    <div className="w-1/4 h-24 bg-gray-200 rounded-lg flex justify-center items-center relative mr-2">
                                        <img src={store?.data?.image?.file_url} alt={store?.data?.image?.name} className="h-24 w-full object-cover rounded-lg" />
                                    </div>
                                )}
                            </div>
                            <label className="block font-medium text-xl text-gray-700 mt-10">Galeria</label>
                            <div className="flex flex-wrap gap-2 mb-10">
                                {store?.data?.images && store?.data?.images.map((file, index) => (
                                    <Card key={index} className="w-1/4 h-24 p-1 bg-gray-200 rounded-lg flex justify-center items-center relative mr-2 mb-4">
                                        <img src={file?.file_url} alt={file?.name} className="h-24 w-full object-cover rounded-lg" />
                                    </Card>
                                ))}
                            </div>
                            <p className='font-semibold'>{store?.data?.name}</p>
                            <div className='mt-4 flex justify-end absolute top-0 right-2'>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${store?.data?.status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {store?.data?.status ? 'Ativa' : 'Inativa'}
                                </span>
                            </div>

                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                Proprietário: {store?.data?.user?.name || 'N/A'}
                            </p>

                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                Cidade: {store?.data?.city?.name || 'N/A'}
                            </p>

                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                Telefone: {store?.data?.phone || 'N/A'}
                            </p>

                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                Email: {store?.data?.email || 'N/A'}
                            </p>

                            <div className='flex gap-2 mt-2 justify-end' dangerouslySetInnerHTML={{ __html: store?.data?.content }}></div>
                        </Card>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}