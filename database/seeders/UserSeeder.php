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
            'name' => 'dev',
            'email' => 'carlosemidiopereira@gmail.com',
            'user_id' => 1, // Assuming the first user is the dev user
        ], [ 'password' => bcrypt('123') ]);

        // Lojista
        $user_lojista = User::updateOrCreate([
            'name' => 'lojista',
            'email' => 'teste1@email.com',
            'user_id' => 1, // Assuming the second user is the lojista
        ], [ 'password' => bcrypt('123') ]);

        // Dev role
        $role_dev = Role::create([
            'name' => 'Dev',
            'user_id' => $user_dev->id,
        ]);

        $user_dev->roles()->attach($role_dev->id);

        // Lojista role
        $role_lojista = Role::create([
            'name' => 'Lojista',
            'user_id' => $user_lojista->id,
        ]);

        // Permissions for Lojista
        $permissions = [
            'stores_view',
            'stores_create',
            'stores_edit',
            'products_view',
            'products_create',
            'products_edit',
            'notifications_view',
            'cities_view',
            'categories_view'
        ];

        foreach ($permissions as $permissionName) {
            $permission = Permission::firstOrCreate(['name' => $permissionName]);
            $role_lojista->permissions()->attach($permission->id);
        }

        $user_lojista->roles()->attach($role_lojista->id);
    }
}
