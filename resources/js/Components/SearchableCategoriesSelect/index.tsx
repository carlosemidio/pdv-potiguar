import { Category } from '@/types/Category';
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';

// Define the shape of the options
interface OptionType {
  value: string | number;
  label: string;
}

type SearchableCategoriesSelectProps = {
  setCategory: (category: Category) => void;
  selectedCategory: Category | null;
  isDisabled?: boolean;
};

const SearchableCategoriesSelect: React.FC<SearchableCategoriesSelectProps> = ({
  setCategory,
  selectedCategory,
  isDisabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedCategory ? { value: selectedCategory.id, label: selectedCategory.name } : null
  );
  
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch options from the API
  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return []; // Return empty array if no input

    try {
      const response = await fetch(
        route('categories-select.search') + (inputValue ? `?search=${inputValue}` : ''),
      );

      const data = await response.json();

      setCategories(data);

      // Map the API response to the format required by react-select
      return data.map((category: Category) => ({
        value: category.id,
        label: category.name
      }));

    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };

  // Handle the selection change
  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    let category = categories.find((category: Category) => category.id === selected?.value);

    if (category) setCategory(category);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={categories?.map((category: Category) => ({
          value: category.id,
          label: category.name
        }))}
        placeholder="Buscar categoría..."
        className="mt-1 block w-full"
        value={selectedOption}
        isClearable
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default SearchableCategoriesSelect;
