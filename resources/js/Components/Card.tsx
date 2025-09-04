import React, { ReactNode } from 'react';

interface CardProps {
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export default function Card({
    value,
    className = '',
    children,
    ...props
}: CardProps) {
    return (
        <div className={className + ' p-3 rounded border bg-white dark:border-gray-600 dark:bg-slate-800'} {...props}>
            {children}
        </div>
    );
}
