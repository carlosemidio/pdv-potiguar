import { Product } from '@/types/Product';
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';

// Define the shape of the options
interface OptionType {
  value: string | number;
  label: string;
}

type SearchableProductsSelectProps = {
  setProduct: (product: Product) => void;
  selectedProduct: Product | null;
  isDisabled?: boolean;
};

const SearchableProductsSelect: React.FC<SearchableProductsSelectProps> = ({
  setProduct,
  selectedProduct,
  isDisabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedProduct ? { value: selectedProduct.id, label: selectedProduct.name } : null
  );
  
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch options from the API
  const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        route('products-select.search') + (inputValue ? `?search=${inputValue}` : ''),
      );

      const data = await response.json();

      setProducts(data);

      return data.map((product: Product) => ({
        value: product.id,
        label: product.name
      }));

    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };

  // Handle the selection change
  const handleChange = (selected: OptionType | null): void => {
    setSelectedOption(selected);
    let product = products.find((product: Product) => product.id === selected?.value);

    if (product) setProduct(product);
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={fetchOptions}
        onChange={handleChange}
        defaultOptions={products?.map((product: Product) => ({
          value: product.id,
          label: product.name
        }))}
        placeholder="Buscar produto..."
        className="mt-1 block w-full"
        value={selectedOption}
        isClearable
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default SearchableProductsSelect;
