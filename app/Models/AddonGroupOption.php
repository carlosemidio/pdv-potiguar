<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AddonGroupOption extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'addon_group_id',
        'addon_id',
        'additional_price',
    ];

    public function addonGroup()
    {
        return $this->belongsTo(VariantAddonGroup::class, 'addon_group_id');
    }

    public function addon()
    {
        return $this->belongsTo(Addon::class, 'addon_id');
    }
}
