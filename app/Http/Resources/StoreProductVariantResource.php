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
            'store' => new StoreResource($this->whenLoaded('store')),
            'product_variant' => new ProductVariantResource($this->whenLoaded('productVariant')),
            'variant_ingredients' => VariantIngredientResource::collection($this->whenLoaded('variantIngredients')),
            'variant_addons' => VariantAddonResource::collection($this->whenLoaded('variantAddons')),
            'variant_addon_groups' => VariantAddonGroupResource::collection($this->whenLoaded('variantAddonGroups')),
            'combo_items' => ComboItemResource::collection($this->whenLoaded('comboItems')),
            'combo_option_groups' => ComboOptionGroupResource::collection($this->whenLoaded('comboOptionGroups')),
            'sku' => $this->sku,
            'cost_price' => $this->cost_price,
            'price' => $this->price,
            'stock_quantity' => $this->stock_quantity,
            'is_produced' => $this->is_produced,
            'featured' => $this->featured,
            'manage_stock' => $this->manage_stock,
            'is_combo' => $this->is_combo,
            'is_published' => $this->is_published,
            'view_count' => $this->view_count,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
