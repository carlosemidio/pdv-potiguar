<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_id',
        'store_product_variant_id',
        'quantity',
        'cost_price',
        'unit_price',
        'total_price',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function storeProductVariant()
    {
        return $this->belongsTo(StoreProductVariant::class);
    }

    public function orderItemAddons()
    {
        return $this->hasMany(OrderItemAddon::class);
    }

    public function orderItemOptions()
    {
        return $this->hasMany(OrderItemOption::class);
    }
}
