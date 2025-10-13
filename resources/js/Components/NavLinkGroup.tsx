import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface NavLinkGroupProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    open?: boolean;
}

export default function NavLinkGroup({ title, icon, children, open }: NavLinkGroupProps) {

    const [isOpen, setIsOpen] = useState(open || false);

    function toggle() {
        setIsOpen(!isOpen);
    }

    return (
        <div className="space-y-1">
            <button
                onClick={toggle}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white px-3 py-2.5 rounded-lg transition-all duration-200 group"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span>{title}</span>
                </div>
                <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`} 
                />
            </button>
            {isOpen && 
                <div className="ml-6 space-y-1 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                    {children}
                </div>
            }
        </div>
    );
}