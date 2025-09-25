import { Ingredient } from '@/types/Ingredient';
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
};


// Define the shape of the options
interface OptionType {
  value: string | number;
  label: string;
}

type SearchableIngredientsSelectProps = {
  setIngredient: (ingredient: Ingredient) => void;
  selectedIngredient: Ingredient | null;
  isDisabled?: boolean;
};

const SearchableIngredientsSelect: React.FC<SearchableIngredientsSelectProps> = ({
  setIngredient,
  selectedIngredient,
  isDisabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedIngredient ? { value: selectedIngredient.id, label: selectedIngredient.name } : null
  );

  useEffect(() => {
    setSelectedOption(selectedIngredient ? { value: selectedIngredient.id, label: selectedIngredient.name } : null);
  }, [selectedIngredient]);
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  // Fetch options from the API
  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        route('ingredients-select.search') + (inputValue ? `?search=${inputValue}` : ''),
      );

      const data = await response.json();

      setIngredients(data);

      return data.map((ingredient: Ingredient) => ({
        value: ingredient.id,
        label: ingredient.name
      }));

    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };

  // Handle the selection change
  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    let ingredient = ingredients.find((ingredient: Ingredient) => ingredient.id === selected?.value);

    if (ingredient) setIngredient(ingredient);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={ingredients?.map((ingredient: Ingredient) => ({
          value: ingredient.id,
          label: ingredient.name
        }))}
        placeholder="Buscar ingrediente..."
        className="mt-1 block w-full"
        value={selectedOption}
        isClearable
        isDisabled={isDisabled}
        styles={customStyles}
      />
    </div>
  );
};

export default SearchableIngredientsSelect;
