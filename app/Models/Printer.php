<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Printer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'store_id',
        'name',
        'type',
        'vendor_id',
        'product_id',
        'product_name',
        'device_path',
        'host',
        'port',
        'status',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
