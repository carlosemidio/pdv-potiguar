<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'tenant_id' => $this->tenant_id,
            'store_id' => $this->store_id,
            'name' => $this->name,
            'store_product_variants' => $this->whenLoaded('storeProductVariants'),
            'addons' => $this->whenLoaded('addons'),
            'schedules' => MenuScheduleResource::collection($this->whenLoaded('schedules')),
            'days' => MenuDayResource::collection($this->whenLoaded('days')),
            'is_permanent' => $this->is_permanent,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
