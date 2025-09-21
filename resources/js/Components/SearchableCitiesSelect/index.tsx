import { City } from '@/types/City';
import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';

// Define the shape of the options
interface OptionType {
  value: string | number;
  label: string;
}

type SearchableCitiesSelectProps = {
  setCity: (city: City) => void;
  selectedCity: City | null;
  isDisabled?: boolean;
};

const SearchableCitiesSelect: React.FC<SearchableCitiesSelectProps> = ({
  setCity,
  selectedCity,
  isDisabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedCity ? { value: selectedCity.id, label: selectedCity.name } : null
  );

  useEffect(() => {
    setSelectedOption(selectedCity ? { value: selectedCity.id, label: selectedCity.name } : null);
  }, [selectedCity]);
  
  const [cities, setCities] = useState<City[]>([]);

  // Fetch options from the API
  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        route('cities-select.search') + (inputValue ? `?search=${inputValue}` : ''),
      );

      const data = await response.json();

      setCities(data);

      return data.map((city: City) => ({
        value: city.id,
        label: city.name
      }));

    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };

  // Handle the selection change
  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    let city = cities.find((city: City) => city.id === selected?.value);

    if (city) setCity(city);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={cities?.map((city: City) => ({
          value: city.id,
          label: city.name
        }))}
        placeholder="Buscar cidade..."
        className="mt-1 block w-full"
        value={selectedOption}
        isClearable
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default SearchableCitiesSelect;
