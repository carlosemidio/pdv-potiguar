<?php

namespace App\Http\Requests;

trait AddressRules
{
    public function addressRules(): array
    {
        return [
            'addresses' => ['array'],
            'addresses.*.zipcode' => ['required'],
            'addresses.*.uf' => ['required'],
            'addresses.*.city' => ['required'],
            'addresses.*.neighborhood' => ['required'],
            'addresses.*.street' => ['required'],
            'addresses.*.number' => ['required'],
            'addresses.*.complement' => ['nullable'],
        ];
    }

    public function addressMessages(): array
    {
        return [
            'addresses.required' => 'O endereço é obrigatório.',
            'addresses.array' => 'O endereço deve ser um array.',
            'addresses.*.zipcode.required' => 'O CEP é obrigatório.',
            'addresses.*.uf.required' => 'O estado é obrigatório.',
            'addresses.*.city.required' => 'A cidade é obrigatória.',
            'addresses.*.neighborhood.required' => 'O bairro é obrigatório.',
            'addresses.*.street.required' => 'A rua é obrigatória.',
            'addresses.*.number.required' => 'O número é obrigatório.',
        ];
    }
}
