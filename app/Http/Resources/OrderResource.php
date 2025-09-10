<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'store' => new StoreResource($this->whenLoaded('store')),
            'table' => new TableResource($this->whenLoaded('table')),
            'number' => $this->number,
            'customer_name' => $this->customer_name,
            'status' => $this->status,
            'status_name' => $this->status_name,
            'total_amount' => $this->total_amount,
            'discount' => $this->discount,
            'service_fee' => $this->service_fee,
            'paid_amount' => $this->paid_amount,
            'payment_status' => $this->payment_status,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
