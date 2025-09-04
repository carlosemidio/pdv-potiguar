<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuid, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'tenant_id',
        'user_id',
        'user_type_id',
        'name',
        'email',
        'password'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->BelongsTo(User::class);
    }

    public function userable(): MorphTo
    {
        return $this->morphTo();
    }

    public function store(): HasOne
    {
        return $this->hasOne(Store::class, 'user_id', 'id')->where('is_default', true);
    }

    public function stores(): HasMany
    {
        return $this->hasMany(Store::class);
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function permissions(): MorphToMany
    {
        return $this->morphToMany(Permission::class, 'permissionable');
    }

    public function notifications(): BelongsToMany
    {
        return $this->belongsToMany(
            Notification::class,
            'notification_user',
            'user_id',
            'notification_id'
        )->withPivot('is_read');
    }

    public function hasPermission($permissionName, $all = false): bool
    {
        if ($this->hasAnyRoles('dev')) {
            return true;
        }

        $permission = Permission::where('name', $permissionName)->first();

        $roles = Role::whereIn('id', $this->roles->pluck('id'))->with('permissions')->get();
        $rolesPermissions = [];

        foreach ($roles as $role) {
            foreach ($role->permissions as $rolePermission) {
                $rolesPermissions[$rolePermission->id] = $rolePermission->pivot->total_access;
            }
        }

        return ($all) ? data_get($rolesPermissions, $permission->id, 0) : in_array($permission->id, array_keys($rolesPermissions));
    }

    public function hasAnyRoles($role): bool
    {
        if (is_string($role)) {
            return $this->roles->contains('slug', $role);
        }

        return !!$role->intersect($this->roles)->count();
    }
}
