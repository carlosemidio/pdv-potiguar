import { Info, Settings, Wrench, ChefHat, ListPlus, Plus } from 'lucide-react';

interface ProductVariantTabsProps {
  tab: string;
  setTab: (tab: any) => void;
  isCombo?: boolean;
}

export default function ProductVariantTabs({ tab, setTab, isCombo }: ProductVariantTabsProps) {
  const tabs = [
    { key: 'detalhes', label: 'Detalhes', icon: Info },
    ...(isCombo
      ? [
          { key: 'opcoes-fixas', label: 'Opções Fixas', icon: Settings },
          { key: 'opcoes-variaveis', label: 'Opções Variáveis', icon: Wrench },
        ]
      : [
          { key: 'ingredientes', label: 'Ingredientes', icon: ChefHat },
          { key: 'grupos-de-opcoes', label: 'Opções', icon: ListPlus },
        ]),
    { key: 'complementos', label: 'Complementos', icon: Plus },
  ];

  return (
    <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          className={`snap-start flex-shrink-0 flex items-center gap-2 py-3 px-4 md:px-6 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
            tab === key
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
