<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class View extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'viewable_id',
        'viewable_type',
        'viewed_at',
        'ip_address',
        'user_agent',
    ];

    /**
     * Get the parent viewable model (e.g., Product, User).
     */
    public function viewable()
    {
        return $this->morphTo();
    }
}
