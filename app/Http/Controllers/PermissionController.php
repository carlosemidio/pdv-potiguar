<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionFormRequest;
use App\Http\Resources\PermissionResource;
use App\Models\Permission;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('list', Permission::class);
        $permissions = Permission::orderBy('display_name')
            ->get();

        return Inertia::render('Permission/Index', [
            'permissions' => PermissionResource::collection($permissions)
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Permission::class);

        return Inertia::render('Permission/Edit', [
            'permission' => null
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PermissionFormRequest $request)
    {
        $this->authorize('create', Permission::class);

        $permission = Permission::create([
            'name' => $request->name,
            'display_name' => $request->display_name,
        ]);

        return redirect()->route('permission.index');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $permission = Permission::where('id', $id)->first();

        $this->authorize('view', $permission);

        return Inertia::render('Permission/Show', [
            'permission' => new PermissionResource($permission)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {

        $permission = Permission::where('id', $id)->first();

        $this->authorize('update', $permission);

        return Inertia::render('Permission/Edit', [
            'permission' => new PermissionResource($permission)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PermissionFormRequest $request, $id)
    {

        $permission = Permission::where('id', $id)->first();

        $this->authorize('update', $permission);

        $permission->update([
            'name' => $request->name,
            'display_name' => $request->display_name,
        ]);

        return redirect()->route('permission.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {

        $permission = Permission::where('id', $id)->first();

        $this->authorize('delete', $permission);

        $permission->delete();

        return redirect()->route('permission.index');

    }
}
