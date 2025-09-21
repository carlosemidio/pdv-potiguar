<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AddonIngredient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'addon_id',
        'ingredient_id',
        'unit_id',
        'quantity'
    ];

    public function addon()
    {
        return $this->belongsTo(Addon::class);
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
