<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'store_id',
        'name',
        'is_permanent'
    ];

    public function storeProductVariants() : BelongsToMany
    {
        return $this->belongsToMany(StoreProductVariant::class, 'menu_store_product_variant', 'menu_id', 'sp_variant_id');
    }

    public function addons() : BelongsToMany
    {
        return $this->belongsToMany(Addon::class, 'menu_addon', 'menu_id', 'addon_id');
    }

    public function schedules() : HasMany
    {
        return $this->hasMany(MenuSchedule::class);
    }

    public function days() : HasMany
    {
        return $this->hasMany(MenuDay::class);
    }
}
