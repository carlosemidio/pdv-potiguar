import { useState } from 'react';
import { router } from '@inertiajs/react';
import pickBy from 'lodash/pickBy';
import TextInput from '../Form/TextInput';
import SecondaryButton from '../SecondaryButton';
import PrimaryButton from '../PrimaryButton';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SimpleSearchBar({
  field,
  search,
}: {
  field: string;
  search?: string;
}) {
  const [values, setValues] = useState({
    field: field,
    search: search || '',
  });

  function reset() {
    setValues({
      field: field,
      search: '',
    });

    window.location.href = route(route().current() as string);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-3"
    >
      <div className="flex-1 relative">
        <TextInput
          name="search"
          placeholder="Buscar…"
          autoComplete="on"
          value={values.search}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-10 pr-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      </div>

      <div className="flex sm:flex-row flex-row sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
        <SecondaryButton
          type="button"
          onClick={reset}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-sm sm:text-base"
        >
          <FiX size={16} />
          Limpar
        </SecondaryButton>
        <PrimaryButton
          type="submit"
          className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-sm sm:text-base"
        >
          <FiSearch size={16} />
          Buscar
        </PrimaryButton>
      </div>
    </form>
  );
}
