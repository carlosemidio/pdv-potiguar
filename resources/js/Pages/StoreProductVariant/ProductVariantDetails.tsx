import { StoreProductVariant } from '@/types/StoreProductVariant';
import { Info, Package } from 'lucide-react';

interface ProductVariantDetailsProps {
    variant: StoreProductVariant;
}

export default function ProductVariantDetails({ variant }: ProductVariantDetailsProps) {
  return (
    <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-l-4 border-blue-500">
            <h3 className='text-xl font-bold mb-4 text-blue-700 dark:text-blue-300 flex items-center gap-2'>
                <Info className="w-5 h-5" />
                Informações Básicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <span className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Nome do Produto</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{variant?.product_variant?.name || 'N/A'}</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <span className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">SKU</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{variant?.product_variant?.sku || 'N/A'}</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <span className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Categoria</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{variant?.product_variant?.product?.category?.name || 'N/A'}</span>
                </div>
                {variant?.product_variant?.product?.brand && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <span className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Marca</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{variant.product_variant.product.brand.name}</span>
                    </div>
                )}
            </div>
        </div>

        {/* Descrição */}
        {variant?.product_variant?.product?.description && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-l-4 border-purple-500">
                <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Descrição do Produto
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{
                        __html: variant.product_variant.product.description
                    }} />
                </div>
            </div>
        )}

        {/* Informações Comerciais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold">R$</span>
                    </div>
                    <div>
                        <span className="block text-sm opacity-90">Preço de Venda</span>
                        <span className="text-2xl font-bold">{variant?.price ? `R$ ${Number(variant.price).toFixed(2).replace('.', ',')}` : 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="block text-sm opacity-90">Estoque Atual</span>
                        <span className="text-2xl font-bold">{variant?.stock_quantity !== null ? variant.stock_quantity : 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Informações de Criação */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-700/50 rounded-2xl p-6 border-l-4 border-gray-400">
            <h3 className="text-lg font-bold mb-3 text-gray-700 dark:text-gray-300">Informações do Sistema</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <span className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Data de Criação</span>
                <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {variant?.created_at
                        ? new Date(variant.created_at).toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                        : 'N/A'
                    }
                </span>
            </div>
        </div>
    </div>
  );
}
