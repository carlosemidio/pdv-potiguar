<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StoreProductVariant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'store_id',
        'product_variant_id',
        'cost_price',
        'price',
        'stock_quantity',
        'featured',
        'view_count',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }

    public function addons()
    {
        return $this->hasMany(StoreProductVariantAddon::class, 'sp_variant_id');
    }

    public function stockMovements()
    {
        return $this->morphMany(StockMovement::class, 'stockable');
    }
}
