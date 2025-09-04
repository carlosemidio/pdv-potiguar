<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'total_access' => $this->pivot ? $this->pivot->total_access : 0,
            'display_name' => $this->display_name,
            'created_at' => $this->created_at,
        ];
    }
}
