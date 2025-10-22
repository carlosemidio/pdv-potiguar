<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CashMovement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'cash_register_id',
        'type',
        'amount',
        'description',
        'source_type',
        'source_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cashRegister()
    {
        return $this->belongsTo(CashRegister::class);
    }

    public function source()
    {
        return $this->morphTo();
    }

    public function isOpening(): bool
    {
        return $this->type === 'opening';
    }
}
