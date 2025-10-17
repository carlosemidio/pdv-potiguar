<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['user_id', 'name', 'size', 'url', 'extension', 'is_default', 'public'];

    // Define the attributes to append to the JSON representation.
    protected $appends = ['file_url', 'image'];

    public function getFileUrlAttribute()
    {
        $disk = config('filesystems.disks.spaces.key') ? 'spaces' : 'public';

        if ($disk === 'spaces') {
            // Detecta se o arquivo é público ou privado
            $isPublic = property_exists($this, 'public') && $this->public; // ou outro campo que você use

            if ($isPublic) {
                return Storage::disk('spaces')->url($this->url); // URL pública direta
            }

            // Arquivo privado → URL temporária
            return Storage::disk('spaces')->temporaryUrl($this->url, now()->addMinutes(60));
        }

        // Local (sempre público via storage:link)
        if (Storage::disk('public')->exists($this->url)) {
            return asset('storage/' . $this->url);
        }

        return null;
    }

    // Define an accessor method to know if file is an image.
    public function getImageAttribute()
    {
        $imageExtensionsForImgTag = [
            'jpg',
            'jpeg',
            'png',
            'gif',
            'webp',
            'svg',
        ];

        return in_array($this->extension, $imageExtensionsForImgTag);
    }

    /**
     * Get the parent fileable model.
    */
    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }
}
