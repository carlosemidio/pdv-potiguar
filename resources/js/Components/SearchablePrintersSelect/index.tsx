import { Printer } from '@/types/Printer';
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';

// Define the shape of the options
interface OptionType {
  value: string | number;
  label: string;
}

type SearchablePrintersSelectProps = {
  setPrinter: (printer: Printer) => void;
  selectedPrinter: Printer | null;
  isDisabled?: boolean;
};

const SearchablePrintersSelect: React.FC<SearchablePrintersSelectProps> = ({
  setPrinter,
  selectedPrinter,
  isDisabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedPrinter ? { value: selectedPrinter.id, label: selectedPrinter.name } : null
  );
  
  const [printers, setPrinters] = useState<Printer[]>([]);

  // Fetch options from the API
  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        route('search-printers') + (inputValue ? `?search=${inputValue}` : ''),
      );

      const data = await response.json();

      setPrinters(data);

      return data.map((printer: Printer) => ({
        value: printer.id,
        label: printer.name
      }));

    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };

  // Handle the selection change
  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    let printer = printers.find((printer: Printer) => printer.id === selected?.value);

    if (printer) setPrinter(printer);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={printers?.map((printer: Printer) => ({
          value: printer.id,
          label: printer.name
        }))}
        placeholder="Buscar impressora..."
        className="mt-1 block w-full"
        value={selectedOption}
        isClearable
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default SearchablePrintersSelect;
