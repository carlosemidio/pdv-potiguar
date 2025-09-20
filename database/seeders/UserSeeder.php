<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {       
        // Dev User
        $user_dev = User::updateOrCreate([
            'user_id' => 1, // Assuming the first user is the dev user
            'name' => 'dev',
            'email' => 'carlosemidiopereira@gmail.com',
        ], [ 'password' => bcrypt('123') ]);

        $byRenataPlusTenant = \App\Models\Tenant::firstOrCreate([
            'name' => 'By Renata plus',
            'domain' => 'byrenataplus',
            'status' => 1
        ]);

        $kalineModasTenant = \App\Models\Tenant::firstOrCreate([
            'name' => 'Kaline Modas',
            'domain' => 'kalinemodas',
            'status' => 1
        ]);

        $pizariaImperialTenant = \App\Models\Tenant::firstOrCreate([
            'name' => 'Pizaria Imperial',
            'domain' => 'pizariaimperial',
            'status' => 1
        ]);

        $byRenataPlusUser = User::updateOrCreate([
            'user_id' => $user_dev->id,
            'tenant_id' => $byRenataPlusTenant->id,
            'name' => 'Renata Pinheiro',
            'email' => 'renatapinheiro@email.com',
        ], [ 'password' => bcrypt('123') ]);

        $kalineModasUser = User::updateOrCreate([
            'user_id' => $user_dev->id,
            'tenant_id' => $kalineModasTenant->id,
            'name' => 'Kaline Modas',
            'email' => 'kalinemodas@email.com',
        ], [ 'password' => bcrypt('123') ]);

        $pizariaImperialUser = User::updateOrCreate([
            'user_id' => $user_dev->id,
            'tenant_id' => $pizariaImperialTenant->id,
            'name' => 'Ricardo',
            'email' => 'ricardo@email.com',
        ], [ 'password' => bcrypt('123') ]);

        // Dev role
        $role_dev = Role::create([
            'user_id' => $user_dev->id,
            'name' => 'Dev',
        ]);

        $user_dev->roles()->attach($role_dev->id);

        // Lojista role
        $role_lojista = Role::create([
            'name' => 'Lojista',
            'user_id' => $user_dev->id,
        ]);

        // Restaurant role
        $role_restaurant = Role::create([
            'name' => 'Restaurant',
            'user_id' => $user_dev->id,
        ]);

        // Permissions for Lojista
        $store_role_permissions = config('store_role_permissions');

        foreach ($store_role_permissions as $permissionData) {
            foreach ($permissionData['actions'] as $action) {
                $permission = Permission::where('name', "{$permissionData['name']}_{$action['action']}")->first();
                if ($permission) {
                    $role_lojista->permissions()->attach($permission->id, ['total_access' => $action['total_access']]);
                }
            }
        }

        $byRenataPlusUser->roles()->attach($role_lojista->id);
        $kalineModasUser->roles()->attach($role_lojista->id);

        $restorant_role_permissions = config('restaurant_role_permissions');

        foreach ($restorant_role_permissions as $permissionData) {
            foreach ($permissionData['actions'] as $action) {
                $permission = Permission::where('name', "{$permissionData['name']}_{$action['action']}")->first();
                if ($permission) {
                    $role_restaurant->permissions()->attach($permission->id, ['total_access' => $action['total_access']]);
                }
            }
        }

        $pizariaImperialUser->roles()->attach([$role_lojista->id, $role_restaurant->id]);
    }
}
