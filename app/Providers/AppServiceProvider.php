<?php

namespace App\Providers;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        // JsonResource::withoutWrapping();

        if (Schema::hasTable('users') && Schema::hasTable('permissions')) {
            $permissions = Permission::where('name', 'like', '%view%')->get();

            foreach ($permissions as $permission) {
                Gate::define($permission->name, function (User $user) use ($permission) {
                    return $user->hasPermission($permission->name);
                });
            }

            Gate::before(function (User $user) {
                if ($user->hasAnyRoles('dev'))
                    return true;
            });
        }
    }
}
