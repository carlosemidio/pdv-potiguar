import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Store } from '@/types/Store';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Store as StoreIcon, User, MapPin, Phone, Mail, Globe, Calendar, Image, FileText, Settings } from 'lucide-react';
import { formatCustomDateTime } from '@/utils/date-format';

export default function Show({
    auth,
    store,
}: PageProps<{ store: { data: Store } }>) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Detalhes da Loja: {store?.data?.name}
                </h2>
            }
        >
            <Head title={`Loja: ${store?.data?.name}`} />

            <div className="py-6 px-4 max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="mb-6">
                    <Link href={route('store.index')}>
                        <SecondaryButton className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar para Lojas
                        </SecondaryButton>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Coluna Principal - Informações */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informações Básicas */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <StoreIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{store?.data?.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                store?.data?.status 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {store?.data?.status ? 'Ativa' : 'Inativa'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Proprietário</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {store?.data?.user?.name || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Cidade</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {store?.data?.city?.name || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Telefone</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {store?.data?.phone || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <Mail className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Email</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {store?.data?.email || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Domínio</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {store?.data?.domain || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Atualizada em</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {formatCustomDateTime(store?.data?.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Descrição */}
                        {store?.data?.description && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-t-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Descrição</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {store?.data?.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Conteúdo Detalhado */}
                        {store?.data?.content && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-t-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Conteúdo Detalhado</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div 
                                        className="prose prose-gray dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: store?.data?.content }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Coluna Lateral - Imagens */}
                    <div className="space-y-6">
                        {/* Logo Principal */}
                        {store?.data?.image && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 rounded-t-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Image className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Logo</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <img 
                                        src={store?.data?.image?.file_url} 
                                        alt={store?.data?.image?.name} 
                                        className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm" 
                                    />
                                </div>
                            </div>
                        )}

                        {/* Galeria */}
                        {store?.data?.images && store?.data?.images.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-4 rounded-t-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Image className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Galeria</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        {store?.data?.images.map((file, index) => (
                                            <img 
                                                key={index}
                                                src={file?.file_url} 
                                                alt={file?.name} 
                                                className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow" 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Configurações Técnicas */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Configurações</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Layout:</span>
                                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                                        {store?.data?.layout || 'Default'}
                                    </span>
                                </div>
                                {store?.data?.latitude && store?.data?.longitude && (
                                    <>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Latitude:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {store?.data?.latitude}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Longitude:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {store?.data?.longitude}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}