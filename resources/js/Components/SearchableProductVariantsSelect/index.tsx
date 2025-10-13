import { ProductVariant } from '@/types/ProductVariant';
import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';

import { StylesConfig, GroupBase } from 'react-select';

const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
  control: (provided) => ({
    ...provided,
    minHeight: '30px', // Set a minimum height for the control
    height: '42px',    // Set a fixed height for the control
  }),
  valueContainer: (provided) => ({
    ...provided,
    minHeight: '28px', // Adjust min-height for the value container
    height: '38px',    // Adjust fixed height for the value container
    paddingTop: '0',   // Remove or adjust padding
    paddingBottom: '0',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    minHeight: '28px', // Adjust min-height for the indicators container
    height: '38px',    // Adjust fixed height for the indicators container
  }),
  // You might also need to adjust styles for other parts like singleValue or multiValue
  singleValue: (provided) => ({
    ...provided,
    lineHeight: '38px', // Ensure single value aligns vertically
  }),
  // Fix z-index and positioning for dropdown menu
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    position: 'absolute',
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

interface OptionType {
  value: string | number;
  label: string;
}

type SearchableProductVariantsSelectProps = {
  setVariant: (variant: ProductVariant | null) => void;
  selectedVariant: ProductVariant | null;
  isDisabled?: boolean;
};

const SearchableProductVariantsSelect: React.FC<SearchableProductVariantsSelectProps> = ({
  setVariant,
  selectedVariant,
  isDisabled = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedVariant ? { value: selectedVariant.id, label: selectedVariant.name } : null
  );

  useEffect(() => {
    setSelectedOption(selectedVariant ? { value: selectedVariant.id, label: selectedVariant.name } : null);
  }, [selectedVariant]);

  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        route('product-variants-select.search') + (inputValue ? `?search=${inputValue}` : '')
      );

      const data = await response.json();

      setVariants(data);

      return data.map((variant: ProductVariant) => ({
        value: variant.id,
        label: `${variant.sku ?? ''} - ${variant.name}`.trim(),
      }));
    } catch (error) {
      console.error('Error fetching variant options:', error);
      return [];
    }
  };

  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    const variant = variants.find((v: ProductVariant) => v.id === selected?.value);
    setVariant(variant ?? null);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={variants?.map((variant: ProductVariant) => ({
          value: variant.id,
          label: `${variant.sku ?? ''} - ${variant.name}`.trim(),
        }))}
        placeholder="Buscar variante..."
        className="mt-1 block w-full"
        value={selectedOption}
        isClearable
        isDisabled={isDisabled}
        styles={customStyles}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        menuShouldScrollIntoView={false}
      />
    </div>
  );
};

export default SearchableProductVariantsSelect;
