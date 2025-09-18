import { ButtonHTMLAttributes } from 'react';

type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: Size;
    fullWidth?: boolean;
    rounded?: boolean;
};

export default function DangerButton({
    className = '',
    disabled,
    children,
    size = 'md',
    fullWidth = false,
    rounded = false,
    ...props
}: Props) {
    const sizeClasses: Record<Size, string> = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-xs',
        lg: 'px-5 py-3 text-sm',
    };
    return (
        <button
            {...props}
            className={
                `inline-flex items-center ${rounded ? 'rounded-full' : 'rounded-md'} border border-transparent bg-red-600 ${sizeClasses[size]} font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700 dark:focus:ring-offset-gray-800 ${
                    disabled && 'opacity-25'
                } ${fullWidth ? 'w-full justify-center' : ''} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
