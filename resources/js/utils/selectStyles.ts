import { StylesConfig, GroupBase } from 'react-select';

// Interface comum para opções de select
export interface SelectOptionType {
  value: string | number;
  label: string;
}

// Estilos customizados para corrigir problemas de z-index e posicionamento
export const createSelectStyles = <OptionType = SelectOptionType>(): StylesConfig<OptionType, false, GroupBase<OptionType>> => ({
  control: (provided, state) => ({
    ...provided,
    minHeight: '42px',
    border: state.isFocused 
      ? '1px solid #3b82f6' 
      : '1px solid #d1d5db',
    boxShadow: state.isFocused 
      ? '0 0 0 1px #3b82f6' 
      : 'none',
    '&:hover': {
      border: '1px solid #9ca3af',
    },
  }),
  
  valueContainer: (provided) => ({
    ...provided,
    minHeight: '40px',
    padding: '2px 8px',
  }),
  
  indicatorsContainer: (provided) => ({
    ...provided,
    minHeight: '40px',
  }),
  
  singleValue: (provided) => ({
    ...provided,
    color: '#374151',
  }),
  
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af',
  }),
  
  // Correção principal: z-index e posicionamento do menu
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }),
  
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
      ? '#eff6ff'
      : 'white',
    color: state.isSelected
      ? 'white'
      : '#374151',
    padding: '8px 12px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: state.isSelected ? '#3b82f6' : '#eff6ff',
    },
  }),
  
  loadingMessage: (provided) => ({
    ...provided,
    color: '#6b7280',
    padding: '8px 12px',
  }),
  
  noOptionsMessage: (provided) => ({
    ...provided,
    color: '#6b7280',
    padding: '8px 12px',
  }),
});

// Props padrão para todos os selects para corrigir overflow
export const defaultSelectProps = {
  menuPortalTarget: typeof document !== 'undefined' ? document.body : undefined,
  menuPosition: 'fixed' as const,
  menuShouldScrollIntoView: false,
  styles: createSelectStyles(),
};