<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id',
        'start_at',
        'end_at',
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
