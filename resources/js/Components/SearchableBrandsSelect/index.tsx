import { Brand } from '@/types/Brand';
import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';

// Define the shape of the options
interface OptionType {
  value: string | number;
  label: string;
}

type SearchableBrandsSelectProps = {
  setBrand: (brand: Brand) => void;
  selectedBrand: Brand | null;
  isDisabled?: boolean;
};

const SearchableBrandsSelect: React.FC<SearchableBrandsSelectProps> = ({
  setBrand,
  selectedBrand,
  isDisabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedBrand ? { value: selectedBrand.id, label: selectedBrand.name } : null
  );

  useEffect(() => {
    setSelectedOption(selectedBrand ? { value: selectedBrand.id, label: selectedBrand.name } : null);
  }, [selectedBrand]);
  
  const [brands, setBrands] = useState<Brand[]>([]);

  // Fetch options from the API
  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return []; // Return empty array if no input

    try {
      const response = await fetch(
        route('brands-select.search') + (inputValue ? `?search=${inputValue}` : ''),
      );

      const data = await response.json();

      setBrands(data);

      // Map the API response to the format required by react-select
      return data.map((brand: Brand) => ({
        value: brand.id,
        label: brand.name
      }));

    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };

  // Handle the selection change
  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    let brand = brands.find((brand: Brand) => brand.id === selected?.value);

    if (brand) setBrand(brand);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={brands?.map((brand: Brand) => ({
          value: brand.id,
          label: brand.name
        }))}
        placeholder="Buscar marca..."
        className="mt-1 block w-full"
        value={selectedOption}
        isClearable
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default SearchableBrandsSelect;
