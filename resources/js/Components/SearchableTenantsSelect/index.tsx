import { Tenant } from '@/types/Tenant';
import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';

interface OptionType {
  value: string | number;
  label: string;
}

type SearchableTenantsSelectProps = {
  setTenant: (tenant: Tenant) => void;
  selectedTenant: Tenant | null;
  isDisabled?: boolean;
  placeholder?: string;
};

const SearchableTenantsSelect: React.FC<SearchableTenantsSelectProps> = ({
  setTenant,
  selectedTenant,
  isDisabled = false,
  placeholder = 'Buscar inquilino...',
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedTenant ? { value: selectedTenant.id, label: selectedTenant.name } : null
  );

  useEffect(() => {
    setSelectedOption(selectedTenant ? { value: selectedTenant.id, label: selectedTenant.name } : null);
  }, [selectedTenant]);
  
  const [tenants, setTenants] = useState<Tenant[]>([]);

  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        route('tenants-select.search') + (inputValue ? `?search=${inputValue}` : ''),
      );

      const data = await response.json();

      setTenants(data);

      return data.map((tenant: Tenant) => ({
        value: tenant.id,
        label: tenant.name
      }));

    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };

  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    let tenant = tenants.find((tenant: Tenant) => tenant.id === selected?.value);

    if (tenant) setTenant(tenant);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={tenants?.map((tenant: Tenant) => ({
          value: tenant.id,
          label: tenant.name
        }))}
        placeholder={placeholder}
        className="mt-1 block w-full"
        value={selectedOption}
        isClearable
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default SearchableTenantsSelect;
