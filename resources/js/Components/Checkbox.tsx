import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-gray-500 shadow-sm focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-800 ' +
                className
            }
        />
    );
}
