import MenuDayFormModal from '@/Components/MenuDayFormModal';
import MenuScheduleFormModal from '@/Components/MenuScheduleFormModal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Addon } from '@/types/Addon';
import Menu from '@/types/Menu';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function Show({
    auth,
    menu,
    storeProductVariants,
    addons,
}: PageProps<{
    menu: { data: Menu };
    storeProductVariants: { data: StoreProductVariant[] };
    addons: { data: Addon[] };
}>) {
    const { data, setData, patch, errors, processing } =
        useForm({
            name: menu.data.name,
            is_permanent: menu.data.is_permanent,
            store_product_variant_ids: menu.data.store_product_variants?.map((p) => p.id) || [],
            addon_ids: menu.data.addons?.map((a) => a.id) || [],
        });

    const [activeTab, setActiveTab] = useState<'items' | 'availability'>('items');
    const [openScheduleModal, setOpenScheduleModal] = useState(false);
    const [openDayModal, setOpenDayModal] = useState(false);

    const allProductIds = storeProductVariants.data.map((p) => p.id);
    const allAddonIds = addons.data.map((a) => a.id);

    const toggleProduct = (id: number) => {
        setData((prev) => {
            const selectedProducts = prev.store_product_variant_ids || [];
            if (selectedProducts.includes(id)) {
                return {
                    ...prev,
                    store_product_variant_ids: selectedProducts.filter((p) => p !== id),
                };
            } else {
                return {
                    ...prev,
                    store_product_variant_ids: [...selectedProducts, id],
                };
            }
        });
    };

    const toggleAddon = (id: number) => {
        setData((prev) => {
            const selectedAddons = prev.addon_ids || [];
            if (selectedAddons.includes(id)) {
                return {
                    ...prev,
                    addon_ids: selectedAddons.filter((a) => a !== id),
                };
            } else {
                return {
                    ...prev,
                    addon_ids: [...selectedAddons, id],
                };
            }
        });
    };

    const toggleAllProducts = () => {
        setData((prev) => {
            const selectedProducts = prev.store_product_variant_ids || [];
            return {
                ...prev,
                store_product_variant_ids:
                    selectedProducts.length === allProductIds.length
                        ? []
                        : allProductIds,
            };
        });
    };

    const toggleAllAddons = () => {
        setData((prev) => {
            const selectedAddons = prev.addon_ids || [];
            return {
                ...prev,
                addon_ids:
                    selectedAddons.length === allAddonIds.length
                        ? []
                        : allAddonIds,
            };
        });
    };

    const allProductsSelected = data.store_product_variant_ids.length === allProductIds.length;
    const allAddonsSelected = data.addon_ids.length === allAddonIds.length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        patch(route('menus.update', menu.data.id), {
            preserveScroll: true,
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Menu: {menu.data.name}
                </h2>
            }
        >
            <Head title={`Menu: ${menu.data.name}`} />

            <div className="py-6 px-4 max-w-5xl mx-auto">
                {/* Voltar */}
                <div className="mb-6">
                    <Link href={route('menus.index')}>
                        <SecondaryButton className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar
                        </SecondaryButton>
                    </Link>
                </div>

                {/* Card principal */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {menu.data.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Criado em: {new Date(menu.data.created_at).toLocaleDateString()}
                    </p>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-6 flex gap-6">
                        <button
                            className={`pb-2 font-semibold text-sm ${
                                activeTab === 'items'
                                    ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                            onClick={() => setActiveTab('items')}
                        >
                            Itens
                        </button>
                        <button
                            className={`pb-2 font-semibold text-sm ${
                                activeTab === 'availability'
                                    ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                            onClick={() => setActiveTab('availability')}
                        >
                            Disponibilidade
                        </button>
                    </div>

                    {/* Conteúdo das abas */}
                    {activeTab === 'items' && (
                        <div className="space-y-10">
                            {/* Produtos */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        Produtos ({storeProductVariants.data.length})
                                    </h4>
                                    {storeProductVariants.data.length > 0 && (
                                        <button
                                            onClick={toggleAllProducts}
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            {allProductsSelected
                                                ? 'Desmarcar todos'
                                                : 'Selecionar todos'}
                                        </button>
                                    )}
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                    {storeProductVariants.data.map((variant) => (
                                        <label
                                            key={variant.id}
                                            className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg px-3 py-2 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.store_product_variant_ids.includes(variant.id)}
                                                onChange={() => toggleProduct(variant.id)}
                                                className="w-5 h-5 accent-indigo-600"
                                            />
                                            <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                                                {variant?.product_variant?.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Adicionais */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        Adicionais ({addons.data.length})
                                    </h4>
                                    {addons.data.length > 0 && (
                                        <button
                                            onClick={toggleAllAddons}
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            {allAddonsSelected
                                                ? 'Desmarcar todos'
                                                : 'Selecionar todos'}
                                        </button>
                                    )}
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                    {addons.data.map((addon) => (
                                        <label
                                            key={addon.id}
                                            className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg px-3 py-2 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.addon_ids.includes(addon.id)}
                                                onChange={() => toggleAddon(addon.id)}
                                                className="w-5 h-5 accent-indigo-600"
                                            />
                                            <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                                                {addon.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <PrimaryButton onClick={handleSubmit} disabled={processing}>
                                    Salvar Itens
                                </PrimaryButton>
                            </div>
                        </div>
                    )}

                    {activeTab === 'availability' && (
                        <div>
                            {menu.data.is_permanent ? (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                        Dias fixos da semana
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Configure os dias e horários de funcionamento do menu.
                                    </p>

                                    {/* Exemplo: placeholders para menu_days */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {menu.data.days && menu.data.days.length > 0 ? (
                                            menu.data.days.map((day) => (
                                                <div
                                                    key={day.id}
                                                    className="border border-gray-300 dark:border-gray-700 rounded-lg p-4"
                                                >
                                                    <h5 className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'][day.weekday]}
                                                    </h5>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {day.opens_at}
                                                        {' '}até{' '}
                                                        {day.closes_at}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Nenhum dia configurado ainda.
                                            </p>
                                        )}
                                    </div>

                                    <MenuDayFormModal
                                        isOpen={openDayModal}
                                        onClose={() => setOpenDayModal(false)}
                                        menuId={menu.data.id}
                                    />

                                    <div className="mt-6">
                                        <SecondaryButton
                                            onClick={() => setOpenDayModal(true)}
                                        >
                                            Adicionar/Editar dia
                                        </SecondaryButton>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                        Horários agendados
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Este menu usa agendamentos personalizados.
                                    </p>

                                    {/* Placeholder para MenuSchedule */}
                                    <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center text-gray-500 dark:text-gray-400">
                                        {menu.data.schedules && menu.data.schedules.length > 0 ? (
                                            <ul className="space-y-2">
                                                {menu.data.schedules.map((schedule) => (
                                                    <li key={schedule.id} className="flex justify-between">
                                                        <span>
                                                            {new Date(schedule.start_at).toLocaleDateString()}:
                                                        </span>
                                                        <span>
                                                            {new Date(schedule.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            {' '}até{' '}
                                                            {new Date(schedule.end_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            'Nenhum horário configurado ainda.'
                                        )}
                                    </div>

                                    <MenuScheduleFormModal
                                        isOpen={openScheduleModal}
                                        onClose={() => setOpenScheduleModal(false)}
                                        menuId={menu.data.id}
                                    />

                                    <div className="mt-6">
                                        <SecondaryButton
                                            onClick={() => setOpenScheduleModal(true)}
                                        >
                                            Adicionar horário
                                        </SecondaryButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
