import MenuDayFormModal from '@/Components/MenuDayFormModal';
import MenuScheduleFormModal from '@/Components/MenuScheduleFormModal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Addon } from '@/types/Addon';
import Menu from '@/types/Menu';
import MenuDay from '@/types/MenuDay';
import MenuSchedule from '@/types/MenuSchedule';
import { StoreProductVariant } from '@/types/StoreProductVariant';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

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
    const { data, setData, patch, delete: destroy, errors, processing } = useForm({
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
    const allProductsSelected = data.store_product_variant_ids.length === allProductIds.length;
    const allAddonsSelected = data.addon_ids.length === allAddonIds.length;

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        patch(route('menus.update', menu.data.id), {
            preserveScroll: true,
        });
    }

    const handleDeleteSchedule = (schedule: MenuSchedule) => {
        const time = new Date(schedule.start_at).toLocaleDateString() + ' ' + new Date(schedule.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' até ' + new Date(schedule.end_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        Swal.fire({
            title: 'Tem certeza que deseja deletar este horário: ' + time + '?',
            text: 'Esta ação não pode ser desfeita.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, deletar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('menu.schedules.destroy', { id: schedule.id }), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire(
                            'Deletado!',
                            'O horário foi deletado com sucesso.',
                            'success'
                        );
                    },
                });
            }
        });
    }

    const handleDeleteDay = (menuDay: MenuDay) => {
        const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const dayName = dayNames[menuDay.weekday];

        Swal.fire({
            title: 'Tem certeza que deseja deletar: ' + dayName + '?',
            text: 'Esta ação não pode ser desfeita.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, deletar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('menu.days.destroy', { id: menuDay.id }), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire(
                            'Deletado!',
                            'O dia foi deletado com sucesso.',
                            'success'
                        );
                    },
                });
            }
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

            <div className="p-4 max-w-7xl">
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
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

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
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
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-6 gap-2">
                                        {menu.data.days && menu.data.days.length > 0 ? (
                                            menu.data.days.map((day) => (
                                                <div
                                                    key={day.id}
                                                    className="border border-gray-300 dark:border-gray-700 rounded-lg p-4"
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h5 className="font-semibold text-gray-800 dark:text-gray-200">
                                                            {['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'][day.weekday]}
                                                        </h5>
                                                        <button
                                                            onClick={() => handleDeleteDay(day)}
                                                            className="text-red-600 hover:text-red-500"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
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
                                    <div className="bg-white/50 dark:bg-gray-800/50">
                                        {menu.data.schedules && menu.data.schedules.length > 0 ? (
                                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2">
                                                {menu.data.schedules.map((schedule) => {
                                                    const startDate = new Date(schedule.start_at);
                                                    const endDate = new Date(schedule.end_at);
                                                    const formattedDate = startDate.toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    });
                                                    const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                    const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                                    return (
                                                    <li
                                                        key={schedule.id}
                                                        className="flex flex-col bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all relative"
                                                    >
                                                        <button
                                                            onClick={() => handleDeleteSchedule(schedule)}
                                                            className="mt-2 text-red-600 hover:text-red-500 absolute top-0 right-2"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>

                                                        <span className="font-medium text-gray-800 dark:text-gray-100">{formattedDate}</span>
                                                        <span className="text-gray-600 dark:text-gray-400 text-sm mt-1 sm:mt-0">
                                                            {startTime} <span className="text-gray-400">até</span> {endTime}
                                                        </span>
                                                    </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 italic">
                                            Nenhum horário configurado ainda.
                                            </p>
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
