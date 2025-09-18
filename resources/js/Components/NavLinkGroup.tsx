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
        <div>
            <button
                onClick={toggle}
                className="flex items-center justify-between w-full tracking-wide uppercase transition-all duration-150 ease-in-out py-3 px-3"
            >
                <div className="flex items-center gap-1 dark:text-gray-300">
                    {icon}
                    <span className="">{title}</span>
                </div>
                <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform transform ${
                        isOpen ? 'rotate-180' : ''
                    }`} 
                />
            </button>
            {isOpen && 
                <div className="w-full flex flex-col gap-2 pl-4">
                    {children}
                </div>
            }
        </div>
    );
}