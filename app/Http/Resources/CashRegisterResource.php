<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CashRegisterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'tenant_id' => $this->tenant_id,
            'store_id' => $this->store_id,
            'closed_by' => $this->closed_by,
            'user' => new UserResource($this->whenLoaded('user')),
            'store' => new StoreResource($this->whenLoaded('store')),
            'closer' => new UserResource($this->whenLoaded('closer')),
            'opening_amount' => $this->opening_amount,
            'closing_amount' => $this->closing_amount,
            'system_balance' => $this->system_balance,
            'difference' => $this->difference,
            'status' => $this->status,
            'opened_at' => $this->opened_at,
            'closed_at' => $this->closed_at,
            'movements' => $this->whenLoaded('movements') ? CashMovementResource::collection($this->movements) : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
