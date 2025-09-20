<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'store_id' => $this->store_id,
            'product_variant_id' => $this->product_variant_id,
            'product_variant' => new ProductVariantResource($this->whenLoaded('productVariant')),
            'addons' => StoreProductVariantAddonResource::collection($this->whenLoaded('addons')),
            'cost_price' => $this->cost_price,
            'price' => $this->price,
            'stock_quantity' => $this->stock_quantity,
            'featured' => $this->featured,
            'view_count' => $this->view_count,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
