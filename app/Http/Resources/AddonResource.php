<?php

namespace App\Http\Resources;

use App\Models\Addon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'tenant_id' => $this->tenant_id,
            'store_id' => $this->store_id,
            'name' => $this->name,
            'addon_ingredients' => AddonIngredientResource::collection($this->whenLoaded('addonIngredients')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
