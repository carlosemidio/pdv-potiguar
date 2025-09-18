import { ProductVariant } from '@/types/ProductVariant';
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';

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
      />
    </div>
  );
};

export default SearchableProductVariantsSelect;
