<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'user_id'         => $this->user_id,
            'store_id'        => $this->store_id,
            'category_id'     => $this->category_id,
            'brand_id'        => $this->brand_id,
            'user'            => $this->whenLoaded('user'),
            'store'           => $this->whenLoaded('store'),
            'category'        => $this->whenLoaded('category'),
            'brand'           => $this->whenLoaded('brand'),
            'name'            => $this->name,
            'slug'            => $this->slug,
            'description'     => $this->description,
            'short_description' => $this->short_description,
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'product_addons' => ProductAddonResource::collection($this->whenLoaded('productAddons')),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
