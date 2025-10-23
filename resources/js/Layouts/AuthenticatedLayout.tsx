import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import NavLinkGroup from '@/Components/NavLinkGroup';
import { User } from '@/types/User';
import { can } from '@/utils/authorization';
import { Button } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ChevronDown, Gauge, KeySquare, Mail, Menu, Store, Table, UserCircle2, X, ShoppingCart, Package, Users, Settings, BarChart3, FileText, Utensils, Boxes, Tag, Palette } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { MdOutlineExtension, MdPrint } from 'react-icons/md';

export default function Authenticated({
    user,
    pendingOrdersCount,
    header,
    children,
}: PropsWithChildren<{ user: User; pendingOrdersCount: number; header?: ReactNode }>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);  // Estado para controlar a sidebar
    const { data, setData, get } = useForm({
        id: user?.store?.id,
    });

    const { flash, unreadNotificationsCount } = usePage().props;

    function setStore(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        return get(route('store.select', data.id));
    }

    function storesNumber() {
        return user?.stores?.length || 0;
    };

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <div className={`lg:block lg:inset-y-0 lg:left-0 lg:w-80 lg:bg-white lg:dark:bg-gray-800`}>
                <nav
                    className={`transition-all duration-300 transform fixed inset-y-0 left-0 z-[999] bg-white dark:bg-gray-800 shadow-xl lg:shadow-none w-64 lg:w-80
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:fixed lg:inset-y-0 lg:w-80 border-r border-gray-200 dark:border-gray-700`}
                >
                    <div className="flex flex-col h-full">
                        {/* Logo/Header */}
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 h-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
                            <Link href={route('home')} className="my-auto">
                                <div className='flex items-center gap-3'>
                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm p-2 flex items-center justify-center">
                                        <ApplicationLogo className="block transition-all duration-300 w-8 h-8" src={user?.store?.image?.file_url} />
                                    </div>
                                    <div>
                                        <h1 className='tracking-wide font-bold text-white text-lg'>{user?.store?.name || 'PDV Potiguar'}</h1>
                                        <p className="text-blue-100 text-xs">Sistema de Gestão</p>
                                    </div>
                                </div>
                            </Link>
                            <button
                                type="button"
                                aria-label="Fechar menu"
                                onClick={() => setSidebarOpen(false)}
                                className='p-2 rounded-lg hover:bg-white/10 text-white lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors'
                            >
                                <X className='w-6 h-6' />
                            </button>
                        </div>

                        {/* Navigation links */}
                        <div className="flex-grow flex flex-col overflow-y-auto p-4 pb-20 space-y-1">
                            {/* Dashboard - Sempre visível */}
                            <div className="mb-4">
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 mb-2">
                                    Principal
                                </h3>
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    <div className='flex gap-3 items-center'>
                                        <Gauge className="w-5 h-5" />
                                        <p>Dashboard</p>
                                    </div>
                                </NavLink>
                            </div>

                            {/* Operações do Dia a Dia */}
                            <div className="mb-4">
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 mb-2">
                                    Operações
                                </h3>

                                {can('cash-registers_view') && (
                                    <NavLink href={route('cash.index')} active={route().current('cash.*')}>
                                        <div className='flex gap-3 items-center'>
                                            <BarChart3 className="w-5 h-5" />
                                            <p>Caixa</p>
                                        </div>
                                    </NavLink>
                                )}
                                
                                {can('orders_view') && (
                                    <NavLink href={route('orders.index')} active={route().current('orders.*')}>
                                        <div className='flex gap-3 items-center'>
                                            <ShoppingCart className="w-5 h-5" />
                                            <div className="flex-1 flex items-center justify-between">
                                                <p>Pedidos</p>
                                                {pendingOrdersCount > 0 && (
                                                    <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-medium animate-pulse">
                                                        {pendingOrdersCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </NavLink>
                                )}

                                {can('tables_view') && (
                                    <NavLink href={route('tables.index')} active={route().current('tables.index')}>
                                        <div className='flex gap-3 items-center'>
                                            <Table className="w-5 h-5" />
                                            <p>Mesas</p>
                                        </div>
                                    </NavLink>
                                )}

                                {can('stock-movements_view') && (
                                    <NavLink href={route('stock-movement.index')} active={route().current('stock-movement.*')}>
                                        <div className='flex gap-3 items-center'>
                                            <Boxes className="w-5 h-5" />
                                            <p>Controle de Estoque</p>
                                        </div>
                                    </NavLink>
                                )}
                            </div>

                            {/* Gestão de Clientes */}
                            {(can('customers_view') || can('clients_view')) && (
                                <div className="mb-4">
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 mb-2">
                                        Clientes
                                    </h3>
                                    
                                    {can('customers_view') && (
                                        <NavLink href={route('customers.index')} active={route().current('customers.index')}>
                                            <div className='flex gap-3 items-center'>
                                                <Users className="w-5 h-5" />
                                                <p>Clientes</p>
                                            </div>
                                        </NavLink>
                                    )}

                                    {can('clients_view') && (
                                        <NavLink href={route('clientes.index')} active={route().current('clientes.index')}>
                                            <div className='flex gap-3 items-center'>
                                                <Users className="w-5 h-5" />
                                                <p>Clientes (Legacy)</p>
                                            </div>
                                        </NavLink>
                                    )}
                                </div>
                            )}

                            {/* Catálogo de Produtos */}
                            {(can('products_view') || can('store-product-variants_view') || can('product-variants_view') || can('categories_view') || can('brands_view') || can('ingredients_view') || can('addons_view')) && (
                                <div className="mb-4">
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 mb-2">
                                        Catálogo
                                    </h3>

                                    {(can('products_view') || can('store-product-variants_view') || can('product-variants_view')) && (
                                        <NavLinkGroup title="Produtos" icon={<Package className="w-5 h-5" />} open={route().current('product.*') || route().current('store-product-variant.*') || route().current('product-variant.*')}>
                                            {can('products_view') && (
                                                <NavLink href={route('product.index')} active={route().current('product.*')}>
                                                    <div className='flex gap-3 items-center'>
                                                        <FileText className="w-4 h-4" />
                                                        <p>Modelos</p>
                                                    </div>
                                                </NavLink>
                                            )}
                                            {can('product-variants_view') && (
                                                <NavLink href={route('product-variant.index')} active={route().current('product-variant.*')}>
                                                    <div className='flex gap-3 items-center'>
                                                        <Package className="w-4 h-4" />
                                                        <p>Variantes</p>
                                                    </div>
                                                </NavLink>
                                            )}
                                            
                                            {can('store-product-variants_view') && (
                                                <NavLink href={route('store-product-variant.index')} active={route().current('store-product-variant.*')}>
                                                    <div className='flex gap-3 items-center'>
                                                        <ShoppingCart className="w-4 h-4" />
                                                        <p>Produtos da Loja</p>
                                                    </div>
                                                </NavLink>
                                            )}                                    
                                        </NavLinkGroup>
                                    )}

                                    {can('categories_view') && (
                                        <NavLink href={route('categories.index')} active={route().current('categories.index')}>
                                            <div className='flex gap-3 items-center'>
                                                <Tag className="w-5 h-5" />
                                                <p>Categorias</p>
                                            </div>
                                        </NavLink>
                                    )}

                                    {can('brands_view') && (
                                        <NavLink href={route('brands.index')} active={route().current('brands.index')}>
                                            <div className='flex gap-3 items-center'>
                                                <Palette className="w-5 h-5" />
                                                <p>Marcas</p>
                                            </div>
                                        </NavLink>
                                    )}

                                    {can('ingredients_view') && (
                                        <NavLink href={route('ingredients.index')} active={route().current('ingredients.index')}>
                                            <div className='flex gap-3 items-center'>
                                                <Utensils className="w-5 h-5" />
                                                <p>Ingredientes</p>
                                            </div>
                                        </NavLink>
                                    )}

                                    {can('addons_view') && (
                                        <NavLink href={route('addons.index')} active={route().current('addons.index')}>
                                            <div className='flex gap-3 items-center'>
                                                <MdOutlineExtension className="w-5 h-5" />
                                                <p>Complementos</p>
                                            </div>
                                        </NavLink>
                                    )}
                                </div>
                            )}

                            {/* Gestão de Lojas */}
                            {(can('stores_view') || can('printers_view')) && (
                                <div className="mb-4">
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 mb-2">
                                        Lojas
                                    </h3>
                                    
                                    {can('stores_view') && (
                                        <NavLink href={route('store.index')} active={route().current('store.*')}>
                                            <div className='flex gap-3 items-center'>
                                                <Store className="w-5 h-5" />
                                                <p>Lojas</p>
                                            </div>
                                        </NavLink>
                                    )}

                                    {can('printers_view') && (
                                        <NavLink href={route('printers.index')} active={route().current('printers.index')}>
                                            <div className='flex gap-3 items-center'>
                                                <MdPrint className="w-5 h-5" />
                                                <p>Impressoras</p>
                                            </div>
                                        </NavLink>
                                    )}
                                </div>
                            )}

                            {/* Administração do Sistema */}
                            {(can('permissions_view') || can('tenants_view') || can('roles_view') || can('users_view') || can('notifications_view')) && (
                                <div className="mb-4">
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 mb-2">
                                        Administração
                                    </h3>
                                    
                                    {can('tenants_view') && (
                                        <NavLink href={route('tenant.index')} active={route().current('tenant.*')}>
                                            <div className='flex gap-3 items-center'>
                                                <BarChart3 className="w-5 h-5" />
                                                <p>Empresas</p>
                                            </div>
                                        </NavLink>
                                    )}

                                    {can('users_view') && (
                                        <NavLink href={route('user.index')} active={route().current('user.*')}>
                                            <div className='flex gap-3 items-center'>
                                                <UserCircle2 className="w-5 h-5" />
                                                <p>Usuários</p>
                                            </div>
                                        </NavLink>
                                    )}

                                    {can('roles_view') && (
                                        <NavLink href={route('role.index')} active={route().current('role.*')}>
                                            <div className='flex gap-3 items-center'>
                                                <Settings className="w-5 h-5" />
                                                <p>Funções</p>
                                            </div>
                                        </NavLink>
                                    )}

                                    {can('permissions_view') && (
                                        <NavLink href={route('permission.index')} active={route().current('permission.index')}>
                                            <div className='flex gap-3 items-center'>
                                                <KeySquare className="w-5 h-5" />
                                                <p>Permissões</p>
                                            </div>
                                        </NavLink>
                                    )}

                                    {can('notifications_view') && (
                                        <NavLink href={route('notification.index')} active={route().current('notification.index')}>
                                            <div className='flex gap-3 items-center'>
                                                <Mail className="w-5 h-5" />
                                                <div className="flex-1 flex items-center justify-between">
                                                    <p>Notificações</p>
                                                    {unreadNotificationsCount > 0 && (
                                                        <span className='bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-medium'>{unreadNotificationsCount}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </NavLink>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile overlay for sidebar */}
            <div
                className={`fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
                aria-hidden={!sidebarOpen}
            />

            {/* Main content area */}
            <div className={`flex-1 transition-all duration-300`}>
                {header && (
                    <header className="flex justify-between lg:justify-end items-center px-4 py-3 lg:px-8 lg:py-4 bg-white shadow dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        <button
                            type="button"
                            aria-label="Abrir menu"
                            onClick={() => setSidebarOpen(true)}
                            className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <Menu className='w-6 h-6' />
                        </button>
                        <div className="flex flex-row">
                            {(storesNumber() == 0) && (
                                <div className="flex items-center gap-2">
                                    <p className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-400">ADMIN</p>
                                </div>
                            )}
                            {(storesNumber() == 1) && (
                                <div className="flex items-center gap-2">
                                    <p className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-400">{user?.store?.name}</p>
                                </div>
                            )}
                            {(storesNumber() > 1) && (
                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                >
                                                    {user?.store?.name}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            {user?.stores?.sort((a, b) => a.name.localeCompare(b.name)).map((store) => (
                                                <form onSubmit={setStore} key={store.id}>
                                                    <Button
                                                        onClick={() => setData('id', store.id)}
                                                        type="submit"
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-300"
                                                    >
                                                        {store?.name}
                                                    </Button>
                                                </form>
                                            ))}
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            )}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex items-center rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-900 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        >
                                            {user.name}
                                            <ChevronDown className="w-6 h-6" />
                                        </button>
                                    </span>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </header>
                )}
                <main className="bg-gray-50 dark:bg-gray-900 h-full pb-20 lg:pb-0">
                    <div className="px-2 pt-4 pb-2 lg:px-8 lg:pt-6 lg:pb-4">
                        <div className='flex items-center gap-3'>
                            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                {header}
                            </div>
                            <div className='flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600'></div>
                        </div>
                    </div>
                    
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-4 mt-4" role="alert">
                            <strong className="font-bold">Sucesso!</strong>
                            <br />
                            <span className="block sm:inline" dangerouslySetInnerHTML={{ __html: flash.success }}></span>
                        </div>
                    )}

                    {flash?.fail && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 mt-4" role="alert">
                            <strong className="font-bold">Erro!</strong>
                            <br />
                            <span className="block sm:inline" dangerouslySetInnerHTML={{ __html: flash.fail }}></span>
                        </div>
                    )}

                    { children }
                </main>
                {/* Bottom Navigation (mobile) */}
                <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 lg:hidden shadow-lg">
                    <div className="grid grid-cols-4 px-2 py-1">
                        <Link href={route('cash.index')} className={`flex flex-col items-center py-2 px-2 rounded-lg mx-1 transition-all duration-200 ${route().current('cash.*') ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            <Package className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium">Caixa</span>
                        </Link>

                        <Link href={route('orders.index')} className={`flex flex-col items-center py-2 px-2 rounded-lg mx-1 transition-all duration-200 relative ${route().current('orders.*') ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            <ShoppingCart className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium">Pedidos</span>
                            {pendingOrdersCount > 0 && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                    {pendingOrdersCount}
                                </div>
                            )}
                        </Link>
                        <Link href={route('tables.index')} className={`flex flex-col items-center py-2 px-2 rounded-lg mx-1 transition-all duration-200 ${route().current('tables.index') ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            <Gauge className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium">Mesas</span>
                        </Link>
                        <Link href={route('customers.index')} className={`flex flex-col items-center py-2 px-2 rounded-lg mx-1 transition-all duration-200 ${route().current('customers.*') ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            <Boxes className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium">Clientes</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    );
}