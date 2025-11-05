<?php

namespace App\Models;

use App\Traits\GeneratesSku;
use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use HasFactory, SoftDeletes, HasSlug, GeneratesSku;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'product_id',
        'name',
        'sku',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function storeProductVariants()
    {
        return $this->hasMany(StoreProductVariant::class, 'product_variant_id');
    }

    public function attributes() {
        return $this->belongsToMany(VariantAttribute::class, 'attribute_values')
            ->withPivot('value')
            ->withTimestamps();
    }

    public function image(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')->where('is_default', true);
    }

    public function images(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable')->where('is_default', false);
    }
}
