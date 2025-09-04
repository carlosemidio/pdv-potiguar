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
                ' tracking-widest uppercase transition-all duration-150 ease-in-out p-3 bg-gray-100 dark:bg-gray-700/50 rounded shadow ' +
                (active
                    ? 'text-gray-900 dark:text-gray-100 font-semibold bg-gray-200 dark:bg-gray-700/90 pl-8'
                    : 'text-gray-600 bg-gray-100 hover:text-gray-700 dark::bg-gray-500 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300') +
                className
            }
        >
            {children}
        </Link>
    );
}
