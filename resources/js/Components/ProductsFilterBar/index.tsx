import { useState } from 'react';
import { router } from '@inertiajs/react';
import SelectInput from '../Form/SelectInput';
import pickBy from 'lodash/pickBy';
import { ChevronDown } from 'lucide-react';
import FieldGroup from '../Form/FieldGroup';
import TextInput from '../Form/TextInput';
import { Category } from '@/types/Category';
import SecondaryButton from '../SecondaryButton';
import PrimaryButton from '../PrimaryButton';

export default function ProductsFilterBar({
  filters,
  categories,
}: {
  filters: {
    category?: string;
    field?: string;
    search?: string;
  };
  categories: Category[];
}) {
  const [opened, setOpened] = useState(false);

  const [values, setValues] = useState({
    category: filters.category || '',
    field: filters.field || 'name',
    search: filters.search || '',
  });

  function reset() {
    setValues({
      category: '',
      search: '',
      field: 'name',
    });

    window.location.href = route(route().current() as string);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const name = e.target.name;
    const value = e.target.value;

    setValues((values) => ({
      ...values,
      [name]: value,
    }));

    if (opened) setOpened(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = Object.keys(pickBy(values)).length ? pickBy(values) : {};
    router.get(route(route().current() as string), query, {
      replace: true,
      preserveState: true,
    });
  }

  return (
    <form className="flex w-full" onSubmit={handleSubmit}>
      <div className="relative flex bg-white rounded w-full border border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400">
        <div
          style={{ top: '100%' }}
          className={`absolute ${opened ? '' : 'hidden'}`}
        >
          <div
            onClick={() => setOpened(false)}
            className="fixed inset-0 z-20 bg-black opacity-25"
          />
          <div className="relative z-30 w-[320px] px-4 py-6 mt-2 bg-white rounded shadow-lg space-y-4">
            <FieldGroup label="Campo da busca" name="field">
              <SelectInput
                name="field"
                value={values.field}
                onChange={handleChange}
                options={[
                  { value: 'name', label: 'Nome' },
                  { value: 'sku', label: 'SKU' },
                ]}
              />
            </FieldGroup>
            <FieldGroup label="Categoria" name="category">
              <SelectInput
                name="category"
                value={values.category}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Todas' },
                  ...categories.map((category) => ({
                    value: category.id.toString(),
                    label: category.name,
                  })),
                ]}
              />
            </FieldGroup>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpened(true)}
          className="px-4 border-r rounded-l md:px-6 hover:bg-gray-100 focus:outline-none focus:border-white focus:ring-2 focus:ring-indigo-400 focus:z-10"
        >
          <div className="flex items-center">
            <span className="hidden text-gray-700 md:inline">Filtros</span>
            <ChevronDown size={14} strokeWidth={3} className="md:ml-2" />
          </div>
        </button>
        <TextInput
          name="search"
          placeholder="Buscar…"
          autoComplete="on"
          value={values.search}
          onChange={handleChange}
          className="border-0 rounded-l-none rounded-r-none focus:ring-2 w-full"
        />
      </div>
      <SecondaryButton type="button" onClick={reset}>
        Limpar
      </SecondaryButton>
      <PrimaryButton className="ml-2" type="submit">
        Filtrar
      </PrimaryButton>
    </form>
  );
}
