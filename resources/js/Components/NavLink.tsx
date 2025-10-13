import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'relative group flex items-center transition-all duration-200 ease-in-out px-3 py-2.5 rounded-lg text-sm font-medium ' +
                (active
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01]') +
                ' ' + className
            }
        >
            {!active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}
            {children}
        </Link>
    );
}
