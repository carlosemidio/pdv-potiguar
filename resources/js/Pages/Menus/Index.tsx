import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash, Plus, Award } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import MenuFormModal from '@/Components/MenuFormModal';
import SimpleSearchBar from '@/Components/SimpleSearchBar';
import Menu from '@/types/Menu';
import Pagination from '@/Components/Pagination/Pagination';

export default function Index({
    auth,
    menus,
    search,
}: PageProps<{ menus: PaginatedData<Menu>, search?: string }>) {

    const [confirmingMenuDeletion, setConfirmingMenuDeletion] = useState(false);
    const [menuIdToDelete, setMenuIdToDelete] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [menuToEdit, setMenuToEdit] = useState<Menu | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm();

    const confirmMenuDeletion = (id: number) => {
        setMenuIdToDelete(id);
        setConfirmingMenuDeletion(true);
    };

    const deleteMenu = () => {
        destroy(route('menus.destroy', { id: menuIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingMenuDeletion(false);
        setMenuIdToDelete(null);
        clearErrors();
        reset();
    };

    const openModal = (menu: Menu | null) => {
        setMenuToEdit(menu);
        setIsOpen(true);
    };

    const menuToDelete = menus?.data?.find
        ? menus.data.find(menu => menu.id === menuIdToDelete)
        : null;

    const {
        meta: { links },
    } = menus;

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Menus
                    </h1>
                    {can('menus_create') && (
                        <button
                            onClick={() => openModal(null)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Novo Menu
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Menus" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-6 max-w-7xl">

                    {/* Menus Grid */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Lista de Menus
                            </h3>
                            <div className="mt-4">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Filtros de Busca
                                    </h3>
                                    <SimpleSearchBar field='name' search={search} />
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {menus?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                                    {menus.data.map((menu) => (
                                        <Link key={menu.id} href={route('menus.show', menu.id)} className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-200 relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {menu.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                                            {menu.name}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 absolute top-1 right-1">
                                                {can('menus_edit') && (
                                                    <button
                                                        onClick={() => openModal(menu)}
                                                        className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 transition-colors"
                                                        title="Editar menu"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {can('menus_delete') && (
                                                    <button
                                                        onClick={() => confirmMenuDeletion(menu.id)}
                                                        className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition-colors"
                                                        title="Excluir menu"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <Award className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                Nenhum menu encontrado
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                Comece adicionando seu primeiro menu.
                                            </p>
                                        </div>
                                        {can('menus_create') && (
                                            <button
                                                onClick={() => openModal(null)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Adicionar Menu
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Pagination links={links} />
                    </div>
                </div>
            </div>

            <MenuFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} menu={menuToEdit ?? undefined} />

            {can('menus_create') && (
                <button
                    aria-label="Novo menu"
                    className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg h-14 w-14 transition-all duration-200 hover:shadow-xl"
                    onClick={() => openModal(null)}
                >
                    <Plus className="h-6 w-6" />
                </button>
            )}

            {menuToDelete && (
                <Modal show={confirmingMenuDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteMenu(); }} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar o menu <span className="font-bold">{menuToDelete.name}</span>?
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Uma vez que o menu é deletado, todos os seus recursos e dados serão permanentemente deletados.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>
                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar Menu
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}
