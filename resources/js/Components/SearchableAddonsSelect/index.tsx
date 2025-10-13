import { Addon } from '@/types/Addon';
import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { StylesConfig, GroupBase } from 'react-select';

// Define the shape of the options
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

type SearchableAddonsSelectProps = {
  setAddon: (addon: Addon) => void;
  selectedAddon: Addon | null;
  isDisabled?: boolean;
};

const SearchableAddonsSelect: React.FC<SearchableAddonsSelectProps> = ({
  setAddon,
  selectedAddon,
  isDisabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedAddon ? { value: selectedAddon.id, label: selectedAddon.name } : null
  );

  useEffect(() => {
    setSelectedOption(selectedAddon ? { value: selectedAddon.id, label: selectedAddon.name } : null);
  }, [selectedAddon]);

  const [addons, setAddons] = useState<Addon[]>([]);

  // Fetch options from the API
  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        route('addons-select.search') + (inputValue ? `?search=${inputValue}` : ''),
      );

      const data = await response.json();

      setAddons(data);

      return data.map((addon: Addon) => ({
        value: addon.id,
        label: addon.name
      }));

    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };

  // Handle the selection change
  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    let addon = addons.find((addon: Addon) => addon.id === selected?.value);

    if (addon) setAddon(addon);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={addons?.map((addon: Addon) => ({
          value: addon.id,
          label: addon.name
        }))}
        placeholder="Buscar complemento..."
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

export default SearchableAddonsSelect;
