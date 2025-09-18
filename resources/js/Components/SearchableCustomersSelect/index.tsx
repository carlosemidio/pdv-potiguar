import { Customer } from '@/types/Customer';
import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';

// Define the shape of the options
interface OptionType {
  value: string | number;
  label: string;
}

type SearchableCustomersSelectProps = {
  setCustomer: (customer: Customer) => void;
  selectedCustomer: Customer | null;
  isDisabled?: boolean;
};

const SearchableCustomersSelect: React.FC<SearchableCustomersSelectProps> = ({
  setCustomer,
  selectedCustomer,
  isDisabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedCustomer ? { value: selectedCustomer.id, label: selectedCustomer.name } : null
  );
  
  // Keep internal state in sync when the parent updates selectedCustomer (e.g., editing an order)
  useEffect(() => {
    if (selectedCustomer) {
      setSelectedOption({ value: selectedCustomer.id, label: selectedCustomer.name });
    } else {
      setSelectedOption(null);
    }
  }, [selectedCustomer]);
  
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Fetch options from the API
  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        route('customers-select.search') + (inputValue ? `?search=${inputValue}` : ''),
      );

      const data = await response.json();

      setCustomers(data);

      return data.map((customer: Customer) => ({
        value: customer.id,
        label: customer.name
      }));

    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };

  // Handle the selection change
  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    let customer = customers.find((customer: Customer) => customer.id === selected?.value);

    if (customer) setCustomer(customer);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={customers?.map((customer: Customer) => ({
          value: customer.id,
          label: customer.name
        }))}
        placeholder="Buscar cliente..."
        className="mt-1 block w-full"
        value={selectedOption}
        isClearable
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default SearchableCustomersSelect;
