<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'store_id',
        'table_id',
        'customer_id',
        'number',
        'status',
        'amount',
        'discount',
        'service_fee',
        'total_amount',
        'payment_method',
        'paid_amount',
        'payment_status',
    ];

    protected $appends = [
        'status_name'
    ];

    public function getStatusNameAttribute()
    {
        return match ($this->status) {
            OrderStatus::PENDING->value => 'Pendente',
            OrderStatus::IN_PROGRESS->value => 'Em andamento',
            OrderStatus::CONFIRMED->value => 'Confirmado',
            OrderStatus::REJECTED->value => 'Rejeitado',
            OrderStatus::PAID->value => 'Pago',
            OrderStatus::SHIPPED->value => 'Enviado',
            OrderStatus::COMPLETED->value => 'Concluído',
            OrderStatus::CANCELED->value => 'Cancelado',
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
