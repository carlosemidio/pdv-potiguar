<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttributeValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_variant_id',
        'variant_attribute_id',
        'value',
    ];

    public function variant() {
        return $this->belongsTo(ProductVariant::class);
    }

    public function attribute() {
        return $this->belongsTo(VariantAttribute::class, 'variant_attribute_id');
    }
}
