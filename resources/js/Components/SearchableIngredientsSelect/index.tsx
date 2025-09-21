import { Ingredient } from '@/types/Ingredient';
import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';

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
      />
    </div>
  );
};

export default SearchableIngredientsSelect;
