<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'store_id',
        'table_id',
        'customer_id',
        'number',
        'status',
        'amount',
        'discount',
        'service_fee',
        'total_amount',
        'paid_amount',
        'payment_status',
    ];

    protected $appends = [
        'status_name'
    ];

    public function getStatusNameAttribute()
    {
        return match ($this->status) {
            'pending' => 'Pendente',
            'in_progress' => 'Em andamento',
            'completed' => 'Finalizado',
            'cancelled' => 'Cancelado',
            default => 'Desconhecido',
        };
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
