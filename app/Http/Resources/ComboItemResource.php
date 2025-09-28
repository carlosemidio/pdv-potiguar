<?php

namespace App\Http\Resources;

use App\Models\StoreProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComboItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sp_variant_id' => $this->sp_variant_id,
            'item_variant_id' => $this->item_variant_id,
            'item_variant' => new StoreProductVariantResource($this->whenLoaded('itemVariant')),
            'quantity' => $this->quantity,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
