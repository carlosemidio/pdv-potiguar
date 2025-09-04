import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
    value,
    className = '',
    children,
    isRequired = false,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string, isRequired?: boolean }) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-gray-700 dark:text-gray-300 ` +
                className
            }
        >
            {value ? value : children} {isRequired && <span className="text-red-500">*</span>}
        </label>
    );
}
