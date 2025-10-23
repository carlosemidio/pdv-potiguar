import { useEffect, useState } from "react";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";
import InputError from "./InputError";
import { Address } from "@/types/Address";
import Select from "react-select";

interface AddressFormProps {
  errors: Record<string, string>;
  address: Address | null;
  onAddressChange?: (address: Address) => void;
}

export default function AddressForm({ errors, address, onAddressChange }: AddressFormProps) {
  const [zipcode, setZipcode] = useState(address?.zipcode || "");
  const [states, setStates] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [state, setState] = useState<{ value: string; label: string } | null>(
    null
  );
  const [city, setCity] = useState<{ value: string; label: string } | null>(
    null
  );
  const [neighborhood, setNeighborhood] = useState(address?.neighborhood || "");
  const [street, setStreet] = useState(address?.street || "");
  const [number, setNumber] = useState(address?.number || "");
  const [complement, setComplement] = useState(address?.complement || "");

  const isEdit = !!address;

  // Atualiza o endereço sempre que algum campo muda
  useEffect(() => {
    const updatedAddress: Address = {
      zipcode,
      state: state?.value || "",
      city: city?.value || "",
      neighborhood,
      street,
      number,
      complement,
      full_address: `${street}, ${number} - ${neighborhood}, ${city?.value || ""} - ${state?.value || ""}, ${zipcode}`,
    };
    onAddressChange && onAddressChange(updatedAddress);
  }, [
    zipcode,
    state,
    city,
    neighborhood,
    street,
    number,
    complement,
  ]);

  // Buscar estados IBGE
  async function getStates() {
    const res = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    );
    const data = await res.json();
    const _states = data.map((s: { sigla: string; nome: string }) => ({
      value: s.sigla,
      label: s.nome,
    }));
    setStates(_states);

    if (isEdit && address?.state) {
      const stateOption = _states.find((s) => s.value === address.state) || null;
      setState(stateOption);
      if (stateOption) getCities(stateOption.value);
    }
  }

  async function getCities(uf: string) {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    );
    const data = await res.json();
    const _cities = data.map((c: any) => ({ value: c.nome, label: c.nome }));
    setCities(_cities);

    if (isEdit && address?.city) {
      const cityOption = _cities.find((c) => c.value === address.city) || null;
      setCity(cityOption);
    }
  }

  useEffect(() => {
    getStates();
  }, []);

  // Manipula CEP com máscara e busca automática
  const handleZipcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) value = value.slice(0, 5) + "-" + value.slice(5);
    setZipcode(value);

    const numericCEP = value.replace(/\D/g, "");
    if (numericCEP.length === 8) {
      fetch(`https://viacep.com.br/ws/${numericCEP}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            const stateOption = states.find((s) => s.value === data.uf) || {
              value: data.uf,
              label: data.uf,
            };
            setState(stateOption);
            getCities(data.uf).then(() => {
              setCity({ value: data.localidade, label: data.localidade });
            });

            setNeighborhood(data.bairro || "");
            setStreet(data.logradouro || "");
          }
        });
    }
  };

  return (
    <div className="border border-gray-100 dark:border-gray-500 p-4 rounded">
      <h2 className="mb-4 text-lg font-semibold">Endereço</h2>
      <div className="space-y-4">
        {/* CEP */}
        <div>
          <InputLabel htmlFor="zipcode" value="CEP" isRequired />
          <TextInput
            id="zipcode"
            className="mt-1 block w-full"
            value={zipcode}
            onChange={handleZipcodeChange}
            placeholder="00000-000"
            autoComplete="zipcode"
            isFocused
          />
          {errors.zipcode && <InputError className="mt-2" message={errors.zipcode} />}
        </div>

        {/* Estado */}
        <div>
          <InputLabel htmlFor="state" value="Estado" isRequired />
          <Select
            id="state"
            options={states}
            value={state}
            onChange={(selected) => {
              setState(selected);
              setCity(null);
              getCities(selected?.value || "");
            }}
            placeholder="Selecione o estado"
          />
          {errors.uf && <InputError className="mt-2" message={errors.uf} />}
        </div>

        {/* Cidade */}
        <div>
          <InputLabel htmlFor="city" value="Cidade" isRequired />
          <Select
            id="city"
            options={cities}
            value={city}
            onChange={(selected) => setCity(selected)}
            placeholder="Selecione a cidade"
            isDisabled={!state}
          />
          {errors.city && <InputError className="mt-2" message={errors.city} />}
        </div>

        {/* Bairro */}
        <div>
          <InputLabel htmlFor="neighborhood" value="Bairro" isRequired />
          <TextInput
            id="neighborhood"
            className="mt-1 block w-full"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
          {errors.neighborhood && <InputError className="mt-2" message={errors.neighborhood} />}
        </div>

        {/* Rua */}
        <div>
          <InputLabel htmlFor="street" value="Rua" isRequired />
          <TextInput
            id="street"
            className="mt-1 block w-full"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          {errors.street && <InputError className="mt-2" message={errors.street} />}
        </div>

        {/* Número */}
        <div>
          <InputLabel htmlFor="number" value="Número" isRequired />
          <TextInput
            id="number"
            className="mt-1 block w-full"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          {errors.number && <InputError className="mt-2" message={errors.number} />}
        </div>

        {/* Complemento */}
        <div>
          <InputLabel htmlFor="complement" value="Complemento" />
          <TextInput
            id="complement"
            className="mt-1 block w-full"
            value={complement}
            onChange={(e) => setComplement(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
