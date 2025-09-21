<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariantAddon extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sp_variant_id',
        'addon_id',
        'quantity',
        'price',
    ];

    public function storeProductVariant()
    {
        return $this->belongsTo(StoreProductVariant::class, 'sp_variant_id');
    }

    public function addon()
    {
        return $this->belongsTo(Addon::class);
    }
}
