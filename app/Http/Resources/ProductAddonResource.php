<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductAddonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'addon_id' => $this->addon_id,
            'addon' => new AddonResource($this->whenLoaded('addon')),
            'product' => new ProductResource($this->whenLoaded('product')),
            'price' => $this->price
        ];
    }
}
