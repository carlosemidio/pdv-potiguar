<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResumeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'store' => $this->whenLoaded('store') ? $this->store->name : null,
            'table' => $this->whenLoaded('table') && $this->table ? $this->table->name : null,
            'customer' => $this->whenLoaded('customer') && $this->customer ? $this->customer->name : null,
            'items' => $this->whenLoaded('items') ? OrderItemResumeResource::collection($this->items) : null,
            'number' => $this->number,
            'total' => $this->total_amount,
            'discount' => $this->discount,
            'service_fee' => $this->service_fee
        ];
    }
}
