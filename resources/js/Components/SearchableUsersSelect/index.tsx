import { User } from '@/types/User';
// Alternative import if alias doesn't work: import { User } from '../../types/User';
import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';

// Define the shape of the options
interface OptionType {
  value: string | number;
  label: string;
}

type SearchableUsersSelectProps = {
  setUser: (user: User) => void;
  selectedUser: User | null;
  isDisabled?: boolean;
};

const SearchableUsersSelect: React.FC<SearchableUsersSelectProps> = ({
  setUser,
  selectedUser,
  isDisabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedUser ? { value: selectedUser.id, label: selectedUser.name } : null
  );

  useEffect(() => {
    setSelectedOption(selectedUser ? { value: selectedUser.id, label: selectedUser.name } : null);
  }, [selectedUser]);
  
  const [users, setUsers] = useState<User[]>([]);

  // Fetch options from the API
  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        route('users-select.search') + (inputValue ? `?search=${inputValue}` : ''),
      );

      const data = await response.json();

      setUsers(data);

      return data.map((user: User) => ({
        value: user.id,
        label: user.name
      }));

    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };

  // Handle the selection change
  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    let user = users.find((user: User) => user.id === selected?.value);

    if (user) setUser(user);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={users?.map((user: User) => ({
          value: user.id,
          label: user.name
        }))}
        placeholder="Buscar usuário..."
        className="mt-1 block w-full"
        value={selectedOption}
        isClearable
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default SearchableUsersSelect;
