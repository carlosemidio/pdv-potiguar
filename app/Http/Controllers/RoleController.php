<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleFormRequest;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\RoleResource;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('list', Role::class);
        $rolesQuery = Role::query();

        $user = User::find(Auth::id());

        if (!$user->hasPermission('roles_view', true)) {
            $rolesQuery->where('user_id', $user->id);
        }

        if ($user->tenant_id != null) {
            $rolesQuery->where('tenant_id', $user->tenant_id);
        }

        $roles = $rolesQuery->paginate(10);

        return Inertia::render('Role/Index', [
            'roles' => RoleResource::collection($roles),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Role::class);
        $user = User::find(Auth::id());
        $permissions = Permission::filterByUserRoles($user);

        return Inertia::render('Role/Edit', [
            'role' => null,
            'permissions' => PermissionResource::collection($permissions)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleFormRequest $request)
    {
        $this->authorize('create', Role::class);
        $user = User::find(Auth::id());
        $dataForm = $request->all();
        $dataForm['user_id'] = $user->id;
        $dataForm['tenant_id'] = $user->tenant_id;
        $role = Role::create($dataForm);

        $permissions = Permission::filterByUserRoles($user)->pluck('id');

        foreach ($request->permissions as $permission) {
            if ($permissions->contains($permission['id'])) {
                $role->permissions()->attach($permission['id'], ['total_access' => $permission['total_access']]);
            }
        }

        return redirect()->route('role.index');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $role = Role::where('id', $id)->first();
        $this->authorize('view', $role);
        $role->load('permissions');

        return Inertia::render('Role/Show', [
            'role' => new RoleResource($role),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $role = Role::where('id', $id)->first();
        $this->authorize('update', $role);
        $role->load('permissions');
        $user = User::find(Auth::id());
        $permissions = Permission::filterByUserRoles($user);

        return Inertia::render('Role/Edit', [
            'role' => new RoleResource($role),
            'permissions' => PermissionResource::collection($permissions)
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(RoleFormRequest $request, $id)
    {
        $role = Role::where('id', $id)->first();
        $this->authorize('update', $role);
        $user = User::find(Auth::id());
        $dataForm = $request->all();
        $role->update($dataForm);
        $permissions = Permission::filterByUserRoles($user)->pluck('id');

        $validPermissions = collect($request->permissions)->filter(
            function ($permission) use ($permissions) {
                return $permissions->contains($permission);
            }
        );

        $validPermissions = collect($request->permissions)->filter(
            function ($permission) use ($permissions) {
                return $permissions->contains($permission['id']);
            });

        $role->permissions()->sync([]);

        foreach ($validPermissions as $permission) {
            $role->permissions()->attach($permission['id'], ['total_access' => $permission['total_access']]);
        }

        return redirect()->route('role.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $role = Role::where('id', $id)->first();
        $this->authorize('delete', $role);

        if ($role->delete()) {
            return redirect()->back()
                ->with('success', 'Função excluída com sucesso.');
        } else {
            return redirect()->back()
                ->with('error', 'Erro ao excluir função.');
        }
    }
}
