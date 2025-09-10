<?php

namespace App\Models;

use App\Traits\GeneratesVariantSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use HasFactory, SoftDeletes, GeneratesVariantSlug;

    protected $fillable = [
        'product_id',
        'attribute',
        'value',
        'sku',
        'price',
        'stock_quantity'
    ];

    protected $appends = [
        'name'
    ];

    public function getNameAttribute()
    {
        $attributes = $this->attributes()->pluck('name', 'value')->toArray();
        $nameParts = [];
        
        foreach ($attributes as $value => $name) {
            $nameParts[] = "$name: $value";
        }

        $name = $this->product ? $this->product->name . ' - ' : '';

        return $name . implode(', ', $nameParts);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
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
