import { Attribute } from '@/types/Attribute';
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';

// Define the shape of the options
interface OptionType {
  value: string | number;
  label: string;
}

type SearchableAttibutesSelectProps = {
  setAttribute: (attribute: Attribute) => void;
  setAttributeName?: (name: string) => void;
  selectedAttribute: Attribute | null;
  isDisabled?: boolean;
};

const SearchableAttibutesSelect: React.FC<SearchableAttibutesSelectProps> = ({
  setAttribute,
  setAttributeName,
  selectedAttribute,
  isDisabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedAttribute ? { value: selectedAttribute.id, label: selectedAttribute.name } : null
  );
  
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  // Fetch options from the API
  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return []; // Return empty array if no input

    try {
      const response = await fetch(
        route('attributes-select.search') + (inputValue ? `?search=${inputValue}` : ''),
      );

      const data = await response.json();

      setAttributes(data);
      setAttributeName?.(inputValue); // Optionally set the attribute name if provided

      // Map the API response to the format required by react-select
      return data.map((attribute: Attribute) => ({
        value: attribute.id,
        label: attribute.name
      }));

    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };

  // Handle the selection change
  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    let attribute = attributes.find((attribute: Attribute) => attribute.id === selected?.value);

    if (attribute) setAttribute(attribute);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={attributes?.map((attribute: Attribute) => ({
          value: attribute.id,
          label: attribute.name
        }))}
        placeholder="Buscar atributo..."
        className="mt-1 block w-full"
        value={selectedOption}
        isClearable
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default SearchableAttibutesSelect;
