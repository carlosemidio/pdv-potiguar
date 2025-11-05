import { useState } from 'react';
import { router } from '@inertiajs/react';
import SelectInput from '../Form/SelectInput';
import pickBy from 'lodash/pickBy';
import { ChevronDown, X } from 'lucide-react';
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
    trashed?: boolean;
  };
  categories: Category[];
}) {
  const [opened, setOpened] = useState(false);

  const [values, setValues] = useState({
    category: filters.category || '',
    field: filters.field || 'name',
    search: filters.search || '',
    trashed: filters.trashed || false,
  });

  function reset() {
    setValues({
      category: '',
      search: '',
      field: 'name',
      trashed: false,
    });
    window.location.href = route(route().current() as string);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
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
      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full"
    >
      <div className="flex w-full items-stretch bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 relative overflow-hidden">
        {/* Botão Filtros */}
        <button
          type="button"
          onClick={() => setOpened(true)}
          className="px-4 flex items-center justify-center border-r border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="hidden sm:inline text-gray-700 dark:text-gray-200 text-sm font-medium">
            Filtros
          </span>
          <ChevronDown
            size={16}
            strokeWidth={2.5}
            className="ml-1 text-gray-500 dark:text-gray-300"
          />
        </button>

        {/* Campo de busca */}
        <TextInput
          name="search"
          placeholder="Buscar produtos…"
          autoComplete="on"
          value={values.search}
          onChange={handleChange}
          className="border-0 w-full rounded-none focus:ring-0 text-sm sm:text-base px-3"
        />
      </div>

      {/* Botões de ação */}
      <div className="flex sm:flex-row flex-row sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
        <SecondaryButton
          type="button"
          onClick={reset}
          className="flex-1 sm:flex-none text-sm sm:text-base"
        >
          Limpar
        </SecondaryButton>
        <PrimaryButton
          type="submit"
          className="flex-1 sm:flex-none text-sm sm:text-base"
        >
          Filtrar
        </PrimaryButton>
      </div>

      {/* Modal de filtros */}
      {opened && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-5 relative overflow-y-auto max-h-[80vh]">
            <button
              type="button"
              onClick={() => setOpened(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Filtros
            </h2>

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

            <FieldGroup label="Incluir itens excluídos" name="trashed">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="trashed"
                  id="trashed"
                  checked={values.trashed}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      trashed: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
            </FieldGroup>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <SecondaryButton type="button" onClick={() => setOpened(false)}>
                Fechar
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                onClick={() => setOpened(false)}
              >
                Aplicar
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
