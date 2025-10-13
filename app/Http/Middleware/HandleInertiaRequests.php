<?php

namespace App\Http\Middleware;

use App\Models\Order;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $userPermissions = session()->get('user_permissions');
        $user = session()->get('user');
        $pendingOrdersCount = Order::where('status', 'pending')
            ->when($user && $user->store_id, function ($query) use ($user) {
                $query->where('store_id', $user->store_id);
            })
            ->count();

        if ($request->user() && (($user === null) || ($userPermissions === null) || (count($userPermissions) === 0))) {
            $user = User::find($request->user()->id);

            if ($user->hasAnyRoles('dev')) {
                $userPermissions = Permission::all()->pluck('name', 'id');
            } else {
                foreach ($user->roles as $role) {
                    foreach ($role->permissions as $permission) {
                        $userPermissions[$permission->id] = $permission->name;
                    }
                }
            }

            $user->load('roles', 'store.image', 'stores');

            if ($user->store_id == null) {
                $store = $user->stores()->first();
                
                if (($store instanceof \App\Models\Store)) {
                    $user->store_id = $store->id;
                    $user->save();
                    $user->load('store.image');
                }
            }

            session()->put('user_permissions', $userPermissions);
            session()->put('user', $user);
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()
                    ? $user
                    : null,
                'userPermissions' => $userPermissions,
                'pendingOrdersCount' => $pendingOrdersCount,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'fail' => fn () => $request->session()->get('fail'),
            ],
            'unreadNotificationsCount' => fn () => $request->user()
                ? $user->notifications()->wherePivot('is_read', false)->count()
                : 0,
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
