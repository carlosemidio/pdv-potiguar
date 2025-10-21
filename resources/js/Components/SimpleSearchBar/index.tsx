import { useState } from 'react';
import { router } from '@inertiajs/react';
import pickBy from 'lodash/pickBy';
import TextInput from '../Form/TextInput';
import SecondaryButton from '../SecondaryButton';
import PrimaryButton from '../PrimaryButton';

export default function SimpleSearchBar({
  field,
  search
}: {
  field: string;
  search?: string;
}) {
  const [opened, setOpened] = useState(false);

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
        Buscar
      </PrimaryButton>
    </form>
  );
}
