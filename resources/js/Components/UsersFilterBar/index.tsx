import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { usePrevious } from 'react-use';
import SelectInput from '../Form/SelectInput';
import pickBy from 'lodash/pickBy';
import { ChevronDown } from 'lucide-react';
import FieldGroup from '../Form/FieldGroup';
import TextInput from '../Form/TextInput';

export default function UsersFilterBar({ filters } : { 
    filters: {
      status?: string;
      field?: string;
      search?: string;
    }
  }) {
  const [opened, setOpened] = useState(false);

  const [values, setValues] = useState({
    status: filters.status || '-1',
    field: filters.field || 'name',
    search: filters.search || '',
  });

  const prevValues = usePrevious(values);

  function reset() {
    setValues({
      status: '',
      search: '',
      field: '',
    });
  }

  function handleFilterSubmit() {
    const query = Object.keys(pickBy(values)).length ? pickBy(values) : {};

    router.get(route(route().current() as string), query, {
      replace: true,
      preserveState: true
    });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const name = e.target.name;
    const value = e.target.value;

    setValues(values => ({
      ...values,
      [name]: value
    }));

    if (opened) setOpened(false);
  }

  return (
    <div className="flex  max-w-md shadow">
      <div className="relative flex bg-white rounded">
        <div
          style={{ top: '100%' }}
          className={`absolute ${opened ? '' : 'hidden'}`}
        >
          <div
            onClick={() => setOpened(false)}
            className="fixed inset-0 z-20 bg-black opacity-25"
          />
          <div className="relative z-30 w-64 px-4 py-6 mt-2 bg-white rounded shadow-lg space-y-4">
            <FieldGroup label="Campo da busca" name="field">
              <SelectInput
                name="field"
                value={values.field}
                onChange={handleChange}
                options={[
                  { value: 'name', label: 'Nome' },
                  { value: 'email', label: 'Email' },
                ]}
              />
            </FieldGroup>
            <FieldGroup label="Status" name="status">
              <SelectInput
                name="status"
                value={values.status}
                onChange={handleChange}
                options={[
                  { value: '-1', label: 'Todos' },
                  { value: '1', label: 'Habilitado' },
                  { value: '0', label: 'Desabilitado' }
                ]}
              />
            </FieldGroup>
          </div>
        </div>
        <button
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
          placeholder="Busca…"
          autoComplete="on"
          value={values.search}
          onChange={handleChange}
          className="border-0 rounded-l-none focus:ring-2"
        />
      </div>
      <button
        onClick={reset}
        className="bg-sky-600 text-white rounded-r  px-2 border-l-2 border-slate-100"
        type="button"
      >
        Reset
      </button>
      <button
        onClick={handleFilterSubmit}
        className="bg-sky-600 text-white rounded-r  px-2 border-l-2 border-slate-100"
        type="button">
        Filtrar
      </button>
    </div>
  );
}
