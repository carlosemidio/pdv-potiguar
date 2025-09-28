<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComboOptionGroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sp_variant_id' => $this->sp_variant_id,
            'store_product_variant' => new StoreProductVariantResource($this->whenLoaded('storeProductVariant')),
            'combo_option_items' => ComboOptionItemResource::collection($this->whenLoaded('comboOptionItems')),
            'name' => $this->name,
            'min_options' => $this->min_options,
            'max_options' => $this->max_options,
            'is_required' => $this->is_required,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
