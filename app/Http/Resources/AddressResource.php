<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'zipcode' => $this->zipcode,
            'uf' => $this->uf,
            'city' => $this->city,
            'neighborhood' => $this->neighborhood,
            'street' => $this->street,
            'number' => $this->number,
            'complement' => $this->complement,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'is_primary' => $this->is_primary,
        ];
    }
}
