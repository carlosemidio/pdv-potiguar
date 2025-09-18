import { ButtonHTMLAttributes } from 'react';

type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: Size;
    fullWidth?: boolean;
    rounded?: boolean;
};

export default function PrimaryButton({
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
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-3 text-base',
    };
    return (
        <button
            {...props}
            className={
                `inline-flex items-center ${rounded ? 'rounded-full' : 'rounded-md'} border border-transparent bg-blue-600 text-white ${sizeClasses[size]} font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    disabled && 'opacity-25'
                } ${fullWidth ? 'w-full justify-center' : ''} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
