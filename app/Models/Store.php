<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Store extends Model
{
    use HasFactory, SoftDeletes, HasSlug;
    protected $fillable = [
        'user_id',
        'city_id',
        'name',
        'email',
        'phone',
        'domain',
        'description',
        'content',
        'latitude',
        'longitude',
        'status',
        'is_default'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function image(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')->where('is_default', true);
    }

    public function images(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable')->where('is_default', false);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function settings()
    {
        return $this->hasMany(StoreSetting::class);
    }
}
