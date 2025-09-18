<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockMovement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'store_id',
        'store_product_variant_id',
        'type',
        'subtype',
        'quantity',
        'cost_price',
        'reason',
        'document_number',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function storeProductVariant()
    {
        return $this->belongsTo(StoreProductVariant::class, 'store_product_variant_id');
    }
}
