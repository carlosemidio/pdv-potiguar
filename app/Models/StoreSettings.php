<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StoreSetting extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'store_id',
        'key',
        'value',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
