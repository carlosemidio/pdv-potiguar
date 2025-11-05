import { useState } from 'react';
import { router } from '@inertiajs/react';
import pickBy from 'lodash/pickBy';
import { FiSearch, FiX } from 'react-icons/fi';

interface SimpleSearchBarProps {
  field: string;
  search?: string;
  withTrashed?: boolean;
  trashed?: boolean;
  placeholder?: string;
}

export default function SimpleSearchBar({ field, search, withTrashed, trashed, placeholder }: SimpleSearchBarProps) {
  const [values, setValues] = useState({
    field,
    search: search || '',
    trashed: trashed || false,
  });

  function reset() {
    setValues({ field, search: '', trashed: false });
    window.location.href = route(route().current() as string);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, checked, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = pickBy(values);
    router.get(route(route().current() as string), query, {
      replace: true,
      preserveState: true,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row sm:items-center w-full gap-3 bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700"
    >
      {/* Campo de busca */}
      <div className="flex-1 relative">
        <input
          type="text"
          name="search"
          placeholder={placeholder}
          autoComplete="on"
          value={values.search}
          onChange={handleChange}
          className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-10 pr-3 py-2 text-sm sm:text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 outline-none transition-all"
        />
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none"
          size={18}
        />
      </div>

      {/* Checkbox: incluir excluídos */}
      {withTrashed && (
        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input
            type="checkbox"
            name="trashed"
            checked={values.trashed}
            onChange={handleChange}
            className="w-4 h-4 rounded border-neutral-400 dark:border-neutral-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          Incluir excluídos
        </label>
      )}

      {/* Botões */}
      <div className="flex flex-row sm:justify-end gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={reset}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-sm sm:text-base py-2 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <FiX size={16} />
          Limpar
        </button>
        <button
          type="submit"
          className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-sm sm:text-base py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          <FiSearch size={16} />
          Buscar
        </button>
      </div>
    </form>
  );
}
