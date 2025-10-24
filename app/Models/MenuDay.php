<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuDay extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id',
        'weekday',
        'opens_at',
        'closes_at',
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
