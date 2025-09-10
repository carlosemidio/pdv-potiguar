<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        
        return [
            'id'             => $this->id,
            'product_id'     => $this->product_id,
            'product'        => new ProductResource($this->whenLoaded('product')),
            'name'           => $this->name,
            'slug'           => $this->slug,
            'sku'            => $this->sku,
            'price'          => $this->price,
            'stock_quantity' => $this->stock_quantity,
            'attributes' => $this->attributes->map(function ($attribute) {
                return [
                    'id'    => $attribute->id,
                    'name' => $attribute->name,
                    'value' => $attribute->pivot->value,
                ];
            }),
            'image' => $this->image ? new FileResource($this->image) : null,
            'images' => $this->images && $this->images->isNotEmpty() ? FileResource::collection($this->images) : [],
        ];
    }
}
