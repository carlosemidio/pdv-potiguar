<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'is_produced',
        'featured',
        'manage_stock',
        'is_combo',
        'is_published',
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

    public function variantIngredients()
    {
        return $this->hasMany(VariantIngredient::class, 'sp_variant_id');
    }

    public function variantAddons()
    {
        return $this->hasMany(VariantAddon::class, 'sp_variant_id');
    }

    public function variantAddonGroups()
    {
        return $this->hasMany(VariantAddonGroup::class, 'sp_variant_id');
    }

    public function comboItems() : HasMany
    {
        return $this->hasMany(ComboItem::class, 'sp_variant_id');
    }

    public function comboOptionGroups() : HasMany
    {
        return $this->hasMany(ComboOptionGroup::class, 'sp_variant_id');
    }
}
