<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserFormRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('list', User::class);
        $query = User::query();
        $user = User::find(Auth::id());

        $request_data = Request::all('status', 'type', 'search', 'field', 'page');

        if (!$user->hasPermission('users_view', true)) {
            $query->where('user_id', $user->id);
        }

        if ($user->tenant_id != null) {
            $query->where('tenant_id', $user->tenant_id)
                ->where('id', '!=', $user->id);
        }

        if (($request_data['status'] != null) && in_array($request_data['status'], [1, 0])) {
            $query->where('status', $request_data['status']);
        }

        if (($request_data['search'] != null) && ($request_data['search'] != '') && ($request_data['field'] != null)) {
            $query->where($request_data['field'], 'like', '%' . $request_data['search'] . '%');
        }

        $users = $query->with('roles')
            ->orderBy('created_at', 'asc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('User/Index', [
            'filters' => Request::all('status', 'search', 'field', 'page'),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', User::class);
        $authUser = User::findOrFail(Auth::user()->id);
        $rolesQuery = Role::query();
        $storesQuery = Store::query();

        if (!$authUser->hasPermission('roles_view', true)) {
            $rolesQuery->where('user_id', $authUser->id);
        }

        if ($authUser->tenant_id != null) {
            $rolesQuery->where('tenant_id', $authUser->tenant_id);
        }

        if (!$authUser->hasPermission('stores_view', true)) {
            $storesQuery->where('user_id', $authUser->id);
        }

        if ($authUser->tenant_id != null) {
            $storesQuery->where('tenant_id', $authUser->tenant_id);
        }

        $roles = $rolesQuery->get();
        $stores = $storesQuery->get();

        return Inertia::render('User/Edit', [
            'roles' => $roles,
            'stores' => $stores,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserFormRequest $request): RedirectResponse
    {
        $this->authorize('create', User::class);
        $loggedUser = User::find(Auth::id());
        $formData = $request->all();
        
        $formData['user_id'] = $loggedUser->id;

        if (isset($formData['tenant_id']) && $formData['tenant_id'] == '') {
            $formData['tenant_id'] = $loggedUser->tenant_id;
        }

        $user = User::create($formData);
        
        $rolesQuery = Role::query();
        $storesQuery = Store::query();

        if (!$loggedUser->hasPermission('roles_view', true)) {
            $rolesQuery->where('user_id', $loggedUser->id);
        }

        if ($loggedUser->tenant_id != null) {
            $rolesQuery->where('tenant_id', $loggedUser->tenant_id);
        }

        if (!$loggedUser->hasPermission('stores_view', true)) {
            $storesQuery->where('user_id', $loggedUser->id);
        }

        if ($loggedUser->tenant_id != null) {
            $storesQuery->where('tenant_id', $loggedUser->tenant_id);
        }

        $loggedUserRoles = $rolesQuery->get();
        $loggedUserStores = $storesQuery->get();

        $roles = [];

        foreach ($loggedUserRoles as $role) {
            if (in_array($role->id, $request->roles)) {
                $roles[] = $role->id;
            }
        }

        $stores = [];

        foreach ($loggedUserStores as $store) {
            if (in_array($store->id, $request->stores)) {
                $stores[] = $store->id;
            }
        }

        $user->roles()->sync($roles);
        $user->stores()->sync($stores);

        event(new Registered($user));

        return redirect()->route('user.index');
    }

    /**
     * Display the specified resource.
     */
    public function show($uuid)
    {
        $user = User::where('uuid', $uuid)->with('roles')->first();
        $this->authorize('view', $user);

        return Inertia::render('User/Show', [
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($uuid)
    {
        $user = User::where('uuid', $uuid)->firstOrFail();
        $this->authorize('update', $user);

        $user->load('roles.permissions', 'tenant', 'stores');

        $authUser = User::findOrFail(Auth::user()->id);
        $rolesQuery = Role::query();
        $storesQuery = Store::query();

        if (($authUser->id == $user->id) && ($authUser->tenant_id != null)) {
            return redirect()->back()
                ->with('fail', 'Você não pode editar este usuário!');
        }

        if (!$authUser->hasPermission('roles_view', true)) {
            $rolesQuery->where('user_id', $authUser->id);
        }

        if ($authUser->tenant_id != null) {
            $rolesQuery->where('tenant_id', $authUser->tenant_id);
        }

        if (!$authUser->hasPermission('stores_view', true)) {
            $storesQuery->where('user_id', $authUser->id);
        }

        if ($authUser->tenant_id != null) {
            $storesQuery->where('tenant_id', $authUser->tenant_id);
        }

        $roles = $rolesQuery->get();
        $stores = $storesQuery->get();

        return Inertia::render('User/Edit', [
            'user' => new UserResource($user),
            'roles' => $roles,
            'stores' => $stores
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserFormRequest $request, $uuid)
    {
        $user = User::where('uuid', $uuid)->first();
        $this->authorize('update', $user);
        $loggedUser = User::find(Auth::id());

        $formData = $request->all();
        $formData['user_id'] = $loggedUser->id;

        if (isset($formData['password']) && $formData['password'] != '') {
            $formData['password'] = bcrypt($formData['password']);
        } else {
            unset($formData['password']);
        }

        $user->update($formData);

        $rolesQuery = Role::query();
        $storesQuery = Store::query();

        if (!$loggedUser->hasPermission('roles_view', true)) {
            $rolesQuery->where('user_id', $loggedUser->id);
        }

        if ($loggedUser->tenant_id != null) {
            $rolesQuery->where('tenant_id', $loggedUser->tenant_id);
        }

        if (!$loggedUser->hasPermission('stores_view', true)) {
            $storesQuery->where('user_id', $loggedUser->id);
        }

        if ($loggedUser->tenant_id != null) {
            $storesQuery->where('tenant_id', $loggedUser->tenant_id);
        }

        $loggedUserRoles = $rolesQuery->get();
        $loggedUserStores = $storesQuery->get();

        $roles = [];
        $stores = [];
     
        foreach ($loggedUserRoles as $role) {
            if (in_array($role->id, $request->roles)) {
                $roles[] = $role->id;
            }
        }

        foreach ($loggedUserStores as $store) {
            if (in_array($store->id, $request->stores)) {
                $stores[] = $store->id;
            }
        }

        $user->stores()->sync($stores);
        $user->roles()->sync($roles);
     
        if ($user->save()) {
            return redirect()->route('user.index')
                ->with('success', 'Usuário atualizado com sucesso!');
        }
     
        return redirect()->back()
            ->with('fail', 'Erro ao tentar atualizar usuário!');
    }

    /**
     * Change status of the specified resource.
     *
     * @param  App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function status(string $uuid)
    {
        $user = User::where('uuid', $uuid)->firstOrFail();
        $this->authorize('update', $user);
        $user->status = !$user->status;
        
        if ($user->save()) {
            if ($user->status == 1) {
                $msg = "Usuário habilitado com sucesso!";
            } else {
                $msg = "Usuário desabilitado com sucesso!";
            }

            return redirect()->back()
                ->with('success', $msg);
        }

        return redirect()->back()
            ->with('fail', 'Erro ao tentar habilitar/desabilitar usuário!');        
    }

    /**
     * Log in as the specified user.
     */
    public function loginAs($uuid)
    {
        $user = User::where('uuid', $uuid)->firstOrFail();
        $this->authorize('update', $user);

        Auth::login($user);

        session()->forget('user_permissions');
        session()->forget('user');

        return redirect()->route('dashboard')->with('success', 'Logado como: ' . $user->name);
    }
}
