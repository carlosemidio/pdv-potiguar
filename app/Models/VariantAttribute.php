<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariantAttribute extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function variants() {
        return $this->belongsToMany(ProductVariant::class, 'product_variant_attribute_values')
            ->withPivot('value')
            ->withTimestamps();
    }

    public function attributeValues() {
        return $this->hasMany(AttributeValue::class, 'variant_attribute_id');
    }
}
