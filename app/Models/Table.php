<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Table extends Model
{
    use HasFactory, SoftDeletes, HasSlug;

    protected $fillable = [
        'user_id',
        'store_id',
        'name',
        'slug',
        'status',
    ];

    protected $appends = [
        'status_name',
    ];

    public function getStatusNameAttribute()
    {
        return match ($this->status) {
            'available' => 'Disponível',
            'occupied' => 'Ocupada',
            'reserved' => 'Reservada',
            default => 'Disponível',
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
}
