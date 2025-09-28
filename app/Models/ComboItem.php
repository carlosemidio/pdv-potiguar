<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComboItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sp_variant_id',
        'item_variant_id',
        'quantity',
    ];

    public function storeProductVariant()
    {
        return $this->belongsTo(StoreProductVariant::class, 'sp_variant_id');
    }

    public function itemVariant()
    {
        return $this->belongsTo(StoreProductVariant::class, 'item_variant_id');
    }
}
