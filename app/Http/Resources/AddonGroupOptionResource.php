<?php

namespace App\Http\Resources;

use App\Models\Addon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddonGroupOptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'addon_group_id' => $this->addon_group_id,
            'addon_id' => $this->addon_id,
            'addon' => new AddonResource($this->whenLoaded('addon')),
            'name' => $this->name,
            'additional_price' => $this->additional_price,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
