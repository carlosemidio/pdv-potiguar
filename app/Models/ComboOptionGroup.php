<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComboOptionGroup extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sp_variant_id',
        'name',
        'min_options',
        'max_options',
        'is_required',
    ];

    public function storeProductVariant()
    {
        return $this->belongsTo(StoreProductVariant::class, 'sp_variant_id');
    }

    public function comboOptionItems()
    {
        return $this->hasMany(ComboOptionItem::class, 'option_group_id');
    }
}
