<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tenant_id' => $this->tenant_id,
            'tenant' => new TenantResource($this->whenLoaded('tenant')),
            'roles' => RoleResource::collection($this->whenLoaded('roles')),
            'store' => new StoreResource($this->whenLoaded('store')),
            'stores' => StoreResource::collection($this->whenLoaded('stores')),
            'uuid' => $this->uuid,
            'name' => $this->name,
            'email' => $this->email,
            'status' => $this->status,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

    }
}
