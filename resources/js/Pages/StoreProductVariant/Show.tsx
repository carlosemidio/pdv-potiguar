import AddonGroupOptionDeleteFormModal from '@/Components/AddonGroupOptionDeleteFormModal';
import AddonGroupOptionFormModal from '@/Components/AddonGroupOptionFormModal';
import Card from '@/Components/Card';
import ComboItemDeleteFormModal from '@/Components/ComboItemDeleteFormModal';
import ComboItemFormModal from '@/Components/ComboItemFormModal';
import ComboOptionGroupDeleteFormModal from '@/Components/ComboOptionGroupDeleteFormModal ';
import ComboOptionGroupFormModal from '@/Components/ComboOptionGroupFormModal';
import ComboOptionItemDeleteFormModal from '@/Components/ComboOptionItemDeleteFormModal';
import ComboOptionItemFormModal from '@/Components/ComboOptionItemFormModal';
import SecondaryButton from '@/Components/SecondaryButton';
import VariantAddonDeleteFormModal from '@/Components/VariantAddonDeleteFormModal';
import VariantAddonFormModal from '@/Components/VariantAddonFormModal';
import VariantAddonGroupDeleteFormModal from '@/Components/VariantAddonGroupDeleteFormModal';
import VariantAddonGroupFormModal from '@/Components/VariantAddonGroupFormModal';
import VariantIngredientDeleteFormModal from '@/Components/VariantIngredientDeleteFormModal';
import VariantIngredientFormModal from '@/Components/VariantIngredientFormModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { Unit } from '@/types/Unit';
import { Head, Link } from '@inertiajs/react';
import { PlusCircle, Trash2, Package, ArrowLeft, Info, Settings, Wrench, Plus, ChefHat, ListPlus } from 'lucide-react';
import { useState } from 'react';

export default function Index({
    auth,
    storeProductVariant,
    units
}: PageProps<{ storeProductVariant: { data: StoreProductVariant }, units: { data: Unit[] } }>) {
    const [tab, setTab] = useState<'detalhes' | 'opcoes-fixas' | 'opcoes-variaveis' | 'ingredientes' | 'grupos-de-opcoes' | 'complementos'>('detalhes');
    const variant = storeProductVariant?.data;
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
    const [isIngredientDeleteModalOpen, setIsIngredientDeleteModalOpen] = useState(false);
    const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
    const [isAddonDeleteModalOpen, setIsAddonDeleteModalOpen] = useState(false);
    const [isOptionGroupModalOpen, setIsOptionGroupModalOpen] = useState(false);
    const [isOptionGroupDeleteModalOpen, setIsOptionGroupDeleteModalOpen] = useState(false);

    const [openOptionGroupIdxs, setOpenOptionGroupIdxs] = useState<number[]>(
        variant?.variant_addon_groups && variant.variant_addon_groups.length > 0 ? [0] : []
    );

    const [isAddonGroupOptionsModalOpen, setIsAddonGroupOptionsModalOpen] = useState(false);
    const [isAddonGroupOptionsDeleteModalOpen, setIsAddonGroupOptionsDeleteModalOpen] = useState(false);
    
    const [addonGroupId, setAddonGroupId] = useState<number | null>(null);

    const [isComboItemModalOpen, setIsComboItemModalOpen] = useState(false);
    const [isComboItemDeleteModalOpen, setIsComboItemDeleteModalOpen] = useState(false);

    const [isComboOptionGroupModalOpen, setIsComboOptionGroupModalOpen] = useState(false);
    const [isComboOptionGroupDeleteModalOpen, setIsComboOptionGroupDeleteModalOpen] = useState(false);

    const [isComboOptionItemModalOpen, setIsComboOptionItemModalOpen] = useState(false);
    const [isComboOptionItemDeleteModalOpen, setIsComboOptionItemDeleteModalOpen] = useState(false);

    const [comboOptionGroupId, setComboOptionGroupId] = useState<number>(0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {variant?.product_variant?.name || 'Variante de Produto'}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {variant?.product_variant?.sku && `SKU: ${variant.product_variant.sku}`}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Produtos" />
            <section className='px-2 text-gray-800 dark:text-gray-200 space-y-6'>
                <div className="mx-auto">
                    {/* Botão Voltar */}
                    <div className="flex items-center mb-6">
                        <Link href={route('store-product-variant.index')}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                                <ArrowLeft className="w-4 h-4" />
                                Voltar
                            </button>
                        </Link>
                    </div>

                    {/* Navegação por Tabs Moderna */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <button 
                                className={`flex items-center gap-2 py-4 px-6 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                                    tab === 'detalhes' 
                                        ? 'bg-blue-500 text-white shadow-lg' 
                                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                }`} 
                                onClick={() => setTab('detalhes')}
                            >
                                <Info className="w-4 h-4" />
                                Detalhes
                            </button>
                            {variant?.is_combo ? (
                                <>
                                    <button 
                                        className={`flex items-center gap-2 py-4 px-6 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                                            tab === 'opcoes-fixas' 
                                                ? 'bg-blue-500 text-white shadow-lg' 
                                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                        }`} 
                                        onClick={() => setTab('opcoes-fixas')}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Opções Fixas
                                    </button>
                                    <button 
                                        className={`flex items-center gap-2 py-4 px-6 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                                            tab === 'opcoes-variaveis' 
                                                ? 'bg-blue-500 text-white shadow-lg' 
                                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                        }`} 
                                        onClick={() => setTab('opcoes-variaveis')}
                                    >
                                        <Wrench className="w-4 h-4" />
                                        Opções Variáveis
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        className={`flex items-center gap-2 py-4 px-6 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                                            tab === 'ingredientes' 
                                                ? 'bg-blue-500 text-white shadow-lg' 
                                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                        }`} 
                                        onClick={() => setTab('ingredientes')}
                                    >
                                        <ChefHat className="w-4 h-4" />
                                        Ingredientes
                                    </button>
                                    <button 
                                        className={`flex items-center gap-2 py-4 px-6 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                                            tab === 'grupos-de-opcoes' 
                                                ? 'bg-blue-500 text-white shadow-lg' 
                                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                        }`} 
                                        onClick={() => setTab('grupos-de-opcoes')}
                                    >
                                        <ListPlus className="w-4 h-4" />
                                        Opções
                                    </button>
                                </>
                            )}
                            <button 
                                className={`flex items-center gap-2 py-4 px-6 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                                    tab === 'complementos' 
                                        ? 'bg-blue-500 text-white shadow-lg' 
                                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                }`} 
                                onClick={() => setTab('complementos')}
                            >
                                <Plus className="w-4 h-4" />
                                Complementos
                            </button>
                        </div>
                        {/* Conteúdo das Tabs */}
                        <div className="p-6">
                            {tab === 'detalhes' && (
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
                            )}

                            {((tab === 'opcoes-fixas') && (variant?.is_combo)) && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border-l-4 border-orange-500">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className='text-xl font-bold text-orange-700 dark:text-orange-300 flex items-center gap-2'>
                                                <Settings className="w-5 h-5" />
                                                Opções Fixas do Combo
                                            </h3>
                                            <div className="flex gap-2">
                                                {variant?.combo_items && variant.combo_items.length > 0 && (
                                                    <button 
                                                        onClick={() => setIsComboItemDeleteModalOpen(true)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 rounded-xl font-medium transition-all duration-200"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Remover
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => setIsComboItemModalOpen(true)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                                >
                                                    <PlusCircle className="w-4 h-4" />
                                                    Adicionar Item
                                                </button>
                                            </div>
                                        </div>

                                        {variant?.combo_items && variant.combo_items.length > 0 ? (
                                            <div className="grid gap-3">
                                                {variant.combo_items.map((option, idx) => (
                                                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                                                <Package className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                                    {option.item_variant?.product_variant?.name || '-'}
                                                                </h4>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    Item fixo do combo
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm font-semibold">
                                                                Qtd: {option.quantity}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma opção fixa cadastrada</p>
                                                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Clique em "Adicionar Item" para começar</p>
                                            </div>
                                        )}
                                    </div>

                                    <ComboItemFormModal
                                        isOpen={isComboItemModalOpen}
                                        onClose={() => setIsComboItemModalOpen(false)}
                                        sp_variant_id={variant?.id ?? 0}
                                        quantity={1}
                                    />

                                    {variant?.combo_items && variant.combo_items.length > 0 && (
                                        <ComboItemDeleteFormModal
                                            isOpen={isComboItemDeleteModalOpen}
                                            onClose={() => setIsComboItemDeleteModalOpen(false)}
                                            comboItems={variant.combo_items}
                                        />
                                    )}
                                </div>
                            )}

                            {((tab === 'opcoes-variaveis') && (variant?.is_combo)) && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-l-4 border-teal-500">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-teal-100 dark:bg-teal-800 p-2 rounded-lg">
                                                    <Wrench className="w-6 h-6 text-teal-600 dark:text-teal-300" />
                                                </div>
                                                <div>
                                                    <h3 className='text-xl font-bold text-teal-700 dark:text-teal-300'>
                                                        Opções Variáveis do Combo
                                                    </h3>
                                                    <p className="text-sm text-teal-600 dark:text-teal-400">
                                                        Configure grupos de opções que o cliente pode escolher
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsComboOptionGroupModalOpen(true)}
                                                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Novo Grupo</span>
                                            </button>
                                        </div>
                                {variant?.combo_option_groups && variant.combo_option_groups.length > 0 ? (
                                    <div className="space-y-4">
                                        {variant.combo_option_groups.map((optionGroup, idx) => (
                                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                                                {/* Group Header */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="bg-teal-100 dark:bg-teal-800 p-2 rounded-lg">
                                                            <ListPlus className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                                                {optionGroup.name || 'Grupo sem nome'}
                                                            </h4>
                                                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="flex items-center space-x-1">
                                                                    <span className="font-medium">Mín:</span>
                                                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                                        {optionGroup.min_options}
                                                                    </span>
                                                                </span>
                                                                <span className="flex items-center space-x-1">
                                                                    <span className="font-medium">Máx:</span>
                                                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                                        {optionGroup.max_options}
                                                                    </span>
                                                                </span>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    optionGroup.is_required 
                                                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                                                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                                }`}>
                                                                    {optionGroup.is_required ? 'Obrigatório' : 'Opcional'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Group Items */}
                                                {optionGroup.combo_option_items && optionGroup.combo_option_items.length > 0 ? (
                                                    <div className="space-y-2 mb-4">
                                                        {optionGroup.combo_option_items.map((option, optionIdx) => (
                                                            <div key={optionIdx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="bg-white dark:bg-gray-600 p-2 rounded-lg">
                                                                        <Package className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-semibold text-gray-900 dark:text-white">
                                                                            {option.store_product_variant?.product_variant?.name || 'Item sem nome'}
                                                                        </span>
                                                                        {option.additional_price && option.additional_price > 0 && (
                                                                            <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                                                                                +R$ {parseFloat(String(option.additional_price)).toFixed(2)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                    <span className="bg-white dark:bg-gray-600 px-2 py-1 rounded">
                                                                        Qtd: {option.quantity}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                        <p className="text-sm">Nenhum item neste grupo ainda</p>
                                                        <p className="text-xs">Adicione itens para que os clientes possam escolher</p>
                                                    </div>
                                                )}

                                                {/* Group Actions */}
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => (setIsComboOptionItemModalOpen(true), setComboOptionGroupId(optionGroup.id))}
                                                            className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            <span>Adicionar Item</span>
                                                        </button>
                                                        
                                                        {optionGroup.combo_option_items && optionGroup.combo_option_items.length > 0 && (
                                                            <button
                                                                onClick={() => (setIsComboOptionItemDeleteModalOpen(true), setComboOptionGroupId(optionGroup.id))}
                                                                className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                <span>Remover Item</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {optionGroup.combo_option_items?.length || 0} item(ns)
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
                                            <Wrench className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                Nenhum grupo configurado
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Crie grupos de opções para que seus clientes possam personalizar o combo
                                            </p>
                                            <button
                                                onClick={() => setIsComboOptionGroupModalOpen(true)}
                                                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-all duration-200 shadow-md hover:shadow-lg"
                                            >
                                                <Plus className="w-5 h-5" />
                                                <span>Criar Primeiro Grupo</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Global Actions */}
                                {variant?.combo_option_groups && variant.combo_option_groups.length > 0 && (
                                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => setIsComboOptionGroupDeleteModalOpen(true)}
                                            className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Remover Grupos</span>
                                        </button>
                                    </div>
                                )}
                                    </div>

                                    {/* Modals */}
                                    <ComboOptionGroupFormModal
                                        isOpen={isComboOptionGroupModalOpen}
                                        sp_variant_id={variant?.id ?? 0}
                                        onClose={() => setIsComboOptionGroupModalOpen(false)}
                                    />

                                    <ComboOptionGroupDeleteFormModal
                                        isOpen={isComboOptionGroupDeleteModalOpen}
                                        onClose={() => setIsComboOptionGroupDeleteModalOpen(false)}
                                        comboOptionGroups={variant?.combo_option_groups}
                                    />

                                    {comboOptionGroupId !== 0 && (
                                        <>
                                            <ComboOptionItemFormModal
                                                isOpen={isComboOptionItemModalOpen}
                                                onClose={() => setIsComboOptionItemModalOpen(false)}
                                                option_group_id={comboOptionGroupId}
                                            />

                                            <ComboOptionItemDeleteFormModal
                                                isOpen={isComboOptionItemDeleteModalOpen}
                                                onClose={() => setIsComboOptionItemDeleteModalOpen(false)}
                                                comboOptionItems={(variant?.combo_option_groups ?? [])
                                                    .find(group => group.id === comboOptionGroupId)
                                                    ?.combo_option_items || []}
                                            />
                                        </>
                                    )}
                                </div>
                            )}

                        {((tab === 'ingredientes') && (!variant?.is_combo)) && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-l-4 border-green-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className='text-xl font-bold text-green-700 dark:text-green-300 flex items-center gap-2'>
                                            <ChefHat className="w-5 h-5" />
                                            Ingredientes da Receita
                                        </h3>
                                        <div className="flex gap-2">
                                            {variant?.variant_ingredients && variant.variant_ingredients.length > 0 && (
                                                <button 
                                                    onClick={() => setIsIngredientDeleteModalOpen(true)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 rounded-xl font-medium transition-all duration-200"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remover
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => setIsIngredientModalOpen(true)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                <PlusCircle className="w-4 h-4" />
                                                Adicionar Ingrediente
                                            </button>
                                        </div>
                                    </div>

                                    {variant?.variant_ingredients && variant.variant_ingredients.length > 0 ? (
                                        <div className="grid gap-3">
                                            {variant.variant_ingredients.map((ingredient, idx) => (
                                                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                                            <ChefHat className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                                {ingredient.ingredient?.name || '-'}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Ingrediente da receita
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                                                            {ingredient.quantity} {ingredient.unit?.symbol || ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                                            <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum ingrediente cadastrado</p>
                                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Clique em "Adicionar Ingrediente" para começar</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {((tab === 'grupos-de-opcoes') && (!variant?.is_combo)) && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border-l-4 border-purple-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className='text-xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2'>
                                            <ListPlus className="w-5 h-5" />
                                            Grupos de Opções
                                        </h3>
                                        <div className="flex gap-2">
                                            {variant?.variant_addon_groups && variant.variant_addon_groups.length > 0 && (
                                                <button 
                                                    onClick={() => setIsOptionGroupDeleteModalOpen(true)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 rounded-xl font-medium transition-all duration-200"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remover Grupo
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => setIsOptionGroupModalOpen(true)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                <PlusCircle className="w-4 h-4" />
                                                Adicionar Grupo
                                            </button>
                                        </div>
                                    </div>

                                    {variant?.variant_addon_groups && variant.variant_addon_groups.length > 0 ? (
                                        <div className="space-y-4">
                                            {variant.variant_addon_groups.map((variantAddonGroup, idx) => {
                                                const isOpen = openOptionGroupIdxs.includes(idx);
                                                return (
                                                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <button
                                                            className="w-full p-4 flex justify-between items-center bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 hover:from-purple-200 hover:to-violet-200 dark:hover:from-purple-800/60 dark:hover:to-violet-800/60 transition-all duration-200"
                                                            onClick={() => {
                                                                setOpenOptionGroupIdxs(isOpen
                                                                    ? openOptionGroupIdxs.filter(i => i !== idx)
                                                                    : [...openOptionGroupIdxs, idx]
                                                                );
                                                            }}
                                                            type="button"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                                                    <ListPlus className="w-4 h-4 text-white" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                                        {variantAddonGroup.name || '-'}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {variantAddonGroup.is_required ? 'Obrigatório' : 'Opcional'} • 
                                                                        Min: {variantAddonGroup.min_options} • Max: {variantAddonGroup.max_options}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                                                                    {variantAddonGroup.addon_group_options?.length || 0} opções
                                                                </span>
                                                                <span className="text-purple-600 dark:text-purple-400 transform transition-transform duration-200" style={{
                                                                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                                                }}>
                                                                    ▼
                                                                </span>
                                                            </div>
                                                        </button>
                                                        
                                                        {isOpen && (
                                                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                                                {variantAddonGroup.addon_group_options && variantAddonGroup.addon_group_options.length > 0 ? (
                                                                    <div className="space-y-3">
                                                                        {variantAddonGroup.addon_group_options.map((option, optionIdx) => (
                                                                            <div key={optionIdx} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 flex items-center justify-between">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                                                                                        <Plus className="w-3 h-3 text-white" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <h5 className="font-medium text-gray-900 dark:text-gray-100">
                                                                                            {option.addon?.name || '-'}
                                                                                        </h5>
                                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                                            Máximo: {option.quantity}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                                                                        + R$ {Number(option.additional_price || 0).toFixed(2).replace('.', ',')}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center py-6">
                                                                        <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                                        <p className="text-gray-500 dark:text-gray-400">Nenhuma opção cadastrada</p>
                                                                    </div>
                                                                )}

                                                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                                    {variantAddonGroup.addon_group_options && variantAddonGroup.addon_group_options.length > 0 && (
                                                                        <button
                                                                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium transition-all duration-200"
                                                                            onClick={() => {
                                                                                setIsAddonGroupOptionsDeleteModalOpen(true);
                                                                                setAddonGroupId(variantAddonGroup.id ?? null);
                                                                            }}
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                            Remover opção
                                                                        </button>
                                                                    )}

                                                                    <button
                                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/40 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium transition-all duration-200"
                                                                        onClick={() => {
                                                                            setAddonGroupId(0);
                                                                            setTimeout(() => {
                                                                                setAddonGroupId(variantAddonGroup.id ?? null);
                                                                                setIsAddonGroupOptionsModalOpen(true);
                                                                            }, 100);
                                                                        }}
                                                                    >
                                                                        <PlusCircle className="w-3 h-3" />
                                                                        Add opção
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                                            <ListPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum grupo de opções cadastrado</p>
                                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Clique em "Adicionar Grupo" para começar</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {tab === 'complementos' && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border-l-4 border-amber-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className='text-xl font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2'>
                                            <Plus className="w-5 h-5" />
                                            Complementos Extras
                                        </h3>
                                        <div className="flex gap-2">
                                            {variant?.variant_addons && variant.variant_addons.length > 0 && (
                                                <button 
                                                    onClick={() => setIsAddonDeleteModalOpen(true)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 rounded-xl font-medium transition-all duration-200"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remover
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => setIsAddonModalOpen(true)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                <PlusCircle className="w-4 h-4" />
                                                Adicionar Complemento
                                            </button>
                                        </div>
                                    </div>

                                    {variant?.variant_addons && variant.variant_addons.length > 0 ? (
                                        <div className="grid gap-3">
                                            {variant.variant_addons.map((variantAddon, idx) => (
                                                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                                                            <Plus className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                                {variantAddon.addon?.name || '-'}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Complemento adicional
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right space-y-1">
                                                        <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm font-semibold">
                                                            Qtd: {variantAddon.quantity}
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            R$ {Number(variantAddon.price || 0).toFixed(2).replace('.', ',')}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                                            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum complemento cadastrado</p>
                                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Clique em "Adicionar Complemento" para começar</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <VariantIngredientFormModal
                            sp_variant_id={variant?.id}
                            isOpen={isIngredientModalOpen}
                            onClose={() => setIsIngredientModalOpen(false)}
                            units={units.data}
                        />

                        {variant?.variant_ingredients && variant.variant_ingredients.length > 0 && (
                            <VariantIngredientDeleteFormModal
                                isOpen={isIngredientDeleteModalOpen}
                                onClose={() => setIsIngredientDeleteModalOpen(false)}
                                variantIngredients={variant.variant_ingredients}
                            />
                        )}

                        <VariantAddonGroupFormModal
                            sp_variant_id={variant?.id}
                            isOpen={isOptionGroupModalOpen}
                            onClose={() => setIsOptionGroupModalOpen(false)}
                        />

                        {variant?.variant_addon_groups && (variant.variant_addon_groups.length > 0) && (
                            <VariantAddonGroupDeleteFormModal
                                isOpen={isOptionGroupDeleteModalOpen}
                                onClose={() => setIsOptionGroupDeleteModalOpen(false)}
                                variantAddonGroups={variant.variant_addon_groups}
                            />
                        )}

                        {addonGroupId && (
                            <AddonGroupOptionFormModal
                                isOpen={isAddonGroupOptionsModalOpen}
                                onClose={() => setIsAddonGroupOptionsModalOpen(false)}
                                addon_group_id={addonGroupId ?? 0}
                            />
                        )}

                        {variant?.variant_addon_groups && (variant.variant_addon_groups.length > 0) && (addonGroupId !== null) && (
                            <AddonGroupOptionDeleteFormModal
                                isOpen={isAddonGroupOptionsDeleteModalOpen}
                                onClose={() => setIsAddonGroupOptionsDeleteModalOpen(false)}
                                addonGroupOptions={
                                    variant.variant_addon_groups
                                        .find(group => group.id === addonGroupId)
                                        ?.addon_group_options ?? []
                                }
                            />
                        )}

                        <VariantAddonFormModal
                            sp_variant_id={variant?.id}
                            units={units.data}
                            isOpen={isAddonModalOpen}
                            onClose={() => setIsAddonModalOpen(false)}
                        />

                        {variant?.variant_addons && variant.variant_addons.length > 0 && (
                            <VariantAddonDeleteFormModal
                                isOpen={isAddonDeleteModalOpen}
                                onClose={() => setIsAddonDeleteModalOpen(false)}
                                variantAddons={variant.variant_addons}
                            />
                        )}
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}