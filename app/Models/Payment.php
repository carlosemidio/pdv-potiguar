<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'order_id',
        'cash_register_id',
        'method',
        'amount',
        'paid_amount',
        'change_amount',
        'notes',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
