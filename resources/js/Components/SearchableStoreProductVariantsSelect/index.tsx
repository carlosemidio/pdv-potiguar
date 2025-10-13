import { StoreProductVariant } from '@/types/StoreProductVariant';
import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { StylesConfig, GroupBase } from 'react-select';

interface OptionType {
  value: string | number;
  label: string;
}

// Custom styles to fix z-index issues
const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
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

type SearchableStoreProductVariantsSelectProps = {
  setVariant: (variant: StoreProductVariant | null) => void;
  selectedVariant: StoreProductVariant | null;
  isDisabled?: boolean;
};

const SearchableStoreProductVariantsSelect: React.FC<SearchableStoreProductVariantsSelectProps> = ({
  setVariant,
  selectedVariant,
  isDisabled = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedVariant && selectedVariant.product_variant
      ? { value: selectedVariant.id, label: selectedVariant.product_variant.name }
      : null
  );

  useEffect(() => {
    setSelectedOption(
      selectedVariant && selectedVariant.product_variant
        ? { value: selectedVariant.id, label: selectedVariant.product_variant.name }
        : null
    );
  }, [selectedVariant]);

  const [variants, setVariants] = useState<StoreProductVariant[]>([]);

  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        route('store-product-variants-select.search') + (inputValue ? `?search=${inputValue}` : '')
      );

      const data = await response.json();

      setVariants(data);

      return data.map((variant: StoreProductVariant) => ({
        value: variant.id,
        label: variant.product_variant
          ? `${variant.product_variant.sku ?? ''} - ${variant.product_variant.name}`.trim()
          : '',
      }));
    } catch (error) {
      console.error('Error fetching variant options:', error);
      return [];
    }
  };

  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    const variant = variants.find((v: StoreProductVariant) => v.id === selected?.value);
    setVariant(variant ?? null);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={variants?.map((variant: StoreProductVariant) => ({
          value: variant.id,
          label: variant.product_variant
            ? `${variant.product_variant.sku ?? ''} - ${variant.product_variant.name}`.trim()
            : '',
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

export default SearchableStoreProductVariantsSelect;
