<?php

namespace App\Http\Resources;

use App\Models\Addon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'order_id' => $this->order_id,
            'store_product_variant' => $this->whenLoaded('storeProductVariant') ? new StoreProductVariantResource($this->storeProductVariant) : null,
            'order_item_options' => OrderItemOptionResource::collection($this->whenLoaded('orderItemOptions')),
            'order_item_addons' => OrderItemAddonResource::collection($this->whenLoaded('orderItemAddons')),
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'total_price' => $this->total_price,
            'item_addons' => OrderItemAddonResource::collection($this->whenLoaded('itemAddons')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
