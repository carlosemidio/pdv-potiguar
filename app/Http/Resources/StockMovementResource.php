<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockMovementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'tenant_id' => $this->tenant_id,
            'store_id' => $this->store_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'tenant' => new TenantResource($this->whenLoaded('tenant')),
            'store' => new StoreResource($this->whenLoaded('store')),
            'store_product_variant' => new StoreProductVariantResource($this->whenLoaded('storeProductVariant')),
            'ingredient' => new IngredientResource($this->whenLoaded('ingredient')),
            'type' => $this->type,
            'subtype' => $this->subtype,
            'quantity' => $this->quantity,
            'cost_price' => $this->cost_price,
            'reason' => $this->reason,
            'document_number' => $this->document_number,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
