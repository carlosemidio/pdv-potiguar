<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariantIngredient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sp_variant_id',
        'ingredient_id',
        'unit_id',
        'quantity',
    ];

    public function storeProductVariant()
    {
        return $this->belongsTo(StoreProductVariant::class, 'sp_variant_id');
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
