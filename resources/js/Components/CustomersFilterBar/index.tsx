import { useState } from 'react';
import { router } from '@inertiajs/react';
import SelectInput from '../Form/SelectInput';
import pickBy from 'lodash/pickBy';
import { ChevronDown } from 'lucide-react';
import FieldGroup from '../Form/FieldGroup';
import TextInput from '../Form/TextInput';
import SecondaryButton from '../SecondaryButton';
import PrimaryButton from '../PrimaryButton';

export default function CustomersFilterBar({
  filters
}: {
  filters: {
    category?: string;
    field?: string;
    search?: string;
  };
}) {
  const [opened, setOpened] = useState(false);

  const [values, setValues] = useState({
    field: filters.field || 'name',
    search: filters.search || '',
  });

  function reset() {
    setValues({
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
    <form className="flex flex-col sm:flex-row w-full gap-2 sm:gap-0" onSubmit={handleSubmit}>
      <div className="relative flex flex-1 bg-white rounded border border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400">
        {/* Dropdown de filtros */}
        <div
          style={{ top: '100%' }}
          className={`absolute ${opened ? '' : 'hidden'} z-50`}
        >
          <div
            onClick={() => setOpened(false)}
            className="fixed inset-0 bg-black opacity-25"
          />
          <div className="relative z-50 w-64 px-4 py-4 mt-1 bg-white dark:bg-gray-800 rounded shadow-lg space-y-4">
            <FieldGroup label="Campo da busca" name="field">
              <SelectInput
                name="field"
                value={values.field}
                onChange={handleChange}
                options={[
                  { value: 'name', label: 'Nome' },
                  { value: 'email', label: 'Email' },
                  { value: 'phone', label: 'Telefone' },
                  { value: 'doc', label: 'CPF/CNPJ' },
                ]}
              />
            </FieldGroup>
          </div>
        </div>

        {/* Botão para abrir dropdown */}
        <button
          type="button"
          onClick={() => setOpened(!opened)}
          className="px-3 sm:px-4 border-r rounded-l hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center"
        >
          <span className="hidden sm:inline text-gray-700 dark:text-gray-200">Filtros</span>
          <ChevronDown size={14} strokeWidth={3} className="ml-1 sm:ml-2" />
        </button>

        {/* Campo de busca */}
        <TextInput
          name="search"
          placeholder="Buscar…"
          autoComplete="on"
          value={values.search}
          onChange={handleChange}
          className="border-0 rounded-l-none flex-1 focus:ring-2"
        />
      </div>

      {/* Botões de ação */}
      <div className="flex gap-2 mt-2 sm:mt-0">
        <SecondaryButton type="button" onClick={reset} className="flex-1 sm:flex-none">
          Limpar
        </SecondaryButton>
        <PrimaryButton type="submit" className="flex-1 sm:flex-none">
          Filtrar
        </PrimaryButton>
      </div>
    </form>
  );
}
