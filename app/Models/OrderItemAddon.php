<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderItemAddon extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_item_id',
        'sp_variant_addon_id',
        'quantity',
        'unit_price',
        'total_price',
    ];

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function addon()
    {
        return $this->belongsTo(StoreProductVariantAddon::class, 'sp_variant_addon_id');
    }
}
