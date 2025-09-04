<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'user_id',
    ];

    public function owner(): BelongsTo
    {
        return $this->BelongsTo(User::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'notification_user',
            'notification_id',
            'user_id'
        )->withPivot('is_read');
    }
}
