<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class CashRegister extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'store_id',
        'closed_by',
        'opening_amount',
        'closing_amount',
        'system_balance',
        'difference',
        'status',
        'opened_at',
        'closed_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function closer()
    {
        return $this->belongsTo(User::class, 'closed_by');
    }

    public function movements()
    {
        return $this->hasMany(CashMovement::class);
    }

    public function getCurrentBalanceAttribute()
    {
        $total = $this->movements()
            ->whereNotIn('type', ['opening', 'closing'])
            ->sum(DB::raw("CASE WHEN type IN ('sale', 'addition') THEN amount ELSE -amount END"));

        return $this->opening_amount + $total;
    }

    public function getCalculatedSystemBalanceAttribute()
    {
        $total = $this->movements()
            ->whereNotIn('type', ['opening', 'closing'])
            ->sum(DB::raw("
                CASE 
                    WHEN type IN ('sale', 'addition') THEN amount
                    WHEN type IN ('removal', 'refund') THEN -amount
                    ELSE 0
                END
            "));

        return $this->opening_amount + $total;
    }
}
