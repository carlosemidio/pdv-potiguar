<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class StoreProductVariantAddon extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'sp_variant_id',
        'name',
        'price',
    ];

    public function orderItems(): BelongsToMany
    {
        return $this->belongsToMany(OrderItem::class, 'order_item_addons', 'sp_variant_addon_id', 'order_item_id');
    }
}
