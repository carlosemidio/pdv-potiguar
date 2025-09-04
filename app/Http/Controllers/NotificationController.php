<?php

namespace App\Http\Controllers;

use App\Http\Requests\NotificationFormRequest;
use App\Http\Resources\NotificationResource;
use App\Http\Resources\UserResource;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('list', Notification::class);
        $user = User::find(Auth::id());

        $notifications = $user->notifications()
            ->where('is_read', false)
            ->paginate(10);

        $notifications_read = $user->notifications()
            ->where('is_read', true)
            ->paginate(10);

        return Inertia::render('Notification/Index', [
            'notifications' => NotificationResource::collection($notifications),
            'notifications_read' => NotificationResource::collection($notifications_read),
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Notification::class);
        $user = User::find(Auth::id());

        $usersQuery = User::where('id', '!=', $user->id);

        if (!$user->hasPermission('users_view', true)) {
            $usersQuery->where('user_id', $user->id);
        }

        $users = $usersQuery->orderBy('name')->get();

        return Inertia::render('Notification/Create', [
            'users' => UserResource::collection($users),
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(NotificationFormRequest $request)
    {
        $this->authorize('create', Notification::class);
        $currentUser = Auth::user();
        $dataForm = $request->all();

        $dataForm['user_id'] = $currentUser->id;
        $dataForm['tenant_id'] = $currentUser->tenant_id;
        $notification = Notification::create($dataForm);

        foreach ($dataForm['users_uuids'] as $user_uuid) {
            $user = User::where('uuid', $user_uuid)->first();
            $notification->users()->attach($user->id);
        }

        return redirect()->route('notification.index');

    }

    public function markAsRead($id): RedirectResponse
    {
        $notification = Notification::find($id);
        $this->authorize('view', $notification);
        $user = User::find(Auth::id());
        $notification->users()->updateExistingPivot($user->id, ['is_read' => true]);

        return Redirect::back();
    }
}
