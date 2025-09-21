<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddonIngredientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'addon_id' => $this->addon_id,
            'ingredient_id' => $this->ingredient_id,
            'unit_id' => $this->unit_id,
            'quantity' => $this->quantity,
            'addon' => new AddonResource($this->whenLoaded('addon')),
            'ingredient' => new IngredientResource($this->whenLoaded('ingredient')),
            'unit' => new UnitResource($this->whenLoaded('unit')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
