<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResumeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'product' => $this->whenLoaded('storeProductVariant') ? [
                'name' => $this->storeProductVariant->productVariant->name,
                'sku' => $this->storeProductVariant->productVariant->sku,
                'price' => $this->storeProductVariant->price,
                'combo_items' => !is_null($this->storeProductVariant->comboItems)
                    ? $this->storeProductVariant->comboItems->map(function ($comboItem) {
                        return [
                            'name' => $comboItem->itemVariant->productVariant->name,
                            'sku' => $comboItem->itemVariant->productVariant->sku,
                            'price' => $comboItem->itemVariant->price,
                        ];
                    })
                    : null,
            ] : null,
            'order_item_options' => $this->whenLoaded('orderItemOptions') && $this->orderItemOptions
                ? $this->orderItemOptions->map(function ($option) {
                    return [
                        'name' => $option->addonGroupOption->addon->name,
                        'quantity' => $option->quantity,
                        'unit_price' => $option->unit_price,
                    ];
                })
                : null,
            'combo_option_items' => $this->whenLoaded('comboOptionItems') && $this->comboOptionItems
                ? $this->comboOptionItems->map(function ($comboOption) {
                    return [
                        'name' => $comboOption->comboOptionItem->storeProductVariant->productVariant->name,
                        'sku' => $comboOption->comboOptionItem->storeProductVariant->productVariant->sku,
                        'quantity' => $comboOption->quantity,
                        'unit_price' => $comboOption->unit_price,
                    ];
                })
                : null,
            'order_item_addons' => $this->whenLoaded('orderItemAddons') && $this->orderItemAddons
                ? $this->orderItemAddons->map(function ($orderItemAddon) {
                    return [
                        'name' => $orderItemAddon->variantAddon->addon->name,
                        'quantity' => $orderItemAddon->quantity,
                        'unit_price' => $orderItemAddon->unit_price,
                    ];
                })
                : null,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'total_price' => $this->total_price,
            'notes' => $this->notes,
        ];
    }
}
