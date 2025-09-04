<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes, HasSlug;

    protected $fillable = [
        'user_id',
        'store_id',
        'category_id',
        'brand_id',
        'name',
        'slug',
        'description',
        'short_description',
        'sku',
        'price',
        'stock_quantity',
        'status',
        'featured',
        'meta_title',
        'meta_description',
        'meta_keywords'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function image(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')->where('is_default', true);
    }

    /**
     * Variations of the product.
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable')->where('is_default', false);
    }

    public function views(): MorphMany
    {
        return $this->morphMany(View::class, 'viewable');
    }
}
