<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'size' => $this->size,
            'url' => $this->url,
            'file_url' => $this->file_url,
            'image' => $this->image,
            'extension' => $this->extension,
        ];
    }
}