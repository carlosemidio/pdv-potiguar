import { ComponentProps } from 'react';
import { AlertCircle } from 'lucide-react';

interface TextInputProps extends ComponentProps<'input'> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
  helpText?: string;
}

export default function TextInput({
  name,
  className,
  error,
  label,
  icon,
  helpText,
  ...props
}: TextInputProps) {
  const baseClasses = `
    w-full px-4 py-3 text-base rounded-xl transition-all duration-200
    border-2 focus:outline-none
    bg-white dark:bg-gray-800 
    text-gray-900 dark:text-gray-100
    disabled:bg-gray-100 dark:disabled:bg-gray-700 
    disabled:cursor-not-allowed disabled:opacity-60
    placeholder:text-gray-400 dark:placeholder:text-gray-500
  `;

  const normalClasses = `
    border-gray-200 dark:border-gray-600
    focus:border-blue-500 dark:focus:border-blue-400
    focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
  `;

  const errorClasses = `
    border-red-300 dark:border-red-600
    focus:border-red-500 dark:focus:border-red-400
    focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-400/20
  `;

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {icon && <span className="inline-flex items-center gap-2">{icon} {label}</span>}
          {!icon && label}
        </label>
      )}
      
      <div className="relative w-full">
        <input
          id={name}
          name={name}
          {...props}
          className={`
            ${baseClasses}
            ${error ? errorClasses : normalClasses}
            ${className || ''}
          `}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
      </div>

      {helpText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}

      {error && (
        <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
