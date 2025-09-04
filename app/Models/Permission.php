<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public static function filterByUserRoles($user): Collection
    {
        $permissions = new Collection();

        if ($user->hasAnyRoles('dev')) {
            $permissions = Permission::all();
        } else {
            foreach ($user->roles as $role) {
                if (count($permissions) < 1) {
                    $permissions = $role->permissions;
                } else {
                    $permissions->merge($role->permissions);
                }
            }
        }

        return $permissions;
    }
}
