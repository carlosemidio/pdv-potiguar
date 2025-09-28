<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComboOptionItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'option_group_id',
        'sp_variant_id',
        'additional_price',
        'quantity',
    ];

    public function comboOptionGroup()
    {
        return $this->belongsTo(ComboOptionGroup::class, 'option_group_id', 'id');
    }

    public function storeProductVariant()
    {
        return $this->belongsTo(StoreProductVariant::class, 'sp_variant_id', 'id');
    }
}
