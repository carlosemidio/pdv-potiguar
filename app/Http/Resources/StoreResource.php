<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $statesCodes = config('statesCodes');

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'city_id' => $this->city_id,
            'city' => $this->whenLoaded('city', function () use ($statesCodes) {
                return [
                    'id' => $this->city->id,
                    'name' => $this->city->name . '/' . $statesCodes[$this->city->uf],
                ];
            }),
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
            'image' => new FileResource($this->image),
            'images' => FileResource::collection($this->images),
            'name' => $this->name,
            'slug' => $this->slug,
            'email' => $this->email,
            'phone' => $this->phone,
            'domain' => $this->domain,
            'description' => $this->description,
            'content' => $this->content,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'status' => $this->status,
            'is_default' => $this->is_default,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
