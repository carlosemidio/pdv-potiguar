<?php

namespace App\Http\Resources;

use App\Models\Addon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VariantAddonGroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sp_variant_id' => $this->sp_variant_id,
            'name' => $this->name,
            'is_required' => $this->is_required,
            'min_options' => $this->min_options,
            'max_options' => $this->max_options,
            'addon_group_options' => AddonGroupOptionResource::collection($this->whenLoaded('addonGroupOptions')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
