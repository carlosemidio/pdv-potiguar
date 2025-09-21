<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariantAddonGroup extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sp_variant_id',
        'name',
        'is_required',
        'min_options',
        'max_options',
    ];

    public function storeProductVariant()
    {
        return $this->belongsTo(StoreProductVariant::class, 'sp_variant_id');
    }

    public function addonGroupOptions()
    {
        return $this->hasMany(AddonGroupOption::class, 'addon_group_id');
    }
}
