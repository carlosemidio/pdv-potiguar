import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { User } from '@/types/user';
import { can } from '@/utils/authorization';
import { Button } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ChevronDown, Gauge, KeySquare, Mail, Menu, MonitorCog, Store, Table, UserCircle2, X } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { CgProductHunt } from 'react-icons/cg';
import { MdAddCircle, MdBrandingWatermark, MdCategory } from 'react-icons/md';
import { TbMenuOrder } from 'react-icons/tb';

export default function Authenticated({
    user,
    header,
    children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
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
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className={`lg:block lg:inset-y-0 lg:left-0 lg:w-80 lg:bg-white lg:dark:bg-gray-800 `}>
                <nav
                    className={`transition-all duration-300 transform fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 shadow-lg lg:shadow-none w-64 lg:w-80
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:fixed lg:inset-y-0 lg:w-80`}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center  border-gray-200 dark:border-gray-700 h-[73px] px-5 ">
                            <Link href={route('home')} className="my-auto">
                                <div className='flex items-center gap-4'>
                                    <ApplicationLogo className="block transition-all duration-300 w-16" src={user?.store?.image?.file_url} />
                                    <h1 className='tracking-wide uppercase'>{user?.store?.name}</h1>
                                </div>
                            </Link>
                            <X onClick={() => setSidebarOpen(!sidebarOpen)}
                                className='dark:text-gray-300 text-gray-800 lg:hidden'
                            ></X>
                        </div>

                        {/* Navigation links */}
                        <div className="flex-grow flex flex-col gap-2 overflow-y-auto p-4">
                            <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                <div className='flex gap-2 items-center'>
                                    <Gauge size={24} />
                                    <p>Dashboard</p>
                                </div>
                            </NavLink>
                            
                            {can('permissions_view') && (
                                <NavLink href={route('permission.index')} active={route().current('permission.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <KeySquare className="w-6 h-6" />
                                        <p>Permissões</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('orders_view') && (
                                <NavLink href={route('orders.index')} active={route().current('orders.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <TbMenuOrder className="w-6 h-6" />
                                        <p>Pedidos</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('customers_view') && (
                                <NavLink href={route('customers.index')} active={route().current('customers.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <UserCircle2 className="w-6 h-6" />
                                        <p>Clientes</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('tables_view') && (
                                <NavLink href={route('tables.index')} active={route().current('tables.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <Table className="w-6 h-6" />
                                        <p>Mesas</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('stores_view') && (
                                <NavLink href={route('store.index')} active={route().current('store.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <Store className="w-6 h-6" />
                                        <p>Lojas</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('categories_view') && (
                                <NavLink href={route('categories.index')} active={route().current('categories.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <MdCategory className="w-6 h-6" />
                                        <p>Categorias</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('brands_view') && (
                                <NavLink href={route('brands.index')} active={route().current('brands.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <MdBrandingWatermark className="w-6 h-6" />
                                        <p>Marcas</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('products_view') && (
                                <NavLink href={route('product.index')} active={route().current('product.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <CgProductHunt className="w-6 h-6" />
                                        <p>Produtos</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('addons_view') && (
                                <NavLink href={route('addons.index')} active={route().current('addons.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <MdAddCircle className="w-6 h-6" />
                                        <p>Complementos</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('roles_view') && (
                                <NavLink href={route('role.index')} active={route().current('role.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <MonitorCog className="w-6 h-6" />
                                        <p>Funções</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('users_view') && (
                                <NavLink href={route('user.index')} active={route().current('user.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <UserCircle2 className="w-6 h-6" />
                                        <p>Usuários</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('clients_view') && (
                                <NavLink href={route('clientes.index')} active={route().current('clientes.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <UserCircle2 className="w-6 h-6" />
                                        <p>Clientes</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('projects_view') && (
                                <NavLink href={route('project.index')} active={route().current('project.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <UserCircle2 className="w-6 h-6" />
                                        <p>Projetos</p>
                                    </div>
                                </NavLink>
                            )}

                            {can('notifications_view') && (
                                <NavLink href={route('notification.index')} active={route().current('notification.index')}>
                                    <div className='flex gap-2 items-center'>
                                        <Mail className="w-6 h-6" />
                                        <p>Notificações {unreadNotificationsCount > 0 && (
                                            <span className='bg-red-500 text-white rounded-full px-2'>{unreadNotificationsCount}</span>
                                        )}</p>
                                    </div>
                                </NavLink>
                            )}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Main content area */}
            <div className={`flex-1 transition-all duration-300`}>
                {header && (
                    <header className="flex justify-between lg:justify-end items-center px-8 py-4  bg-white shadow dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        <Menu
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className='lg:hidden'
                        ></Menu>
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
                <main className="bg-gray-100 dark:bg-gray-900 h-full">
                    <div className="uppercase tracking-widest px-4 pt-8 lg:px-8 lg:pt-8">
                        <div className='flex items-center gap-2'>
                            {header}
                            <div className='flex-1 h-[1px] bg-gray-400 dark:bg-gray-500'></div>
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
            </div>
        </div>
    );
}