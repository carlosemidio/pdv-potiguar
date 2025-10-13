import { AlertCircle } from 'lucide-react';

interface FieldGroupProps {
  name?: string;
  label?: string;
  error?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  helpText?: string;
  required?: boolean;
  className?: string;
}

export default function FieldGroup({
  label,
  name,
  error,
  children,
  icon,
  helpText,
  required = false,
  className = ""
}: FieldGroupProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 select-none" 
          htmlFor={name}
        >
          <div className="flex items-center gap-2">
            {icon && <span className="text-blue-600 dark:text-blue-400">{icon}</span>}
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
          </div>
        </label>
      )}
      
      <div className="relative">
        {children}
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
