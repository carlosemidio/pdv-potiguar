import { useState } from "react";
import { Address } from "@/types/address";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";
import InputError from "./InputError";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";
import PrimaryButton from "./PrimaryButton";

interface AddressFormProps {
    addresses: Address[];
    setAddresses: (addresses: Address[]) => void;
}

export default function AddressForm({ addresses, setAddresses }: AddressFormProps) {
    const [localAddresses, setLocalAddresses] = useState<Address[]>(addresses);
    const [newAddress, setNewAddress] = useState<Address>({
        id: 0,
        is_primary: false,
        street: "",
        city: "",
        uf: "",
        zipcode: "" ,
        neighborhood: "",
        number: "",
        complement: "",
    });
    const [errors, setErrors] = useState<{ [key in keyof Address]?: string }>({});

    const handleAddAddress = () => {
        const newErrors: { [key in keyof Address]?: string } = {};

        // Validação dos campos obrigatórios
        if (!newAddress.street) newErrors.street = "Rua é obrigatória";
        if (!newAddress.number) newErrors.number = "Número é obrigatório";
        if (!newAddress.city) newErrors.city = "Cidade é obrigatória";
        if (!newAddress.uf) newErrors.uf = "Estado é obrigatório";
        if (!newAddress.zipcode) newErrors.zipcode = "CEP é obrigatório";
        if (!newAddress.neighborhood) newErrors.neighborhood = "Bairro é obrigatório";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const updatedAddresses = [...localAddresses, newAddress];
        setLocalAddresses(updatedAddresses);
        setAddresses(updatedAddresses);
        setNewAddress({
            id: 0,
            is_primary: false,
            street: "",
            city: "",
            uf: "",
            zipcode: "",
            neighborhood: "",
            number: "",
            complement: "",
        });
        setErrors({});
    };

    const handleRemoveAddress = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const updatedAddresses = localAddresses.filter((_, i) => i !== index);
        setLocalAddresses(updatedAddresses);
        setAddresses(updatedAddresses);
    };

    const handleChangeNewAddress = (field: keyof Address, value: string) => {
        setNewAddress({ ...newAddress, [field]: value });
        setErrors({ ...errors, [field]: undefined });
    };

    const handleSetPrimaryAddress = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const updatedAddresses = localAddresses.map((address, i) => ({
            ...address,
            is_primary: i === index,
        }));
        setLocalAddresses(updatedAddresses);
        setAddresses(updatedAddresses);
    };

    return (
        <div className="border border-gray-100 dark:border-gray-500 p-4 rounded">
            <div className="flex items-center gap-1 mb-4">
                <h2 className="">Endereços</h2>
                <div className="w-6 h-6 flex justify-center items-center text-sm font-semibold bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full p-2">
                    {localAddresses.length}
                </div>
            </div>
            <div className="space-y-4">

                <div>
                    <InputLabel htmlFor="street" value="Rua" isRequired={true} />

                    <TextInput
                        id="street"
                        className="mt-1 block w-full"
                        value={newAddress.street}
                        onChange={(e) => handleChangeNewAddress("street", e.target.value)}
                        isFocused
                        autoComplete="street"
                    />
                    {errors.street && <InputError className="mt-2" message={errors.street} />}
                </div>

                <div>
                    <InputLabel htmlFor="number" value="Número" isRequired={true} />

                    <TextInput
                        id="number"
                        className="mt-1 block w-full"
                        value={newAddress.number}
                        onChange={(e) => handleChangeNewAddress("number", e.target.value)}
                        isFocused
                        autoComplete="number"
                    />
                    {errors.number && <InputError className="mt-2" message={errors.number} />}
                </div>

                <div>
                    <InputLabel htmlFor="complement" value="Complemento" />

                    <TextInput
                        id="complement"
                        className="mt-1 block w-full"
                        value={newAddress.complement}
                        onChange={(e) => handleChangeNewAddress("complement", e.target.value)}
                        isFocused
                        autoComplete="complement"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="neighborhood" value="Bairro" isRequired={true} />

                    <TextInput
                        id="neighborhood"
                        className="mt-1 block w-full"
                        value={newAddress.neighborhood}
                        onChange={(e) => handleChangeNewAddress("neighborhood", e.target.value)}
                        isFocused
                        autoComplete="neighborhood"
                    />
                    {errors.neighborhood && <InputError className="mt-2" message={errors.neighborhood} />}
                </div>

                <div>
                    <InputLabel htmlFor="city" value="Cidade" isRequired={true} />

                    <TextInput
                        id="city"
                        className="mt-1 block w-full"
                        value={newAddress.city}
                        onChange={(e) => handleChangeNewAddress("city", e.target.value)}
                        isFocused
                        autoComplete="city"
                    />
                    {errors.city && <InputError className="mt-2" message={errors.city} />}
                </div>

                <div>
                    <InputLabel htmlFor="uf" value="Estado" isRequired={true} />

                    <TextInput
                        id="uf"
                        className="mt-1 block w-full"
                        value={newAddress.uf}
                        onChange={(e) => handleChangeNewAddress("uf", e.target.value)}
                        isFocused
                        autoComplete="uf"
                    />
                    {errors.uf && <InputError className="mt-2" message={errors.uf} />}
                </div>

                <div>
                    <InputLabel htmlFor="zipcode" value="CEP" isRequired={true} />

                    <TextInput
                        id="zipcode"
                        className="mt-1 block w-full"
                        value={newAddress.zipcode}
                        onChange={(e) => handleChangeNewAddress("zipcode", e.target.value)}
                        isFocused
                        autoComplete="zipcode"
                    />
                    {errors.zipcode && <InputError className="mt-2" message={errors.zipcode} />}
                </div>

                <div className="flex justify-end">
                    <SecondaryButton onClick={handleAddAddress}>Adicionar Endereço</SecondaryButton>
                </div>
            </div>
            <div className="space-y-3 mt-3">
                {localAddresses.map((address, index) => (
                    <div key={index} className="border border-gray-100 dark:border-gray-500 p-3 rounded">
                        <div className="flex justify-between items-start">
                            <div>
                                <p><strong>Rua:</strong> {address.street}</p>
                                <p><strong>Número:</strong> {address.number}</p>
                                <p><strong>Complemento:</strong> {address.complement ? address.complement : 'Sem complemento'}</p>
                                <p><strong>Cidade:</strong> {address.city}</p>
                                <p><strong>Estado:</strong> {address.uf}</p>
                                <p><strong>CEP:</strong> {address.zipcode}</p>
                            </div>
                            <div>
                                {
                                    address.is_primary ?
                                        <span className="uppercase tracking-widest text-xs border border-gray-300 text-gray-700 rounded p-1 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300">
                                            Primário
                                        </span>
                                    : <></>
                                }
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 items-center">
                            {address.is_primary == false ?
                                <SecondaryButton onClick={(e) => handleSetPrimaryAddress(index, e)}>
                                    Definir como Primário
                                </SecondaryButton>
                                : <></>
                            }
                            <DangerButton onClick={(e) => handleRemoveAddress(index, e)}>Deletar</DangerButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}